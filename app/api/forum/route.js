import { NextResponse } from 'next/server';
import { queryD1 } from '../../lib/d1Client';
import { getSessionUser } from '../../lib/session';
import { checkRateLimit, getClientIp } from '../../lib/rateLimit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function ensureForumTables() {
  try {
    await queryD1(`
      CREATE TABLE IF NOT EXISTS forum_threads (
        id TEXT PRIMARY KEY,
        author_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_badge TEXT DEFAULT '[SUPERVIVIENTE]',
        author_color TEXT DEFAULT '#38bdf8',
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        takeaway TEXT,
        city TEXT DEFAULT 'Rosewood',
        day TEXT DEFAULT 'Día 1',
        tag TEXT DEFAULT 'TÁCTICA B42',
        upvotes INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        comments_json TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.warn('Advertencia verificando tabla forum_threads:', err.message);
  }
}

// GET: Listar todos los hilos del foro comunitario desde D1
export async function GET(request) {
  try {
    await ensureForumTables();
    const rows = await queryD1('SELECT * FROM forum_threads ORDER BY created_at DESC');
    if (Array.isArray(rows)) {
      const parsed = rows.map((th) => ({
        id: th.id,
        title: th.title,
        city: th.city,
        day: th.day,
        date: th.created_at,
        author: {
          id: th.author_id,
          name: th.author_name,
          badge: th.author_badge || '[SUPERVIVIENTE]',
          color: th.author_color || '#38bdf8',
          isVerified: true,
        },
        tag: th.tag,
        content: th.content,
        takeaway: th.takeaway,
        upvotes: th.upvotes || 0,
        commentsCount: th.comments_count || 0,
        comments: typeof th.comments_json === 'string' ? JSON.parse(th.comments_json) : (th.comments_json || []),
        createdAt: th.created_at,
      }));
      return NextResponse.json({ success: true, source: 'cloudflare_d1', data: parsed });
    }
  } catch (error) {
    console.warn('Error leyendo hilos de D1:', error.message);
  }

  return NextResponse.json({ success: true, source: 'cloudflare_d1', data: [] });
}

// POST: Publicar un nuevo hilo táctico
export async function POST(request) {
  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`forum:post:${clientIp}`, 10, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Has alcanzado el límite de publicaciones por hora.' },
      { status: 429 }
    );
  }

  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json(
      { success: false, error: 'Debes iniciar sesión con Google para publicar en el foro.' },
      { status: 401 }
    );
  }

  try {
    await ensureForumTables();
    const body = await request.json().catch(() => ({}));

    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: 'Título y contenido requeridos.' }, { status: 400 });
    }

    const threadId = `th-${Date.now()}`;
    const badge = sessionUser.role === 'admin' ? '[OFICIAL KNOX]' : '[SUPERVIVIENTE]';
    const badgeColor = sessionUser.role === 'admin' ? '#ef4444' : '#38bdf8';

    await queryD1(
      `INSERT INTO forum_threads (
        id, author_id, author_name, author_badge, author_color,
        title, content, takeaway, city, day, tag, upvotes, comments_count, comments_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, '[]')`,
      [
        threadId,
        sessionUser.id,
        sessionUser.name || 'Superviviente',
        badge,
        badgeColor,
        body.title.trim(),
        body.content.trim(),
        body.takeaway ? body.takeaway.trim() : '',
        body.city || 'Rosewood',
        body.day || 'Día 1',
        body.tag || 'TÁCTICA B42',
      ]
    );

    const created = {
      id: threadId,
      title: body.title.trim(),
      city: body.city || 'Rosewood',
      day: body.day || 'Día 1',
      date: 'Recién publicado',
      author: {
        id: sessionUser.id,
        name: sessionUser.name || 'Superviviente',
        badge,
        color: badgeColor,
        isVerified: true,
      },
      tag: body.tag || 'TÁCTICA B42',
      content: body.content.trim(),
      takeaway: body.takeaway ? body.takeaway.trim() : '',
      upvotes: 0,
      commentsCount: 0,
      comments: [],
      createdAt: 'Ahora mismo',
    };

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error insertando hilo en D1:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Voto en hilo o añadir comentario
export async function PATCH(request) {
  try {
    await ensureForumTables();
    const body = await request.json().catch(() => ({}));

    if (body.action === 'vote' && body.threadId) {
      await queryD1('UPDATE forum_threads SET upvotes = upvotes + 1 WHERE id = ?', [body.threadId]);
      return NextResponse.json({ success: true, threadId: body.threadId });
    }

    if (body.action === 'comment' && body.threadId && body.comment) {
      const rows = await queryD1('SELECT comments_json, comments_count FROM forum_threads WHERE id = ? LIMIT 1', [body.threadId]);
      if (rows && rows.length > 0) {
        const currentComments = typeof rows[0].comments_json === 'string' ? JSON.parse(rows[0].comments_json) : [];
        const updated = [...currentComments, body.comment];
        await queryD1('UPDATE forum_threads SET comments_json = ?, comments_count = comments_count + 1 WHERE id = ?', [JSON.stringify(updated), body.threadId]);
        return NextResponse.json({ success: true, comments: updated });
      }
    }

    return NextResponse.json({ success: false, error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error en PATCH /api/forum:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
