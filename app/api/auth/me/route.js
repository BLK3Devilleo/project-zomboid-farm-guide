import { NextResponse } from 'next/server';
import { getSessionUser, COOKIE_SESSION_NAME } from '../../../lib/session';

// GET: Obtener sesión activa actual
export async function GET(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }
    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

// POST: Cerrar sesión
export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada' });
  response.cookies.delete(COOKIE_SESSION_NAME);
  return response;
}
