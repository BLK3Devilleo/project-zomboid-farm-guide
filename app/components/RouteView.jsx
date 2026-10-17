'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HoloCard from './HoloCard';
import AnimatedList from './AnimatedList';
import {
  HazardIcon,
  MedicalCrossIcon,
  CrosshairIcon,
  WrenchIcon,
  BackpackIcon,
  RadarServerIcon,
  CloudCheckIcon,
  RankChevronIcon,
} from './icons/KnoxIcons';

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
    route.id.includes('hotwire')
      ? '/spiffo/ferret_mascot.jpg'
      : route.id.includes('vehicle') || route.id.includes('nomad')
      ? '/spiffo/spiffo_vehicle.png'
      : route.id.includes('farm')
      ? '/spiffo/spiffo_farming.png'
      : route.id.includes('combat')
      ? '/spiffo/spiffo_combat.png'
      : route.id.includes('craft') || route.id.includes('carpent')
      ? '/spiffo/spiffo_crafting.png'
      : '/spiffo/ferret_mascot.jpg';

  return (
    <div className="hud-container">
      {/* CABECERA HERO CON TARJETA HOLOCARD 3D */}
      <div className="hud-panel corner-reticle">
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
                • Fase Activa {currentLevel.levelNumber} de {route.levels.length}
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
                Progreso Fase:
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
              KNOX 3D BADGE
            </span>
          </div>
        </div>

        {/* BARRA DE TELEMETRÍA TÁCTICA KNOX (STITCH HUD) */}
        <div className="knox-telemetry-grid">
          <div className="knox-telemetry-cell">
            <span className="knox-telemetry-label">Tiempo Vivo</span>
            <span className="knox-telemetry-value">T+18 Días</span>
            <span className="knox-telemetry-sub" style={{ color: '#10b981' }}>SECTOR KNOX B42</span>
          </div>
          <div className="knox-telemetry-cell">
            <span className="knox-telemetry-label">Hostiles</span>
            <span className="knox-telemetry-value">148 Bajas</span>
            <span className="knox-telemetry-sub" style={{ color: '#ef4444' }}>PERÍMETRO EN ALERTA</span>
          </div>
          <div className="knox-telemetry-cell">
            <span className="knox-telemetry-label">Infección</span>
            <span className="knox-telemetry-value" style={{ color: '#10b981' }}>0.00%</span>
            <span className="knox-telemetry-sub" style={{ color: '#10b981' }}>INMUNIDAD ASIGNADA</span>
          </div>
          <div className="knox-telemetry-cell">
            <span className="knox-telemetry-label">Cordura</span>
            <span className="knox-telemetry-value" style={{ color: '#f59e0b' }}>92% Estable</span>
            <span className="knox-telemetry-sub" style={{ color: '#38bdf8' }}>RADIO 91.5 MHz</span>
          </div>
          <div className="knox-telemetry-cell">
            <span className="knox-telemetry-label">Mecánica</span>
            <span className="knox-telemetry-value" style={{ color: '#38bdf8' }}>Fase {currentLevel.levelNumber}</span>
            <span className="knox-telemetry-sub" style={{ color: '#a78bfa' }}>{currentLevel.title.split(':')[0]}</span>
          </div>
        </div>
      </div>

      {/* MAPA DE NODOS DE FASE (ESTILO TÁCTICO VECTORIAL STITCH) */}
      <div className="hud-panel" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#10b981' }}>◆</span>
            <span style={{ fontSize: 11, fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.08em' }}>
              SECTOR OPS // SECUENCIA DE APRENDIZAJE TÁCTICO
            </span>
          </div>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            PASO {selectedLevelIdx + 1} DE {route.levels.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
          {route.levels.map((lvl, idx) => {
            const isSelected = selectedLevelIdx === idx;
            const completedInThis = lvl.objectives.filter((o) =>
              routeProgress.completedObjectives.includes(o.id)
            ).length;
            const isDone = completedInThis === lvl.objectives.length;

            return (
              <React.Fragment key={lvl.id}>
                {idx > 0 && (
                  <div
                    style={{
                      height: 2,
                      width: 24,
                      minWidth: 24,
                      background: isDone || isSelected ? 'linear-gradient(90deg, #10b981, #38bdf8)' : 'rgba(255, 255, 255, 0.12)',
                    }}
                  />
                )}
                <button
                  onClick={() => setSelectedLevelIdx(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: isSelected
                      ? 'rgba(16, 185, 129, 0.22)'
                      : isDone
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(15, 23, 42, 0.6)',
                    border: isSelected
                      ? '1.5px solid #10b981'
                      : isDone
                      ? '1px solid rgba(16, 185, 129, 0.45)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 0 14px rgba(16, 185, 129, 0.35)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: isDone ? '#10b981' : isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                      color: isDone || isSelected ? '#04120c' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 900,
                      fontFamily: 'monospace',
                    }}
                  >
                    {isDone ? <CloudCheckIcon size={12} color="#04120c" /> : lvl.levelNumber}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                      {lvl.title.split(':')[0]}
                    </span>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: isDone ? '#34d399' : isSelected ? '#38bdf8' : '#94a3b8' }}>
                      {isDone ? '[COMPLETADA]' : isSelected ? '[EN CURSO]' : `(${completedInThis}/${lvl.objectives.length})`}
                    </span>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
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
                <BackpackIcon size={16} color="#38bdf8" />
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
                    <span style={{ fontSize: 14, fontWeight: 900, color: '#10b981', display: 'inline-flex', alignItems: 'center' }}>
                      {isEq ? <CloudCheckIcon size={16} color="#10b981" /> : '+'}
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
              <RadarServerIcon size={16} color="#f59e0b" />
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

            <div className="loot-tip-box" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <HazardIcon size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
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
              <CrosshairIcon size={16} color="#10b981" />
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
                    <span style={{ userSelect: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      {isChecked ? (
                        <CloudCheckIcon size={16} color="#10b981" />
                      ) : (
                        <span style={{ width: 14, height: 14, border: '1.5px solid #64748b', display: 'inline-block', borderRadius: 2 }} />
                      )}
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

        {/* DIRECTIVA TÁCTICA BUILD 42 */}
        {currentLevel.build42Note && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 6,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <HazardIcon size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '0.06em', display: 'block', marginBottom: 2 }}>
                DIRECTIVA TÁCTICA BUILD 42
              </strong>
              <p style={{ fontSize: 12, color: '#fde68a', margin: 0, lineHeight: 1.4 }}>
                {currentLevel.build42Note}
              </p>
            </div>
          </div>
        )}

        {/* CELEBRACIÓN DE MAESTRÍA AL 100% */}
        {levelPercent === 100 ? (
          <div className="mastery-box">
            <HoloCard
              image="/spiffo/ferret_mascot.jpg"
              alt="Maestría Desbloqueada"
              preset="gold"
              width={90}
              radius={12}
              intensity={1}
              edgeSparkle={1}
            />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#34d399', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <RankChevronIcon size={14} color="#34d399" />
                <span>¡Fase {currentLevel.levelNumber} Completada con Éxito!</span>
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
              Recompensa al Completar:
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <RadarServerIcon size={14} color="currentColor" />
              <span>Ver Ficha de Saqueo en Radar →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
