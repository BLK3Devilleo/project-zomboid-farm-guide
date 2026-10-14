'use client';

import React, { useState } from 'react';
import { metaEventsDatabase } from '../data/metaEventsDatabase';

export default function MetaEventsView() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('dos'); // 'dos' | 'donts' | 'gear'

  const categories = [
    { id: 'ALL', label: 'Todos los Eventos' },
    { id: 'acoustic', label: 'Acústicos (Disparos / Gritos)' },
    { id: 'major', label: 'El Helicóptero' },
    { id: 'world-shutoff', label: 'Cortes Mundiales' },
    { id: 'broadcast', label: 'Transmisiones TV' },
    { id: 'world-story', label: 'Alarmas y Peligros' },
  ];

  const filteredEvents = selectedCategory === 'ALL'
    ? metaEventsDatabase
    : metaEventsDatabase.filter((ev) => ev.category === selectedCategory);

  return (
    <div className="hud-container" style={{ paddingBottom: 60 }}>
      {/* 1. HERO MISSION PANEL: QUÉ SON Y PARA QUÉ SIRVEN */}
      <div className="pz-mission-panel">
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#10b981', fontWeight: 900 }}>●</span>
            <span>KNOX RADAR // SISTEMA DE META-EVENTOS Y DINÁMICA DE HORDAS</span>
          </div>
          <span>PROTOCOLO DIEGÉTICO B42</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 10px', borderRadius: 4, fontFamily: 'monospace' }}>
                INTELIGENCIA ACÚSTICA VIRTUAL
              </span>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>
                Total Eventos Registrados: {metaEventsDatabase.length}
              </span>
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 900, color: '#ffffff', margin: '0 0 10px', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
              📡 RADAR DE META-EVENTOS
            </h1>

            <p style={{ fontSize: 15, color: '#cbd5e1', margin: '0 0 14px', lineHeight: 1.6, maxWidth: 720 }}>
              ¿Qué son y para qué sirven? En Project Zomboid, los meta-eventos son perturbaciones generadas por el motor del juego para <strong>romper la estática de los zombis y forzar la migración constante de hordas</strong>. No hay otros supervivientes disparando en el mapa: cada estruendo es un señuelo masivo diseñado para vaciar o colapsar sectores del condado.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 4 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 13, color: '#fca5a5', fontWeight: 700 }}>
                  Regla de Oro: Nunca persigas el sonido de un disparo
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 4 }}>
                <span style={{ fontSize: 14 }}>📻</span>
                <span style={{ fontSize: 13, color: '#67e8f9', fontWeight: 700 }}>
                  Frecuencia AEBS: Alerta temprana de helicóptero a las 09:00 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RACK DE FILTROS POR CATEGORÍA */}
      <div className="pz-mission-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              Filtrar Tipo:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`pz-switch-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>
            Mostrando {filteredEvents.length} eventos tácticos
          </span>
        </div>
      </div>

      {/* 3. GRID DE TARJETAS DE EVENTOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => setActiveEvent(event)}
            className="pz-mission-panel"
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 14,
              transition: 'transform 0.18s ease, border-color 0.18s ease',
              borderLeft: `4px solid ${event.threatColor}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = event.threatColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderLeft = `4px solid ${event.threatColor}`;
            }}
          >
            {/* Cantoneras */}
            <div className="pz-corner-tick tl" />
            <div className="pz-corner-tick tr" />
            <div className="pz-corner-tick bl" />
            <div className="pz-corner-tick br" />

            {/* Cabecera de la tarjeta */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{event.icon}</span>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
                      {event.name}
                    </h3>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                      {event.subtitle}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: event.threatColor,
                    background: `${event.threatColor}18`,
                    border: `1px solid ${event.threatColor}40`,
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em',
                  }}
                >
                  {event.threatLevel}
                </span>
              </div>

              <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px' }}>
                {event.summary}
              </p>
            </div>

            {/* Metadatos técnicos (Radio + Ventana) */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>Alcance Acústico:</span>
                <span style={{ color: event.noiseRadius > 0 ? '#f59e0b' : '#38bdf8', fontWeight: 800, fontFamily: 'monospace' }}>
                  {event.noiseRadius > 0 ? `🔊 ${event.noiseRadius} ${event.noiseRadiusUnit}` : '🔇 Silencioso / Pasivo'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>Ventana / Frecuencia:</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>
                  ⏱️ {event.timeWindow}
                </span>
              </div>

              <button
                type="button"
                className="pz-btn-secondary"
                style={{ width: '100%', marginTop: 6, minHeight: 40, justifyContent: 'center' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveEvent(event);
                }}
              >
                <span>🔍 Abrir Ficha y Consejos Tácticos</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. MODAL DOSSIER DETALLADO DEL EVENTO */}
      {activeEvent && (
        <div className="server-modal-backdrop" onClick={() => setActiveEvent(null)}>
          <div
            className="server-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 760, borderColor: activeEvent.threatColor }}
          >
            {/* Cantoneras */}
            <div className="pz-corner-tick tl" />
            <div className="pz-corner-tick tr" />
            <div className="pz-corner-tick bl" />
            <div className="pz-corner-tick br" />

            {/* Barra superior retro CRT */}
            <div className="pz-dossier-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: activeEvent.threatColor, fontSize: 13, fontWeight: 900 }}>●</span>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.08em' }}>
                  DOSSIER TÁCTICO // {activeEvent.name.toUpperCase()} [{activeEvent.threatLevel}]
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="pz-window-controls">
                  <span className="pz-window-btn">_</span>
                  <span className="pz-window-btn">□</span>
                </div>
                <button
                  onClick={() => setActiveEvent(null)}
                  className="server-modal-close-btn"
                  title="Cerrar Dossier"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido del Dossier */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Encabezado del Evento */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 16 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: 'rgba(0,0,0,0.6)',
                    border: `1.5px solid ${activeEvent.threatColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 34,
                    flexShrink: 0,
                  }}
                >
                  {activeEvent.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: activeEvent.threatColor, fontFamily: 'monospace' }}>
                      Nivel de Amenaza: {activeEvent.threatLevel}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>•</span>
                    <span style={{ fontSize: 12, color: '#38bdf8', fontFamily: 'monospace' }}>
                      {activeEvent.categoryLabel}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
                    {activeEvent.name}
                  </h2>
                  <p style={{ fontSize: 14, color: '#94a3b8', margin: '4px 0 0' }}>
                    {activeEvent.subtitle}
                  </p>
                </div>
              </div>

              {/* Telemetría Acústica y Cronograma */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
                    Radio de Atracción
                  </span>
                  <span style={{ fontSize: 16, color: activeEvent.noiseRadius > 0 ? '#f59e0b' : '#38bdf8', fontWeight: 900, fontFamily: 'monospace' }}>
                    {activeEvent.noiseRadius > 0 ? `${activeEvent.noiseRadius} ${activeEvent.noiseRadiusUnit}` : 'Inaudible / Pasivo'}
                  </span>
                </div>

                <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
                    Momento de Ocurrencia
                  </span>
                  <span style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 800 }}>
                    {activeEvent.timeWindow}
                  </span>
                </div>

                <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>
                    Frecuencia Típica
                  </span>
                  <span style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 600 }}>
                    {activeEvent.frequency}
                  </span>
                </div>
              </div>

              {/* Explicación Mecánica Profunda */}
              <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 4 }}>
                <h4 style={{ fontSize: 13, fontWeight: 900, color: '#10b981', margin: '0 0 8px', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                  ⚙️ Mecánica Interna del Motor del Juego
                </h4>
                <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                  {activeEvent.mechanics}
                </p>
              </div>

              {/* Pestañas de Protocolo Táctico: QUÉ HACER / QUÉ NO HACER / EQUIPO */}
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>
                  <button
                    onClick={() => setActiveTab('dos')}
                    className={`pz-switch-tab ${activeTab === 'dos' ? 'active' : ''}`}
                    style={{ fontSize: 13, padding: '8px 16px', color: activeTab === 'dos' ? '#10b981' : '#94a3b8' }}
                  >
                    ✅ Protocolo de Supervivencia (Qué Hacer)
                  </button>
                  <button
                    onClick={() => setActiveTab('donts')}
                    className={`pz-switch-tab ${activeTab === 'donts' ? 'active' : ''}`}
                    style={{ fontSize: 13, padding: '8px 16px', color: activeTab === 'donts' ? '#ef4444' : '#94a3b8' }}
                  >
                    ❌ Errores Fatales (Qué NO Hacer)
                  </button>
                  <button
                    onClick={() => setActiveTab('gear')}
                    className={`pz-switch-tab ${activeTab === 'gear' ? 'active' : ''}`}
                    style={{ fontSize: 13, padding: '8px 16px', color: activeTab === 'gear' ? '#38bdf8' : '#94a3b8' }}
                  >
                    🎒 Equipo Clave
                  </button>
                </div>

                {/* Tab: QUÉ HACER */}
                {activeTab === 'dos' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeEvent.dos.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: '12px 14px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: 4,
                        }}
                      >
                        <span style={{ color: '#10b981', fontWeight: 900, fontSize: 16 }}>✓</span>
                        <span style={{ fontSize: 14, color: '#f1f5f9', lineHeight: 1.5 }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: QUÉ NO HACER */}
                {activeTab === 'donts' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeEvent.donts.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: '12px 14px',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: 4,
                        }}
                      >
                        <span style={{ color: '#ef4444', fontWeight: 900, fontSize: 16 }}>✕</span>
                        <span style={{ fontSize: 14, color: '#fca5a5', lineHeight: 1.5 }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: EQUIPO RECOMENDADO */}
                {activeTab === 'gear' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    {activeEvent.recommendedGear.map((g, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 14px',
                          background: 'rgba(6, 182, 212, 0.08)',
                          border: '1px solid rgba(6, 182, 212, 0.25)',
                          borderRadius: 4,
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8', display: 'block', marginBottom: 4, fontFamily: 'monospace' }}>
                          📦 {g.name}
                        </span>
                        <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 }}>
                          {g.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Directiva Build 42 */}
              {activeEvent.build42Notes && (
                <div style={{ padding: '14px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: 4, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 2 }}>
                      INNOVACIÓN BUILD 42 // FÍSICA Y ACÚSTICA
                    </span>
                    <span style={{ fontSize: 13, color: '#fde68a', lineHeight: 1.5 }}>
                      {activeEvent.build42Notes}
                    </span>
                  </div>
                </div>
              )}

              {/* Botón de cierre ergonómico */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setActiveEvent(null)}
                  className="pz-btn-primary"
                  style={{ minWidth: 160, justifyContent: 'center' }}
                >
                  <span>Entendido // Cerrar Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
