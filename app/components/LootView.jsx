'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { lootDatabase } from '../data/lootDatabase';

export default function LootView({ selectedCategory = 'all', onSelectRoute }) {
  const [activeRadius, setActiveRadius] = useState('1.5km'); // '500m' | '1.5km' | '5.0km'
  const [activeCategory, setActiveCategory] = useState(selectedCategory === 'all' ? 'TODO' : selectedCategory);
  const [trackedRoute, setTrackedRoute] = useState(null);
  const [hordeAlerts, setHordeAlerts] = useState({});
  const [savedGpsPings, setSavedGpsPings] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [activeTabByCard, setActiveTabByCard] = useState({});
  const [checkedGear, setCheckedGear] = useState({});
  const [stashModalOpen, setStashModalOpen] = useState(false);
  const [customStashes, setCustomStashes] = useState([]);
  const [newStashName, setNewStashName] = useState('');
  const [newStashCategory, setNewStashCategory] = useState('Militar');
  const [newStashItems, setNewStashItems] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const cardRefs = useRef({});

  // Categorías de filtro militar
  const filterCategories = [
    { id: 'TODO', label: 'TODO', color: '#10b981', dot: '#10b981' },
    { id: 'militar', label: 'MILITAR (ORO)', color: '#fbbf24', dot: '#f59e0b' },
    { id: 'epico', label: 'ÉPICO (PÚRPURA)', color: '#c084fc', dot: '#a855f7' },
    { id: 'medico', label: 'MÉDICO (CIAN)', color: '#38bdf8', dot: '#00a6e0' },
    { id: 'herramientas', label: 'HERRAMIENTAS', color: '#34d399', dot: '#10b981' },
    { id: 'alimentos', label: 'ALIMENTOS', color: '#fed7aa', dot: '#f97316' },
  ];

  // Distancia máxima en metros según radio
  const radiusLimit = useMemo(() => {
    if (activeRadius === '500m') return 550;
    if (activeRadius === '1.5km') return 1600;
    return 6000;
  }, [activeRadius]);

  // Lista combinada (base de datos + alijos personalizados del jugador)
  const allStashes = useMemo(() => {
    return [...customStashes, ...lootDatabase];
  }, [customStashes]);

  // Filtrado activo por radio, categoría y búsqueda
  const filteredList = useMemo(() => {
    return allStashes.filter((item) => {
      // Filtro por radio de sonar
      const inRadius = item.distanceMeters <= radiusLimit;

      // Filtro por categoría / tier
      let matchesCategory = true;
      if (activeCategory !== 'TODO') {
        matchesCategory =
          item.tier === activeCategory ||
          item.category.toLowerCase().includes(activeCategory.toLowerCase());
      }

      // Filtro por búsqueda
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.scanItems && item.scanItems.some((s) => s.toLowerCase().includes(q))) ||
        (item.whatToLookFor && item.whatToLookFor.some((w) => w.toLowerCase().includes(q)));

      return inRadius && matchesCategory && matchesSearch;
    });
  }, [allStashes, radiusLimit, activeCategory, searchQuery]);

  // Objetivos visibles en la pantalla de radar según radio
  const visibleRadarBlips = useMemo(() => {
    return allStashes.filter((item) => item.distanceMeters <= radiusLimit);
  }, [allStashes, radiusLimit]);

  // Acción: Clic en blip de radar -> Scroll y Resaltar tarjeta
  const handleBlipClick = (cardId) => {
    const el = cardRefs.current[cardId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('pz-card-pulse-highlight');
      setTimeout(() => {
        el.classList.remove('pz-card-pulse-highlight');
      }, 1500);
    }
  };

  // Acción: Fijar o cancelar ruta en GPS
  const handleToggleRoute = (stash) => {
    if (trackedRoute?.id === stash.id) {
      setTrackedRoute(null);
    } else {
      setTrackedRoute(stash);
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {}
    }
  };

  // Acción: Conmutar Alerta de Horda en zona
  const handleToggleHordeAlert = (cardId) => {
    setHordeAlerts((prev) => {
      const nextState = !prev[cardId];
      if (nextState) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        } catch (e) {}
      }
      return { ...prev, [cardId]: nextState };
    });
  };

  // Acción: Guardar alijo en GPS personal
  const handleSaveGps = (stash) => {
    setSavedGpsPings((prev) => ({
      ...prev,
      [stash.id]: !prev[stash.id],
    }));
  };

  // Acción: Crear alijo personalizado
  const handleCreateCustomStash = (e) => {
    e.preventDefault();
    if (!newStashName.trim()) return;

    const newId = `custom-${Date.now()}`;
    const newEntry = {
      id: newId,
      tier: newStashCategory.toLowerCase() === 'militar' ? 'militar' : newStashCategory.toLowerCase() === 'épico' ? 'epico' : newStashCategory.toLowerCase() === 'médico' ? 'medico' : 'herramientas',
      tierLabel: `TIER: PERSONAL // ${newStashCategory.toUpperCase()}`,
      tierColor: '#10b981',
      glowColor: '#4edea3',
      category: newStashCategory,
      icon: 'add_location_alt',
      title: newStashName.trim(),
      sector: 'SECTOR 03: POSICIÓN DE CAMPO',
      freq: '142.80',
      distanceMeters: Math.floor(Math.random() * 400) + 150,
      distanceDisplay: 'Posición Marcada en Terreno',
      radarPos: {
        top: `${Math.floor(Math.random() * 60) + 20}%`,
        left: `${Math.floor(Math.random() * 60) + 20}%`,
      },
      radarLabel: `${newStashName.substring(0, 10).toUpperCase()} // MARCADOR`,
      hazardLevel: 'PELIGRO VARIABLE // ZONA RECONOCIMIENTO',
      hazardNote: 'BALIZA ACTIVA DE SUPERVIVIENTE',
      respawnTimer: 'Permanente',
      isCritical: false,
      image: '/spiffo/ferret_mascot.jpg',
      imageTag: 'BALIZA GPS REGISTRADA',
      scanItems: newStashItems
        ? newStashItems.split(',').map((s) => s.trim())
        : ['Suministros varios', 'Caja de clavos', 'Munición de reserva'],
      riskLevel: 'Medio',
      whenToGo: 'A discreción del superviviente',
      whatToLookFor: ['Objetos almacenados en la baliza de campaña'],
      whereToFind: ['Coordenadas GPS fijadas en este sector'],
      recommendedGear: ['Mochila para transporte de suministros'],
      tacticalTips: ['No dejes marcas visibles si juegas en servidores PvP.'],
      relatedRoutes: ['survival-basics'],
    };

    setCustomStashes((prev) => [newEntry, ...prev]);
    setNewStashName('');
    setNewStashItems('');
    setStashModalOpen(false);
  };

  return (
    <div className="radar-view-container">
      {/* 1. DEFCON TACTICAL ZONE ALERT RIBBON */}
      <div className="radar-defcon-ribbon">
        <div className="radar-defcon-strip-pulse"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10 }}>
          <span className="radar-defcon-warning-icon">⚠️</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="radar-defcon-label">AMENAZA ACTIVA // KNOX DENSITY</span>
            <span className="radar-defcon-sub">DEFCON-1 : ZONA INFESTADA CRÍTICA</span>
          </div>
        </div>
        <div className="radar-active-status-pill">
          <span className="radar-ping-dot"></span>
          <span className="radar-ping-text">RADAR ACTIVO</span>
        </div>
      </div>

      <div className="radar-content-wrapper">
        {/* 2. TERMINAL Y SONAR TAC-HUD VIEWPORT */}
        <div className="radar-sonar-card">
          {/* Header de Sector & Frecuencia */}
          <div className="radar-sector-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="radar-sector-pulse-beacon"></div>
              <span className="radar-sector-title">SECTOR 03: WEST POINT</span>
            </div>
            <span className="radar-freq-badge">FREQ 142.80</span>
          </div>

          {/* Selectores de Radio (500M / 1.5KM / 5.0KM) */}
          <div className="radar-radius-selector">
            {['500m', '1.5km', '5.0km'].map((rad) => {
              const isActive = activeRadius === rad;
              return (
                <button
                  key={rad}
                  onClick={() => setActiveRadius(rad)}
                  className={`radar-radius-btn ${isActive ? 'active' : ''}`}
                >
                  {rad.toUpperCase().replace('M', ' M').replace('KM', ' KM')}
                </button>
              );
            })}
          </div>

          {/* SONAR CIRCULAR DIEGÉTICO */}
          <div className="radar-sonar-viewport">
            {/* Retícula SVG concéntrica y ejes */}
            <svg
              className="radar-svg-grid"
              viewBox="0 0 300 300"
              aria-hidden="true"
            >
              <circle cx="150" cy="150" fill="none" r="140" stroke="rgba(78, 222, 163, 0.25)" strokeDasharray="4 4" strokeWidth="1.5" />
              <circle cx="150" cy="150" fill="none" r="100" stroke="rgba(78, 222, 163, 0.3)" strokeWidth="1" />
              <circle cx="150" cy="150" fill="none" r="60" stroke="rgba(78, 222, 163, 0.2)" strokeDasharray="2 2" strokeWidth="1" />
              <circle cx="150" cy="150" fill="none" r="20" stroke="rgba(78, 222, 163, 0.35)" strokeWidth="1" />
              <line stroke="rgba(78, 222, 163, 0.2)" strokeWidth="1" x1="150" x2="150" y1="5" y2="295" />
              <line stroke="rgba(78, 222, 163, 0.2)" strokeWidth="1" x1="5" x2="295" y1="150" y2="150" />
            </svg>

            {/* Haz de Barrido Giratorio (Radar Sweep Beam) */}
            <div className="radar-sweep-beam"></div>

            {/* Nodo Central del Superviviente */}
            <div className="radar-player-center" title="Tu Posición Actual (GPS)">
              <span className="radar-player-ping"></span>
              <span className="radar-player-icon">▲</span>
            </div>

            {/* Blips Interactivos en el Sonar */}
            {visibleRadarBlips.map((stash) => {
              const isArmory = stash.tier === 'militar';
              const isEpic = stash.tier === 'epico';
              const isMedical = stash.tier === 'medico';
              const isFood = stash.tier === 'alimentos';

              let blipColor = '#10b981';
              if (isArmory) blipColor = '#f59e0b';
              else if (isEpic) blipColor = '#a855f7';
              else if (isMedical) blipColor = '#00a6e0';
              else if (isFood) blipColor = '#f97316';

              return (
                <div
                  key={stash.id}
                  onClick={() => handleBlipClick(stash.id)}
                  className="radar-blip-node"
                  style={{
                    top: stash.radarPos.top,
                    left: stash.radarPos.left,
                  }}
                  title={`Clic para inspeccionar alijo: ${stash.title}`}
                >
                  <div
                    className="radar-blip-dot-wrapper"
                    style={{
                      background: `${blipColor}33`,
                      boxShadow: `0 0 10px ${blipColor}`,
                    }}
                  >
                    <span
                      className="radar-blip-core"
                      style={{ background: blipColor }}
                    ></span>
                  </div>
                  <span
                    className="radar-blip-tag"
                    style={{ color: blipColor }}
                  >
                    {stash.radarLabel || `${stash.title.substring(0, 10)}`}
                  </span>
                </div>
              );
            })}

            {/* Puntos Cardinales */}
            <span className="radar-cardinal-pt north">N</span>
            <span className="radar-cardinal-pt south">S</span>
            <span className="radar-cardinal-pt west">O</span>
            <span className="radar-cardinal-pt east">E</span>
          </div>

          {/* Telemetría Rápida HUD (3 Cajas Inferiores) */}
          <div className="radar-telemetry-grid">
            <div className="radar-telemetry-box">
              <span className="radar-telemetry-label">OBJETIVOS DETECTADOS</span>
              <span className="radar-telemetry-value green">{filteredList.length} PUNTOS</span>
            </div>
            <div className="radar-telemetry-box">
              <span className="radar-telemetry-label">RUIDO AMBIENTAL</span>
              <span className="radar-telemetry-value amber">38 dB (SEGURO)</span>
            </div>
            <div className="radar-telemetry-box">
              <span className="radar-telemetry-label">SENSORES ACTIVOS</span>
              <span className="radar-telemetry-value cyan">3 NODOS</span>
            </div>
          </div>
        </div>

        {/* 3. BARRA DE BÚSQUEDA Y FILTROS CATEGORÍA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          {/* Búsqueda en Vivo */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Buscar alijo, munición, arma, medicina o forja B42..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="radar-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: 900,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtros por Categoría Rápida */}
          <div className="radar-filter-chips-strip">
            {filterCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`radar-cat-chip ${isActive ? 'active' : ''}`}
                  style={{
                    color: isActive ? '#ffffff' : cat.color,
                  }}
                >
                  <span
                    className="radar-cat-dot"
                    style={{ background: cat.dot }}
                  ></span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. CABECERA DE LISTA DE ALIJOS */}
        <div className="radar-stash-list-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>🎯</span>
            <span className="radar-stash-list-title">ALIJOS Y PUNTOS DE INTERÉS</span>
          </div>
          <span className="radar-stash-list-order">ORDEN: PROXIMIDAD ({filteredList.length})</span>
        </div>

        {/* 5. TARJETAS TÁCTICAS DE BOTÍN */}
        <div className="radar-cards-stack">
          {filteredList.length === 0 ? (
            <div className="radar-empty-box">
              <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>📡</span>
              <h3 style={{ color: '#ffffff', fontSize: 16, margin: '0 0 6px', fontFamily: 'monospace' }}>
                SIN SEÑAL EN ESTE RADIO DE ESCANEO
              </h3>
              <p style={{ color: '#94a3b8', fontSize: 12, margin: 0, maxWidth: 440 }}>
                Prueba ampliando el rango del radar a <strong>1.5 KM</strong> o <strong>5.0 KM</strong>, o selecciona la categoría <strong>TODO</strong>.
              </p>
            </div>
          ) : (
            filteredList.map((stash) => {
              const isHordeAlertActive = Boolean(hordeAlerts[stash.id]);
              const isGpsSaved = Boolean(savedGpsPings[stash.id]);
              const isTracked = trackedRoute?.id === stash.id;
              const isExpanded = Boolean(expandedCards[stash.id]);
              const activeTab = activeTabByCard[stash.id] || 'look';

              // Colores según rareza
              let tierBorder = 'rgba(255, 255, 255, 0.12)';
              let tierGlow = 'rgba(255, 255, 255, 0.05)';
              let tierTopLine = '#94a3b8';
              if (stash.tier === 'militar') {
                tierBorder = 'rgba(245, 158, 11, 0.4)';
                tierGlow = 'rgba(245, 158, 11, 0.12)';
                tierTopLine = '#f59e0b';
              } else if (stash.tier === 'epico') {
                tierBorder = 'rgba(168, 85, 247, 0.4)';
                tierGlow = 'rgba(168, 85, 247, 0.12)';
                tierTopLine = '#a855f7';
              } else if (stash.tier === 'medico') {
                tierBorder = 'rgba(0, 166, 224, 0.4)';
                tierGlow = 'rgba(0, 166, 224, 0.12)';
                tierTopLine = '#00a6e0';
              } else if (stash.tier === 'alimentos') {
                tierBorder = 'rgba(249, 115, 22, 0.4)';
                tierGlow = 'rgba(249, 115, 22, 0.12)';
                tierTopLine = '#f97316';
              } else if (stash.tier === 'herramientas') {
                tierBorder = 'rgba(16, 185, 129, 0.4)';
                tierGlow = 'rgba(16, 185, 129, 0.12)';
                tierTopLine = '#10b981';
              }

              return (
                <div
                  key={stash.id}
                  id={stash.id}
                  ref={(el) => {
                    if (el) cardRefs.current[stash.id] = el;
                  }}
                  className={`radar-loot-card ${isHordeAlertActive ? 'horde-alert-glow' : ''}`}
                  style={{
                    borderColor: isHordeAlertActive ? '#ef4444' : tierBorder,
                  }}
                >
                  {/* Línea Superior de Resplandor por Tier */}
                  <div
                    className="radar-card-glow-bar"
                    style={{
                      background: isHordeAlertActive ? '#ef4444' : tierTopLine,
                      boxShadow: `0 0 12px ${isHordeAlertActive ? '#ef4444' : tierTopLine}`,
                    }}
                  ></div>

                  {/* Cabecera de la Tarjeta */}
                  <div className="radar-card-header">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span
                          className="radar-tier-badge"
                          style={{
                            color: tierTopLine,
                            borderColor: `${tierTopLine}66`,
                            background: tierGlow,
                          }}
                        >
                          {stash.tierLabel || `TIER: ${stash.tier?.toUpperCase()}`}
                        </span>
                        {stash.respawnTimer && (
                          <span className="radar-respawn-chip">
                            ⏳ Respawn: {stash.respawnTimer}
                          </span>
                        )}
                      </div>

                      <h2 className="radar-card-title">{stash.title}</h2>

                      <span className="radar-distance-text">
                        📍 {stash.distanceDisplay || `${stash.distanceMeters}m de proximidad`}
                      </span>
                    </div>

                    {/* Emblema Táctico */}
                    <div
                      className="radar-emblem-box"
                      style={{
                        borderColor: `${tierTopLine}44`,
                        color: tierTopLine,
                      }}
                    >
                      {stash.tier === 'militar'
                        ? '🛡️'
                        : stash.tier === 'epico'
                        ? '⚒️'
                        : stash.tier === 'medico'
                        ? '💉'
                        : stash.tier === 'alimentos'
                        ? '🥫'
                        : '🔧'}
                    </div>
                  </div>

                  {/* Peligro & Densidad de Zeds */}
                  <div className="radar-hazard-strip">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        className="radar-hazard-dot"
                        style={{
                          background: stash.hazardLevel.includes('EXTREMO')
                            ? '#ef4444'
                            : stash.hazardLevel.includes('MEDIO')
                            ? '#f59e0b'
                            : '#10b981',
                        }}
                      ></span>
                      <span
                        className="radar-hazard-title"
                        style={{
                          color: stash.hazardLevel.includes('EXTREMO')
                            ? '#fca5a5'
                            : stash.hazardLevel.includes('MEDIO')
                            ? '#fde68a'
                            : '#a7f3d0',
                        }}
                      >
                        {stash.hazardLevel}
                      </span>
                    </div>
                    <span className="radar-hazard-note">{stash.hazardNote}</span>
                  </div>

                  {/* Imagen de Reconocimiento Táctico */}
                  {stash.image && (
                    <div className="radar-card-img-container">
                      <img
                        src={stash.image}
                        alt={stash.title}
                        className="radar-card-recon-img"
                      />
                      <div className="radar-card-img-gradient"></div>
                      <div className="radar-card-img-tag">
                        <span>🔒</span>
                        <span>{stash.imageTag || 'ESTRUCTURA FORTIFICADA'}</span>
                      </div>
                    </div>
                  )}

                  {/* Chips de Botín Detectado por Escáner */}
                  {stash.scanItems && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span className="radar-scan-header-text">
                        BOTÍN DETECTADO POR ESCÁNER:
                      </span>
                      <div className="radar-scan-chips-row">
                        {stash.scanItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="radar-scan-chip"
                            style={{
                              borderColor: idx === 0 ? `${tierTopLine}88` : 'rgba(255, 255, 255, 0.1)',
                              color: idx === 0 ? tierTopLine : '#e2e8f0',
                            }}
                          >
                            {idx === 0 && <span style={{ opacity: 0.8 }}>⚡</span>}
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pestañas Desplegables de Inteligencia Profunda (Dossier Expandible) */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <button
                        onClick={() =>
                          setExpandedCards((prev) => ({
                            ...prev,
                            [stash.id]: !prev[stash.id],
                          }))
                        }
                        className="radar-expand-intel-btn"
                      >
                        <span>{isExpanded ? '▲ Ocultar Dossier Táctico' : '▼ Expandir Inteligencia Táctica (Mochila, Tips, Zonas)'}</span>
                      </button>

                      {stash.relatedRoutes && stash.relatedRoutes.length > 0 && (
                        <button
                          onClick={() => onSelectRoute && onSelectRoute(stash.relatedRoutes[0])}
                          className="radar-open-route-link"
                          title="Abrir la ruta de supervivencia relacionada"
                        >
                          <span>Ver Ruta Guía →</span>
                        </button>
                      )}
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* Selector de Pestaña Interna */}
                        <div className="radar-intel-tabs-row">
                          <button
                            onClick={() =>
                              setActiveTabByCard((p) => ({ ...p, [stash.id]: 'look' }))
                            }
                            className={`radar-intel-tab-btn ${activeTab === 'look' ? 'active' : ''}`}
                          >
                            📦 Qué Buscar
                          </button>
                          <button
                            onClick={() =>
                              setActiveTabByCard((p) => ({ ...p, [stash.id]: 'where' }))
                            }
                            className={`radar-intel-tab-btn ${activeTab === 'where' ? 'active' : ''}`}
                          >
                            📍 Dónde Buscar
                          </button>
                          <button
                            onClick={() =>
                              setActiveTabByCard((p) => ({ ...p, [stash.id]: 'gear' }))
                            }
                            className={`radar-intel-tab-btn ${activeTab === 'gear' ? 'active' : ''}`}
                          >
                            🎒 Mochila
                          </button>
                          <button
                            onClick={() =>
                              setActiveTabByCard((p) => ({ ...p, [stash.id]: 'tips' }))
                            }
                            className={`radar-intel-tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
                          >
                            💡 Tips de Escape
                          </button>
                        </div>

                        {/* Contenido según pestaña */}
                        <div className="radar-intel-tab-body">
                          {activeTab === 'look' && (
                            <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 12, lineHeight: 1.6 }}>
                              {stash.whatToLookFor?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          )}

                          {activeTab === 'where' && (
                            <ul style={{ margin: 0, paddingLeft: 18, color: '#93c5fd', fontSize: 12, lineHeight: 1.6 }}>
                              {stash.whereToFind?.map((loc, idx) => (
                                <li key={idx}>{loc}</li>
                              ))}
                            </ul>
                          )}

                          {activeTab === 'gear' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {stash.recommendedGear?.map((gear, idx) => {
                                const gearKey = `${stash.id}-gear-${idx}`;
                                const isChecked = Boolean(checkedGear[gearKey]);
                                return (
                                  <label
                                    key={idx}
                                    onClick={() =>
                                      setCheckedGear((p) => ({ ...p, [gearKey]: !p[gearKey] }))
                                    }
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      cursor: 'pointer',
                                      fontSize: 12,
                                      color: isChecked ? '#64748b' : '#f1f5f9',
                                      textDecoration: isChecked ? 'line-through' : 'none',
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      readOnly
                                      style={{ accentColor: '#10b981' }}
                                    />
                                    <span>{gear}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {activeTab === 'tips' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {stash.tacticalTips?.map((tip, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    gap: 6,
                                    fontSize: 12,
                                    color: '#fef08a',
                                    lineHeight: 1.5,
                                    background: 'rgba(245, 158, 11, 0.08)',
                                    padding: '6px 10px',
                                    borderRadius: 4,
                                    borderLeft: '2px solid #f59e0b',
                                  }}
                                >
                                  <span>⚠️</span>
                                  <span>{tip}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones de la Tarjeta */}
                  <div className="radar-card-actions-grid">
                    <button
                      type="button"
                      onClick={() => handleToggleRoute(stash)}
                      className={`radar-action-btn primary ${isTracked ? 'tracking-active' : ''}`}
                    >
                      <span>🧭</span>
                      <span>{isTracked ? 'RUTA ACTIVA' : 'RASTREAR RUTA'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleHordeAlert(stash.id)}
                      className={`radar-action-btn alert ${isHordeAlertActive ? 'alerting' : ''}`}
                    >
                      <span>🚨</span>
                      <span>{isHordeAlertActive ? 'HORDA ACTIVA' : 'ALERTA HORDA'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveGps(stash)}
                      className={`radar-action-btn secondary ${isGpsSaved ? 'saved' : ''}`}
                      title="Guardar en GPS de campo"
                    >
                      <span>{isGpsSaved ? '⭐' : '📌'}</span>
                      <span>{isGpsSaved ? 'GUARDADO' : 'EN GPS'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 6. TACTICAL QUICK ACTION FLOATING DOCK (STICKY BOTTOM HUD) */}
      <div className="radar-floating-dock-layer">
        {/* Banner de Ruta Activa */}
        {trackedRoute && (
          <div className="radar-active-route-toast">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="radar-route-toast-pulse">🎯</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="radar-route-toast-label">RADAR GPS FIJADO</span>
                <span className="radar-route-toast-target">
                  Rumbo: {trackedRoute.title} ({trackedRoute.distanceDisplay || `${trackedRoute.distanceMeters}m`})
                </span>
              </div>
            </div>
            <button
              onClick={() => setTrackedRoute(null)}
              className="radar-route-toast-cancel"
            >
              CANCELAR
            </button>
          </div>
        )}

        {/* Botón Flotante: Registrar Nuevo Alijo de Botín */}
        <button
          onClick={() => setStashModalOpen(true)}
          className="radar-floating-fab-btn"
        >
          <span>📍</span>
          <span>+ REGISTRAR NUEVO ALIJO DE BOTÍN</span>
          <span>»</span>
        </button>
      </div>

      {/* MODAL DE NUEVA BALIZA / ALIJO */}
      {stashModalOpen && (
        <div className="server-modal-backdrop" onClick={() => setStashModalOpen(false)}>
          <div
            className="radar-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="radar-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#10b981', fontSize: 18 }}>📍</span>
                <span style={{ fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                  REGISTRAR BALIZA GPS DE CAMPO
                </span>
              </div>
              <button
                onClick={() => setStashModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomStash} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', marginBottom: 4 }}>
                  NOMBRE DEL ALIJO O EDIFICIO
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cobertizo con Generador y Combustible"
                  value={newStashName}
                  onChange={(e) => setNewStashName(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', marginBottom: 4 }}>
                  CATEGORÍA / TIER
                </label>
                <select
                  value={newStashCategory}
                  onChange={(e) => setNewStashCategory(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                >
                  <option value="Militar">Militar (Armamento / Munición)</option>
                  <option value="Épico">Épico (Forja B42 / Yunque / Herramientas Pesadas)</option>
                  <option value="Médico">Médico (Antibióticos / Suturas)</option>
                  <option value="Herramientas">Herramientas & Construcción</option>
                  <option value="Alimentos">Alimentos & Semillas</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', marginBottom: 4 }}>
                  OBJETOS CRÍTICOS (SEPARADOS POR COMA)
                </label>
                <input
                  type="text"
                  placeholder="Ej: 2 bidones de gasolina, batería de coche, sierra"
                  value={newStashItems}
                  onChange={(e) => setNewStashItems(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setStashModalOpen(false)}
                  className="btn-tactical"
                  style={{ padding: '8px 16px', fontSize: 12 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-tactical-success"
                  style={{ padding: '8px 18px', fontSize: 12 }}
                >
                  Fijar Baliza en Sonar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
