'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Navbar({
  currentView,
  onSelectView,
  onSelectRoute,
  onSelectLootCategory,
  onResetToOnboarding,
  globalXp,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleRouteClick = (routeId) => {
    onSelectRoute(routeId);
    setOpenMenu(null);
  };

  const handleLootClick = (catId) => {
    onSelectLootCategory(catId);
    setOpenMenu(null);
  };

  return (
    <header
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(11, 17, 32, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.8)',
        padding: '10px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        {/* LOGO SPIFFO-OS (Vuelve al Onboarding sin borrar datos) */}
        <div
          onClick={onResetToOnboarding}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="Volver a la selección inicial"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#1e293b',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Image src="/spiffo/spiffo_character.png" alt="Spiffo" width={30} height={30} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>SPIFFO-OS</span>
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 5px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                B42
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Acompañante Táctico</div>
          </div>
        </div>

        {/* 4 MENÚS DESPLEGABLES LIMPIOS */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* 1. MODO DE JUEGO */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleMenu('gameMode')}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: openMenu === 'gameMode' ? '#1e293b' : 'transparent',
                border: '1px solid',
                borderColor: openMenu === 'gameMode' ? '#10b981' : 'transparent',
                color: openMenu === 'gameMode' ? '#34d399' : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>🎮</span> Modo de juego ▾
            </button>
            {openMenu === 'gameMode' && (
              <div style={dropdownStyle}>
                <div style={dropdownItemStyle} onClick={() => handleRouteClick('survival-basics')}>
                  <span>🔰</span> Novato / Supervivencia Inicial
                </div>
                <div style={dropdownItemStyle} onClick={() => handleRouteClick('first-vehicle')}>
                  <span>🚐</span> Nómada / Carretera
                </div>
                <div style={dropdownItemStyle} onClick={() => handleRouteClick('farming-b42')}>
                  <span>🌾</span> Base y Agricultura
                </div>
                <div style={dropdownDisabledStyle}>
                  <span>⚔️</span> PvP / Saqueador Urbano <small style={{ color: '#64748b' }}>(Pronto)</small>
                </div>
                <div style={dropdownDisabledStyle}>
                  <span>🎭</span> Roleplay y Comunidad <small style={{ color: '#64748b' }}>(Pronto)</small>
                </div>
              </div>
            )}
          </div>

          {/* 2. PROFESIONES */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleMenu('professions')}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: openMenu === 'professions' ? '#1e293b' : 'transparent',
                border: '1px solid',
                borderColor: openMenu === 'professions' ? '#10b981' : 'transparent',
                color: openMenu === 'professions' ? '#34d399' : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>💼</span> Profesiones ▾
            </button>
            {openMenu === 'professions' && (
              <div style={dropdownStyle}>
                <div style={dropdownItemStyle} onClick={() => handleRouteClick('first-vehicle')}>
                  <span>🔑</span> Ladrón / Mecánico (Puentear autos)
                </div>
                <div style={dropdownItemStyle} onClick={() => handleRouteClick('farming-b42')}>
                  <span>🌱</span> Agricultor / Granjero
                </div>
                <div style={dropdownDisabledStyle}>
                  <span>🔨</span> Carpintero / Constructor <small style={{ color: '#64748b' }}>(Pronto)</small>
                </div>
                <div style={dropdownDisabledStyle}>
                  <span>🩹</span> Médico / Enfermero <small style={{ color: '#64748b' }}>(Pronto)</small>
                </div>
                <div style={dropdownDisabledStyle}>
                  <span>⚡</span> Electricista <small style={{ color: '#64748b' }}>(Pronto)</small>
                </div>
              </div>
            )}
          </div>

          {/* 3. HABILIDADES */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleMenu('skills')}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: openMenu === 'skills' ? '#1e293b' : 'transparent',
                border: '1px solid',
                borderColor: openMenu === 'skills' ? '#10b981' : 'transparent',
                color: openMenu === 'skills' ? '#34d399' : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>📚</span> Habilidades ▾
            </button>
            {openMenu === 'skills' && (
              <div style={dropdownStyle}>
                <div style={dropdownItemStyle} onClick={() => handleRouteClick('farming-b42')}>
                  <span>🌾</span> Agricultura (Build 42)
                </div>
                <div style={dropdownItemStyle} onClick={() => handleRouteClick('first-vehicle')}>
                  <span>🔧</span> Mecánica y Vehículos
                </div>
                <div style={dropdownItemStyle} onClick={() => handleRouteClick('survival-basics')}>
                  <span>🎒</span> Sigilo y Supervivencia
                </div>
                <div style={dropdownDisabledStyle}>
                  <span>🔨</span> Carpintería <small style={{ color: '#64748b' }}>(Pronto)</small>
                </div>
                <div style={dropdownDisabledStyle}>
                  <span>⚡</span> Electricidad <small style={{ color: '#64748b' }}>(Pronto)</small>
                </div>
                <div style={dropdownDisabledStyle}>
                  <span>⚒️</span> Soldadura / Metalurgia <small style={{ color: '#64748b' }}>(Pronto)</small>
                </div>
              </div>
            )}
          </div>

          {/* 4. LOOT Y MAPAS */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleMenu('loot')}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: openMenu === 'loot' || currentView === 'loot' ? '#1e293b' : 'transparent',
                border: '1px solid',
                borderColor: openMenu === 'loot' || currentView === 'loot' ? '#10b981' : 'transparent',
                color: openMenu === 'loot' || currentView === 'loot' ? '#34d399' : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>🗺️</span> Loot y mapas ▾
            </button>
            {openMenu === 'loot' && (
              <div style={dropdownStyle}>
                <div style={dropdownItemStyle} onClick={() => handleLootClick('all')}>
                  <span>📋</span> Ver Todo el Loot
                </div>
                <div style={dropdownItemStyle} onClick={() => handleLootClick('hospitals')}>
                  <span>🏥</span> Hospitales y Farmacias
                </div>
                <div style={dropdownItemStyle} onClick={() => handleLootClick('vehicles')}>
                  <span>⛽</span> Vehículos y Gasolineras
                </div>
                <div style={dropdownItemStyle} onClick={() => handleLootClick('tools')}>
                  <span>🔨</span> Herramientas y Ferreterías
                </div>
                <div style={dropdownItemStyle} onClick={() => handleLootClick('groceries')}>
                  <span>🥫</span> Comida y Supermercados
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* HUD DE XP GLOBAL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '5px 12px', borderRadius: '10px' }}>
          <span style={{ fontSize: '13px' }}>⭐</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b' }}>{globalXp} XP</span>
        </div>
      </div>
    </header>
  );
}

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: '6px',
  width: '230px',
  backgroundColor: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '10px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)',
  padding: '6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  zIndex: 60,
};

const dropdownItemStyle = {
  padding: '8px 10px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#cbd5e1',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'background 0.15s ease, color 0.15s ease',
  userSelect: 'none',
};

const dropdownDisabledStyle = {
  padding: '8px 10px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#64748b',
  cursor: 'not-allowed',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  userSelect: 'none',
};
