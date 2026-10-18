import { NextResponse } from 'next/server';
import { queryD1 } from '../../lib/d1Client';
import { CreateServerSchema, VoteServerSchema, getZodErrorMessage } from '../../lib/validations';
import { checkRateLimit, getClientIp } from '../../lib/rateLimit';
import { getSessionUser, hasRequiredRole } from '../../lib/session';
import { ensureProductionTables } from '../../lib/dbBootstrap';
import { sanitizeText, isBotHoneypotTriggered } from '../../lib/sanitizer';

// GET: Listar servidores ordenados por reputación (votos)
export async function GET(request) {
  // Rate Limit lectura: 120 peticiones / minuto por IP
  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`servers:get:${clientIp}`, 120, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Demasiadas consultas al directorio. Por favor espera un momento.' },
      { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
    );
  }

  try {
    await ensureProductionTables();

    // Comprobar si el usuario actual ha votado por alguno de los servidores
    let userVotedIds = new Set();
    const sessionUser = await getSessionUser(request);
    if (sessionUser?.id) {
      try {
        const userVotes = await queryD1('SELECT server_id FROM server_votes WHERE user_id = ?', [sessionUser.id]);
        if (Array.isArray(userVotes)) {
          userVotedIds = new Set(userVotes.map((v) => v.server_id));
        }
      } catch (e) {}
    }

    const results = await queryD1('SELECT * FROM servers ORDER BY votes DESC');
    if (Array.isArray(results)) {
      const parsed = results.map((server) => ({
        ...server,
        is_online: Boolean(server.is_online),
        tags: typeof server.tags === 'string' ? JSON.parse(server.tags) : (server.tags || []),
        gallery_images: typeof server.gallery_images === 'string' ? JSON.parse(server.gallery_images) : (server.gallery_images || []),
        has_voted: userVotedIds.has(server.id),
      }));
      return NextResponse.json({ success: true, source: 'cloudflare_d1', data: parsed });
    }
  } catch (error) {
    console.error('Error crítico consultando D1 en GET /api/servers:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: `Error de base de datos D1: ${error.message}`,
        source: 'd1_error',
        data: [],
      },
      { status: 500 }
    );
  }
}

// POST: Registrar un nuevo servidor con Validación Zod, Rate Limit y RLS
export async function POST(request) {
  const clientIp = getClientIp(request);

  // 1. Rate Limit: Máximo 10 servidores por hora por IP
  const rate = checkRateLimit(`servers:create:${clientIp}`, 10, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Límite de registro de servidores alcanzado. Vuelve a intentar en ${Math.ceil(rate.resetInSeconds / 60)} minutos.`,
      },
      { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
    );
  }

  // 2. Comprobar sesión de usuario (RLS)
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json(
      {
        success: false,
        error: 'Debes iniciar sesión con tu cuenta de Google para registrar un servidor en la comunidad.',
      },
      { status: 401 }
    );
  }

  try {
    await ensureProductionTables();
    const rawBody = await request.json().catch(() => ({}));

    // Trampa Honeypot Anti-Bot
    if (isBotHoneypotTriggered(rawBody)) {
      return NextResponse.json({ success: false, error: 'Petición rechazada por protocolo de seguridad.' }, { status: 400 });
    }

    // 3. Validación estricta con Zod
    const parseResult = CreateServerSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = getZodErrorMessage(parseResult.error);
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const validData = parseResult.data;
    const newServerId = `srv-${Date.now()}`;
    const playersOnline = Math.floor(Math.random() * 8) + 2;

    const safeDescription = sanitizeText(validData.description, 1000);
    const safeName = sanitizeText(validData.name, 64);

    // 4. Inserción segura con parámetros vinculados (Previene Inyecciones SQL)
    await queryD1(
      `INSERT INTO servers (
        id, name, ip, port, region, mode, loot_tier,
        players_online, max_players, is_online, votes,
        description, discord_url, banner_url, gallery_images, tags, owner_id, owner_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newServerId,
        safeName,
        validData.ip,
        validData.port,
        validData.region,
        validData.gamemode,
        validData.loot_multiplier,
        playersOnline,
        validData.max_players,
        1, // is_online
        0, // votes
        safeDescription,
        validData.discord_url || '',
        validData.banner_url || '/spiffo/spiffo_character.png',
        JSON.stringify(validData.gallery_images || []),
        JSON.stringify(validData.tags || []),
        sessionUser.id,
        sessionUser.email,
      ]
    );

    const createdServer = {
      id: newServerId,
      name: safeName,
      ip: validData.ip,
      port: validData.port,
      region: validData.region,
      mode: validData.gamemode,
      loot_tier: validData.loot_multiplier,
      players_online: playersOnline,
      max_players: validData.max_players,
      is_online: true,
      votes: 0,
      description: safeDescription,
      discord_url: validData.discord_url,
      banner_url: validData.banner_url,
      gallery_images: validData.gallery_images,
      tags: validData.tags,
      owner_id: sessionUser.id,
      owner_email: sessionUser.email,
      has_voted: false,
    };

    return NextResponse.json({ success: true, data: createdServer });
  } catch (error) {
    console.error('Error insertando servidor en D1:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Fallo interno al registrar el servidor.' },
      { status: 500 }
    );
  }
}

