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
      <div className="py-20 text-center text-slate-400">
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

  // Asignar imagen Spiffo según la temática de la ruta
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
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 flex flex-col gap-6">
      {/* CABECERA 2026 DE LA RUTA CON HOLOCARD 3D */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-[rgba(255,255,255,0.1)]">
        {/* Lado izquierdo: Metadatos y título */}
        <div className="flex-1 z-10 flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#10b981] bg-[#10b9811f] border border-[#10b9814d] px-2.5 py-0.5 rounded-md">
              {route.difficulty}
            </span>
            <span className="text-xs text-[#94a3b8] font-medium">
              ⏱️ {route.estimatedTime}
            </span>
            <span className="text-xs text-[#38bdf8] font-medium">
              • Nivel Activo {currentLevel.levelNumber} de {route.levels.length}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3 mt-1">
            <span>{route.icon}</span>
            <span>{route.title}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-xl m-0">
            {route.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-xs text-[#cbd5e1]">
            <span className="font-semibold text-[#10b981]">
              Progreso de la Ruta:
            </span>
            <div className="w-36 h-2 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden border border-[rgba(255,255,255,0.1)]">
              <div
                className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] transition-all duration-500 shadow-[0_0_10px_#10b981]"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
            <span className="font-mono font-bold text-white">
              {levelPercent}%
            </span>
          </div>
        </div>

        {/* Lado derecho: HOLOCARD 3D HOLOGRÁFICA REACT BITS */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="relative group cursor-pointer">
            <HoloCard
              image={spiffoCardImage}
              alt={route.title}
              preset="bursts"
              width={140}
              radius={16}
              intensity={0.9}
              edgeSparkle={0.85}
              tiltMax={16}
              className="shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            />
          </div>
          <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest font-mono">
            SPIFFO CARD 3D
          </span>
        </div>
      </div>

      {/* SELECTOR DE NIVELES (TABS CON FEEDBACK VISUAL) */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 select-none">
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
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#10b981] text-[#060913] shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-[#34d399]'
                  : isDone
                  ? 'bg-[rgba(16,185,129,0.15)] text-[#34d399] border border-[rgba(16,185,129,0.3)]'
                  : 'bg-[rgba(15,23,42,0.6)] text-[#cbd5e1] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              <span>Nivel {lvl.levelNumber}</span>
              {isDone ? (
                <span className="text-xs">✓</span>
              ) : (
                <span className="text-[10px] opacity-60">
                  ({completedInThis}/{lvl.objectives.length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECUENCIA GAMIFICADA PASO A PASO */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-[rgba(255,255,255,0.1)]">
        {/* Cabecera del nivel */}
        <div className="border-b border-[rgba(255,255,255,0.08)] pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#10b981] uppercase font-mono">
              MISIÓN DE NIVEL {currentLevel.levelNumber}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight">
              {currentLevel.title}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#10b981] font-mono">
              {levelCompletedCount}/{currentLevel.objectives.length} Tareas (
              {levelPercent}%)
            </span>
          </div>
        </div>

        {/* FASE 1: QUÉ EQUIPAR PRIMERO (INVENTARIO TÁCTICO) */}
        {currentLevel.requiredGear && (
          <div className="flex flex-col gap-3 bg-[#080d1b99] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🎒</span>
                <span className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  Fase 1: ¿Qué equipar de inmediato?
                </span>
              </div>
              <span className="text-[10px] text-[#94a3b8]">
                Haz clic en cada ranura para marcar equipo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentLevel.requiredGear.map((item, i) => {
                const isEq = !!equippedItems[item.name];
                return (
                  <div
                    key={i}
                    onClick={() => toggleEquip(item.name)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isEq
                        ? 'bg-[#10b98124] border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-[#0f172a80] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'
                    }`}
                  >
                    <div className={`inv-slot ${isEq ? 'equipped' : ''}`}>
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-xs font-bold truncate ${
                          isEq ? 'text-[#34d399]' : 'text-white'
                        }`}
                      >
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#94a3b8] line-clamp-1">
                        {item.desc}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#10b981]">
                      {isEq ? '✓' : '+'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FASE 2: DÓNDE Y QUÉ RECOLECTAR */}
        {currentLevel.lootTarget && (
          <div className="flex flex-col gap-2.5 bg-[#080d1b99] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2">
              <span className="text-sm">📍</span>
              <span className="text-xs font-black uppercase tracking-wider text-[#f59e0b]">
                Fase 2: ¿Dónde recolectar los materiales?
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#0f172a66] p-2.5 rounded-xl border border-[rgba(255,255,255,0.05)]">
                <span className="text-[10px] text-[#94a3b8] uppercase font-bold block">
                  Edificio Clave
                </span>
                <span className="font-bold text-white">
                  {currentLevel.lootTarget.building}
                </span>
              </div>
              <div className="bg-[#0f172a66] p-2.5 rounded-xl border border-[rgba(255,255,255,0.05)]">
                <span className="text-[10px] text-[#94a3b8] uppercase font-bold block">
                  Prioridad en Contenedores
                </span>
                <span className="font-bold text-[#e2e8f0]">
                  {currentLevel.lootTarget.priority}
                </span>
              </div>
              <div className="bg-[#0f172a66] p-2.5 rounded-xl border border-[rgba(255,255,255,0.05)]">
                <span className="text-[10px] text-[#94a3b8] uppercase font-bold block">
                  Nivel de Riesgo
                </span>
                <span className="font-bold text-[#38bdf8]">
                  {currentLevel.lootTarget.risk}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#fde68a] bg-[#f59e0b17] p-3 rounded-xl border border-[#f59e0b33] flex items-start gap-2">
              <span>💡</span>
              <span>
                <strong>Consejo Táctico:</strong> {currentLevel.lootTarget.tip}
              </span>
            </div>
          </div>
        )}

        {/* FASE 3: ACCIONES DE CAMPO CON ANIMATED LIST REACT BITS */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚡</span>
              <span className="text-xs font-black uppercase tracking-wider text-[#10b981]">
                Fase 3: Misiones de Supervivencia (+XP)
              </span>
            </div>
            <span className="text-[10px] text-[#94a3b8]">
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
                  className={`flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isChecked
                      ? 'bg-[#10b9811f] border-[#10b98180]'
                      : isSelected
                      ? 'bg-[#10b98112] border-[#10b9814d] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-[#0f172a80] border-[rgba(255,255,255,0.08)] hover:border-[rgba(16,185,129,0.3)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg select-none">
                      {isChecked ? '✅' : '⬜'}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        isChecked
                          ? 'line-through text-[#34d399]'
                          : 'text-white'
                      }`}
                    >
                      {obj.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black text-[#f59e0b] bg-[#f59e0b1f] border border-[#f59e0b40] px-2.5 py-1 rounded-lg shrink-0">
                    +{obj.xp} XP
                  </span>
                </div>
              );
            }}
          />
        </div>

        {/* CELEBRACIÓN DE MAESTRÍA (SI NIVEL ESTÁ COMPLETO) */}
        {levelPercent === 100 ? (
          <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-[#10b98126] via-[#06b6d41f] to-[#10b98126] border border-[#10b98180] shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <HoloCard
              image="/spiffo/spiffo_character.png"
              alt="Maestría Desbloqueada"
              preset="gold"
              width={100}
              radius={14}
              intensity={1}
              edgeSparkle={1}
            />
            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs font-black uppercase text-[#34d399] tracking-wider block mb-1">
                🏆 ¡Nivel {currentLevel.levelNumber} Completado con Éxito!
              </span>
              <p className="text-xs text-[#d1fae5] leading-relaxed m-0">
                {currentLevel.unlockReward}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#065f4626] border border-[#10b9814d] text-xs text-[#a7f3d0]">
            <strong className="text-[#34d399] uppercase tracking-wider block mb-1">
              🔓 Recompensa al Completar:
            </strong>
            {currentLevel.unlockReward}
          </div>
        )}

        {/* ACCESO RÁPIDO A LOOT RECOMENDADO */}
        {currentLevel.recommendedLootCategory && (
          <div className="flex justify-end pt-2">
            <button
              onClick={() =>
                onOpenLootCategory(currentLevel.recommendedLootCategory)
              }
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
