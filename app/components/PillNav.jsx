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

  // Calcular Nivel y Rango
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
    { id: 'onboarding', label: 'Asistente', icon: '🧭' },
  ];

  return (
    <header className="pill-nav-header">
      <nav className="pill-nav-bar">
        {/* LOGO SPIFFO */}
        <div
          onClick={onResetToOnboarding}
          className="pill-logo-btn"
          title="Reiniciar Asistente de Supervivencia"
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#060913',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Image
                src="/spiffo/spiffo_character.png"
                alt="Spiffo"
                width={26}
                height={26}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em', fontFamily: 'monospace' }}>
              Spiffo<span style={{ color: '#10b981' }}>OS</span>
            </span>
            <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              B42 HUD
            </span>
          </div>
        </div>

        {/* GRUPO DE PESTAÑAS FLOTANTES */}
        <div className="pill-items-group">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setRoutesMenuOpen(false);
                  if (item.id === 'onboarding') {
                    onResetToOnboarding();
                  } else {
                    onSelectView(item.id);
                  }
                }}
                className={`pill-tab-btn ${isActive ? 'active' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="pillNavIndicator"
                    className="pill-tab-active-indicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="pill-tab-content">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}

          {/* MENÚ DESPLEGABLE DE RUTAS */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoutesMenuOpen(!routesMenuOpen)}
              className="pill-routes-btn"
            >
              <span>🧭 Rutas</span>
              <span style={{ color: '#10b981', fontSize: 10 }}>▾</span>
            </button>

            {routesMenuOpen && (
              <div className="pill-routes-dropdown">
                <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
                      className={`pill-dropdown-item ${isCurrent ? 'active' : ''}`}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.title}
                      </span>
                      <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', marginLeft: 8 }}>
                        {r.levels.length} Nvs
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BADGE DE XP Y RANGO */}
        <div className="pill-xp-badge">
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#10b981',
              color: '#04120c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 11,
              fontFamily: 'monospace',
              boxShadow: '0 0 10px #10b981',
            }}
          >
            {playerLevel}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {rankTitle}
            </span>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#ffffff', fontFamily: 'monospace', lineHeight: 1 }}>
              {globalXp} <span style={{ color: '#64748b', fontSize: 8 }}>XP</span>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
