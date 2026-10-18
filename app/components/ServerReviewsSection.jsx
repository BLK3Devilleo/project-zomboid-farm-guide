'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [stats, setStats] = useState({ total: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(3); // 1 | 2 | 3
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!serverId) return;
    setLoading(true);
    try {
      const data = await fetchServerReviews(serverId);
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setStats(data.stats || { total: 0, avgRating: 0 });
    } catch (err) {
      console.warn('Error cargando reseñas D1:', err);
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Si el usuario actual ya tiene una reseña registrada, cargarla en el formulario
  useEffect(() => {
    if (currentUser && reviews.length > 0) {
      const myReview = reviews.find((r) => r.user_id === currentUser.id);
      if (myReview) {
        setRating(Number(myReview.rating) || 2);
        setCommentText(myReview.comment || '');
      }
    }
  }, [currentUser, reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) {
      onOpenLoginModal();
      return;
    }

    if (!commentText.trim()) {
      setErrorMsg('Por favor escribe tu informe u opinión sobre el servidor.');
      return;
    }

    if (commentText.trim().length < 5) {
      setErrorMsg('El reporte debe contener al menos 5 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addServerReview(
        serverId,
        { rating, comment: commentText },
        currentUser
      );
      setReviews(res.reviews);
      setStats(res.stats);
      setSuccessMsg(res.message || '¡Informe de evaluación guardado con éxito!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar la reseña en D1.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('¿Deseas eliminar este reporte del registro de frecuencia?')) return;
    try {
      const res = await deleteServerReview(serverId, reviewId, currentUser);
      setReviews(res.reviews);
      setStats(res.stats);
      setCommentText('');
      setRating(2);
    } catch (err) {
      alert(err.message || 'Error al eliminar reseña.');
    }
  };

  const myExistingReview = currentUser ? reviews.find((r) => r.user_id === currentUser.id) : null;

  return (
    <div
      style={{
        background: 'rgba(4, 8, 18, 0.75)',
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
            BITÁCORA MILITAR // EVALUACIONES DE SUPERVIVIENTES ({stats.total || reviews.length})
          </span>
        </div>

        {reviews.length > 0 && (
          <div
            style={{
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 3,
              background: stats.avgRating >= 2.3 ? 'rgba(16, 185, 129, 0.15)' : stats.avgRating >= 1.7 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: stats.avgRating >= 2.3 ? '#34d399' : stats.avgRating >= 1.7 ? '#facc15' : '#f87171',
              border: `1px solid ${stats.avgRating >= 2.3 ? 'rgba(16, 185, 129, 0.3)' : stats.avgRating >= 1.7 ? 'rgba(234, 179, 8, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>PROMEDIO: {stats.avgRating}/3</span>
            <span>
              {stats.avgRating >= 2.5 ? '★★★ ÓPTIMO' : stats.avgRating >= 1.5 ? '★★☆ ESTABLE' : '★☆☆ ALERTA'}
            </span>
          </div>
        )}
      </div>

      {/* Formulario para publicar o editar reseña (1 por usuario) */}
      {currentUser ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {errorMsg && (
            <div style={{ color: '#fca5a5', fontSize: 11, fontFamily: 'monospace', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 10px', borderRadius: 4 }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ color: '#86efac', fontSize: 11, fontFamily: 'monospace', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 10px', borderRadius: 4 }}>
              {successMsg}
            </div>
          )}

          {/* Selector de 3 estrellas tácticas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 700 }}>
              {myExistingReview ? 'Modificar tu Evaluación:' : 'Calificación Táctica:'}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { val: 1, label: '★☆☆ Alerta', desc: 'Riesgo / Pobre', color: '#ef4444' },
                { val: 2, label: '★★☆ Aceptable', desc: 'Estable / Jugable', color: '#f59e0b' },
                { val: 3, label: '★★★ Óptimo', desc: 'Recomendado / Excelente', color: '#10b981' },
              ].map((tier) => {
                const isSelected = rating === tier.val;
                return (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => setRating(tier.val)}
                    style={{
                      background: isSelected ? `${tier.color}22` : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? `1px solid ${tier.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isSelected ? tier.color : '#94a3b8',
                      borderRadius: 4,
                      padding: '5px 10px',
                      fontSize: 11,
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                    title={tier.desc}
                  >
                    <span>{tier.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="¿Qué tal el ping, la estabilidad, la comunidad o la administración? Escribe tu informe..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="pz-scanner-input"
              style={{ minHeight: 38, fontSize: 12, flex: 1 }}
              maxLength={800}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="pz-btn-primary"
              style={{ fontSize: 11, padding: '0 18px', whiteSpace: 'nowrap' }}
            >
              {isSubmitting ? 'Guardando...' : myExistingReview ? 'Actualizar Reporte' : 'Publicar Informe'}
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
            Inicia sesión con tu cuenta de Google para emitir tu evaluación y reseña sobre este servidor.
          </span>
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="pz-btn-primary"
            style={{ fontSize: 10, padding: '5px 12px' }}
          >
            Acceder
          </button>
        </div>
      )}

      {/* Lista de Reseñas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        {loading ? (
          <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
            Sintonizando bitácora de evaluaciones desde Cloudflare D1...
          </span>
        ) : reviews.length === 0 ? (
          <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace', fontStyle: 'italic' }}>
            Aún no hay reportes de supervivientes sobre este servidor. ¡Sé el primero en dejar una reseña!
          </span>
        ) : (
          reviews.map((rev) => {
            const isAuthor = currentUser && rev.user_id === currentUser.id;
            const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin');
            const numRating = Number(rev.rating) || 2;
            const tierColor = numRating === 3 ? '#10b981' : numRating === 2 ? '#f59e0b' : '#ef4444';
            const tierLabel = numRating === 3 ? '★★★ ÓPTIMO' : numRating === 2 ? '★★☆ ACEPTABLE' : '★☆☆ ALERTA';

            return (
              <div
                key={rev.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderLeft: `3px solid ${tierColor}`,
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
                      {rev.user_name}
                    </span>
                    {isAuthor && (
                      <span
                        style={{
                          fontSize: 9,
                          fontFamily: 'monospace',
                          fontWeight: 900,
                          padding: '1px 5px',
                          borderRadius: 2,
                          background: 'rgba(56, 189, 248, 0.2)',
                          color: '#38bdf8',
                        }}
                      >
                        [TU REPORTE]
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 2,
                        background: `${tierColor}22`,
                        color: tierColor,
                        border: `1px solid ${tierColor}44`,
                      }}
                    >
                      {tierLabel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Reciente'}
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
                        title="Eliminar este reporte"
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
