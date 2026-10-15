'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
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
  onOpenLogsModal = () => {},
  onLogout = () => {},
}) {
  const [routesMenuOpen, setRoutesMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileRoutesAccordion, setMobileRoutesAccordion] = useState(false);

  // Bloquear scroll de fondo cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
    { id: 'route', label: 'Mecánica Activa', icon: '⚡' },
    { id: 'events', label: 'Meta-Eventos', icon: '📡' },
    { id: 'servers', label: 'Servidores', icon: '🌐' },
    { id: 'loot', label: 'Radar de Loot', icon: '📦' },
    { id: 'radio', label: 'Radio 91.5', icon: '📻' },
    { id: 'onboarding', label: 'Asistente', icon: '🧭' },
  ];

  const currentRoleMeta = currentUser
    ? ROLE_LABELS[currentUser.role] || ROLE_LABELS.usuario
    : null;

  const isAdmin = Boolean(
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin')
  );

  const currentActiveRoute = routesDatabase.find((r) => r.id === activeRouteId) || routesDatabase[0];

  return (
    <>
      <header className="pill-nav-header">
        <nav className="pill-nav-bar">
          {/* LADO IZQUIERDO: LOGO SPIFFO / KNOX-OS */}
          <div
            onClick={onResetToOnboarding}
            className="pill-logo-btn"
            title="Reiniciar Asistente de Supervivencia"
          >
            <div className="pill-logo-avatar" style={{ overflow: 'hidden', borderRadius: '50%' }}>
              <Image
                src="/spiffo/ferret_mascot.jpg"
                alt="Hurón Superviviente"
                width={26}
                height={26}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="pill-logo-text-group">
              <span className="pill-logo-brand">KnoxOS</span>
              <span className="pill-logo-badge">B42 HUD</span>
            </div>
          </div>

          {/* CENTRO: BARRA SEGMENTADA DE NAVEGACIÓN (VISIBLE EN DESKTOP) */}
          <div className="pill-nav-center-strip desktop-only">
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

              {/* SELECTOR DESPLEGABLE DE MECÁNICAS (DESKTOP) */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setRoutesMenuOpen(!routesMenuOpen)}
                  className={`pill-tab-item pill-routes-trigger ${routesMenuOpen ? 'open' : ''}`}
                  title="Cambiar Mecánica de Supervivencia"
                >
                  <span>⚙️</span>
                  <span className="pill-tab-label">Mecánicas</span>
                  <span style={{ fontSize: 9, opacity: 0.7 }}>{routesMenuOpen ? '▲' : '▼'}</span>
                </button>

                {routesMenuOpen && (
                  <div className="pill-dropdown-menu">
                    <div style={{ padding: '8px 12px', fontSize: 10, fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                      Mecánicas de Supervivencia B42
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

          {/* LADO DERECHO: ACCESO / USUARIO & XP & BOTÓN HAMBURGUESA MÓVIL */}
          <div className="pill-nav-right-strip">
            {/* BOTÓN TERMINAL LOGS SSE (SOLO VISIBLE PARA ADMIN O SUPER_ADMIN) */}
            {isAdmin && (
              <button
                onClick={onOpenLogsModal}
                className="pill-tab-item desktop-only"
                style={{
                  padding: '5px 9px',
                  gap: 4,
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
                title="Abrir Terminal de Telemetría y Logs SSE en Vivo (Administrador)"
              >
                <span style={{ fontSize: 11 }}>🛰️</span>
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 900, color: '#34d399' }}>LOGS</span>
              </button>
            )}

            {/* USUARIO LOGUEADO O ACCESO */}
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
                  <div className="pill-user-meta desktop-only">
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
                  <span style={{ fontSize: 9, opacity: 0.6 }} className="desktop-only">▼</span>
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
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenLogsModal();
                        }}
                        className="pill-dropdown-item"
                        style={{ color: '#38bdf8', fontWeight: 800 }}
                      >
                        <span>🛰️ Terminal SSE Logs</span>
                      </button>
                    )}
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
                className="pill-login-btn desktop-only"
                title="Iniciar sesión para guardar progreso"
              >
                <span>🔑</span>
                <span>Acceder</span>
              </button>
            )}

            {/* BADGE DE XP */}
            <div className="pill-xp-chip" title={`Nivel ${playerLevel}: ${rankTitle} (${globalXp} XP acumulados)`}>
              <span className="pill-xp-level">{playerLevel}</span>
              <div className="pill-xp-details desktop-only">
                <span className="pill-xp-rank">{rankTitle}</span>
                <span className="pill-xp-points">{globalXp} XP</span>
              </div>
            </div>

            {/* BOTÓN HAMBURGUESA TÁCTICO (SOLO MÓVIL) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="pill-hamburger-btn mobile-only"
              aria-label="Abrir Menú de Navegación Táctica"
              title="Menú de Navegación"
            >
              <span className="pill-hamburger-bar"></span>
              <span className="pill-hamburger-bar"></span>
              <span className="pill-hamburger-bar"></span>
            </button>
          </div>
        </nav>
      </header>

      {/* DRAWER / MODAL HAMBURGUESA EN MÓVIL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="pill-mobile-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="pill-mobile-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Encabezado del Menú Móvil */}
              <div className="pill-mobile-drawer-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1px solid #10b981' }}>
                    <Image
                      src="/spiffo/ferret_mascot.jpg"
                      alt="Knox-OS"
                      width={32}
                      height={32}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 14, fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                      Knox-OS B42
                    </span>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#10b981', letterSpacing: '0.08em' }}>
                      TACTICAL HUD MENU
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="pill-mobile-close-btn"
                  aria-label="Cerrar Menú"
                >
                  ✕
                </button>
              </div>

              {/* Tarjeta de Nivel y Superviviente en Móvil */}
              <div className="pill-mobile-user-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                    <span style={{ fontSize: 11, fontWeight: 900, fontFamily: 'monospace', color: '#34d399' }}>
                      NIVEL {playerLevel} // {rankTitle.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#ffffff', fontWeight: 800 }}>
                    {globalXp} XP
                  </span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(globalXp % 100)}%`,
                      background: 'linear-gradient(90deg, #10b981, #34d399)',
                      boxShadow: '0 0 8px #10b981',
                    }}
                  ></div>
                </div>
              </div>

              {/* Lista Principal de Vistas */}
              <div className="pill-mobile-nav-list">
                <span className="pill-mobile-nav-section-title">SECCIONES PRINCIPALES</span>

                {navItems.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`pill-mobile-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <span className="pill-mobile-nav-icon">{item.icon}</span>
                      <span className="pill-mobile-nav-label">{item.label}</span>
                      {isActive && <span className="pill-mobile-active-pip">●</span>}
                    </button>
                  );
                })}

                {/* Acordeón de Mecánicas de Supervivencia en Móvil */}
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => setMobileRoutesAccordion(!mobileRoutesAccordion)}
                    className="pill-mobile-routes-accordion-btn"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span>⚙️</span>
                      <span>Mecánicas ({routesDatabase.length})</span>
                    </div>
                    <span>{mobileRoutesAccordion ? '▲' : '▼'}</span>
                  </button>

                  {mobileRoutesAccordion && (
                    <div className="pill-mobile-routes-sublist">
                      {routesDatabase.map((r) => {
                        const isCurrent = activeRouteId === r.id;
                        return (
                          <button
                            key={r.id}
                            onClick={() => {
                              onSelectRoute(r.id);
                              onSelectView('route');
                              setMobileMenuOpen(false);
                            }}
                            className={`pill-mobile-routes-subitem ${isCurrent ? 'active' : ''}`}
                          >
                            <span>{isCurrent ? '▸' : '•'}</span>
                            <span style={{ flex: 1, textAlign: 'left' }}>{r.title}</span>
                            <span style={{ fontSize: 9, opacity: 0.6 }}>{r.levels.length} nvs</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Accesos de Perfil / Sistema */}
                {isAdmin && (
                  <>
                    <span className="pill-mobile-nav-section-title" style={{ marginTop: 16 }}>
                      SISTEMA & TELEMETRÍA (ADMIN)
                    </span>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenLogsModal();
                      }}
                      className="pill-mobile-nav-item"
                      style={{ color: '#38bdf8' }}
                    >
                      <span className="pill-mobile-nav-icon">🛰️</span>
                      <span className="pill-mobile-nav-label">Terminal SSE Logs en Vivo</span>
                    </button>
                  </>
                )}

                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenProfileModal();
                      }}
                      className="pill-mobile-nav-item"
                      style={{ color: '#10b981' }}
                    >
                      <span className="pill-mobile-nav-icon">🪪</span>
                      <span className="pill-mobile-nav-label">Ficha de Superviviente</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="pill-mobile-nav-item"
                      style={{ color: '#ef4444' }}
                    >
                      <span className="pill-mobile-nav-icon">🚪</span>
                      <span className="pill-mobile-nav-label">Cerrar Sesión</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLoginModal();
                    }}
                    className="pill-mobile-nav-item"
                    style={{ color: '#fbbf24' }}
                  >
                    <span className="pill-mobile-nav-icon">🔑</span>
                    <span className="pill-mobile-nav-label">Acceder / Iniciar Sesión</span>
                  </button>
                )}
              </div>

              {/* Pie del Drawer */}
              <div className="pill-mobile-drawer-footer">
                <span>KNOX-OS v42.1 // TACTICAL MOBILE INTERFACE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
