import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/session';
import { queryD1 } from '../../../lib/d1Client';
import { UpdateProfileSchema, getZodErrorMessage } from '../../../lib/validations';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

// GET: Obtener perfil completo del usuario actual
export async function GET(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  try {
    const results = await queryD1(
      'SELECT id, email, name, picture, role, nickname, profession, playstyle, discord_tag, bio, avatar_pz, created_at, last_login FROM users WHERE id = ? LIMIT 1',
      [sessionUser.id]
    );

    if (results && results.length > 0) {
      return NextResponse.json({ success: true, profile: results[0] });
    }

    return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Actualizar perfil de personaje PZ con validación Zod
export async function PUT(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  // Rate Limit: Máximo 20 actualizaciones de perfil cada 10 minutos
  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`profile:update:${sessionUser.id || clientIp}`, 20, 10 * 60 * 1000);
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

    const { nickname, profession, playstyle, discord_tag, bio, avatar_pz } = parseResult.data;

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
        role: sessionUser.role,
      },
    });
  } catch (error) {
    console.error('Error al actualizar perfil de PZ:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
