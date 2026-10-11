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
  onResetToOnboarding,
  globalXp = 0,
  currentUser = null,
  onOpenLoginModal = () => {},
  onOpenProfileModal = () => {},
  onLogout = () => {},
}) {
  const [routesMenuOpen, setRoutesMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Calcular Nivel y Rango del jugador
  const playerLevel = Math.floor(globalXp / 100) + 1;
  const rankTitle =
    playerLevel >= 10
      ? 'Veterano'
      : playerLevel >= 6
      ? 'Nómada'
      : playerLevel >= 3
      ? 'Superviviente'
      : 'Novato';

  const navItems = [
    { id: 'route', label: 'Ruta Activa', icon: '🎯' },
    { id: 'servers', label: 'Servidores', icon: '🌐' },
    { id: 'loot', label: 'Radar de Loot', icon: '📦' },
    { id: 'radio', label: 'Radio 91.5', icon: '📻' },
    { id: 'onboarding', label: 'Asistente', icon: '🧭' },
  ];

  const currentRoleMeta = currentUser
    ? ROLE_LABELS[currentUser.role] || ROLE_LABELS.usuario
    : null;

  return (
    <header className="pill-nav-header">
      <nav className="pill-nav-bar">
        {/* LADO IZQUIERDO: LOGO SPIFFO */}
        <div
          onClick={onResetToOnboarding}
          className="pill-logo-btn"
          title="Reiniciar Asistente de Supervivencia"
        >
          <div className="pill-logo-avatar">
            <Image
              src="/spiffo/spiffo_character.png"
              alt="Spiffo"
              width={24}
              height={24}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="pill-logo-text-group">
            <span className="pill-logo-brand">SpiffoOS</span>
            <span className="pill-logo-badge">B42 HUD</span>
          </div>
        </div>

        {/* CENTRO: BARRA SEGMENTADA DE NAVEGACIÓN (UNA SOLA FILA) */}
        <div className="pill-nav-center-strip">
          <div className="pill-nav-tabs">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`pill-tab-item ${isActive ? 'active' : ''}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="pill-active-bg"
                      className="pill-tab-active-glow"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="pill-tab-icon">{item.icon}</span>
                  <span className="pill-tab-label">{item.label}</span>
                </button>
              );
            })}

            {/* SELECTOR DESPLEGABLE DE RUTAS */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setRoutesMenuOpen(!routesMenuOpen)}
                className={`pill-tab-item pill-routes-trigger ${routesMenuOpen ? 'open' : ''}`}
                title="Cambiar Ruta de Supervivencia"
              >
                <span>🗺️</span>
                <span className="pill-tab-label">Rutas</span>
                <span style={{ fontSize: 9, opacity: 0.7 }}>{routesMenuOpen ? '▲' : '▼'}</span>
              </button>

              {routesMenuOpen && (
                <div className="pill-dropdown-menu">
                  <div style={{ padding: '8px 12px', fontSize: 10, fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                    Rutas de Aprendizaje B42
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
        </div>

        {/* LADO DERECHO: ACCESO / USUARIO & XP */}
        <div className="pill-nav-right-strip">
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="pill-user-btn"
                style={{
                  borderColor: currentRoleMeta?.glow || 'rgba(255, 255, 255, 0.15)',
                }}
              >
                {currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name}
                    className="pill-user-avatar"
                  />
                ) : (
                  <div
                    className="pill-user-avatar fallback"
                    style={{ background: currentRoleMeta?.color || '#10b981' }}
                  >
                    {currentUser.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="pill-user-meta">
                  <span
                    className="pill-user-badge"
                    style={{ color: currentRoleMeta?.color || '#10b981' }}
                  >
                    {currentRoleMeta?.badge || 'SUPERVIVIENTE'}
                  </span>
                  <span className="pill-user-name">
                    {currentUser.name}
                  </span>
                </div>
                <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
              </button>

              {userMenuOpen && (
                <div className="pill-dropdown-menu right">
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', wordBreak: 'break-all', fontFamily: 'monospace' }}>
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
                        borderRadius: 3,
                        fontFamily: 'monospace',
                        display: 'inline-block',
                      }}
                    >
                      ROL: {currentRoleMeta?.label?.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="pill-dropdown-item"
                    style={{ color: '#10b981', fontWeight: 800 }}
                  >
                    <span>🪪 Ficha de Superviviente</span>
                  </button>
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
              className="pill-login-btn"
              title="Iniciar sesión para guardar progreso"
            >
              <span>🔑</span>
              <span>Acceder</span>
            </button>
          )}

          {/* BADGE DE XP */}
          <div className="pill-xp-chip" title={`Nivel ${playerLevel}: ${rankTitle} (${globalXp} XP acumulados)`}>
            <span className="pill-xp-level">{playerLevel}</span>
            <div className="pill-xp-details">
              <span className="pill-xp-rank">{rankTitle}</span>
              <span className="pill-xp-points">{globalXp} XP</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