// PATCH: Voto de reputación (+1 / -1) - 1 Voto Único por Usuario Registrado con Google
export async function PATCH(request) {
  const clientIp = getClientIp(request);

  // 1. Rate Limit de votos: Máximo 30 votos por minuto por IP
  const rate = checkRateLimit(`servers:vote:${clientIp}`, 30, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Has emitido demasiados votos en poco tiempo. Espera ${rate.resetInSeconds} segundos.`,
      },
      { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
    );
  }

  // 2. Control de Autorización: Requiere sesión de usuario registrada con Google
  const sessionUser = await getSessionUser(request);
  if (!sessionUser?.id) {
    return NextResponse.json(
      {
        success: false,
        error: 'Debes iniciar sesión con Google para emitir un voto de reputación verificado.',
      },
      { status: 401 }
    );
  }

  try {
    await ensureProductionTables();
    const rawBody = await request.json().catch(() => ({}));

    // Honeypot check
    if (isBotHoneypotTriggered(rawBody)) {
      return NextResponse.json({ success: false, error: 'Acceso no permitido.' }, { status: 400 });
    }

    const parseResult = VoteServerSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: getZodErrorMessage(parseResult.error) || 'ID inválido' },
        { status: 400 }
      );
    }

    const { id } = parseResult.data;

    // Verificar si el usuario ya votó por este servidor en la tabla server_votes
    const existingVote = await queryD1(
      'SELECT user_id FROM server_votes WHERE user_id = ? AND server_id = ? LIMIT 1',
      [sessionUser.id, id]
    );

    let hasVoted = false;
    let newVotesCount = 0;

    if (existingVote && existingVote.length > 0) {
      // Retirar el voto previo (toggle un-vote)
      await queryD1('DELETE FROM server_votes WHERE user_id = ? AND server_id = ?', [sessionUser.id, id]);
      await queryD1('UPDATE servers SET votes = MAX(0, votes - 1) WHERE id = ?', [id]);
      hasVoted = false;
    } else {
      // Registrar voto verificado en D1
      await queryD1('INSERT INTO server_votes (user_id, server_id) VALUES (?, ?)', [sessionUser.id, id]);
      await queryD1('UPDATE servers SET votes = votes + 1 WHERE id = ?', [id]);
      hasVoted = true;
    }

    const updatedRow = await queryD1('SELECT votes FROM servers WHERE id = ? LIMIT 1', [id]);
    if (updatedRow && updatedRow.length > 0) {
      newVotesCount = updatedRow[0].votes;
    }

    return NextResponse.json({
      success: true,
      id,
      has_voted: hasVoted,
      votes: newVotesCount,
      message: hasVoted ? '¡Voto registrado con éxito!' : 'Voto retirado.',
    });
  } catch (error) {
    console.error('Error procesando voto:', error);
    return NextResponse.json({ success: false, error: error.message || 'Fallo al computar el voto' }, { status: 500 });
  }
}

// DELETE: Eliminación de servidor con RLS estricto
export async function DELETE(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const serverId = searchParams.get('id');

  if (!serverId) {
    return NextResponse.json({ success: false, error: 'ID de servidor requerido' }, { status: 400 });
  }

  try {
    // Consultar el servidor para verificar propiedad
    const existing = await queryD1('SELECT * FROM servers WHERE id = ? LIMIT 1', [serverId]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Servidor no encontrado' }, { status: 404 });
    }

    const server = existing[0];
    const isOwner = server.owner_id === sessionUser.id || server.owner_email === sessionUser.email;
    const isStaff = hasRequiredRole(sessionUser.role, 'moderador');

    // RLS: Solo el dueño, moderadores o administradores pueden eliminarlo
    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { success: false, error: 'No tienes autorización para eliminar este servidor.' },
        { status: 403 }
      );
    }

    await queryD1('DELETE FROM servers WHERE id = ?', [serverId]);

    return NextResponse.json({ success: true, message: 'Servidor eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar servidor:', error);
    return NextResponse.json({ success: false, error: error.message || 'Fallo interno al eliminar.' }, { status: 500 });
  }
}

// PUT: Actualizar servidor existente (Solo dueño o admin)
export async function PUT(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  try {
    const rawBody = await request.json().catch(() => ({}));
    const { id, ...dataToValidate } = rawBody;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de servidor requerido' }, { status: 400 });
    }

    const parseResult = CreateServerSchema.safeParse(dataToValidate);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: getZodErrorMessage(parseResult.error) },
        { status: 400 }
      );
    }

    // Verificar propiedad
    const existing = await queryD1('SELECT * FROM servers WHERE id = ? LIMIT 1', [id]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Servidor no encontrado' }, { status: 404 });
    }

    const server = existing[0];
    const isOwner = server.owner_id === sessionUser.id || server.owner_email === sessionUser.email;
    const isStaff = hasRequiredRole(sessionUser.role, 'admin');

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para editar este servidor.' },
        { status: 403 }
      );
    }

    const validData = parseResult.data;

    await queryD1(
      `UPDATE servers SET
        name = ?, ip = ?, port = ?, region = ?, mode = ?, loot_tier = ?,
        max_players = ?, description = ?, discord_url = ?, banner_url = ?, gallery_images = ?, tags = ?
       WHERE id = ?`,
      [
        validData.name,
        validData.ip,
        validData.port,
        validData.region,
        validData.gamemode,
        validData.loot_multiplier,
        validData.max_players,
        validData.description,
        validData.discord_url || '',
        validData.banner_url || server.banner_url || '/spiffo/spiffo_character.png',
        JSON.stringify(validData.gallery_images || []),
        JSON.stringify(validData.tags || []),
        id,
      ]
    );

    const updatedServer = {
      ...server,
      name: validData.name,
      ip: validData.ip,
      port: validData.port,
      region: validData.region,
      mode: validData.gamemode,
      loot_tier: validData.loot_multiplier,
      max_players: validData.max_players,
      description: validData.description,
      discord_url: validData.discord_url,
      banner_url: validData.banner_url || server.banner_url,
      gallery_images: validData.gallery_images || [],
      tags: validData.tags,
    };

    return NextResponse.json({ success: true, message: 'Servidor actualizado con éxito.', data: updatedServer });
  } catch (error) {
    console.error('Error al actualizar servidor:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

