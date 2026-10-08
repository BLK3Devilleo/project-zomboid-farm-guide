'use client';

import { useState } from 'react';

export default function RouteView({
  route,
  progress,
  onToggleObjective,
  onOpenLootCategory,
}) {
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);

  if (!route) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
        No se encontró la ruta solicitada.
      </div>
    );
  }

  // Si la ruta aún no tiene niveles desarrollados
  if (route.status === 'coming_soon' || !route.levels || route.levels.length === 0) {
    return (
      <div style={{ maxWidth: '780px', margin: '40px auto', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid #334155', borderRadius: '18px', padding: '40px 20px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>{route.icon}</span>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>{route.title}</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '480px', margin: '0 auto 20px', lineHeight: '1.5' }}>
            {route.description}
          </p>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 14px', borderRadius: '8px' }}>
            🚧 Módulo en preparación para la Build 42
          </span>
        </div>
      </div>
    );
  }

  const currentLevel = route.levels[selectedLevelIdx] || route.levels[0];
  const routeProgress = progress.routes[route.id] || { completedObjectives: [] };

  // Cálculo de progreso del nivel
  const levelCompletedCount = currentLevel.objectives.filter((obj) =>
    routeProgress.completedObjectives.includes(obj.id)
  ).length;
  const levelPercent = Math.round((levelCompletedCount / currentLevel.objectives.length) * 100);

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* CABECERA DE LA RUTA */}
      <div
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(51, 65, 85, 0.8)',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '40px' }}>{route.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                  Dificultad: {route.difficulty}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>•</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{route.estimatedTime}</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                {route.title}
              </h1>
            </div>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: '14px 0 0' }}>
          {route.description}
        </p>
      </div>

      {/* TABS DE NIVELES (Nivel 1, 2, 3...) - Acceso libre para consultar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
        {route.levels.map((lvl, idx) => {
          const isSelected = selectedLevelIdx === idx;
          const completedInThis = lvl.objectives.filter((o) =>
            routeProgress.completedObjectives.includes(o.id)
          ).length;
          const isFullDone = completedInThis === lvl.objectives.length;

          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevelIdx(idx)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: isSelected ? '#10b981' : 'rgba(30, 41, 59, 0.6)',
                color: isSelected ? '#0f172a' : isFullDone ? '#34d399' : '#cbd5e1',
                border: '2px solid',
                borderColor: isSelected ? '#34d399' : isFullDone ? 'rgba(16, 185, 129, 0.4)' : '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>Nivel {lvl.levelNumber}</span>
              {isFullDone && <span>✓</span>}
            </button>
          );
        })}
      </div>

      {/* PANEL PRINCIPAL DEL NIVEL SELECCIONADO */}
      <div
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '18px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Cabecera del nivel y barra de progreso */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {currentLevel.title}
            </h2>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>
              {levelCompletedCount} de {currentLevel.objectives.length} Objetivos ({levelPercent}%)
            </span>
          </div>

          {/* Barra de progreso */}
          <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '99px', overflow: 'hidden', border: '1px solid #334155' }}>
            <div
              style={{
                width: `${levelPercent}%`,
                height: '100%',
                backgroundColor: '#10b981',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Requisito previo */}
        <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', border: '1px solid #334155', padding: '12px 14px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
            📋 Requisito Previo:
          </span>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
            {currentLevel.requirement}
          </p>
        </div>

        {/* CHECKLIST DE OBJETIVOS CON XP */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            Acciones Tácticas del Nivel:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentLevel.objectives.map((obj) => {
              const isChecked = routeProgress.completedObjectives.includes(obj.id);

              return (
                <div
                  key={obj.id}
                  onClick={() => onToggleObjective(route.id, obj.id, obj.xp)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                    border: '2px solid',
                    borderColor: isChecked ? '#10b981' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{isChecked ? '✅' : '⬜'}</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isChecked ? '#34d399' : '#f8fafc',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      flex: 1,
                      lineHeight: '1.4',
                    }}
                  >
                    {obj.label}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', backgroundColor: '#0f172a', padding: '3px 7px', borderRadius: '4px', border: '1px solid #334155' }}>
                    +{obj.xp} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recompensa de conocimiento */}
        <div style={{ backgroundColor: 'rgba(6, 95, 70, 0.25)', border: '1px solid #10b981', borderRadius: '12px', padding: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
            🔓 Recompensa de Conocimiento:
          </span>
          <p style={{ fontSize: '12px', color: '#a7f3d0', margin: 0, lineHeight: '1.4' }}>
            {currentLevel.unlockReward}
          </p>
        </div>

        {/* Nota de Build 42 */}
        {currentLevel.build42Note && (
          <div style={{ backgroundColor: 'rgba(120, 53, 15, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '12px', padding: '12px 14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              ⚠️ Nota Técnica de la Build 42:
            </span>
            <p style={{ fontSize: '12px', color: '#fde68a', margin: 0, lineHeight: '1.4' }}>
              {currentLevel.build42Note}
            </p>
          </div>
        )}

        {/* Acceso a Loot Relacionado */}
        {currentLevel.recommendedLootCategory && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button
              onClick={() => onOpenLootCategory(currentLevel.recommendedLootCategory)}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🗺️</span> Ver Botín Recomendado para este nivel →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
