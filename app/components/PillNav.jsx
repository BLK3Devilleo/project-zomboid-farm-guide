'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { routesDatabase } from '../data/routesDatabase';
import { ROLE_LABELS } from '../lib/authClient';

export default function PillNav({
  activeView,
  onSelectView,
  activeRouteId,
  onSelectRoute,
  onSelectLootCategory,
  onResetToOnboarding,
  globalXp = 0,
  currentUser = null,
  onOpenLoginModal = () => {},
  onLogout = () => {},
}) {
  const [routesMenuOpen, setRoutesMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Calcular Nivel y Rango del jugador
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
    { id: 'servers', label: 'Servidores', icon: '🌐' },
    { id: 'loot', label: 'Radar de Loot', icon: '📦' },
    { id: 'onboarding', label: 'Asistente', icon: '🧭' },
  ];

  const currentRoleMeta = currentUser
    ? ROLE_LABELS[currentUser.role] || ROLE_LABELS.usuario
    : null;

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
          <span className="pill-logo-text">Spiffo OS</span>
        </div>

        {/* ITEMS PRINCIPALES DE NAVEGACIÓN */}
        <div className="pill-nav-items">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`pill-nav-btn ${isActive ? 'active' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="pill-active-bg"
                    className="pill-nav-active-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="pill-nav-icon">{item.icon}</span>
                <span className="pill-nav-label">{item.label}</span>
              </button>
            );
          })}

          {/* SELECTOR DESPLEGABLE DE RUTAS */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoutesMenuOpen(!routesMenuOpen)}
              className="pill-route-dropdown-btn"
              title="Cambiar Ruta de Supervivencia"
            >
              <span>🗺️ Rutas</span>
              <span style={{ fontSize: 9, opacity: 0.7 }}>{routesMenuOpen ? '▲' : '▼'}</span>
            </button>

            {routesMenuOpen && (
              <div className="pill-dropdown-menu">
                <div style={{ padding: '8px 12px', fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Rutas de Aprendizaje
                </div>
                {routesDatabase.map((r) => {
                  const isCurrent = activeRouteId === r.id;
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

        {/* SECCIÓN DERECHA: USUARIO & XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* BADGE DE USUARIO / INICIAR SESIÓN */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `1px solid ${currentRoleMeta?.glow || 'rgba(255, 255, 255, 0.1)'}`,
                  padding: '4px 10px 4px 6px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  color: '#ffffff',
                }}
              >
                {currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name}
                    style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: currentRoleMeta?.color || '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 900,
                      color: '#000',
                    }}
                  >
                    {currentUser.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: currentRoleMeta?.color || '#10b981',
                      fontFamily: 'monospace',
                      lineHeight: 1,
                    }}
                  >
                    {currentRoleMeta?.badge || 'SUPERVIVIENTE'}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#e2e8f0',
                      maxWidth: 100,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentUser.name}
                  </span>
                </div>
                <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
              </button>

              {userMenuOpen && (
                <div
                  className="pill-dropdown-menu"
                  style={{ right: 0, left: 'auto', minWidth: 200 }}
                >
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', wordBreak: 'break-all' }}>
                      {currentUser.email}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 9,
                        fontWeight: 900,
                        color: currentRoleMeta?.color,
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        display: 'inline-block',
                      }}
                    >
                      ROL: {currentRoleMeta?.label?.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="pill-dropdown-item"
                    style={{ color: '#ef4444', fontWeight: 700 }}
                  >
                    <span>🚪 Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Iniciar sesión con Google para registrar servidores"
            >
              <span>🔑</span>
              <span>Acceder</span>
            </button>
          )}

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
        </div>
      </nav>
    </header>
  );
}
