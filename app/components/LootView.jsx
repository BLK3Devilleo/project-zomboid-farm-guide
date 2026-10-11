'use client';

import React, { useState, useMemo } from 'react';
import { lootDatabase } from '../data/lootDatabase';

export default function LootView({ selectedCategory = 'all', onSelectRoute }) {
  const [activeTabByCard, setActiveTabByCard] = useState({});
  const [checkedGear, setCheckedGear] = useState({});
  const [filterCat, setFilterCat] = useState(selectedCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Cambiar pestaña interna de una tarjeta específica
  const handleTabChange = (cardId, tab) => {
    setActiveTabByCard((prev) => ({ ...prev, [cardId]: tab }));
  };

  // Checkbox de preparación táctica por tarjeta
  const toggleGearCheck = (gearKey) => {
    setCheckedGear((prev) => ({ ...prev, [gearKey]: !prev[gearKey] }));
  };

  // Categorías únicas para filtro rápido
  const categories = useMemo(() => {
    const list = Array.from(new Set(lootDatabase.map((item) => item.category)));
    return ['all', ...list];
  }, []);

  // Filtrado por categoría y búsqueda
  const filteredLoot = useMemo(() => {
    return lootDatabase.filter((item) => {
      const matchesCat = filterCat === 'all' || item.category === filterCat || item.id === filterCat;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.whatToLookFor.some((w) => w.toLowerCase().includes(q)) ||
        item.whereToFind.some((loc) => loc.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [filterCat, searchQuery]);

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* CABECERA MILITAR DE RADAR */}
      <div className="loot-hero-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="loot-hero-badge">RADAR DE INCURSIONES KNOX B42</span>
              <span style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>
                ● {filteredLoot.length} Puntos de Interés Registrados
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
              Botín y Saqueo Táctico de Kentucky
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0', maxWidth: 640 }}>
              Prioridades de búsqueda, rutas seguras de escape y listas de verificación táctica para no morir acorralado.
            </p>
          </div>

          {/* Búsqueda en Vivo */}
          <div style={{ minWidth: 260, flex: 1, maxWidth: 360 }}>
            <input
              type="text"
              placeholder="🔍 Buscar objeto, medicina, arma o zona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ fontSize: 12, padding: '8px 14px' }}
            />
          </div>
        </div>

        {/* CHIPS DE FILTRO RÁPIDO */}
        <div className="loot-filter-scroll">
          {categories.map((cat) => {
            const isActive = filterCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`filter-chip ${isActive ? 'active' : ''}`}
                style={{ fontSize: 11, whiteSpace: 'nowrap' }}
              >
                {cat === 'all' ? '🗺️ Todas las Zonas' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* GRID DE TARJETAS DINÁMICAS */}
      {filteredLoot.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(9, 14, 27, 0.7)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>📡</span>
          <h3 style={{ color: '#fff', fontSize: 16, margin: '0 0 6px', fontFamily: 'monospace' }}>
            No hay puntos de interés que coincidan con la búsqueda
          </h3>
          <button
            onClick={() => { setSearchQuery(''); setFilterCat('all'); }}
            className="btn-secondary"
            style={{ fontSize: 11, marginTop: 10 }}
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredLoot.map((item) => {
            const currentTab = activeTabByCard[item.id] || 'loot';
            const isHighRisk = item.riskLevel.includes('Alto');
            const isMediumRisk = item.riskLevel.includes('Medio');

            return (
              <div
                key={item.id}
                className={`loot-card ${isHighRisk ? 'risk-high' : isMediumRisk ? 'risk-med' : 'risk-low'}`}
              >
                {/* Cantoneras tácticas */}
                <div className="pz-corner-tick tl" />
                <div className="pz-corner-tick tr" />
                <div className="pz-corner-tick bl" />
                <div className="pz-corner-tick br" />

                {/* CABECERA DE LA TARJETA */}
                <div className="loot-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="loot-card-icon-box">
                      <span style={{ fontSize: 26 }}>{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="loot-card-title">{item.title}</h3>
                      <span className="loot-card-category">{item.category}</span>
                    </div>
                  </div>

                  {/* Badge de Riesgo Dinámico */}
                  <div className={`loot-risk-pill ${isHighRisk ? 'high' : isMediumRisk ? 'med' : 'low'}`}>
                    <span className="loot-risk-dot" />
                    <span>Riesgo {item.riskLevel}</span>
                  </div>
                </div>

                {/* CUÁNDO IR: BRIEFING TÁCTICO */}
                <div className="loot-timing-box">
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
                    ⏱️ VENTANA TÁCTICA:
                  </span>
                  <span style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.4 }}>
                    {item.whenToGo}
                  </span>
                </div>

                {/* SELECTOR DE PESTAÑAS INTERNAS DE LA TARJETA */}
                <div className="loot-tab-bar">
                  <button
                    onClick={() => handleTabChange(item.id, 'loot')}
                    className={`loot-tab-btn ${currentTab === 'loot' ? 'active' : ''}`}
                  >
                    💎 Botín ({item.whatToLookFor.length})
                  </button>
                  <button
                    onClick={() => handleTabChange(item.id, 'locations')}
                    className={`loot-tab-btn ${currentTab === 'locations' ? 'active' : ''}`}
                  >
                    📍 Ubicaciones ({item.whereToFind.length})
                  </button>
                  <button
                    onClick={() => handleTabChange(item.id, 'gear')}
                    className={`loot-tab-btn ${currentTab === 'gear' ? 'active' : ''}`}
                  >
                    🎒 Checklist ({item.recommendedGear.length})
                  </button>
                  <button
                    onClick={() => handleTabChange(item.id, 'tips')}
                    className={`loot-tab-btn ${currentTab === 'tips' ? 'active' : ''}`}
                  >
                    ⚠️ Alertas
                  </button>
                </div>

                {/* CONTENIDO SEGÚN PESTAÑA ACTIVA */}
                <div className="loot-tab-content">
                  {/* PESTAÑA 1: BOTÍN CLAVE EN CHIPS DE INVENTARIO */}
                  {currentTab === 'loot' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                        OBJETOS PRIORITARIOS A SAQUEAR:
                      </span>
                      <div className="loot-chips-grid">
                        {item.whatToLookFor.map((obj, i) => (
                          <div key={i} className="loot-item-chip">
                            <span className="loot-chip-bullet">✦</span>
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA 2: UBICACIONES Y WAYPOINTS */}
                  {currentTab === 'locations' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                        COORDENADAS Y EDIFICIOS CLAVE:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {item.whereToFind.map((loc, i) => (
                          <div key={i} className="loot-waypoint-row">
                            <span style={{ color: '#f59e0b', fontSize: 13 }}>📍</span>
                            <span style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.4 }}>{loc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA 3: CHECKLIST DE EQUIPO INTERACTIVO */}
                  {currentTab === 'gear' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                        LISTA DE EQUIPAMIENTO RECOMENDADO:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {item.recommendedGear.map((gear, i) => {
                          const gearKey = `${item.id}-gear-${i}`;
                          const isDone = Boolean(checkedGear[gearKey]);
                          return (
                            <div
                              key={i}
                              onClick={() => toggleGearCheck(gearKey)}
                              className={`loot-gear-item ${isDone ? 'checked' : ''}`}
                            >
                              <div className={`loot-gear-checkbox ${isDone ? 'checked' : ''}`}>
                                {isDone ? '✓' : ''}
                              </div>
                              <span style={{ fontSize: 12, color: isDone ? '#94a3b8' : '#e2e8f0', textDecoration: isDone ? 'line-through' : 'none' }}>
                                {gear}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA 4: TIPS Y PROTOCOLO DE PELIGRO */}
                  {currentTab === 'tips' && (
                    <div className="loot-advisory-box">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ color: '#fbbf24', fontSize: 12 }}>⚠️</span>
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                          SEÑALES DE ALERTA Y REGLAS DE ESCAPE
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {item.tacticalTips.map((tip, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <span style={{ color: '#f59e0b', fontSize: 11 }}>•</span>
                            <span style={{ fontSize: 11, color: '#fde68a', lineHeight: 1.4 }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* PIE DE TARJETA CON RUTA ASOCIADA */}
                {item.relatedRoutes && item.relatedRoutes.length > 0 && onSelectRoute && (
                  <div className="loot-card-footer">
                    <button
                      onClick={() => onSelectRoute(item.relatedRoutes[0])}
                      className="loot-route-link"
                    >
                      <span>🗺️ Sintonizar Ruta de Supervivencia</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
