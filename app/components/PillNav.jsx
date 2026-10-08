'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { routesDatabase } from '../data/routesDatabase';

export default function PillNav({
  activeView,
  onSelectView,
  activeRouteId,
  onSelectRoute,
  onSelectLootCategory,
  onResetToOnboarding,
  globalXp = 0,
}) {
  const [routesMenuOpen, setRoutesMenuOpen] = useState(false);
  const [lootMenuOpen, setLootMenuOpen] = useState(false);

  // Calcular Nivel y Título de Superviviente según XP global
  const playerLevel = Math.floor(globalXp / 100) + 1;
  const rankTitle =
    playerLevel >= 10
      ? 'Veterano Imparable'
      : playerLevel >= 6
      ? 'Nómada Experto'
      : playerLevel >= 3
      ? 'Superviviente Ágil'
      : 'Novato en Knox';

  const navItems = [
    { id: 'route', label: 'Ruta Activa', icon: '🎯' },
    { id: 'loot', label: 'Radar de Loot', icon: '📦' },
    { id: 'onboarding', label: 'Asistente / Modos', icon: '🧭' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto max-w-5xl w-full mx-auto flex items-center justify-between gap-2 p-1.5 rounded-full bg-[#0a0f1ed9] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]">
        {/* LOGO SPIFFO TÁCTICO */}
        <div
          onClick={onResetToOnboarding}
          className="flex items-center gap-2.5 pl-3 pr-2 py-1 cursor-pointer select-none group"
          title="Reiniciar Asistente de Supervivencia"
        >
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#10b981] to-[#06b6d4] p-[1.5px] transition-transform duration-300 group-hover:scale-110">
            <div className="w-full h-full rounded-full bg-[#060913] flex items-center justify-center overflow-hidden">
              <Image
                src="/spiffo/spiffo_character.png"
                alt="Spiffo"
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
              Spiffo<span className="text-[#10b981]">OS</span>
            </span>
            <span className="text-[9px] text-[#94a3b8] font-semibold tracking-widest uppercase">
              B42 COMPANION
            </span>
          </div>
        </div>

        {/* PILL BUTTONS */}
        <div className="flex items-center gap-1 bg-[#06091380] p-1 rounded-full border border-[rgba(255,255,255,0.06)] relative">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setRoutesMenuOpen(false);
                  setLootMenuOpen(false);
                  if (item.id === 'onboarding') {
                    onResetToOnboarding();
                  } else {
                    onSelectView(item.id);
                  }
                }}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 select-none flex items-center gap-1.5 ${
                  isActive ? 'text-black' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="pillNavIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#10b981] to-[#34d399] shadow-[0_0_18px_rgba(16,185,129,0.5)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 text-[13px]">{item.icon}</span>
                <span className="relative z-10 hidden md:inline">{item.label}</span>
              </button>
            );
          })}

          {/* DESPLEGABLE: TODAS LAS RUTAS */}
          <div className="relative">
            <button
              onClick={() => {
                setRoutesMenuOpen(!routesMenuOpen);
                setLootMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-[#cbd5e1] hover:text-white transition-colors flex items-center gap-1 hover:bg-[rgba(255,255,255,0.06)]"
            >
              <span>🧭 Rutas</span>
              <span className="text-[10px] text-[#10b981]">▾</span>
            </button>

            {routesMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#0b1222f2] backdrop-blur-2xl border border-[rgba(255,255,255,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-50 flex flex-col gap-1 max-h-[380px] overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#94a3b8] border-b border-[rgba(255,255,255,0.06)]">
                  Seleccionar Ruta Táctica
                </div>
                {routesDatabase.map((r) => {
                  const isCurrent = r.id === activeRouteId;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        onSelectRoute(r.id);
                        setRoutesMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-[#10b98126] text-[#34d399] border border-[#10b9814d]'
                          : 'text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.07)]'
                      }`}
                    >
                      <span className="truncate">{r.title}</span>
                      <span className="text-[10px] text-[#94a3b8] font-mono ml-2">
                        {r.levels.length} Nvs
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* XP BADGE MILITAR */}
        <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#10b98114] border border-[#10b98140] rounded-full select-none">
          <div className="w-5 h-5 rounded-full bg-[#10b981] text-[#060913] flex items-center justify-center font-black text-[10px] font-mono shadow-[0_0_8px_#10b981]">
            {playerLevel}
          </div>
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[9px] font-bold text-[#10b981] uppercase tracking-wider">
              {rankTitle}
            </span>
            <span className="text-[10px] text-white font-mono font-black leading-tight">
              {globalXp} <span className="text-[#64748b] text-[8px]">XP</span>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
