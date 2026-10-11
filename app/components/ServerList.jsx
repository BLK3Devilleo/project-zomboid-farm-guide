'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { fetchServersList, createServerEntry, upvoteServerEntry } from '../lib/supabaseClient';
import ServerDetailModal from './ServerDetailModal';
import AddServerModal from './AddServerModal';

export default function ServerList({ currentUser = null, onOpenLoginModal = () => {} }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedLoot, setSelectedLoot] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('votes'); // 'votes' | 'players'
  
  const [activeModalServer, setActiveModalServer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Carga inicial
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchServersList();
      setServers(data);
      setLoading(false);
    }
    load();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Copiar IP
  const handleCopyIP = (e, server) => {
    e.stopPropagation();
    const address = `${server.ip}:${server.port || 16261}`;
    try {
      navigator.clipboard.writeText(address);
      showToast(`¡IP ${address} copiada al portapapeles!`);
    } catch (err) {
      showToast(`IP: ${address}`);
    }
  };

  // Votar por un servidor
  const handleVote = async (e, serverId) => {
    if (e) e.stopPropagation();
    // Actualización optimista
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, votes: (s.votes || 0) + 1 } : s))
    );
    if (activeModalServer && activeModalServer.id === serverId) {
      setActiveModalServer((prev) => ({ ...prev, votes: (prev.votes || 0) + 1 }));
    }
    showToast('¡Voto registrado! +1 Reputación');
    await upvoteServerEntry(serverId);
  };

  // Crear nuevo servidor
  const handleAddServer = async (serverData) => {
    const created = await createServerEntry(serverData);
    setServers((prev) => [created, ...prev]);
    showToast('¡Servidor publicado con éxito en el ranking!');
  };

  // Filtrado y ordenación
  const filteredServers = useMemo(() => {
    return servers
      .filter((s) => {
        const matchesSearch =
          searchQuery === '' ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (s.tags && s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesMode = selectedMode === 'ALL' || s.mode === selectedMode;
        const matchesLoot = selectedLoot === 'ALL' || s.loot_tier === selectedLoot;
        const matchesRegion = selectedRegion === 'ALL' || s.region === selectedRegion;

        return matchesSearch && matchesMode && matchesLoot && matchesRegion;
      })
      .sort((a, b) => {
        if (selectedSort === 'players') {
          return (b.players_online || 0) - (a.players_online || 0);
        }
        return (b.votes || 0) - (a.votes || 0);
      });
  }, [servers, searchQuery, selectedMode, selectedLoot, selectedRegion, selectedSort]);

  // Contadores globales
  const totalPlayers = servers.reduce((acc, s) => acc + (s.players_online || 0), 0);

  return (
    <div className="hud-container">
      {/* TOAST DE FEEDBACK */}
      {toastMessage && (
        <div className="server-toast">
          {toastMessage}
        </div>
      )}

      {/* CABECERA HERO DEL HUB */}
      <div className="hud-panel">
        <div className="hud-hero">
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}
              >
                HUB DEDICADO B42
              </span>
              <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 700 }}>
                🟢 {servers.length} Servidores Activos
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                • 👥 {totalPlayers} Supervivientes Jugando
              </span>
            </div>

            <h1
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span>🌐</span>
              <span>Ranking de Servidores Dedicados</span>
            </h1>

            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: 0, maxWidth: 580 }}>
              Descubre y conéctate a las mejores comunidades de Project Zomboid en español y global. Filtra por estilo de juego, copia la IP con un clic y vota por tu server favorito.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <button
              onClick={() => {
                if (!currentUser) {
                  showToast('Debes iniciar sesión con Google para enlistar un servidor.');
                  onOpenLoginModal();
                  return;
                }
                setShowAddModal(true);
              }}
              className="btn-tactical"
              style={{ padding: '12px 22px', fontSize: 13 }}
            >
              <span>➕ Enlistar Mi Servidor</span>
            </button>
            <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
              {currentUser ? `Autenticado como ${currentUser.name}` : 'Requiere cuenta de Google verificada'}
            </span>
          </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS TÁCTICOS */}
      <div className="hud-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Input de Búsqueda */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre de servidor, IP, mod o tag (ej: Sprinters, RP, Brita)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 16, fontSize: 13 }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Chips de Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          {/* Modos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginRight: 4 }}>
              Modo:
            </span>
            {['ALL', 'Roleplay', 'PvP', 'PvE', 'Hardcore'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`filter-chip ${selectedMode === m ? 'active' : ''}`}
              >
                {m === 'ALL' ? 'Todos' : m}
              </button>
            ))}
          </div>

          {/* Región */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginRight: 4 }}>
              Región:
            </span>
            {['ALL', 'LATAM', 'España', 'NA'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`filter-chip ${selectedRegion === r ? 'active' : ''}`}
              >
                {r === 'ALL' ? 'Todas' : r}
              </button>
            ))}
          </div>

          {/* Orden */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              Ordenar:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="form-input"
              style={{ padding: '4px 10px', fontSize: 11, width: 'auto' }}
            >
              <option value="votes">⭐ Más Votados</option>
              <option value="players">👥 Más Jugadores</option>
            </select>
          </div>
        </div>
      </div>

      {/* LISTADO DE TARJETAS DE SERVIDORES */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#10b981', fontFamily: 'monospace' }}>
          CARGANDO DIRECTORIO DE SERVIDORES...
        </div>
      ) : filteredServers.length === 0 ? (
        <div className="hud-panel" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>📡</span>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
            No se encontraron servidores con estos filtros
          </h3>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
            Prueba a restablecer los filtros de búsqueda o sé el primero en enlistar tu servidor.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMode('ALL');
              setSelectedRegion('ALL');
              setSelectedLoot('ALL');
            }}
            className="btn-secondary"
            style={{ marginTop: 16 }}
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredServers.map((server, index) => {
            const rank = index + 1;
            const fullAddress = `${server.ip}:${server.port || 16261}`;
            
            // Determinar clase temática de modo
            const modeLower = (server.mode || 'pve').toLowerCase();
            const modeClass = modeLower.includes('hardcore')
              ? 'mode-hardcore'
              : modeLower.includes('roleplay')
              ? 'mode-roleplay'
              : modeLower.includes('pvp')
              ? 'mode-pvp'
              : 'mode-pve';

            // Cálculo de VU-Meter (8 segmentos)
            const occupancyRatio = (server.players_online || 0) / (server.max_players || 32);
            const activeSegments = Math.min(8, Math.max(1, Math.round(occupancyRatio * 8)));

            // Título de estatus según modo
            const statusLabel = modeClass === 'mode-hardcore'
              ? 'PELIGRO // SPRINTERS'
              : modeClass === 'mode-roleplay'
              ? 'RADIO COMUNIDAD'
              : modeClass === 'mode-pvp'
              ? 'ZONA HOSTIL // RAID'
              : 'REFUGIO SEGURO';

            return (
              <div
                key={server.id}
                onClick={() => setActiveModalServer(server)}
                className={`server-card-item ${modeClass}`}
              >
                {/* Cantoneras tácticas */}
                <div className="pz-corner-tick tl" />
                <div className="pz-corner-tick tr" />
                <div className="pz-corner-tick bl" />
                <div className="pz-corner-tick br" />

                {/* Barra superior de ventana estilo terminal */}
                <div className="pz-window-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#10b981', fontWeight: 900 }}>●</span>
                    <span style={{ color: '#94a3b8' }}>
                      KNOX FREQ-0{rank} // [{statusLabel}]
                    </span>
                  </div>
                  <div className="pz-window-controls">
                    <span className="pz-window-btn">_</span>
                    <span className="pz-window-btn">□</span>
                    <span className="pz-window-btn close">✕</span>
                  </div>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="server-card-body">
                  {/* LADO IZQUIERDO: RANGO + ICONO + INFO */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
                    {/* Badge de Posición en Ranking */}
                    <div className={`server-rank-badge rank-${rank <= 3 ? rank : 'normal'}`}>
                      <span style={{ fontSize: 9, opacity: 0.8, letterSpacing: '0.05em' }}>
                        {rank === 1 ? 'TOP' : rank === 2 ? 'VAN' : rank === 3 ? 'OUT' : 'SEC'}
                      </span>
                      <span style={{ fontSize: 16 }}>#{rank}</span>
                    </div>

                    {/* Icono / Banner */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 4,
                        background: 'rgba(0, 0, 0, 0.65)',
                        border: '1.5px solid rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={server.banner_url || '/spiffo/spiffo_character.png'}
                        alt={server.name}
                        width={34}
                        height={34}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>

                    {/* Info Principal */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span className="server-badge-mode">{server.mode}</span>
                        <span className="server-badge-region">🌍 {server.region}</span>
                        <span className="server-badge-loot">📦 {server.loot_tier}</span>

                        {/* VU-Meter de Capacidad de Supervivientes */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                          <div className="pz-vu-meter" title={`Ocupación: ${server.players_online}/${server.max_players}`}>
                            {[...Array(8)].map((_, i) => {
                              const isActive = i < activeSegments;
                              let segmentColor = '';
                              if (isActive) {
                                if (i >= 6) segmentColor = 'active-red';
                                else if (i >= 4) segmentColor = 'active-yellow';
                                else segmentColor = 'active-green';
                              }
                              return (
                                <div
                                  key={i}
                                  className={`pz-vu-segment ${segmentColor}`}
                                />
                              );
                            })}
                          </div>
                          <span style={{ fontSize: 11, color: '#f1f5f9', fontWeight: 900, fontFamily: 'monospace' }}>
                            {server.players_online}/{server.max_players}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: 17, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.01em', fontFamily: 'monospace' }}>
                        {server.name}
                      </h3>

                      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {server.description}
                      </p>
                    </div>
                  </div>

                  {/* LADO DERECHO: TELEMETRÍA DE AUDIO + FRECUENCIA IP + VOTOS */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* Telemetría de onda de audio */}
                    <div className="pz-audio-bar-row" style={{ color: modeClass === 'mode-hardcore' ? '#ef4444' : modeClass === 'mode-roleplay' ? '#f59e0b' : '#10b981' }}>
                      {[8, 14, 5, 12, 10, 6, 13, 9].map((h, idx) => (
                        <div key={idx} className="pz-audio-bar" style={{ height: h }} />
                      ))}
                    </div>

                    {/* Botón Copiar Frecuencia / IP */}
                    <div
                      onClick={(e) => handleCopyIP(e, server)}
                      className="server-ip-btn"
                      title="Copiar Frecuencia de Conexión"
                    >
                      <span>📻 FREQ</span>
                      <span>{fullAddress}</span>
                    </div>

                    {/* Botón de Votar */}
                    <button
                      onClick={(e) => handleVote(e, server.id)}
                      className="server-vote-btn"
                      title="Votar por este servidor"
                    >
                      <span>⭐</span>
                      <span>{server.votes || 0}</span>
                    </button>

                    {/* Ver Ficha Dossier */}
                    <button
                      onClick={() => setActiveModalServer(server)}
                      className="btn-tactical"
                      style={{ padding: '6px 14px', fontSize: 11, borderRadius: 3 }}
                    >
                      Dossier →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE DETALLE DE SERVIDOR */}
      {activeModalServer && (
        <ServerDetailModal
          server={activeModalServer}
          onClose={() => setActiveModalServer(null)}
          onVote={(id) => handleVote(null, id)}
        />
      )}

      {/* MODAL DE ENLISTAR NUEVO SERVIDOR */}
      {showAddModal && (
        <AddServerModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddServer}
        />
      )}
    </div>
  );
}
