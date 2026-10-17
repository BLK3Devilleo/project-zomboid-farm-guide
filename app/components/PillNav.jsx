'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { routesDatabase } from '../data/routesDatabase';
import { ROLE_LABELS } from '../lib/authClient';
import {
  RouteIcon,
  RadarServerIcon,
  BackpackIcon,
  HazardIcon,
  RadioAntennaIcon,
  ShieldAdminIcon,
  TerminalLogsIcon,
  KeyAccessIcon,
  RankChevronIcon,
  CrosshairIcon,
  WrenchIcon,
  UserIcon,
  LogoutIcon,
  CloseCrossIcon,
  ChatIcon,
} from './icons/KnoxIcons';

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
  onOpenAdminModal = () => {},
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
    { id: 'servers', label: 'Servidores', icon: <RadarServerIcon size={14} /> },
    { id: 'guide', label: 'Guía de Juego', icon: <RouteIcon size={14} /> },
    { id: 'forum', label: 'Foro', icon: <ChatIcon size={14} /> },
    { id: 'loot', label: 'Loot Points', icon: <BackpackIcon size={14} /> },
    { id: 'radio', label: 'Radio (Chat)', icon: <RadioAntennaIcon size={14} /> },
    { id: 'missions', label: 'Misiones', icon: <CrosshairIcon size={14} /> },
  ];

  const currentRoleMeta = currentUser
    ? ROLE_LABELS[currentUser.role] || ROLE_LABELS.usuario
    : null;

  const isStaff = Boolean(
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'moderador')
  );

  const isAdmin = Boolean(
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin')
  );

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
            </div>
          </div>

          {/* LADO DERECHO: ACCESO / USUARIO & XP & BOTONES STAFF */}
          <div className="pill-nav-right-strip">
            {/* BOTÓN PANEL DE ADMINISTRACIÓN (SOLO MODERADOR, ADMIN O SUPER_ADMIN) */}
            {isStaff && (
              <button
                onClick={onOpenAdminModal}
                className="pill-tab-item desktop-only"
                style={{
                  padding: '5px 9px',
                  gap: 5,
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  background: 'rgba(6, 182, 212, 0.12)',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
                title="Abrir Panel de Administración y Control RBAC"
              >
                <ShieldAdminIcon size={13} color="#06b6d4" />
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 900, color: '#06b6d4' }}>ADMIN</span>
              </button>
            )}

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
                <TerminalLogsIcon size={13} color="#34d399" />
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
                      style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <UserIcon size={14} color="#10b981" />
                      <span>Ficha de Superviviente</span>
                    </button>

                    {isStaff && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAdminModal();
                        }}
                        className="pill-dropdown-item"
                        style={{ color: '#06b6d4', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <ShieldAdminIcon size={14} color="#06b6d4" />
                        <span>Panel de Administración</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenLogsModal();
                        }}
                        className="pill-dropdown-item"
                        style={{ color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <TerminalLogsIcon size={14} color="#38bdf8" />
                        <span>Terminal SSE Logs</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="pill-dropdown-item"
                      style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <LogoutIcon size={14} color="#ef4444" />
                      <span>Cerrar Sesión</span>
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
                <KeyAccessIcon size={14} />
                <span>Acceder</span>
              </button>
            )}

            {/* BADGE DE XP */}
            <div className="pill-xp-chip" title={`Nivel ${playerLevel}: ${rankTitle} (${globalXp} XP acumulados)`}>
              <RankChevronIcon size={14} color="#10b981" style={{ marginRight: 2 }} />
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
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <CloseCrossIcon size={16} />
                </button>
              </div>

              {/* Tarjeta de Nivel y Superviviente en Móvil */}
              <div className="pill-mobile-user-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RankChevronIcon size={14} color="#10b981" />
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
                      <span className="pill-mobile-nav-icon" style={{ display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </span>
                      <span className="pill-mobile-nav-label">{item.label}</span>
                      {isActive && <span className="pill-mobile-active-pip">●</span>}
                    </button>
                  );
                })}

                {/* Accesos de Administración y Perfil en Móvil */}
                {isStaff && (
                  <>
                    <span className="pill-mobile-nav-section-title" style={{ marginTop: 16 }}>
                      CENTRO DE CONTROL & STAFF
                    </span>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAdminModal();
                      }}
                      className="pill-mobile-nav-item"
                      style={{ color: '#06b6d4' }}
                    >
                      <span className="pill-mobile-nav-icon"><ShieldAdminIcon size={16} color="#06b6d4" /></span>
                      <span className="pill-mobile-nav-label">Panel de Administración</span>
                    </button>
                  </>
                )}

                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogsModal();
                    }}
                    className="pill-mobile-nav-item"
                    style={{ color: '#38bdf8' }}
                  >
                    <span className="pill-mobile-nav-icon"><TerminalLogsIcon size={16} color="#38bdf8" /></span>
                    <span className="pill-mobile-nav-label">Terminal SSE Logs en Vivo</span>
                  </button>
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
                      <span className="pill-mobile-nav-icon"><UserIcon size={16} color="#10b981" /></span>
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
                      <span className="pill-mobile-nav-icon"><LogoutIcon size={16} color="#ef4444" /></span>
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
                    <span className="pill-mobile-nav-icon"><KeyAccessIcon size={16} color="#fbbf24" /></span>
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
