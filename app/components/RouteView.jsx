'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HoloCard from './HoloCard';
import AnimatedList from './AnimatedList';

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
  const routeProgress = progress?.routes?.[route.id] || { completedObjectives: [] };

  const levelCompletedCount = currentLevel.objectives.filter((obj) =>
    routeProgress.completedObjectives.includes(obj.id)
  ).length;
  const levelPercent = Math.round(
    (levelCompletedCount / currentLevel.objectives.length) * 100
  );

  const toggleEquip = (name) => {
    setEquippedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Mapeo temático de imágenes para la tarjeta 3D
  const spiffoCardImage =
    route.id.includes('vehicle') || route.id.includes('nomad')
      ? '/spiffo/spiffo_vehicle.png'
      : route.id.includes('farm')
      ? '/spiffo/spiffo_farming.png'
      : route.id.includes('combat')
      ? '/spiffo/spiffo_combat.png'
      : route.id.includes('craft') || route.id.includes('carpent')
      ? '/spiffo/spiffo_crafting.png'
      : '/spiffo/spiffo_character.png';

  return (
    <div className="hud-container">
      {/* CABECERA HERO CON TARJETA HOLOCARD 3D */}
      <div className="hud-panel">
        <div className="hud-hero">
          {/* Lado izquierdo: Metadatos y título de la ruta */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}
              >
                {route.difficulty}
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                ⏱️ {route.estimatedTime}
              </span>
              <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>
                • Nivel Activo {currentLevel.levelNumber} de {route.levels.length}
              </span>
            </div>

            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>{route.icon}</span>
              <span>{route.title}</span>
            </h1>

            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: 0, maxWidth: 540 }}>
              {route.description}
            </p>

            {/* Barra de progreso global del nivel */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                Progreso:
              </span>
              <div
                style={{
                  flex: 1,
                  maxWidth: 220,
                  height: 8,
                  borderRadius: 99,
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    width: `${levelPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    boxShadow: '0 0 10px #10b981',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
                {levelPercent}%
              </span>
            </div>
          </div>

          {/* Lado derecho: HOLOCARD 3D */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <HoloCard
              image={spiffoCardImage}
              alt={route.title}
              preset="bursts"
              width={130}
              radius={14}
              intensity={0.95}
              edgeSparkle={0.9}
              tiltMax={16}
            />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
              SPIFFO 3D CARD
            </span>
          </div>
        </div>
      </div>

      {/* SELECTOR DE NIVELES (TABS CON SEPARACIÓN VISUAL) */}
      <div className="level-tabs-bar">
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
              className={`level-tab-btn ${isSelected ? 'active' : isDone ? 'done' : ''}`}
            >
              <span>Nivel {lvl.levelNumber}</span>
              {isDone ? (
                <span style={{ color: isSelected ? '#04120c' : '#34d399', fontWeight: 900 }}>✓</span>
              ) : (
                <span style={{ fontSize: 10, opacity: 0.7 }}>
                  ({completedInThis}/{lvl.objectives.length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENEDOR PRINCIPAL DEL BUCLE GAMIFICADO */}
      <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Cabecera del nivel activo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 14 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
              MISIÓN DE NIVEL {currentLevel.levelNumber}
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '4px 0 0', letterSpacing: '-0.02em' }}>
              {currentLevel.title}
            </h2>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
            {levelCompletedCount} de {currentLevel.objectives.length} Tareas ({levelPercent}%)
          </span>
        </div>

        {/* FASE 1: LOADOUT INMEDIATO (¿QUÉ EQUIPAR PRIMERO?) */}
        {currentLevel.requiredGear && (
          <div className="phase-gear-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🎒</span>
                <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.06em' }}>
                  Fase 1: ¿Qué equipar de inmediato?
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                Toca para marcar equipo
              </span>
            </div>

            <div className="gear-grid">
              {currentLevel.requiredGear.map((item, i) => {
                const isEq = !!equippedItems[item.name];
                return (
                  <div
                    key={i}
                    onClick={() => toggleEquip(item.name)}
                    className={`gear-card ${isEq ? 'equipped' : ''}`}
                  >
                    <div className={`gear-slot ${isEq ? 'equipped' : ''}`}>
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={34}
                        height={34}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: isEq ? '#34d399' : '#f8fafc',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3, marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>
                      {isEq ? '✅' : '➕'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FASE 2: RADAR DE RECOLECCIÓN (¿DÓNDE BUSCAR?) */}
        {currentLevel.lootTarget && (
          <div className="phase-loot-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>📍</span>
              <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '0.06em' }}>
                Fase 2: ¿Dónde recolectar los materiales?
              </span>
            </div>

            <div className="loot-grid-3">
              <div className="loot-stat-box">
                <span style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Edificio Prioritario
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>
                  {currentLevel.lootTarget.building}
                </span>
              </div>
              <div className="loot-stat-box">
                <span style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Prioridad en Contenedores
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#cbd5e1' }}>
                  {currentLevel.lootTarget.priority}
                </span>
              </div>
              <div className="loot-stat-box">
                <span style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Nivel de Riesgo
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8' }}>
                  {currentLevel.lootTarget.risk}
                </span>
              </div>
            </div>

            <div className="loot-tip-box">
              <span>💡</span>
              <span>
                <strong>Consejo Táctico:</strong> {currentLevel.lootTarget.tip}
              </span>
            </div>
          </div>
        )}

        {/* FASE 3: MISIONES DE SUPERVIVENCIA (+XP) */}
        <div className="phase-tasks-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.06em' }}>
                Fase 3: Misiones de Supervivencia (+XP)
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Usa [↑/↓] y [Enter] o clic
            </span>
          </div>

          <AnimatedList
            items={currentLevel.objectives}
            onItemSelect={(obj) => onToggleObjective(route.id, obj.id, obj.xp)}
            renderItem={(obj, idx, isSelected) => {
              const isChecked = routeProgress.completedObjectives.includes(obj.id);
              return (
                <div
                  className={`task-card ${isChecked ? 'checked' : ''} ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                    <span style={{ fontSize: 18, userSelect: 'none' }}>
                      {isChecked ? '✅' : '⬜'}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isChecked ? '#34d399' : '#ffffff',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        lineHeight: 1.4,
                      }}
                    >
                      {obj.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#f59e0b',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      padding: '3px 8px',
                      borderRadius: 8,
                      fontFamily: 'monospace',
                      flexShrink: 0,
                    }}
                  >
                    +{obj.xp} XP
                  </span>
                </div>
              );
            }}
          />
        </div>

        {/* CELEBRACIÓN DE MAESTRÍA AL 100% */}
        {levelPercent === 100 ? (
          <div className="mastery-box">
            <HoloCard
              image="/spiffo/spiffo_character.png"
              alt="Maestría Desbloqueada"
              preset="gold"
              width={90}
              radius={12}
              intensity={1}
              edgeSparkle={1}
            />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#34d399', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
                🏆 ¡Nivel {currentLevel.levelNumber} Completado con Éxito!
              </span>
              <p style={{ fontSize: 12, color: '#d1fae5', margin: 0, lineHeight: 1.4 }}>
                {currentLevel.unlockReward}
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 14,
              background: 'rgba(6, 95, 70, 0.18)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontSize: 12,
              color: '#a7f3d0',
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: '#34d399', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
              🔓 Recompensa al Completar:
            </strong>
            {currentLevel.unlockReward}
          </div>
        )}

        {/* BOTÓN AL RADAR DE LOOT */}
        {currentLevel.recommendedLootCategory && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
            <button
              onClick={() => onOpenLootCategory(currentLevel.recommendedLootCategory)}
              className="btn-secondary"
            >
              <span>🗺️</span>
              <span>Ver Ficha de Saqueo en Radar →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
