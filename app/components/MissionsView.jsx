'use client';

import React from 'react';
import { routesDatabase } from '../data/routesDatabase';
import { CrosshairIcon, CheckIcon, RankChevronIcon } from './icons/KnoxIcons';

export default function MissionsView({
  playerData = {},
  onToggleObjective = () => {},
}) {
  const globalXp = playerData.globalXp || 0;
  const currentLevel = Math.floor(globalXp / 100) + 1;

  return (
    <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Cabecera del Panel Militar de Misiones */}
      <div className="pz-mission-panel" style={{ padding: '24px 28px' }}>
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CrosshairIcon size={14} color="#10b981" />
            <span>REGISTRO DE OPERACIONES TÁCTICAS // MISIONES ACTIVAS</span>
          </div>
          <span style={{ color: '#38bdf8' }}>XP TOTAL: {globalXp}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
              Misiones & Directivas de Campo
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Marca tus objetivos cumplidos en Kentucky para acumular XP y desbloquear rangos de veterano en tu perfil.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <RankChevronIcon size={16} color="#10b981" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>
              Nivel {currentLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Listado de todas las misiones agrupadas por ruta táctica */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {routesDatabase.map((r) => {
          const currentRouteProg = playerData.routes?.[r.id] || { completedObjectives: [] };
          return (
            <div key={r.id} className="pz-mission-panel" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: 16, color: '#38bdf8', fontFamily: 'monospace' }}>
                  {r.title}
                </strong>
                <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                  {r.difficulty} • {r.levels.length} Fases
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {r.levels.flatMap((lvl) => lvl.objectives).map((obj) => {
                  const isDone = currentRouteProg.completedObjectives?.includes(obj.id);
                  return (
                    <div
                      key={obj.id}
                      onClick={() => onToggleObjective(r.id, obj.id, obj.xp)}
                      className={`task-card ${isDone ? 'checked' : ''}`}
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 18, height: 18, borderRadius: 3, border: isDone ? '1px solid #10b981' : '1px solid #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#10b981' : 'transparent' }}>
                          {isDone && <CheckIcon size={12} color="#04120c" />}
                        </span>
                        <span style={{ fontSize: 13, color: isDone ? '#34d399' : '#f8fafc', textDecoration: isDone ? 'line-through' : 'none' }}>
                          {obj.label}
                        </span>
                      </div>
                      <span className="task-xp-badge">
                        +{obj.xp} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
