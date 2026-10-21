import { NextResponse } from 'next/server';
import { queryD1 } from '../../lib/d1Client';
import { getSessionUser } from '../../lib/session';
import { checkRateLimit, getClientIp } from '../../lib/rateLimit';
import { sanitizeText, isBotHoneypotTriggered } from '../../lib/sanitizer';
import { ensureProductionTables } from '../../lib/dbBootstrap';
import { broadcastLog } from '../../lib/sseLogger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Reconstruye el árbol recursivo de comentarios para cada hilo
 */
function buildCommentTrees(comments) {
  const threadMap = {};
  const commentLookup = {};

  for (const c of comments) {
    const item = {
      id: c.id,
      threadId: c.thread_id,
      parentId: c.parent_id || null,
      author: {
        id: c.author_id,
        name: c.author_name,
        badge: c.author_badge || '[SUPERVIVIENTE]',
        color: c.author_color || '#38bdf8',
        isVerified: true,
      },
      content: c.content,
      createdAt: c.created_at,
      upvotes: c.upvotes || 0,
      replies: [],
    };
    commentLookup[c.id] = item;
    if (!threadMap[c.thread_id]) {
      threadMap[c.thread_id] = [];
    }
  }

  for (const id in commentLookup) {
    const item = commentLookup[id];
    if (item.parentId && commentLookup[item.parentId]) {
      commentLookup[item.parentId].replies.push(item);
    } else if (threadMap[item.threadId]) {
      threadMap[item.threadId].push(item);
    }
  }

  return threadMap;
}

// GET: Listar todos los hilos del foro con árboles de comentarios recursivos
export async function GET(request) {
  try {
    await ensureProductionTables();
    const sessionUser = await getSessionUser(request);

    // 1. Obtener todos los hilos
    const threadRows = await queryD1('SELECT * FROM forum_threads ORDER BY created_at DESC');
    const rawThreads = Array.isArray(threadRows) ? threadRows : [];

    // 2. Obtener todos los comentarios relacionales
    const commentRows = await queryD1('SELECT * FROM forum_comments ORDER BY created_at ASC');
    const rawComments = Array.isArray(commentRows) ? commentRows : [];

    // 3. Obtener votos del usuario si está autenticado
    let userVotedThreadIds = new Set();
    if (sessionUser?.id) {
      try {
        const voteRows = await queryD1('SELECT thread_id FROM forum_votes WHERE user_id = ?', [sessionUser.id]);
        if (Array.isArray(voteRows)) {
          userVotedThreadIds = new Set(voteRows.map((v) => v.thread_id).filter(Boolean));
        }
      } catch (colErr) {
        // Fallback defensivo si la tabla forum_votes usa target_id
        try {
          const voteRows = await queryD1("SELECT target_id AS thread_id FROM forum_votes WHERE user_id = ? AND (target_type = 'thread' OR target_type IS NULL)", [sessionUser.id]);
          if (Array.isArray(voteRows)) {
            userVotedThreadIds = new Set(voteRows.map((v) => v.thread_id).filter(Boolean));
          }
        } catch (e2) {}
      }
    }

    // 4. Mapear comentarios en árboles recursivos
    const commentTrees = buildCommentTrees(rawComments);

    // 5. Ensamblar DTO final
    const parsed = rawThreads.map((th) => {
      const tree = commentTrees[th.id] || [];
      const d1CommentCount = rawComments.filter((c) => c.thread_id === th.id).length;

      // Fallback si no hay comentarios relacionales pero hay legado JSON
      let legacyComments = [];
      if (tree.length === 0 && th.comments_json && th.comments_json !== '[]') {
        try {
          legacyComments = JSON.parse(th.comments_json);
        } catch (e) {}
      }

      const finalComments = tree.length > 0 ? tree : legacyComments;
      const finalCount = d1CommentCount > 0 ? d1CommentCount : (th.comments_count || finalComments.length);

      return {
        id: th.id,
        title: th.title,
        city: th.city || 'Rosewood',
        day: th.day || 'Día 1',
        date: th.created_at,
        author: {
          id: th.author_id,
          name: th.author_name,
          badge: th.author_badge || '[SUPERVIVIENTE]',
          color: th.author_color || '#38bdf8',
          isVerified: true,
        },
        tag: th.tag || 'TÁCTICA B42',
        content: th.content,
        takeaway: th.takeaway || '',
        upvotes: th.upvotes || 0,
        has_voted: userVotedThreadIds.has(th.id),
        commentsCount: finalCount,
        comments: finalComments,
        createdAt: th.created_at,
      };
    });

    return NextResponse.json({ success: true, source: 'cloudflare_d1', data: parsed });
  } catch (error) {
    console.error('Error leyendo hilos de D1:', error);
    return NextResponse.json({ success: true, source: 'cloudflare_d1', data: [] });
  }
}

