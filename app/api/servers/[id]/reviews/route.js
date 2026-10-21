import { NextResponse } from 'next/server';
import { queryD1 } from '../../../../lib/d1Client';
import { getSessionUser } from '../../../../lib/session';
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit';
import { sanitizeText, isBotHoneypotTriggered } from '../../../../lib/sanitizer';
import { ensureProductionTables } from '../../../../lib/dbBootstrap';
import { broadcastLog } from '../../../../lib/sseLogger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function fetchSafeReviews(serverId) {
  try {
    const rows = await queryD1(
      'SELECT id, server_id, user_id, user_name, user_avatar, user_role, rating, comment, created_at FROM server_reviews WHERE server_id = ? ORDER BY created_at DESC',
      [serverId]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    // Fallback defensivo si la columna user_role no existiera aún en D1
    const fallbackRows = await queryD1(
      'SELECT id, server_id, user_id, user_name, user_avatar, rating, comment, created_at FROM server_reviews WHERE server_id = ? ORDER BY created_at DESC',
      [serverId]
    );
    return Array.isArray(fallbackRows)
      ? fallbackRows.map((r) => ({ ...r, user_role: 'usuario' }))
      : [];
  }
}

// GET: Obtener las reseñas de un servidor específico
export async function GET(request, { params }) {
  try {
    await ensureProductionTables();
    const resolvedParams = await params;
    const serverId = resolvedParams?.id;

    if (!serverId) {
      return NextResponse.json({ success: false, error: 'ID de servidor requerido' }, { status: 400 });
    }

    const reviews = await fetchSafeReviews(serverId);
    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 2), 0) / total).toFixed(1) : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        stats: {
          total,
          avgRating: Number(avgRating),
        },
      },
    });
  } catch (error) {
    console.error('Error obteniendo reseñas de D1:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno consultando bitácora de reseñas' },
      { status: 500 }
    );
  }
}

// POST: Publicar o actualizar la reseña de un servidor (1 por usuario)
export async function POST(request, { params }) {
  try {
    await ensureProductionTables();
    const resolvedParams = await params;
    const serverId = resolvedParams?.id;

    if (!serverId) {
      return NextResponse.json({ success: false, error: 'ID de servidor requerido' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));

    // Trampa honeypot anti-bots
    if (isBotHoneypotTriggered(body, 'knox_protocol_trap')) {
      return NextResponse.json({ success: true, message: 'Reseña registrada con éxito' });
    }

    // Rate limiting: máx 15 reseñas por hora por IP
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`review:post:${clientIp}`, 15, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Límite de reseñas alcanzado. Intenta nuevamente más tarde.' },
        { status: 429 }
      );
    }

    // Autenticación obligatoria
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Debes iniciar sesión con tu cuenta de Google para publicar una reseña.' },
        { status: 401 }
      );
    }

    // Validar calificación táctica: 1 (Alerta), 2 (Aceptable), 3 (Óptimo)
    let rating = parseInt(body.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 3) {
      rating = 2; // Default aceptable
    }

    // Validar y sanitizar comentario
    const rawComment = body.comment || '';
    const cleanComment = sanitizeText(rawComment, 800);

    if (cleanComment.length < 5) {
      return NextResponse.json(
        { success: false, error: 'La reseña debe contener al menos 5 caracteres descriptivos.' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya tiene una reseña previa para este servidor
    const existing = await queryD1(
      'SELECT id FROM server_reviews WHERE server_id = ? AND user_id = ? LIMIT 1',
      [serverId, sessionUser.id]
    );

    let reviewId;
    if (existing && existing.length > 0) {
      reviewId = existing[0].id;
      await queryD1(
        `UPDATE server_reviews
         SET rating = ?, comment = ?, user_name = ?, user_avatar = ?, created_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          rating,
          cleanComment,
          sessionUser.name || 'Superviviente',
          sessionUser.picture || null,
          reviewId,
        ]
      );
    } else {
      reviewId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      try {
        await queryD1(
          `INSERT INTO server_reviews (
            id, server_id, user_id, user_name, user_avatar, user_role, rating, comment, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [
            reviewId,
            serverId,
            sessionUser.id,
            sessionUser.name || 'Superviviente',
            sessionUser.picture || null,
            sessionUser.role || 'usuario',
            rating,
            cleanComment,
          ]
        );
      } catch (insertErr) {
        // Fallback si la columna user_role no existe aún
        await queryD1(
          `INSERT INTO server_reviews (
            id, server_id, user_id, user_name, user_avatar, rating, comment, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [
            reviewId,
            serverId,
            sessionUser.id,
            sessionUser.name || 'Superviviente',
            sessionUser.picture || null,
            rating,
            cleanComment,
          ]
        );
      }
    }

    const reviews = await fetchSafeReviews(serverId);
    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 2), 0) / total).toFixed(1) : 0;

    broadcastLog('info', `[SERVER-REVIEW] Reseña ${existing && existing.length > 0 ? 'actualizada' : 'publicada'} en servidor ${serverId} por ${sessionUser.email} (Rating: ${rating}★)`, {
      serverId,
      user: sessionUser.email,
      rating,
    });

    return NextResponse.json({
      success: true,
      data: {
        reviewId,
        reviews,
        stats: {
          total,
          avgRating: Number(avgRating),
        },
      },
      message: existing && existing.length > 0 ? 'Reseña táctica actualizada con éxito.' : 'Reseña militar registrada en el búnker.',
    });
  } catch (error) {
    console.error('Error guardando reseña en D1:', error);
    return NextResponse.json(
      { success: false, error: 'Fallo al almacenar la reseña en Cloudflare D1: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una reseña (solo autor o admin)
export async function DELETE(request, { params }) {
  try {
    await ensureProductionTables();
    const resolvedParams = await params;
    const serverId = resolvedParams?.id;

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!serverId || !reviewId) {
      return NextResponse.json({ success: false, error: 'Parámetros insuficientes' }, { status: 400 });
    }

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ success: false, error: 'Acceso no autorizado' }, { status: 401 });
    }

    const existing = await queryD1(
      'SELECT id, user_id FROM server_reviews WHERE id = ? AND server_id = ? LIMIT 1',
      [reviewId, serverId]
    );

    if (!existing || existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Reseña no encontrada' }, { status: 404 });
    }

    const isAuthor = existing[0].user_id === sessionUser.id;
    const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Solo el autor o un administrador puede eliminar esta reseña.' },
        { status: 403 }
      );
    }

    await queryD1('DELETE FROM server_reviews WHERE id = ?', [reviewId]);

    broadcastLog('warn', `[SERVER-REVIEW-DELETE] Reseña ${reviewId} en servidor ${serverId} eliminada por ${sessionUser.email}`, {
      serverId,
      reviewId,
      deletedBy: sessionUser.email,
    });

    const reviews = await fetchSafeReviews(serverId);
    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 2), 0) / total).toFixed(1) : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        stats: {
          total,
          avgRating: Number(avgRating),
        },
      },
      message: 'Reseña eliminada del registro.',
    });
  } catch (error) {
    console.error('Error eliminando reseña en D1:', error);
    return NextResponse.json(
      { success: false, error: 'Fallo al eliminar la reseña en Cloudflare D1' },
      { status: 500 }
    );
  }
}
