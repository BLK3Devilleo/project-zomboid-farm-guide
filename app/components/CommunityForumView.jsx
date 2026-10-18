'use client';

import React, { useState, useEffect } from 'react';
import { initialForumThreads } from '../data/forumThreadsDatabase';
import CommentThreadItem from './CommentThreadItem';
import {
  RadioAntennaIcon,
  SignalPulseIcon,
  VoteIcon,
  CheckIcon,
  SearchIcon,
  ChatIcon,
} from './icons/KnoxIcons';

export default function CommunityForumView({ currentUser = null, onOpenLoginModal = () => {} }) {
  const [threads, setThreads] = useState(initialForumThreads);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [userThreadVotes, setUserThreadVotes] = useState({});
  const [userCommentVotes, setUserCommentVotes] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'compact'
  const [isPostingOpen, setIsPostingOpen] = useState(false);
  const [newRootComment, setNewRootComment] = useState('');

  // Formulario de nuevo hilo táctico
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');
  const [newCity, setNewCity] = useState('Rosewood');
  const [newDay, setNewDay] = useState('Día 1');
  const [newTag, setNewTag] = useState('TÁCTICA B42');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forumError, setForumError] = useState(null);

  // Carga inicial y revalidación desde Cloudflare D1
  useEffect(() => {
    let isMounted = true;
    const fetchForumThreads = async () => {
      try {
        const res = await fetch('/api/forum', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            setThreads(json.data);
          }
        }
      } catch (err) {
        console.warn('Alerta: Error sincronizando foro con Cloudflare D1:', err);
      }
    };
    fetchForumThreads();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  // Filtrado de hilos
  const filteredThreads = threads.filter((thread) => {
    if (selectedTagFilter !== 'ALL' && thread.tag !== selectedTagFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      thread.title.toLowerCase().includes(q) ||
      thread.content.toLowerCase().includes(q) ||
      (thread.takeaway && thread.takeaway.toLowerCase().includes(q)) ||
      (thread.city && thread.city.toLowerCase().includes(q)) ||
      thread.author.name.toLowerCase().includes(q)
    );
  });

  // Voto en Hilo Principal (Optimista con persistencia en D1)
  const handleVoteThread = async (threadId, e) => {
    if (e) e.stopPropagation();
    if (userThreadVotes[threadId]) return;

    setUserThreadVotes((prev) => ({ ...prev, [threadId]: true }));
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );

    try {
      const res = await fetch('/api/forum', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vote', threadId }),
      });
      if (!res.ok) {
        throw new Error('Voto rechazado en D1');
      }
    } catch (err) {
      console.warn('Revertiendo voto de hilo:', err);
      setUserThreadVotes((prev) => {
        const clone = { ...prev };
        delete clone[threadId];
        return clone;
      });
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, upvotes: Math.max(0, t.upvotes - 1) } : t))
      );
    }
  };

  // Voto en Comentario Individual (Búsqueda recursiva en el árbol)
  const handleVoteComment = (commentId) => {
    if (userCommentVotes[commentId]) return;
    setUserCommentVotes((prev) => ({ ...prev, [commentId]: true }));

    const updateVotesInTree = (commentsList) => {
      return commentsList.map((c) => {
        if (c.id === commentId) {
          return { ...c, upvotes: c.upvotes + 1 };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: updateVotesInTree(c.replies) };
        }
        return c;
      });
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return { ...t, comments: updateVotesInTree(t.comments) };
        }
        return t;
      })
    );
  };

  // Agregar Comentario Raíz al Hilo
  const handleAddRootComment = async (e) => {
    e.preventDefault();
    if (!newRootComment.trim() || !activeThreadId) return;

    const authorProfile = {
      id: currentUser?.id ? `usr-${currentUser.id}` : `usr-anon-${Date.now()}`,
      name: currentUser?.name || 'Superviviente_Anónimo',
      badge: currentUser?.role === 'admin' ? '[ADMIN]' : '[SUPERVIVIENTE]',
      color: '#10b981',
      isVerified: Boolean(currentUser),
    };

    const newCommentItem = {
      id: `c-${Date.now()}`,
      threadId: activeThreadId,
      parentId: null,
      author: authorProfile,
      content: newRootComment.trim(),
      createdAt: 'Justo ahora',
      upvotes: 1,
      replies: [],
    };

    // Actualización local
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            commentsCount: (t.commentsCount || 0) + 1,
            comments: [newCommentItem, ...t.comments],
          };
        }
        return t;
      })
    );

    const savedCommentText = newRootComment;
    setNewRootComment('');

    // Persistencia en D1
    try {
      await fetch('/api/forum', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          threadId: activeThreadId,
          comment: newCommentItem,
        }),
      });
    } catch (err) {
      console.warn('Advertencia guardando comentario en D1:', err);
    }
  };

  // Agregar Réplica a un Comentario Existente
  const handleAddReply = async (targetCommentId, replyText) => {
    if (!replyText.trim() || !activeThreadId) return;

    const authorProfile = {
      id: currentUser?.id ? `usr-${currentUser.id}` : `usr-anon-${Date.now()}`,
      name: currentUser?.name || 'Superviviente_Anónimo',
      badge: currentUser?.role === 'admin' ? '[ADMIN]' : '[SUPERVIVIENTE]',
      color: '#10b981',
      isVerified: Boolean(currentUser),
    };

    const newReplyItem = {
      id: `c-${Date.now()}`,
      threadId: activeThreadId,
      parentId: targetCommentId,
      author: authorProfile,
      content: replyText.trim(),
      createdAt: 'Justo ahora',
      upvotes: 1,
      replies: [],
    };

    const insertReplyInTree = (commentsList) => {
      return commentsList.map((c) => {
        if (c.id === targetCommentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReplyItem],
          };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: insertReplyInTree(c.replies) };
        }
        return c;
      });
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            commentsCount: (t.commentsCount || 0) + 1,
            comments: insertReplyInTree(t.comments),
          };
        }
        return t;
      })
    );

    // Persistencia en D1
    try {
      await fetch('/api/forum', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          threadId: activeThreadId,
          comment: newReplyItem,
        }),
      });
    } catch (err) {
      console.warn('Advertencia guardando respuesta en D1:', err);
    }
  };

  // Crear Nuevo Hilo Principal (D1 con verificación de auth)
  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    if (!currentUser) {
      onOpenLoginModal();
      return;
    }

    setIsSubmitting(true);
    setForumError(null);

    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          takeaway: newTakeaway.trim(),
          city: newCity.trim() || 'Rosewood',
          day: newDay.trim() || 'Día 1',
          tag: newTag,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al publicar reporte en el foro de Knox.');
      }

      setThreads((prev) => [json.data, ...prev]);
      setNewTitle('');
      setNewContent('');
      setNewTakeaway('');
      setIsPostingOpen(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 4000);
    } catch (err) {
      console.error('Error publicando hilo:', err);
      setForumError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTagClass = (tag) => {
    switch (tag) {
      case 'FALLO CRÍTICO':
        return 'fallo';
      case 'MÉDICO':
        return 'medico';
      case 'AGRICULTURA':
        return 'agricultura';
      case 'COMBATE & SIGILO':
      case 'COMBATE':
        return 'fallo';
      default:
        return 'tactica';
    }
  };

  return (
    <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. CABECERA TÁCTICA DEL FORO */}
      <div className="pz-mission-panel" style={{ padding: '22px 26px' }}>
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SignalPulseIcon size={14} color="#38bdf8" />
            <span>FORO COMUNITARIO // FRECUENCIA 91.5 MHz</span>
          </div>
          <span>KNOX SURVIVOR NETWORK</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 10 }}>
              <RadioAntennaIcon size={24} color="#38bdf8" />
              <span>Foro Táctico & Hilos de Debate</span>
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
              Tablón de radio abierto estilo Reddit: consultas de supervivientes novatos, trucos de veteranos, anécdotas y lecciones de campo para no morir en Kentucky.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: 4, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              RED EN VIVO 91.5 MHz
            </span>
          </div>
        </div>
      </div>

      {/* 2. VISTA DE HILO COMPLETO vs FEED DE HILOS */}
      {activeThread ? (
        /* ================= VISTA DE HILO COMPLETO ================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Botón Volver al Feed */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setActiveThreadId(null)}
              className="pz-btn-secondary"
              style={{ minHeight: 34, padding: '6px 14px', fontSize: 12, gap: 6 }}
            >
              <span>← Volver al tablón de hilos</span>
            </button>
            <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
              FRECUENCIA 91.5 MHz // HILO ID: {activeThread.id}
            </span>
          </div>

          {/* Post Raíz del Hilo */}
          <div className="pz-mission-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="pz-card-eyebrow">
              <span className={`pz-tag-badge ${getTagClass(activeThread.tag)}`}>
                {activeThread.tag}
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                {activeThread.city} · {activeThread.day} · {activeThread.createdAt}
              </span>
            </div>

            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
              {activeThread.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 900,
                  fontFamily: 'monospace',
                }}
              >
                {activeThread.author.name ? activeThread.author.name.substring(0, 2).toUpperCase() : 'OP'}
              </span>
              <span style={{ fontSize: 13, color: '#cbd5e1' }}>
                Iniciado por <strong style={{ color: '#f8fafc' }}>{activeThread.author.name}</strong>
              </span>
              {activeThread.author.badge && (
                <span className="pz-comment-author-badge">
                  {activeThread.author.badge}
                </span>
              )}
            </div>

            <p style={{ fontSize: 15, color: '#e2e8f0', lineHeight: 1.6, margin: '8px 0 0', maxWidth: '75ch' }}>
              {activeThread.content}
            </p>

            {/* Caja de Takeaway Táctico */}
            {activeThread.takeaway && (
              <div className={`pz-takeaway-box ${activeThread.tag === 'FALLO CRÍTICO' ? 'warning' : 'success'}`} style={{ marginTop: 6 }}>
                <span className="pz-takeaway-label">
                  {activeThread.tag === 'FALLO CRÍTICO' ? 'ADVERTENCIA DE CAMPO' : 'CONSEJO TÁCTICO'}
                </span>
                <p className="pz-takeaway-text">
                  {activeThread.takeaway}
                </p>
              </div>
            )}

            {/* Barra de Acciones del Hilo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 14, marginTop: 4 }}>
              <button
                type="button"
                onClick={(e) => handleVoteThread(activeThread.id, e)}
                className={`server-vote-btn ${userThreadVotes[activeThread.id] ? 'voted' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 14px' }}
              >
                <VoteIcon size={14} color={userThreadVotes[activeThread.id] ? '#eab308' : '#94a3b8'} />
                <span>{activeThread.upvotes} Apoyos al reporte</span>
              </button>

              <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ChatIcon size={14} color="#38bdf8" />
                <span>{activeThread.commentsCount || 0} Aportes de la comunidad</span>
              </span>
            </div>
          </div>

          {/* Formulario para Comentar en el Hilo Raíz */}
          <div className="pz-mission-panel" style={{ padding: '18px 22px' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
              AGREGAR RESPUESTA TÁCTICA AL HILO
            </span>
            <form onSubmit={handleAddRootComment} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                required
                rows={3}
                value={newRootComment}
                onChange={(e) => setNewRootComment(e.target.value)}
                placeholder="¿Qué opinas o qué experiencia tienes con esta situación? Aporta tu perspectiva táctica..."
                className="pz-scanner-input"
                style={{ fontSize: 13, resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="pz-btn-primary"
                  style={{ minHeight: 36, padding: '6px 16px', fontSize: 12 }}
                >
                  <span>Publicar Comentario</span>
                </button>
              </div>
            </form>
          </div>

          {/* Árbol de Comentarios con Threadlines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', textTransform: 'uppercase', paddingLeft: 4 }}>
              DEBATE EN CURSO ({activeThread.comments.length} ramas de discusión)
            </span>

            {activeThread.comments.length === 0 ? (
              <div className="pz-mission-panel" style={{ padding: '28px', textAlign: 'center', color: '#64748b' }}>
                <span>Aún no hay respuestas en este reporte. Sé el primer superviviente en aportar.</span>
              </div>
            ) : (
              activeThread.comments.map((rootComment) => (
                <CommentThreadItem
                  key={rootComment.id}
                  comment={rootComment}
                  onVote={handleVoteComment}
                  onReply={handleAddReply}
                  userVotes={userCommentVotes}
                  depth={0}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* ================= VISTA DE TABLÓN / FEED DE HILOS ================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Alerta de Publicación Exitosa */}
          {publishSuccess && (
            <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 6, color: '#34d399', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckIcon size={16} color="#34d399" />
              <span>Tu hilo fue publicado con éxito en la red comunitaria.</span>
            </div>
          )}

          {/* Barra de Filtros, Buscador y Selector de Densidad */}
          <div className="pz-mission-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            {/* Buscador */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 240, maxWidth: 360 }}>
              <SearchIcon size={15} color="#94a3b8" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar hilos o consejos..."
                className="pz-scanner-input"
                style={{ flex: 1, padding: '7px 12px', fontSize: 13 }}
              />
            </div>

            {/* Filtros por Categoría */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['ALL', 'COMBATE & SIGILO', 'TÁCTICA B42', 'FALLO CRÍTICO', 'MÉDICO', 'AGRICULTURA'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(tag)}
                  style={{
                    background: selectedTagFilter === tag ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedTagFilter === tag ? '#38bdf8' : '#94a3b8',
                    border: `1px solid ${selectedTagFilter === tag ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: 4,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tag === 'ALL' ? 'Todos' : tag}
                </button>
              ))}
            </div>

            {/* Toggle de Densidad */}
            <div className="pz-density-toggle">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`pz-density-btn ${viewMode === 'cards' ? 'active' : ''}`}
                title="Vista de tarjetas de debate"
              >
                <span>Tarjetas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`pz-density-btn ${viewMode === 'compact' ? 'active' : ''}`}
                title="Vista compacta de lista rápida"
              >
                <span>Compacto</span>
              </button>
            </div>
          </div>

          {/* Trigger Desplegable para Publicar Hilo */}
          <div className="pz-mission-panel" style={{ padding: '12px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RadioAntennaIcon size={14} color="#38bdf8" />
                </div>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>
                  ¿Tienes una anécdota, error mortal o estrategia para abrir un debate?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPostingOpen(!isPostingOpen)}
                className="pz-btn-secondary"
                style={{ minHeight: 34, padding: '6px 14px', fontSize: 12, gap: 6 }}
              >
                <span>{isPostingOpen ? 'Cerrar Emisor' : '+ Abrir Nuevo Hilo'}</span>
              </button>
            </div>

            {/* Formulario Desplegable */}
            {isPostingOpen && (
              <form onSubmit={handleCreateThread} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 12 }}>Título del Hilo</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ej: ¿Merece la pena construir barricadas de metal en B42?"
                      className="pz-scanner-input"
                      style={{ fontSize: 13, padding: '8px 12px' }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 12 }}>Ciudad / Sector</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', minHeight: 38, fontSize: 13 }}
                    >
                      <option value="Rosewood">Rosewood</option>
                      <option value="West Point">West Point</option>
                      <option value="Muldraugh">Muldraugh</option>
                      <option value="Riverside">Riverside</option>
                      <option value="March Ridge">March Ridge</option>
                      <option value="Louisville">Louisville</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 12 }}>Categoría</label>
                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', minHeight: 38, fontSize: 13 }}
                    >
                      <option value="COMBATE & SIGILO">Combate & Sigilo</option>
                      <option value="TÁCTICA B42">Táctica B42</option>
                      <option value="FALLO CRÍTICO">Fallo Crítico</option>
                      <option value="MÉDICO">Médico</option>
                      <option value="AGRICULTURA">Agricultura</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 12 }}>Relato / Experiencia Completa</label>
                  <textarea
                    required
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Describe en detalle la situación vivida o tu planteamiento para abrir el debate..."
                    className="pz-scanner-input"
                    style={{ fontSize: 13, resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 12, color: '#38bdf8' }}>
                    Consejo Clave / Moraleja Táctica (Takeaway)
                  </label>
                  <input
                    type="text"
                    required
                    value={newTakeaway}
                    onChange={(e) => setNewTakeaway(e.target.value)}
                    placeholder="Ej: Caminar es más rápido que los zeds normales; correr innecesariamente gasta resistencia."
                    className="pz-scanner-input"
                    style={{ fontSize: 13, padding: '8px 12px' }}
                  />
                </div>

                {forumError && (
                  <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 4, color: '#f87171', fontSize: 12 }}>
                    ⚠️ {forumError}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setIsPostingOpen(false)}
                    className="pz-btn-secondary"
                    style={{ minHeight: 38, padding: '8px 16px', fontSize: 12 }}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="pz-btn-primary"
                    style={{ minHeight: 38, padding: '8px 18px', fontSize: 12 }}
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'Transmitiendo...' : 'Publicar Hilo'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contador de Hilos */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
              {filteredThreads.length} HILOS DE DISCUSIÓN DISPONIBLES
            </span>
          </div>

          {/* RENDERIZADO SEGÚN MODO DE VISTA */}
          {viewMode === 'cards' ? (
            /* 1. VISTA DE TARJETAS (2 COLUMNAS ERGONÓMICAS) */
            <div className="pz-forum-grid">
              {filteredThreads.map((thread) => {
                const hasVoted = Boolean(userThreadVotes[thread.id]);
                const isFallo = thread.tag === 'FALLO CRÍTICO';
                return (
                  <div
                    key={thread.id}
                    className="pz-forum-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveThreadId(thread.id)}
                  >
                    {/* Eyebrow con 2 Metadatos Claros */}
                    <div className="pz-card-eyebrow">
                      <span className={`pz-tag-badge ${getTagClass(thread.tag)}`}>
                        {thread.tag}
                      </span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        {thread.city} · {thread.day} · {thread.createdAt}
                      </span>
                    </div>

                    {/* Título Legible Semibold */}
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
                      {thread.title}
                    </h3>

                    {/* Cuerpo acotado a 65ch */}
                    <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                      {thread.content}
                    </p>

                    {/* Caja de Takeaway Destacado */}
                    {thread.takeaway && (
                      <div className={`pz-takeaway-box ${isFallo ? 'warning' : 'success'}`}>
                        <span className={`pz-takeaway-label ${isFallo ? 'warning' : ''}`}>
                          {isFallo ? 'ADVERTENCIA DE CAMPO' : 'CONSEJO TÁCTICO'}
                        </span>
                        <p className="pz-takeaway-text">
                          {thread.takeaway}
                        </p>
                      </div>
                    )}

                    {/* Footer Limpio con Operador, Votos y Contador de Comentarios */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: 'auto' }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        Por: <strong style={{ color: '#94a3b8' }}>{thread.author.name}</strong>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, color: '#38bdf8', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <ChatIcon size={13} color="#38bdf8" />
                          <span>{thread.commentsCount || 0} respuestas</span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleVoteThread(thread.id, e)}
                          className={`server-vote-btn ${hasVoted ? 'voted' : ''}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '4px 10px' }}
                          title="Apoyar este hilo"
                        >
                          <VoteIcon size={13} color={hasVoted ? '#eab308' : '#94a3b8'} />
                          <span>{thread.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. VISTA COMPACTA DE 1 LÍNEA (Reddit Compact View) */
            <div className="pz-compact-table">
              {filteredThreads.map((thread) => {
                const hasVoted = Boolean(userThreadVotes[thread.id]);
                return (
                  <div
                    key={thread.id}
                    className="pz-compact-row"
                    onClick={() => setActiveThreadId(thread.id)}
                  >
                    <span className={`pz-tag-badge ${getTagClass(thread.tag)}`} style={{ minWidth: 110, justifyContent: 'center' }}>
                      {thread.tag}
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                      <strong style={{ fontSize: 14, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {thread.title}
                      </strong>
                      <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {thread.takeaway || thread.content}
                      </span>
                    </div>

                    <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                      {thread.city} · {thread.day}
                    </span>

                    <span style={{ fontSize: 12, color: '#38bdf8', whiteSpace: 'nowrap', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <ChatIcon size={13} color="#38bdf8" />
                      <span>{thread.commentsCount || 0}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleVoteThread(thread.id, e)}
                      className={`server-vote-btn ${hasVoted ? 'voted' : ''}`}
                      style={{ padding: '3px 8px', fontSize: 11 }}
                    >
                      <VoteIcon size={12} color={hasVoted ? '#eab308' : '#94a3b8'} />
                      <span>{thread.upvotes}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
