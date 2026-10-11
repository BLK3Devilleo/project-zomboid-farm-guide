import { NextResponse } from 'next/server';
import { GoogleAuthSchema } from '../../../lib/validations';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';
import { queryD1 } from '../../../lib/d1Client';
import { createSessionToken, COOKIE_SESSION_NAME } from '../../../lib/session';

export async function POST(request) {
  // 1. Rate Limiting: Máximo 10 intentos por minuto por IP
  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`auth:google:${clientIp}`, 10, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Demasiados intentos de acceso. Intenta de nuevo en ${rate.resetInSeconds} segundos.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.resetInSeconds) },
      }
    );
  }

  try {
    // 2. Validación de entrada con Zod
    const body = await request.json().catch(() => ({}));
    const parseResult = GoogleAuthSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors[0]?.message || 'Datos de autenticación inválidos',
        },
        { status: 400 }
      );
    }

    const { credential } = parseResult.data;

    // 3. Verificación del ID Token directamente con el endpoint oficial de Google OAuth2
    const googleVerifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { cache: 'no-store' }
    );

    if (!googleVerifyRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Token de Google no válido o expirado.' },
        { status: 401 }
      );
    }

    const googlePayload = await googleVerifyRes.json();
    const { sub: googleId, email, name, picture } = googlePayload;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'No se pudo obtener el correo de la cuenta de Google.' },
        { status: 400 }
      );
    }

    // 4. Determinar rol inicial
    // Si el email está listado en la variable SUPER_ADMIN_EMAILS (separados por coma), asignar super_admin
    const superAdminList = (process.env.SUPER_ADMIN_EMAILS || '')
      .toLowerCase()
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    const isConfiguredSuperAdmin = superAdminList.includes(email.toLowerCase());

    let userRole = isConfiguredSuperAdmin ? 'super_admin' : 'usuario';

    // 5. Consultar y actualizar en Cloudflare D1
    try {
      const existingUsers = await queryD1('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      
      if (existingUsers && existingUsers.length > 0) {
        const existing = existingUsers[0];
        // Conservar rol si ya tenía uno más alto, o elevarlo si ahora está en la lista de super_admin
        userRole = isConfiguredSuperAdmin ? 'super_admin' : existing.role || 'usuario';

        await queryD1(
          'UPDATE users SET name = ?, picture = ?, role = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?',
          [name || existing.name, picture || existing.picture, userRole, existing.id]
        );
      } else {
        // Nuevo usuario
        await queryD1(
          'INSERT INTO users (id, email, name, picture, role) VALUES (?, ?, ?, ?, ?)',
          [googleId, email, name || 'Superviviente', picture || '', userRole]
        );
      }
    } catch (d1Err) {
      console.warn('Advertencia al consultar/actualizar usuario en D1:', d1Err.message);
    }

    const userProfile = {
      id: googleId,
      email,
      name: name || 'Superviviente',
      picture: picture || '',
      role: userRole,
    };

    // 6. Generar JWT de sesión seguro
    const sessionToken = await createSessionToken(userProfile);

    // 7. Responder con Cookie HttpOnly segura
    const response = NextResponse.json({
      success: true,
      user: userProfile,
    });

    response.cookies.set({
      name: COOKIE_SESSION_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });

    return response;
  } catch (error) {
    console.error('Error procesando login de Google:', error);
    return NextResponse.json(
      { success: false, error: 'Fallo interno al procesar inicio de sesión.' },
      { status: 500 }
    );
  }
}
