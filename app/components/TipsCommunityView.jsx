'use client';

import React, { useState } from 'react';
import { standaloneGuides } from '../data/tipsDatabase';
import { initialForumThreads } from '../data/forumThreadsDatabase';
import CommentThreadItem from './CommentThreadItem';
import {
  WrenchIcon,
  ShieldAdminIcon,
  CrosshairIcon,
  SignalPulseIcon,
  VoteIcon,
  RadioAntennaIcon,
  HazardIcon,
  BackpackIcon,
  CheckIcon,
  CloseCrossIcon,
  SearchIcon,
  ChatIcon,
} from './icons/KnoxIcons';

export default function TipsCommunityView({ currentUser = null, onOpenLoginModal = () => {} }) {
  const [activeTab, setActiveTab] = useState('community'); // 'guides' | 'community' (abrimos en foro como prioridad del usuario)
  const [selectedGuideId, setSelectedGuideId] = useState(standaloneGuides[0]?.id || 'hotwiring');
  const [threads, setThreads] = useState(initialForumThreads);
  const [activeThreadId, setActiveThreadId] = useState(null); // ID del hilo activo para ver debate completo
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

  const selectedGuide = standaloneGuides.find((g) => g.id === selectedGuideId) || standaloneGuides[0];
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

  // Voto en Hilo Principal
  const handleVoteThread = (threadId, e) => {
    if (e) e.stopPropagation();
    if (userThreadVotes[threadId]) return;
    setUserThreadVotes((prev) => ({ ...prev, [threadId]: true }));
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
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
  const handleAddRootComment = (e) => {
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

    setNewRootComment('');
  };

  // Agregar Réplica a un Comentario Existente (Recursivo)
  const handleAddReply = (targetCommentId, replyText) => {
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
  };

  // Crear Nuevo Hilo Principal
  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const authorProfile = {
      id: currentUser?.id ? `usr-${currentUser.id}` : `usr-anon-${Date.now()}`,
      name: currentUser?.name || 'Superviviente_Anónimo',
      badge: currentUser?.role === 'admin' ? '[ADMIN]' : '[SUPERVIVIENTE]',
      color: '#10b981',
      isVerified: Boolean(currentUser),
    };

    const newThreadItem = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      city: newCity.trim() || 'Sector Knox',
      location: `${newCity.trim() || 'Sector Knox'}`,
      day: newDay.trim() || 'Día 1',
      date: `${newDay.trim() || 'Día 1'} in-game`,
      author: authorProfile,
      tag: newTag,
      content: newContent.trim(),
      takeaway: newTakeaway.trim() || 'Mantén siempre una vía de escape y evalúa el riesgo antes de saquear.',
      upvotes: 1,
      createdAt: 'Justo ahora',
      commentsCount: 0,
      comments: [],
    };

    setThreads([newThreadItem, ...threads]);
    setNewTitle('');
    setNewContent('');
    setNewTakeaway('');
    setIsPostingOpen(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  const getTagClass = (tag) => {
    switch (tag) {
      case 'FALLO CRÍTICO':
        return 'fallo';
      case 'MÉDICO':
        return 'medico';
      case 'AGRICULTURA':
        return 'agricultura';
      default:
        return 'tactica';
    }
  };

  return (
    <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. CABECERA TÁCTICA KNOX-OS */}
      <div className="pz-mission-panel" style={{ padding: '22px 26px' }}>
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SignalPulseIcon size={14} color="#38bdf8" />
            <span>CENTRO DE TELEMETRÍA // CONOCIMIENTO TÁCTICO B42</span>
          </div>
          <span>CANAL DE RADIO 91.5 MHz</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 10 }}>
              <WrenchIcon size={24} color="#38bdf8" />
              <span>Foro Táctico & Hilos de la Comunidad</span>
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 640, lineHeight: 1.5 }}>
              Hilos de discusión interactiva estilo Reddit: debates, réplicas, lecciones de campo y manuales de supervivencia en Kentucky.
            </p>
          </div>

          {/* Selector de Pestaña Principal */}
          <div style={{ display: 'flex', gap: 6, background: 'rgba(15, 23, 42, 0.8)', padding: 4, borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => { setActiveTab('community'); setActiveThreadId(null); }}
              className={`pz-switch-tab ${activeTab === 'community' ? 'active' : ''}`}
              style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px' }}
            >
              <RadioAntennaIcon size={14} color="currentColor" />
              <span>Foro & Hilos</span>
            </button>
            <button
              onClick={() => { setActiveTab('guides'); setActiveThreadId(null); }}
              className={`pz-switch-tab ${activeTab === 'guides' ? 'active' : ''}`}
              style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px' }}
            >
              <WrenchIcon size={14} color="currentColor" />
              <span>Guías Sueltas</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      {activeTab === 'guides' ? (
        /* ================= VISTA DE GUÍAS SUELTAS ================= */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 300px) 1fr', gap: 20 }}>
          {/* Menú Lateral de Guías */}
          <div className="pz-mission-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              DIRECTORIO DE PROTOCOLOS
            </span>
            {standaloneGuides.map((guide) => {
              const isSelected = selectedGuideId === guide.id;
              return (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`pz-mode-card ${isSelected ? 'selected' : ''}`}
                  style={{ textAlign: 'left', padding: '12px 14px', borderLeft: isSelected ? '3px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#38bdf8', fontWeight: 800 }}>
                      {guide.tag}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <strong style={{ fontSize: 13, color: isSelected ? '#ffffff' : '#cbd5e1', lineHeight: 1.3 }}>
                    {guide.title}
                  </strong>
                  <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    {guide.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ficha Detallada de la Guía */}
          <div className="pz-mission-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="pz-mission-bar">
              <span>MANUAL DE OPERACIONES // {selectedGuide.id.toUpperCase()}</span>
              <span style={{ color: '#10b981' }}>ESTIMACIÓN: {selectedGuide.estimatedTime}</span>
            </div>

            <div>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                {selectedGuide.category} • {selectedGuide.tag}
              </span>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', margin: '4px 0 8px', letterSpacing: '-0.01em' }}>
                {selectedGuide.title}
              </h2>
              <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.55, margin: 0, maxWidth: '65ch' }}>
                {selectedGuide.summary}
              </p>
            </div>

            {/* Chips de Requisitos */}
            <div>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
                REQUISITOS PREVIOS DE INVENTARIO Y HABILIDAD
              </span>
              <div className="pz-gear-chips-grid">
                {selectedGuide.requirements.map((req, idx) => (
                  <div key={idx} className="pz-gear-chip">
                    <BackpackIcon size={13} color="#38bdf8" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pasos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#10b981', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                SECUENCIA TÁCTICA PASO A PASO
              </span>
              {selectedGuide.steps.map((st) => (
                <div
                  key={st.step}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '12px 16px',
                    borderRadius: 6,
                    background: 'rgba(30, 41, 59, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {st.step}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <strong style={{ fontSize: 14, color: '#f8fafc', fontWeight: 700 }}>{st.title}</strong>
                    <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55, margin: 0, maxWidth: '65ch' }}>
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Advertencias */}
            {selectedGuide.warnings && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 6,
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <HazardIcon size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#fca5a5', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                    ADVERTENCIAS DE RIESGO MORTAL
                  </span>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#fecaca', fontSize: 13, lineHeight: 1.5 }}>
                    {selectedGuide.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeThread ? (
        /* ================= VISTA DE HILO COMPLETO ESTILO REDDIT ================= */
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
              DEBATE EN CURSO ({activeThread.comments.length} hilos de conversación)
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
              {['ALL', 'TÁCTICA B42', 'FALLO CRÍTICO', 'MÉDICO', 'AGRICULTURA'].map((tag) => (
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
                    placeholder="Ej: Las barricadas de metal aguantan el triple de impacto antes de ceder."
                    className="pz-scanner-input"
                    style={{ fontSize: 13, padding: '8px 12px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setIsPostingOpen(false)}
                    className="pz-btn-secondary"
                    style={{ minHeight: 38, padding: '8px 16px', fontSize: 12 }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="pz-btn-primary"
                    style={{ minHeight: 38, padding: '8px 18px', fontSize: 12 }}
                  >
                    <span>Publicar Hilo</span>
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
                    <span className={`pz-tag-badge ${getTagClass(thread.tag)}`} style={{ minWidth: 100, justifyContent: 'center' }}>
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
