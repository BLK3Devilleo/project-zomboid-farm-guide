import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/session';
import { queryD1 } from '../../../lib/d1Client';
import { UpdateProfileSchema, getZodErrorMessage } from '../../../lib/validations';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

// GET: Obtener perfil completo del usuario actual, incluyendo XP y progreso cloud
export async function GET(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  try {
    let results = null;
    try {
      results = await queryD1(
        'SELECT id, email, name, picture, role, nickname, profession, playstyle, discord_tag, bio, avatar_pz, xp, completed_milestones, active_route, created_at, last_login FROM users WHERE id = ? LIMIT 1',
        [sessionUser.id]
      );
    } catch (columnErr) {
      // Fallback si las columnas xp/milestones aún no están migradas en la base D1
      results = await queryD1(
        'SELECT id, email, name, picture, role, nickname, profession, playstyle, discord_tag, bio, avatar_pz, created_at, last_login FROM users WHERE id = ? LIMIT 1',
        [sessionUser.id]
      );
    }

    if (results && results.length > 0) {
      const user = results[0];
      let milestones = [];
      if (user.completed_milestones) {
        try {
          milestones = typeof user.completed_milestones === 'string'
            ? JSON.parse(user.completed_milestones)
            : user.completed_milestones;
        } catch (e) {
          milestones = [];
        }
      }

      return NextResponse.json({
        success: true,
        profile: {
          ...user,
          xp: typeof user.xp === 'number' ? user.xp : (parseInt(user.xp, 10) || 0),
          completed_milestones: Array.isArray(milestones) ? milestones : [],
          active_route: user.active_route || null,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Actualizar perfil de personaje PZ y sincronizar XP/progreso en Cloudflare D1
export async function PUT(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  // Rate Limit: Máximo 30 actualizaciones de perfil cada 10 minutos
  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`profile:update:${sessionUser.id || clientIp}`, 30, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Has actualizado tu perfil demasiadas veces. Espera ${rate.resetInSeconds} segundos.`,
      },
      { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
    );
  }

  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = UpdateProfileSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: getZodErrorMessage(parseResult.error) },
        { status: 400 }
      );
    }

    const {
      nickname,
      profession,
      playstyle,
      discord_tag,
      bio,
      avatar_pz,
      xp,
      completed_milestones,
      active_route,
    } = parseResult.data;

    const milestonesJson = completed_milestones ? JSON.stringify(completed_milestones) : null;

    try {
      // Intentar actualizar con campos de progresión
      await queryD1(
        `UPDATE users SET
          nickname = ?,
          profession = ?,
          playstyle = ?,
          discord_tag = ?,
          bio = ?,
          avatar_pz = ?,
          xp = COALESCE(?, xp),
          completed_milestones = COALESCE(?, completed_milestones),
          active_route = COALESCE(?, active_route)
         WHERE id = ?`,
        [
          nickname || sessionUser.name,
          profession,
          playstyle,
          discord_tag || '',
          bio || '',
          avatar_pz,
          xp !== undefined ? xp : null,
          milestonesJson,
          active_route || null,
          sessionUser.id,
        ]
      );
    } catch (d1Err) {
      // Si la tabla aún no tiene las nuevas columnas, actualizar las estándar
      await queryD1(
        `UPDATE users SET
          nickname = ?,
          profession = ?,
          playstyle = ?,
          discord_tag = ?,
          bio = ?,
          avatar_pz = ?
         WHERE id = ?`,
        [nickname || sessionUser.name, profession, playstyle, discord_tag || '', bio || '', avatar_pz, sessionUser.id]
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name,
        nickname: nickname || sessionUser.name,
        profession,
        playstyle,
        discord_tag,
        bio,
        avatar_pz,
        xp: xp !== undefined ? xp : 0,
        completed_milestones: completed_milestones || [],
        active_route: active_route || null,
        role: sessionUser.role,
      },
    });
  } catch (error) {
    console.error('Error al actualizar perfil de PZ:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