// POST: Publicar un nuevo hilo táctico
export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  // Honeypot anti-bots
  if (isBotHoneypotTriggered(body, 'knox_protocol_trap')) {
    return NextResponse.json({ success: true, data: { id: `th-${Date.now()}` } });
  }

  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`forum:post:${clientIp}`, 10, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Has alcanzado el límite de publicaciones por hora. Espera unos momentos.' },
      { status: 429 }
    );
  }

  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json(
      { success: false, error: 'Debes iniciar sesión con Google para publicar un hilo en el foro.' },
      { status: 401 }
    );
  }

  const cleanTitle = sanitizeText(body.title || '', 150);
  const cleanContent = sanitizeText(body.content || '', 4000);
  const cleanTakeaway = sanitizeText(body.takeaway || '', 300);
  const cleanCity = sanitizeText(body.city || 'Rosewood', 60);
  const cleanDay = sanitizeText(body.day || 'Día 1', 40);
  const cleanTag = sanitizeText(body.tag || 'TÁCTICA B42', 40);

  if (cleanTitle.length < 4 || cleanContent.length < 10) {
    return NextResponse.json(
      { success: false, error: 'Título (min 4 chars) y contenido (min 10 chars) requeridos.' },
      { status: 400 }
    );
  }

  try {
    await ensureProductionTables();
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
        cleanTitle,
        cleanContent,
        cleanTakeaway,
        cleanCity,
        cleanDay,
        cleanTag,
      ]
    );

    const created = {
      id: threadId,
      title: cleanTitle,
      city: cleanCity,
      day: cleanDay,
      date: 'Recién publicado',
      author: {
        id: sessionUser.id,
        name: sessionUser.name || 'Superviviente',
        badge,
        color: badgeColor,
        isVerified: true,
      },
      tag: cleanTag,
      content: cleanContent,
      takeaway: cleanTakeaway,
      upvotes: 0,
      has_voted: false,
      commentsCount: 0,
      comments: [],
      createdAt: 'Ahora mismo',
    };

    broadcastLog('info', `[FORUM-THREAD-CREATE] Hilo publicado: "${cleanTitle}" por ${sessionUser.email}`, {
      threadId,
      author: sessionUser.email,
      city: cleanCity,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error insertando hilo en D1:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Voto en hilo, añadir comentario recursivo o votar comentario
export async function PATCH(request) {
  const body = await request.json().catch(() => ({}));

  // Honeypot anti-bots
  if (isBotHoneypotTriggered(body, 'knox_protocol_trap')) {
    return NextResponse.json({ success: true });
  }

  const clientIp = getClientIp(request);

  try {
    await ensureProductionTables();

    // 1. Votar en Hilo (1 voto por usuario registrado con toggle)
    if (body.action === 'vote' && body.threadId) {
      const sessionUser = await getSessionUser(request);
      if (!sessionUser) {
        return NextResponse.json(
          { success: false, error: 'Debes iniciar sesión con Google para votar.' },
          { status: 401 }
        );
      }

      let existingVote = [];
      try {
        existingVote = await queryD1(
          'SELECT 1 FROM forum_votes WHERE user_id = ? AND thread_id = ? LIMIT 1',
          [sessionUser.id, body.threadId]
        );
      } catch (colErr) {
        existingVote = await queryD1(
          'SELECT 1 FROM forum_votes WHERE user_id = ? AND target_id = ? LIMIT 1',
          [sessionUser.id, body.threadId]
        );
      }

      const alreadyVoted = existingVote && existingVote.length > 0;

      if (alreadyVoted) {
        try {
          await queryD1('DELETE FROM forum_votes WHERE user_id = ? AND (thread_id = ? OR target_id = ?)', [sessionUser.id, body.threadId, body.threadId]);
        } catch (delErr) {
          try {
            await queryD1('DELETE FROM forum_votes WHERE user_id = ? AND thread_id = ?', [sessionUser.id, body.threadId]);
          } catch (delErr2) {
            await queryD1('DELETE FROM forum_votes WHERE user_id = ? AND target_id = ?', [sessionUser.id, body.threadId]);
          }
        }
        await queryD1('UPDATE forum_threads SET upvotes = MAX(0, upvotes - 1) WHERE id = ?', [body.threadId]);
      } else {
        try {
          await queryD1('INSERT INTO forum_votes (user_id, thread_id, target_id, target_type) VALUES (?, ?, ?, ?)', [sessionUser.id, body.threadId, body.threadId, 'thread']);
        } catch (insErr1) {
          try {
            await queryD1('INSERT INTO forum_votes (user_id, thread_id) VALUES (?, ?)', [sessionUser.id, body.threadId]);
          } catch (insErr2) {
            await queryD1('INSERT INTO forum_votes (user_id, target_id, target_type) VALUES (?, ?, ?)', [sessionUser.id, body.threadId, 'thread']);
          }
        }
        await queryD1('UPDATE forum_threads SET upvotes = upvotes + 1 WHERE id = ?', [body.threadId]);
      }

      const rows = await queryD1('SELECT upvotes FROM forum_threads WHERE id = ? LIMIT 1', [body.threadId]);
      const currentVotes = rows && rows.length > 0 ? rows[0].upvotes : 0;

      broadcastLog('info', `[FORUM-VOTE] ${!alreadyVoted ? 'Voto añadido (+1)' : 'Voto retirado (-1)'} en hilo ${body.threadId} por ${sessionUser.email}`, {
        threadId: body.threadId,
        user: sessionUser.email,
        upvotes: currentVotes,
      });

      return NextResponse.json({
        success: true,
        threadId: body.threadId,
        has_voted: !alreadyVoted,
        upvotes: currentVotes,
        message: !alreadyVoted ? '¡Voto táctico confirmado!' : 'Voto retirado.',
      });
    }

    // 2. Añadir Comentario o Réplica Anidada (Árbol Infinito)
    if (body.action === 'comment' && body.threadId) {
      const rateCheck = checkRateLimit(`forum:comment:${clientIp}`, 30, 60 * 60 * 1000);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { success: false, error: 'Has superado el límite de comentarios por hora.' },
          { status: 429 }
        );
      }

      const sessionUser = await getSessionUser(request);
      const rawContent = body.content || body.comment?.content || '';
      const cleanContent = sanitizeText(rawContent, 1500);

      if (cleanContent.length < 2) {
        return NextResponse.json(
          { success: false, error: 'El comentario debe contener al menos 2 caracteres.' },
          { status: 400 }
        );
      }

      const commentId = `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const parentId = body.parentId || body.comment?.parentId || null;
      const authorId = sessionUser ? sessionUser.id : `usr-anon-${Date.now()}`;
      const authorName = sessionUser ? sessionUser.name : 'Superviviente_Anónimo';
      const authorBadge = sessionUser?.role === 'admin' ? '[OFICIAL KNOX]' : '[SUPERVIVIENTE]';
      const authorColor = sessionUser?.role === 'admin' ? '#ef4444' : '#10b981';

      await queryD1(
        `INSERT INTO forum_comments (
          id, thread_id, parent_id, author_id, author_name, author_badge, author_color, content, upvotes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
        [
          commentId,
          body.threadId,
          parentId,
          authorId,
          authorName,
          authorBadge,
          authorColor,
          cleanContent,
        ]
      );

      await queryD1(
        'UPDATE forum_threads SET comments_count = comments_count + 1 WHERE id = ?',
        [body.threadId]
      );

      const insertedItem = {
        id: commentId,
        threadId: body.threadId,
        parentId: parentId,
        author: {
          id: authorId,
          name: authorName,
          badge: authorBadge,
          color: authorColor,
          isVerified: Boolean(sessionUser),
        },
        content: cleanContent,
        createdAt: 'Ahora mismo',
        upvotes: 1,
        replies: [],
      };

      broadcastLog('info', `[FORUM-COMMENT] Comentario añadido en hilo ${body.threadId} por ${authorName}`, {
        threadId: body.threadId,
        author: authorName,
        commentId,
      });

      return NextResponse.json({
        success: true,
        comment: insertedItem,
      });
    }

    // 3. Votar en Comentario
    if (body.action === 'vote_comment' && body.commentId) {
      await queryD1(
        'UPDATE forum_comments SET upvotes = upvotes + 1 WHERE id = ?',
        [body.commentId]
      );
      return NextResponse.json({ success: true, commentId: body.commentId });
    }

    return NextResponse.json({ success: false, error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error en PATCH /api/forum:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
