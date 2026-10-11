import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/session';
import { queryD1 } from '../../../lib/d1Client';

// GET: Obtener todos los servidores registrados por el usuario autenticado
export async function GET(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  try {
    const results = await queryD1(
      'SELECT * FROM servers WHERE owner_id = ? OR owner_email = ? ORDER BY created_at DESC',
      [sessionUser.id, sessionUser.email]
    );

    const parsed = (results || []).map((server) => ({
      ...server,
      is_online: Boolean(server.is_online),
      tags: typeof server.tags === 'string' ? JSON.parse(server.tags) : (server.tags || []),
    }));

    return NextResponse.json({ success: true, servers: parsed });
  } catch (error) {
    console.error('Error listando servidores del usuario:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
