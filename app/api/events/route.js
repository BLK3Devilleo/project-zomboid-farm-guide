import { NextResponse } from 'next/server';
import { queryD1 } from '../../lib/d1Client';
import { getSessionUser, hasRequiredRole } from '../../lib/session';
import { initialServerEvents } from '../../data/eventsDatabase';
import { checkRateLimit, getClientIp } from '../../lib/rateLimit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Asegura que la tabla server_events exista en Cloudflare D1.
 */
async function ensureEventsTable() {
  try {
    await queryD1(`
      CREATE TABLE IF NOT EXISTS server_events (
        id TEXT PRIMARY KEY,
        server_id TEXT NOT NULL,
        server_name TEXT,
        server_ip TEXT,
        owner_id TEXT NOT NULL,
        owner_email TEXT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        urgency TEXT NOT NULL DEFAULT 'MEDIA',
        tag TEXT NOT NULL DEFAULT 'EVENTO COMUNIDAD',
        status TEXT NOT NULL DEFAULT 'PROGRAMADO',
        date_display TEXT NOT NULL,
        frequency TEXT,
        description TEXT NOT NULL,
        directives TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.warn('Advertencia verificando tabla server_events:', err.message);
  }
}

// GET: Listar todos los eventos de la comunidad ordenados por fecha de creación
export async function GET(request) {
  try {
    await ensureEventsTable();
    const rows = await queryD1('SELECT * FROM server_events ORDER BY created_at DESC');
    if (Array.isArray(rows) && rows.length > 0) {
      const parsed = rows.map((evt) => ({
        id: evt.id,
        serverId: evt.server_id,
        serverName: evt.server_name || 'Servidor Knox',
        serverIp: evt.server_ip || '',
        ownerId: evt.owner_id,
        ownerEmail: evt.owner_email || '',
        title: evt.title,
        type: evt.type,
        urgency: evt.urgency,
        tag: evt.tag,
        status: evt.status,
        dateDisplay: evt.date_display,
        frequency: evt.frequency || '',
        description: evt.description,
        directives: typeof evt.directives === 'string' ? JSON.parse(evt.directives) : (evt.directives || []),
        createdAt: evt.created_at,
      }));
      return NextResponse.json({ success: true, source: 'cloudflare_d1', data: parsed });
    }
  } catch (error) {
    console.warn('Fallo consultando D1 en GET /api/events, usando eventos base:', error.message);
  }

  // Si aún no hay eventos creados por usuarios en D1, devolver eventos iniciales
  return NextResponse.json({ success: true, source: 'initial_events', data: initialServerEvents });
}

// POST: Publicar nuevo evento con validación estricta de cuota (máximo 2 por dueño)
export async function POST(request) {
  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`events:create:${clientIp}`, 15, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Límite de publicaciones alcanzado. Intenta de nuevo más tarde.' },
      { status: 429 }
    );
  }

  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json(
      { success: false, error: 'Debes iniciar sesión con Google para emitir un evento.' },
      { status: 401 }
    );
  }

  try {
    await ensureEventsTable();
    const body = await request.json().catch(() => ({}));

    if (!body.title || !body.description || !body.serverId || !body.dateDisplay) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios para el evento.' },
        { status: 400 }
      );
    }

    // 1. Verificar propiedad del servidor asociado
    const servers = await queryD1('SELECT id, name, ip, port, owner_id, owner_email FROM servers WHERE id = ? LIMIT 1', [body.serverId]);
    if (!servers || servers.length === 0) {
      return NextResponse.json({ success: false, error: 'El servidor seleccionado no existe.' }, { status: 404 });
    }

    const targetServer = servers[0];
    const isOwner = targetServer.owner_id === sessionUser.id || targetServer.owner_email === sessionUser.email;
    const isStaff = hasRequiredRole(sessionUser.role, 'moderador');

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { success: false, error: 'Solo el dueño verificado del servidor puede publicar un evento para él.' },
        { status: 403 }
      );
    }

    // 2. Control de cuota de negocio: Máximo 2 eventos activos por dueño
    const countRows = await queryD1('SELECT COUNT(*) as total FROM server_events WHERE owner_id = ?', [sessionUser.id]);
    const currentCount = countRows?.[0]?.total || 0;
    if (currentCount >= 2 && !isStaff) {
      return NextResponse.json(
        { success: false, error: 'Cuota máxima alcanzada: solo puedes tener hasta 2 eventos activos simultáneos.' },
        { status: 400 }
      );
    }

    // 3. Crear registro en D1
    const newEventId = `evt-${Date.now()}`;
    const serverAddress = `${targetServer.ip}:${targetServer.port || 16261}`;
    const directivesJson = JSON.stringify(body.directives || []);

    await queryD1(
      `INSERT INTO server_events (
        id, server_id, server_name, server_ip, owner_id, owner_email,
        title, type, urgency, tag, status, date_display, frequency, description, directives
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newEventId,
        body.serverId,
        targetServer.name,
        serverAddress,
        sessionUser.id,
        sessionUser.email,
        body.title,
        body.type || 'EVENTO COMUNIDAD',
        body.urgency || 'MEDIA',
        body.tag || 'EVENTO COMUNIDAD',
        body.status || 'PROGRAMADO',
        body.dateDisplay,
        body.frequency || `${targetServer.name} Direct Frequency`,
        body.description,
        directivesJson,
      ]
    );

    const created = {
      id: newEventId,
      serverId: body.serverId,
      serverName: targetServer.name,
      serverIp: serverAddress,
      ownerId: sessionUser.id,
      ownerEmail: sessionUser.email,
      title: body.title,
      type: body.type || 'EVENTO COMUNIDAD',
      urgency: body.urgency || 'MEDIA',
      tag: body.tag || 'EVENTO COMUNIDAD',
      status: body.status || 'PROGRAMADO',
      dateDisplay: body.dateDisplay,
      frequency: body.frequency || `${targetServer.name} Direct Frequency`,
      description: body.description,
      directives: body.directives || [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error insertando evento en D1:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Retirar evento de D1 con RLS
export async function DELETE(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('id');

  if (!eventId) {
    return NextResponse.json({ success: false, error: 'ID de evento requerido' }, { status: 400 });
  }

  try {
    const existing = await queryD1('SELECT * FROM server_events WHERE id = ? LIMIT 1', [eventId]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Evento no encontrado' }, { status: 404 });
    }

    const evt = existing[0];
    const isOwner = evt.owner_id === sessionUser.id || evt.owner_email === sessionUser.email;
    const isStaff = hasRequiredRole(sessionUser.role, 'moderador');

    if (!isOwner && !isStaff) {
      return NextResponse.json({ success: false, error: 'No autorizado para eliminar este evento' }, { status: 403 });
    }

    await queryD1('DELETE FROM server_events WHERE id = ?', [eventId]);
    return NextResponse.json({ success: true, message: 'Evento retirado del tablón militar con éxito.' });
  } catch (error) {
    console.error('Error eliminando evento en D1:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
