import { NextResponse } from 'next/server';
import { getSessionUser } from '../../lib/session';
import { queryD1 } from '../../lib/d1Client';
import { ChatMessageSchema, getZodErrorMessage } from '../../lib/validations';
import { checkRateLimit, getClientIp } from '../../lib/rateLimit';

// GET: Obtener los últimos 50 mensajes de la radio comunitaria
export async function GET() {
  try {
    const results = await queryD1(
      'SELECT id, user_id, user_name, user_role, avatar, message, server_ref_id, created_at FROM chat_messages ORDER BY created_at DESC LIMIT 50'
    );

    // Devolver en orden cronológico (antiguo a reciente)
    const reversed = (results || []).reverse();
    return NextResponse.json({ success: true, messages: reversed });
  } catch (error) {
    console.error('Error obteniendo mensajes del chat:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Enviar nuevo mensaje a la frecuencia de radio
export async function POST(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json(
      { success: false, error: 'Debes iniciar sesión con Google para transmitir por la radio comunitaria.' },
      { status: 401 }
    );
  }

  // Rate Limiting: 1 mensaje cada 3 segundos por usuario/IP (20 por minuto)
  const clientIp = getClientIp(request);
  const rateKey = `chat:send:${sessionUser.id || clientIp}`;
  const rate = checkRateLimit(rateKey, 20, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Frecuencia saturada. Espera ${rate.resetInSeconds} segundos antes de enviar otro mensaje.`,
      },
      { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
    );
  }

  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = ChatMessageSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: getZodErrorMessage(parseResult.error) },
        { status: 400 }
      );
    }

    const { message, server_ref_id } = parseResult.data;
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Obtener nickname y avatar PZ actualizados del usuario
    let displayName = sessionUser.name;
    let avatarImg = sessionUser.picture || '/spiffo/spiffo_combat.png';

    try {
      const userRows = await queryD1('SELECT nickname, avatar_pz FROM users WHERE id = ? LIMIT 1', [sessionUser.id]);
      if (userRows && userRows.length > 0) {
        if (userRows[0].nickname) displayName = userRows[0].nickname;
        if (userRows[0].avatar_pz) avatarImg = `/spiffo/${userRows[0].avatar_pz}`;
      }
    } catch (e) {}

    await queryD1(
      `INSERT INTO chat_messages (id, user_id, user_name, user_role, avatar, message, server_ref_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        msgId,
        sessionUser.id,
        displayName,
        sessionUser.role || 'usuario',
        avatarImg,
        message,
        server_ref_id || '',
      ]
    );

    const newMessage = {
      id: msgId,
      user_id: sessionUser.id,
      user_name: displayName,
      user_role: sessionUser.role || 'usuario',
      avatar: avatarImg,
      message,
      server_ref_id: server_ref_id || '',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error publicando mensaje en el chat:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
