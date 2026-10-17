'use client';

import React, { useState, useMemo } from 'react';
import { lootZoneTypes, MAP_REGIONS } from '../data/lootDatabase';
import { useTacticalModal } from '../hooks/useTacticalModal';
import {
  CrosshairIcon,
  BackpackIcon,
  RadarServerIcon,
  HazardIcon,
  ShieldAdminIcon,
  SignalPulseIcon,
  VoteIcon,
  CloseCrossIcon,
  WrenchIcon,
  MedicalCrossIcon,
  CheckIcon,
} from './icons/KnoxIcons';

export default function LootView({ onSelectRoute }) {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPoi, setExpandedPoi] = useState({});
  const [savedPois, setSavedPois] = useState({});

  // Modal para registrar una baliza GPS personalizada
  const [beaconModalOpen, setBeaconModalOpen] = useState(false);
  const { modalContainerProps } = useTacticalModal(beaconModalOpen, () => setBeaconModalOpen(false));
  const [customBeacons, setCustomBeacons] = useState([]);
  const [beaconName, setBeaconName] = useState('');
  const [beaconCity, setBeaconCity] = useState('Rosewood');
  const [beaconDesc, setBeaconDesc] = useState('');

  const categories = [
    { id: 'ALL', label: 'Todas las Zonas' },
    { id: 'Militar', label: 'Militar & Armamento' },
    { id: 'Herramientas', label: 'Herramientas & Forja B42' },
    { id: 'Médica', label: 'Clínicas & Farmacia' },
    { id: 'Alimentos', label: 'Supermercados & Comida' },
    { id: 'Automotriz', label: 'Talleres & Gasolineras' },
    { id: 'Residencial', label: 'Residencial & Libros' },
  ];

  // Filtrado reactivo de POIs
  const filteredPois = useMemo(() => {
    return lootZoneTypes.filter((poi) => {
      // Filtro de región/ciudad
      if (selectedRegion !== 'ALL' && !poi.cities.includes(selectedRegion)) {
        return false;
      }
      // Filtro de categoría
      if (selectedCategory !== 'ALL' && poi.category !== selectedCategory) {
        return false;
      }
      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = poi.title.toLowerCase().includes(q);
        const matchDesc = poi.zoneBadge.toLowerCase().includes(q);
        const matchLoc = poi.knownLocations.some((l) =>
          l.location.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)
        );
        return matchTitle || matchDesc || matchLoc;
      }
      return true;
    });
  }, [selectedRegion, selectedCategory, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedPoi((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSavePoi = (id) => {
    setSavedPois((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateBeacon = (e) => {
    e.preventDefault();
    if (!beaconName.trim()) return;

    const newBeacon = {
      id: `custom-${Date.now()}`,
      category: 'Personalizado',
      title: beaconName.trim(),
      zoneBadge: 'BALIZA DE CAMPO SUPERVIVIENTE',
      threatLevel: 'Variable',
      threatColor: '#10b981',
      alarmRisk: 'Desconocido',
      cities: [beaconCity],
      knownLocations: [{ city: beaconCity, location: beaconDesc.trim() || 'Coordenadas marcadas en PDA' }],
      targetContainers: [{ container: 'Alijo Táctico Personal', probability: '100%', lootTypes: 'Recursos almacenados por el operador' }],
      tacticalBreach: ['Punto seguro fijado por el usuario.'],
      disclaimer: 'Marcador personalizado de supervivencia en memoria local.',
    };

    setCustomBeacons([newBeacon, ...customBeacons]);
    setBeaconName('');
    setBeaconDesc('');
    setBeaconModalOpen(false);
  };

  const allVisiblePois = [...customBeacons, ...filteredPois];

  return (
    <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. HERO DIEGÉTICO */}
      <div className="pz-mission-panel" style={{ padding: '24px 28px' }}>
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SignalPulseIcon size={14} color="#10b981" />
            <span>RADAR TÁCTICO // RECONOCIMIENTO DE POIs & ZONAS DE BOTÍN</span>
          </div>
          <span>B42 HEURISTIC SCANNER</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 280 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 10 }}>
              <BackpackIcon size={26} color="#10b981" />
              <span>Loot Points & Zonas de Saqueo</span>
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 660, lineHeight: 1.5 }}>
              Inteligencia predictiva de arquitectura y contenedores de Project Zomboid Build 42. Consulta probabilidades heurísticas según la tipología de edificio y ciudad sin promesas falsas de botín fijo garantizado.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setBeaconModalOpen(true)}
            className="pz-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <RadarServerIcon size={16} color="currentColor" />
            <span>+ Fijar Baliza GPS</span>
          </button>
        </div>
      </div>

      {/* 2. SELECTOR DE CIUDAD / MAPA & FILTROS */}
      <div className="pz-mission-panel" style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Selector de Ciudad/Región */}
        <div>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
            SECTOR / MAPA DEL CONDADO DE KNOX
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {MAP_REGIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => setSelectedRegion(region.id)}
                className={`pz-switch-tab ${selectedRegion === region.id ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: 12 }}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Buscador y Categorías */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          {/* Categorías */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1, minWidth: 260 }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`pz-switch-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                style={{ padding: '5px 12px', fontSize: 11 }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div style={{ position: 'relative', width: 260 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar zona, contenedor o ciudad..."
              className="pz-scanner-input"
              style={{ padding: '6px 12px', fontSize: 12 }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <CloseCrossIcon size={12} color="#94a3b8" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. LISTADO DE ZONAS Y POIs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {allVisiblePois.length === 0 ? (
          <div className="pz-mission-panel" style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <RadarServerIcon size={36} color="#64748b" style={{ display: 'block', margin: '0 auto 10px' }} />
            <strong style={{ color: '#ffffff', display: 'block', fontSize: 16, fontFamily: 'monospace' }}>
              NO SE DETECTAN ZONAS CON ESTOS PARÁMETROS
            </strong>
            <p style={{ fontSize: 13, marginTop: 4 }}>
              Intenta seleccionar "Todo Knox" o restablecer los filtros de búsqueda.
            </p>
          </div>
        ) : (
          allVisiblePois.map((poi) => {
            const isExpanded = Boolean(expandedPoi[poi.id]);
            const isSaved = Boolean(savedPois[poi.id]);

            return (
              <div key={poi.id} className="pz-mission-panel" style={{ padding: '20px 24px' }}>
                {/* Cabecera de la Tarjeta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontFamily: 'monospace', fontWeight: 800 }}>
                        {poi.zoneBadge}
                      </span>
                      <span style={{ fontSize: 11, color: poi.threatColor || '#f59e0b', fontFamily: 'monospace', fontWeight: 800 }}>
                        Amenaza: {poi.threatLevel}
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                        Alarma: {poi.alarmRisk}
                      </span>
                    </div>

                    <h2 style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', margin: '4px 0 0', fontFamily: 'monospace' }}>
                      {poi.title}
                    </h2>
                  </div>

                  {/* Botones de Acción */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => toggleSavePoi(poi.id)}
                      className={`server-vote-btn ${isSaved ? 'voted' : ''}`}
                      style={{ fontSize: 12, padding: '6px 12px' }}
                      title="Guardar en GPS de campo"
                    >
                      <VoteIcon size={12} color={isSaved ? '#eab308' : '#94a3b8'} />
                      <span>{isSaved ? 'EN GPS' : 'GUARDAR'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(poi.id)}
                      className="pz-btn-secondary"
                      style={{ fontSize: 12, padding: '6px 14px' }}
                    >
                      {isExpanded ? '[-] Menos Intel' : '[+] Desplegar Intel'}
                    </button>
                  </div>
                </div>

                {/* Ubicaciones Conocidas en el Sector */}
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                    EDIFICIOS CANÓNICOS DETECTADOS POR SECTOR
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {poi.knownLocations
                      .filter((l) => selectedRegion === 'ALL' || l.city === selectedRegion)
                      .map((loc, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
                          <span style={{ color: '#10b981', fontFamily: 'monospace' }}>• [{loc.city}]</span>
                          <span>{loc.location}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Detalle Expandido: Contenedores y Probabilidad */}
                {isExpanded && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Tabla de Contenedores */}
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#10b981', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                        CONTENEDORES PRIORITARIOS & PROBABILIDAD DE SPAWN
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                        {poi.targetContainers.map((tc, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 4,
                              background: 'rgba(15, 23, 42, 0.7)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: 12, color: '#f8fafc' }}>{tc.container}</strong>
                              <span style={{ fontSize: 11, color: '#34d399', fontFamily: 'monospace', fontWeight: 800 }}>
                                {tc.probability}
                              </span>
                            </div>
                            <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>
                              Botín: {tc.lootTypes}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Protocolo de Brecha y Entrada */}
                    <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: 4, padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                        TÁCTICA DE ACCESO & SEGURIDAD
                      </span>
                      <ul style={{ margin: 0, paddingLeft: 16, color: '#cbd5e1', fontSize: 12, lineHeight: 1.5 }}>
                        {poi.tacticalBreach.map((tb, idx) => (
                          <li key={idx}>{tb}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Disclaimer de Sandbox */}
                    <span style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', fontFamily: 'monospace' }}>
                      * {poi.disclaimer}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL PARA REGISTRAR BALIZA GPS */}
      {beaconModalOpen && (
        <div className="server-modal-backdrop" onClick={() => setBeaconModalOpen(false)}>
          <div className="radar-modal-box" onClick={(e) => e.stopPropagation()} {...modalContainerProps}>
            <div className="radar-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RadarServerIcon size={18} color="#10b981" />
                <span style={{ fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                  REGISTRAR BALIZA TÁCTICA EN GPS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBeaconModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                aria-label="Cerrar modal"
              >
                <CloseCrossIcon size={16} color="#94a3b8" />
              </button>
            </div>

            <form onSubmit={handleCreateBeacon} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Nombre del Refugio o Alijo</label>
                <input
                  type="text"
                  required
                  value={beaconName}
                  onChange={(e) => setBeaconName(e.target.value)}
                  placeholder="Ej: Base en Almacén Norte con Generador"
                  className="pz-scanner-input"
                />
              </div>

              <div>
                <label className="form-label">Ciudad / Sector</label>
                <select
                  value={beaconCity}
                  onChange={(e) => setBeaconCity(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                >
                  <option value="Rosewood">Rosewood</option>
                  <option value="West Point">West Point</option>
                  <option value="Muldraugh">Muldraugh</option>
                  <option value="Riverside">Riverside</option>
                  <option value="Louisville">Louisville</option>
                </select>
              </div>

              <div>
                <label className="form-label">Descripción y Recursos Asegurados</label>
                <textarea
                  rows={3}
                  value={beaconDesc}
                  onChange={(e) => setBeaconDesc(e.target.value)}
                  placeholder="Ej: 2 bidones de combustible, comida enlatada, puerta barreada..."
                  className="pz-scanner-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setBeaconModalOpen(false)}
                  className="pz-btn-secondary"
                  style={{ fontSize: 12, padding: '8px 16px' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="pz-btn-primary"
                  style={{ fontSize: 12, padding: '8px 18px' }}
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
