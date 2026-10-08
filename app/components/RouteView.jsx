'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function RouteView({
  route,
  progress,
  onToggleObjective,
  onOpenLootCategory,
}) {
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const [equippedItems, setEquippedItems] = useState({});

  if (!route) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
        No se encontró la ruta solicitada.
      </div>
    );
  }

  const currentLevel = route.levels[selectedLevelIdx] || route.levels[0];
  const routeProgress = progress.routes[route.id] || { completedObjectives: [] };

  const levelCompletedCount = currentLevel.objectives.filter((obj) =>
    routeProgress.completedObjectives.includes(obj.id)
  ).length;
  const levelPercent = Math.round((levelCompletedCount / currentLevel.objectives.length) * 100);

  const toggleEquip = (name) => {
    setEquippedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '36px 20px 80px' }}>
      {/* CABECERA 2026 DE LA RUTA */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
            }}
          >
            {route.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                {route.difficulty}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>• {route.estimatedTime}</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              {route.title}
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: '8px 0 0', maxWidth: '640px' }}>
          {route.description}
        </p>
      </div>

      {/* SELECTOR DE NIVELES / TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {route.levels.map((lvl, idx) => {
          const isSelected = selectedLevelIdx === idx;
          const completedInThis = lvl.objectives.filter((o) =>
            routeProgress.completedObjectives.includes(o.id)
          ).length;
          const isDone = completedInThis === lvl.objectives.length;

          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevelIdx(idx)}
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: isSelected ? '#10b981' : 'rgba(15, 23, 42, 0.6)',
                color: isSelected ? '#090d16' : isDone ? '#34d399' : '#cbd5e1',
                border: '1.5px solid',
                borderColor: isSelected ? '#34d399' : isDone ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
              }}
            >
              <span>Nivel {lvl.levelNumber}</span>
              {isDone && <span>✓</span>}
            </button>
          );
        })}
      </div>

      {/* CONTENEDOR PRINCIPAL DEL NIVEL (EL LOOP GAMIFICADO) */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '24px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Cabecera y Barra de Progreso */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              {currentLevel.title}
            </h2>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>
              {levelCompletedCount} de {currentLevel.objectives.length} Tareas ({levelPercent}%)
            </span>
          </div>

          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '99px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              style={{
                width: `${levelPercent}%`,
                height: '100%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.7)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* PASO 1: LOADOUT DE EQUIPO REQUERIDO (SLOTS DE INVENTARIO GAMER) */}
        {currentLevel.requiredGear && (
          <div style={{ backgroundColor: 'rgba(9, 13, 24, 0.7)', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🎒 Paso 1: Equipo Requerido en tu Inventario
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Toca cada slot para equipar</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {currentLevel.requiredGear.map((item, i) => {
                const isEq = !!equippedItems[item.name];
                return (
                  <div
                    key={i}
                    onClick={() => toggleEquip(item.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      backgroundColor: isEq ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      border: '1.5px solid',
                      borderColor: isEq ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div className={`inv-slot ${isEq ? 'equipped' : ''}`}>
                      <Image src={item.img} alt={item.name} width={34} height={34} style={{ objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: isEq ? '#34d399' : '#f8fafc' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.3' }}>{item.desc}</div>
                    </div>
                    <span style={{ fontSize: '14px' }}>{isEq ? '✅' : '➕'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 2: TARGET DE SAQUEO / DÓNDE RECOLECTAR */}
        {currentLevel.lootTarget && (
          <div style={{ backgroundColor: 'rgba(9, 13, 24, 0.7)', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              📍 Paso 2: Dónde Buscar y Recolectar
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '12px' }}>
              <div style={{ color: '#cbd5e1' }}>
                <strong style={{ color: '#f8fafc' }}>Edificio prioritario:</strong> {currentLevel.lootTarget.building}
              </div>
              <div style={{ color: '#cbd5e1' }}>
                <strong style={{ color: '#f8fafc' }}>Prioridad:</strong> {currentLevel.lootTarget.priority}
              </div>
              <div style={{ color: '#cbd5e1' }}>
                <strong style={{ color: '#f8fafc' }}>Riesgo estimado:</strong> <span style={{ color: '#38bdf8' }}>{currentLevel.lootTarget.risk}</span>
              </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#fde68a', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              💡 {currentLevel.lootTarget.tip}
            </div>
          </div>
        )}

        {/* PASO 3: CHECKLIST DE ACCIONES DE CAMPO CON XP */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
            🎯 Paso 3: Acciones en el Juego (Checklist)
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
                    gap: '14px',
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.65)',
                    border: '1.5px solid',
                    borderColor: isChecked ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{isChecked ? '✅' : '⬜'}</span>
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
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    +{obj.xp} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECOMPENSA DE CONOCIMIENTO TÁCTICO */}
        <div style={{ backgroundColor: 'rgba(6, 95, 70, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '16px', padding: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
            🔓 Recompensa de Conocimiento Táctico:
          </span>
          <p style={{ fontSize: '12px', color: '#a7f3d0', margin: 0, lineHeight: '1.4' }}>
            {currentLevel.unlockReward}
          </p>
        </div>

        {/* ACCESO A LOOT RELACIONADO */}
        {currentLevel.recommendedLootCategory && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
            <button
              onClick={() => onOpenLootCategory(currentLevel.recommendedLootCategory)}
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '10px 18px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>🗺️</span> Ver Ficha de Saqueo Recomendada →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
