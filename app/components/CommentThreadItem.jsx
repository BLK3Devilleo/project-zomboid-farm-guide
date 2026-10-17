'use client';

import React, { useState } from 'react';
import { VoteIcon, CheckIcon, CloseCrossIcon, BackpackIcon } from './icons/KnoxIcons';

/**
 * Componente Recursivo de Comentario Estilo Reddit / Discourse
 * Soporta respuestas anidadas, threadline visual, colapso de ramas y votos individuales.
 */
export default function CommentThreadItem({
  comment,
  onVote,
  onReply,
  userVotes = {},
  depth = 0,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const hasVoted = Boolean(userVotes[comment.id]);
  const maxDepthReached = depth >= 3; // Evita el efecto escalera excesivo en pantallas pequeñas

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(comment.id, replyText.trim());
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className="pz-threadline-wrapper">
      {/* Línea conectora vertical (si tiene réplicas y no está colapsado) */}
      {comment.replies && comment.replies.length > 0 && !isCollapsed && (
        <div
          className="pz-threadline"
          onClick={() => setIsCollapsed(true)}
          title="Clic para colapsar este hilo de respuestas"
        />
      )}

      {/* Tarjeta del Comentario */}
      <div className="pz-comment-card">
        {/* Metadatos del Autor */}
        <div className="pz-comment-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 900,
                fontFamily: 'monospace',
              }}
            >
              {comment.author?.name ? comment.author.name.substring(0, 2).toUpperCase() : 'OP'}
            </span>
            <strong style={{ fontSize: 13, color: '#f8fafc' }}>
              {comment.author?.name || 'Superviviente'}
            </strong>
            {comment.author?.badge && (
              <span className="pz-comment-author-badge">
                {comment.author.badge}
              </span>
            )}
            <span style={{ fontSize: 11, color: '#64748b' }}>
              · {comment.createdAt}
            </span>
          </div>

          {/* Botón de Colapsar Rama */}
          {comment.replies && comment.replies.length > 0 && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="pz-comment-act-btn"
              style={{ fontSize: 10 }}
            >
              {isCollapsed ? `[+ ${comment.replies.length} respuestas]` : '[-]'}
            </button>
          )}
        </div>

        {/* Contenido si no está colapsado */}
        {!isCollapsed && (
          <>
            <p className="pz-comment-body">
              {comment.content}
            </p>

            {/* Barra de Acciones del Comentario */}
            <div className="pz-comment-actions">
              {/* Voto individual */}
              <button
                type="button"
                onClick={() => onVote(comment.id)}
                className={`pz-comment-act-btn ${hasVoted ? 'voted' : ''}`}
                title="Apoyar este comentario"
              >
                <VoteIcon size={12} color={hasVoted ? '#eab308' : '#94a3b8'} />
                <span>{comment.upvotes}</span>
              </button>

              {/* Botón Responder */}
              <button
                type="button"
                onClick={() => setIsReplying(!isReplying)}
                className="pz-comment-act-btn"
              >
                <span>{isReplying ? 'Cancelar' : 'Responder'}</span>
              </button>
            </div>

            {/* Formulario de Respuesta Inline */}
            {isReplying && (
              <form onSubmit={handleSubmitReply} className="pz-reply-inline-box">
                <textarea
                  required
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Responder a ${comment.author?.name}...`}
                  className="pz-scanner-input"
                  style={{ fontSize: 12, resize: 'vertical' }}
                  autoFocus
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setIsReplying(false)}
                    className="pz-btn-secondary"
                    style={{ minHeight: 32, padding: '4px 10px', fontSize: 11 }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="pz-btn-primary"
                    style={{ minHeight: 32, padding: '4px 14px', fontSize: 11 }}
                  >
                    <span>Publicar Respuesta</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Renderizado de Réplicas Hijas (Recursivo con Indentación) */}
      {!isCollapsed && comment.replies && comment.replies.length > 0 && (
        <div className="pz-comment-node" style={{ marginLeft: maxDepthReached ? 0 : 8 }}>
          {comment.replies.map((child) => (
            <CommentThreadItem
              key={child.id}
              comment={child}
              onVote={onVote}
              onReply={onReply}
              userVotes={userVotes}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
