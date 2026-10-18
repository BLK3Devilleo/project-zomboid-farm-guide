'use client';

import React, { useState, useEffect } from 'react';
import {
  ChatIcon,
  CheckIcon,
  HazardIcon,
  CloseCrossIcon,
  UserProfileIcon,
  VoteIcon,
} from './icons/KnoxIcons';
import {
  fetchServerReviews,
  addServerReview,
  deleteServerReview,
} from '../lib/serverReviewsClient';

export default function ServerReviewsSection({
  serverId,
  currentUser = null,
  onOpenLoginModal = () => {},
}) {
  const [reviews, setReviews] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState('recommended'); // 'recommended' | 'warning'
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serverId) {
      setReviews(fetchServerReviews(serverId));
    }
  }, [serverId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      onOpenLoginModal();
      return;
    }

    if (!commentText.trim()) {
      setErrorMsg('Por favor escribe tu opinión antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = addServerReview(serverId, { rating, comment: commentText }, currentUser);
      setReviews(res.allReviews);
      setCommentText('');
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar la reseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (reviewId) => {
    if (!confirm('¿Deseas eliminar este comentario?')) return;
    try {
      const res = deleteServerReview(serverId, reviewId, currentUser);
      setReviews(res.allReviews);
    } catch (err) {
      alert(err.message || 'Error al eliminar reseña.');
    }
  };

  const recommendedCount = reviews.filter((r) => r.rating === 'recommended').length;
  const recommendedPercent = reviews.length > 0 ? Math.round((recommendedCount / reviews.length) * 100) : 100;

  return (
    <div
      style={{
        background: 'rgba(4, 8, 18, 0.7)',
        borderRadius: 6,
        padding: '18px 20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Cabecera de Reseñas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChatIcon size={14} color="#38bdf8" />
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
            BITÁCORA DE SUPERVIVIENTES // RESEÑAS Y OPINIONES ({reviews.length})
          </span>
        </div>

        {reviews.length > 0 && (
          <div
            style={{
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 3,
              background: recommendedPercent >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: recommendedPercent >= 70 ? '#34d399' : '#f87171',
              border: `1px solid ${recommendedPercent >= 70 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            {recommendedPercent}% RECOMENDADO POR LA COMUNIDAD
          </div>
        )}
      </div>

      {/* Formulario para publicar reseña */}
      {currentUser ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {errorMsg && (
            <div style={{ color: '#fca5a5', fontSize: 11, fontFamily: 'monospace' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
              Veredicto del Refugio:
            </span>
            <button
              type="button"
              onClick={() => setRating('recommended')}
              style={{
                background: rating === 'recommended' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: rating === 'recommended' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                color: rating === 'recommended' ? '#34d399' : '#94a3b8',
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 11,
                fontFamily: 'monospace',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontWeight: 800,
              }}
            >
              <CheckIcon size={12} color="currentColor" />
              <span>RECOMENDADO</span>
            </button>

            <button
              type="button"
              onClick={() => setRating('warning')}
              style={{
                background: rating === 'warning' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: rating === 'warning' ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                color: rating === 'warning' ? '#f87171' : '#94a3b8',
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 11,
                fontFamily: 'monospace',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontWeight: 800,
              }}
            >
              <HazardIcon size={12} color="currentColor" />
              <span>ADVERTENCIA</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="¿Qué tal el ping, el loot, la administración o el ambiente? Escribe tu reseña..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="pz-scanner-input"
              style={{ minHeight: 38, fontSize: 12 }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="pz-btn-primary"
              style={{ fontSize: 11, padding: '0 16px', whiteSpace: 'nowrap' }}
            >
              {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
            </button>
          </div>
        </form>
      ) : (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 14px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
            Inicia sesión con tu cuenta verificada de Google para dejar tu reporte u opinión sobre este servidor.
          </span>
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="pz-btn-primary"
            style={{ fontSize: 10, padding: '4px 10px' }}
          >
            Acceder
          </button>
        </div>
      )}

      {/* Lista de Reseñas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        {reviews.length === 0 ? (
          <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace', fontStyle: 'italic' }}>
            Aún no hay reportes de supervivientes sobre este servidor. ¡Sé el primero en dejar una reseña!
          </span>
        ) : (
          reviews.map((rev) => {
            const isAuthor = currentUser && rev.userId === currentUser.id;
            const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin');
            const isGood = rev.rating === 'recommended';

            return (
              <div
                key={rev.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderLeft: `3px solid ${isGood ? '#10b981' : '#ef4444'}`,
                  borderRadius: 4,
                  padding: '10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserProfileIcon size={13} color="#94a3b8" />
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', fontFamily: 'monospace' }}>
                      {rev.userName}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: 2,
                        background: isGood ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isGood ? '#34d399' : '#fca5a5',
                      }}
                    >
                      {isGood ? 'RECOMENDADO' : 'ADVERTENCIA'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                    {(isAuthor || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(rev.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        title="Eliminar mi comentario"
                      >
                        <CloseCrossIcon size={12} color="#f87171" />
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 12.5, color: '#cbd5e1', margin: 0, lineHeight: 1.45, fontFamily: 'sans-serif' }}>
                  {rev.comment}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
