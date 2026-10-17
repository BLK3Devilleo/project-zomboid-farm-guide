'use client';

import React, { useState } from 'react';
import { gameGuidesDatabase } from '../data/gameGuidesDatabase';
import {
  WrenchIcon,
  CrosshairIcon,
  SignalPulseIcon,
  HazardIcon,
  BackpackIcon,
  CheckIcon,
  VoteIcon,
  ChatIcon,
} from './icons/KnoxIcons';

export default function GameGuideView({
  currentUser = null,
  playerData = null,
  toggleObjective = () => {},
  playSound = () => {},
}) {
  const [guides, setGuides] = useState(gameGuidesDatabase);
  const [selectedGuideId, setSelectedGuideId] = useState(gameGuidesDatabase[0]?.id || 'survival-basics');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [guideCommentVotes, setGuideCommentVotes] = useState({});
  const [newGuideComment, setNewGuideComment] = useState('');

  const selectedGuide = guides.find((g) => g.id === selectedGuideId) || guides[0];

  const categories = [
    { id: 'ALL', label: 'Todos los Manuales' },
    { id: 'Supervivencia Temprana', label: 'Supervivencia' },
    { id: 'Vehículos & Motores', label: 'Vehículos' },
    { id: 'Construcción & Fortificación', label: 'Construcción' },
    { id: 'Recursos & Agua', label: 'Fontanería & Agua' },
    { id: 'Electricidad & Energía', label: 'Generadores' },
  ];

  const filteredGuides = selectedCategory === 'ALL'
    ? guides
    : guides.filter((g) => g.category === selectedCategory);

  const isMissionCompleted = (missionId) => {
    return Boolean(playerData?.completedObjectives?.[missionId]);
  };

  const handleToggleMission = (mission) => {
    toggleObjective(mission.id, mission.xp);
  };

  const handleVoteGuideComment = (commentId) => {
    if (guideCommentVotes[commentId]) return;
    setGuideCommentVotes((prev) => ({ ...prev, [commentId]: true }));
    setGuides((prev) =>
      prev.map((g) => {
        if (g.id === selectedGuideId) {
          return {
            ...g,
            comments: g.comments.map((c) =>
              c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
            ),
          };
        }
        return g;
      })
    );
  };

  const handleAddGuideComment = (e) => {
    e.preventDefault();
    if (!newGuideComment.trim()) return;

    const authorName = currentUser?.name || 'Superviviente_Anónimo';
    const newCommentItem = {
      id: `gc-${Date.now()}`,
      author: {
        name: authorName,
        badge: currentUser?.role === 'admin' ? '[ADMIN]' : '[SUPERVIVIENTE]',
        color: '#10b981',
      },
      content: newGuideComment.trim(),
      createdAt: 'Justo ahora',
      upvotes: 1,
    };

    setGuides((prev) =>
      prev.map((g) => {
        if (g.id === selectedGuideId) {
          return {
            ...g,
            comments: [newCommentItem, ...(g.comments || [])],
          };
        }
        return g;
      })
    );

    setNewGuideComment('');
  };

  return (
    <div style={{ maxWidth: 1140, width: '100%', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. CABECERA DIEGÉTICA DE LA GUÍA DE JUEGO */}
      <div className="pz-mission-panel" style={{ padding: '22px 26px' }}>
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SignalPulseIcon size={14} color="#10b981" />
            <span>MANUAL TÁCTICO OFICIAL // PROTOCOLOS DE CAMPO BUILD 42</span>
          </div>
          <span>MISIONES & PROGRESIÓN XP</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 10 }}>
              <WrenchIcon size={24} color="#10b981" />
              <span>Guía de Juego: Manuales & Misiones Tácticas</span>
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
              Manuales oficiales con requisitos de inventario, instrucciones paso a paso, misiones interactivas con XP y espacio de debate oficial para cada mecánica de Project Zomboid.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16, 185, 129, 0.1)', padding: '8px 14px', borderRadius: 6, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <CrosshairIcon size={16} color="#34d399" />
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#34d399', fontWeight: 800 }}>
              NIVEL {playerData?.level || 1} // {playerData?.totalXp || 0} XP ACUMULADA
            </span>
          </div>
        </div>

        {/* Filtros de Categoría de Manuales */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.06)', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat.id ? '#34d399' : '#94a3b8',
                border: `1px solid ${selectedCategory === cat.id ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LAYOUT EN 2 COLUMNAS: DIRECTORIO DE MANUALES + FICHA OPERATIVA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: 20 }}>
        {/* Panel Lateral: Selector de Manuales */}
        <div className="pz-mission-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, height: 'fit-content' }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            DIRECTORIO DE MANUALES ({filteredGuides.length})
          </span>

          {filteredGuides.map((guide) => {
            const isSelected = selectedGuideId === guide.id;
            const completedCount = guide.missions?.filter((m) => isMissionCompleted(m.id)).length || 0;
            const totalCount = guide.missions?.length || 0;

            return (
              <button
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className={`pz-mode-card ${isSelected ? 'selected' : ''}`}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderLeft: isSelected ? '3px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#10b981', fontWeight: 800 }}>
                    {guide.tag}
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                    {guide.difficulty}
                  </span>
                </div>

                <strong style={{ fontSize: 13, color: isSelected ? '#ffffff' : '#cbd5e1', lineHeight: 1.3, display: 'block', margin: '2px 0' }}>
                  {guide.title}
                </strong>

                {/* Progreso de Misiones del Manual */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    {guide.category}
                  </span>
                  {totalCount > 0 && (
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: completedCount === totalCount ? '#34d399' : '#eab308' }}>
                      {completedCount}/{totalCount} Misiones
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Panel Central: Ficha Operativa del Manual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Ficha Técnica y Pasos */}
          <div className="pz-mission-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="pz-mission-bar">
              <span>MANUAL DE OPERACIONES // {selectedGuide.id.toUpperCase()}</span>
              <span style={{ color: '#10b981' }}>ESTIMACIÓN: {selectedGuide.estimatedTime}</span>
            </div>

            <div>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                {selectedGuide.category} • {selectedGuide.tag}
              </span>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', margin: '4px 0 8px', letterSpacing: '-0.01em' }}>
                {selectedGuide.title}
              </h2>
              <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.55, margin: 0, maxWidth: '65ch' }}>
                {selectedGuide.summary}
              </p>
            </div>

            {/* Requisitos de Inventario en Chips Visuales */}
            <div>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
                REQUISITOS PREVIOS DE INVENTARIO Y HABILIDAD
              </span>
              <div className="pz-gear-chips-grid">
                {selectedGuide.requirements?.map((req, idx) => (
                  <div key={idx} className="pz-gear-chip">
                    <BackpackIcon size={13} color="#38bdf8" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pasos Secuenciales */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#10b981', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                SECUENCIA TÁCTICA PASO A PASO
              </span>
              {selectedGuide.steps?.map((st) => (
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
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
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

            {/* Advertencias Críticas */}
            {selectedGuide.warnings && selectedGuide.warnings.length > 0 && (
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

          {/* MÓDULO DE MISIONES TÁCTICAS DEL MANUAL (CON XP) */}
          <div className="pz-mission-panel" style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="pz-mission-bar">
              <span>MISIONES TÁCTICAS VINCULADAS</span>
              <span style={{ color: '#38bdf8' }}>GANANCIA DIRECTA DE XP</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
                Completa los hitos de este manual para registrar tu progreso:
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedGuide.missions?.map((mission) => {
                const done = isMissionCompleted(mission.id);
                return (
                  <div
                    key={mission.id}
                    onClick={() => handleToggleMission(mission)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: done ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${done ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          border: `1.5px solid ${done ? '#10b981' : '#64748b'}`,
                          background: done ? '#10b981' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {done && <CheckIcon size={13} color="#04120c" strokeWidth={2.5} />}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: done ? '#f8fafc' : '#cbd5e1',
                          textDecoration: done ? 'line-through' : 'none',
                        }}
                      >
                        {mission.label}
                      </span>
                    </div>

                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: done ? '#34d399' : '#eab308', fontWeight: 800 }}>
                      +{mission.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DEBATE OFICIAL / DUDAS DE LA COMUNIDAD PARA ESTE MANUAL */}
          <div className="pz-mission-panel" style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="pz-mission-bar">
              <span>DEBATE OFICIAL DEL MANUAL</span>
              <span style={{ color: '#94a3b8' }}>PREGUNTAS Y APORTES DE LA COMUNIDAD</span>
            </div>

            {/* Formulario de Pregunta / Aporte para este manual */}
            <form onSubmit={handleAddGuideComment} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                required
                rows={2}
                value={newGuideComment}
                onChange={(e) => setNewGuideComment(e.target.value)}
                placeholder="¿Tienes alguna duda o truco adicional sobre este manual? Deja tu aporte..."
                className="pz-scanner-input"
                style={{ fontSize: 13, resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="pz-btn-primary"
                  style={{ minHeight: 34, padding: '6px 14px', fontSize: 12 }}
                >
                  <span>Publicar en este Manual</span>
                </button>
              </div>
            </form>

            {/* Lista de Comentarios del Manual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {selectedGuide.comments?.length === 0 ? (
                <span style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', padding: '6px 0' }}>
                  Aún no hay aportes en este manual. Sé el primero en dejar un truco.
                </span>
              ) : (
                selectedGuide.comments?.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 6,
                      padding: '10px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 12, color: '#f8fafc' }}>{c.author.name}</strong>
                        {c.author.badge && (
                          <span className="pz-comment-author-badge">{c.author.badge}</span>
                        )}
                        <span style={{ fontSize: 11, color: '#64748b' }}>· {c.createdAt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleVoteGuideComment(c.id)}
                        className={`server-vote-btn ${guideCommentVotes[c.id] ? 'voted' : ''}`}
                        style={{ padding: '2px 8px', fontSize: 11 }}
                      >
                        <VoteIcon size={11} color={guideCommentVotes[c.id] ? '#eab308' : '#94a3b8'} />
                        <span>{c.upvotes}</span>
                      </button>
                    </div>
                    <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
