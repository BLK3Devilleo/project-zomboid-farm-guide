import { NextResponse } from 'next/server';
import { initialServers } from '../../data/serversDatabase';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

// Función para consultar Cloudflare D1 mediante la API REST oficial
async function queryD1(sql, params = []) {
  if (!ACCOUNT_ID || !DATABASE_ID || !API_TOKEN) {
    return null;
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cloudflare D1 HTTP Error:', response.status, errorText);
    throw new Error(`D1 query failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    console.error('Cloudflare D1 Query Error:', data.errors);
    throw new Error(data.errors?.[0]?.message || 'D1 query failed');
  }

  return data.result?.[0]?.results || [];
}

// GET: Obtener lista de servidores clasificados por votos
export async function GET() {
  try {
    if (ACCOUNT_ID && DATABASE_ID && API_TOKEN) {
      const results = await queryD1(
        'SELECT * FROM servers ORDER BY votes DESC'
      );
      if (results && results.length > 0) {
        // Asegurar parsing de tags si vienen serializados en JSON o texto
        const parsed = results.map((server) => ({
          ...server,
          is_online: Boolean(server.is_online),
          tags: typeof server.tags === 'string' ? JSON.parse(server.tags) : (server.tags || []),
        }));
        return NextResponse.json({ success: true, source: 'cloudflare_d1', data: parsed });
      }
    }
  } catch (error) {
    console.warn('Error conectando a Cloudflare D1 en GET, usando fallback local:', error.message);
  }

  // Fallback con datos iniciales
  return NextResponse.json({ success: true, source: 'fallback', data: initialServers });
}

// POST: Registrar un nuevo servidor
export async function POST(request) {
  try {
    const body = await request.json();
    const newServer = {
      id: body.id || `srv-${Date.now()}`,
      name: body.name || 'Servidor Desconocido',
      ip: body.ip || '127.0.0.1',
      port: parseInt(body.port, 10) || 16261,
      gamemode: body.gamemode || 'PvE',
      region: body.region || 'LATAM',
      loot_multiplier: body.loot_multiplier || 'Normal (x1.0)',
      zombie_speed: body.zombie_speed || 'Fast Shamblers',
      pvp_rules: body.pvp_rules || 'Desactivado',
      description: body.description || '',
      rules: body.rules || '',
      discord_url: body.discord_url || '',
      tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
      players_online: Math.floor(Math.random() * 8) + 2,
      max_players: parseInt(body.max_players, 10) || 32,
      votes: 0,
      is_online: 1,
      banner_gradient: body.banner_gradient || 'from-emerald-950/70 via-black/80 to-zinc-950',
    };

    if (ACCOUNT_ID && DATABASE_ID && API_TOKEN) {
      await queryD1(
        `INSERT INTO servers (
          id, name, ip, port, gamemode, region, loot_multiplier, zombie_speed,
          pvp_rules, description, rules, discord_url, tags, players_online,
          max_players, votes, is_online, banner_gradient
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newServer.id,
          newServer.name,
          newServer.ip,
          newServer.port,
          newServer.gamemode,
          newServer.region,
          newServer.loot_multiplier,
          newServer.zombie_speed,
          newServer.pvp_rules,
          newServer.description,
          newServer.rules,
          newServer.discord_url,
          newServer.tags,
          newServer.players_online,
          newServer.max_players,
          newServer.votes,
          newServer.is_online,
          newServer.banner_gradient,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...newServer,
        tags: Array.isArray(body.tags) ? body.tags : [],
        is_online: true,
      },
    });
  } catch (error) {
    console.error('Error registrando servidor:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Incrementar voto (+1 reputación atómica)
export async function PATCH(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    if (ACCOUNT_ID && DATABASE_ID && API_TOKEN) {
      await queryD1('UPDATE servers SET votes = votes + 1 WHERE id = ?', [id]);
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error al votar servidor:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
