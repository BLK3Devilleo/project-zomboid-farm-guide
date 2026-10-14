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

      {/* CABECERA: CONSOLA DE MANDO Y EMISIONES */}
      <div className="pz-mission-panel">
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#10b981', fontWeight: 900 }}>●</span>
            <span>CONSOLA DE MANDO // SECTOR KNOX COUNTY B42</span>
          </div>
          <span>CANAL RECEPTOR 16261</span>
        </div>

        <div className="hud-hero">
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '3px 10px',
                  borderRadius: 3,
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}
              >
                HUB DEDICADO B42
              </span>
              <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace' }}>
                🟢 {servers.length} Servidores Activos
              </span>
              <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>
                • 👥 {totalPlayers} Supervivientes Jugando
              </span>
            </div>

            <h1
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span>🌐</span>
              <span>Directorio de Servidores Dedicados</span>
            </h1>

            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, margin: 0, maxWidth: 640 }}>
              Directorio oficial de comunidades y refugios de Project Zomboid. Copia la IP en un clic o emite tu propia frecuencia.
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
              className="pz-btn-primary"
            >
              <span>📡 Transmitir Mi Servidor</span>
            </button>
            <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
              {currentUser ? `Operador: ${currentUser.name}` : 'Requiere cuenta de Google verificada'}
            </span>
          </div>
        </div>
      </div>

      {/* RACK DE SINTONIZACIÓN Y FILTROS TÁCTICOS */}
      <div className="pz-mission-panel" style={{ padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#38bdf8', fontWeight: 900 }}>⚡</span>
            <span>ESCÁNER DE RADIOFRECUENCIAS // SINTONIZADOR</span>
          </div>
          <span>B42.18 SCANNER</span>
        </div>

        {/* Input de Búsqueda Grande y Legible */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Escanear por nombre de servidor, IP, mod o tag (Sprinters, RP, Brita)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pz-scanner-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Switches de Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          {/* Modos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              Modo:
            </span>
            {['ALL', 'Roleplay', 'PvP', 'PvE', 'Hardcore'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`pz-switch-tab ${selectedMode === m ? 'active' : ''}`}
              >
                {m === 'ALL' ? 'Todos' : m}
              </button>
            ))}
          </div>

          {/* Región */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              Región:
            </span>
            {['ALL', 'LATAM', 'España', 'NA'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`pz-switch-tab ${selectedRegion === r ? 'active' : ''}`}
              >
                {r === 'ALL' ? 'Todas' : r}
              </button>
            ))}
          </div>

          {/* Orden */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              Ordenar:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="form-input"
              style={{ padding: '8px 14px', fontSize: 13, width: 'auto', minHeight: 38 }}
            >
              <option value="votes">⭐ Más Votados</option>
              <option value="players">👥 Más Jugadores</option>
            </select>
          </div>
        </div>
      </div>

      {/* LISTADO DE TARJETAS O ESTADO VACÍO */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#10b981', fontFamily: 'monospace', fontSize: 15, fontWeight: 800 }}>
          📡 ESCANEANDO SEÑALES EN EL CONDADO DE KNOX...
        </div>
      ) : filteredServers.length === 0 ? (
        <div className="pz-mission-panel" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div className="pz-mission-bar">
            <span>TELEMETRÍA DE RED</span>
            <span style={{ color: '#ef4444' }}>● SILENCIO DE RADIO</span>
          </div>

          <span style={{ fontSize: 44, display: 'block', marginTop: 10 }}>📡</span>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
            SILENCIO DE RADIO EN EL CONDADO DE KNOX
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, maxWidth: 580, lineHeight: 1.6 }}>
            No se reciben emisiones en esta banda. Si tienes una base fortificada o un refugio comunitario, sé el primero en transmitir tu frecuencia para guiar a los supervivientes.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                if (!currentUser) {
                  showToast('Debes iniciar sesión con Google para enlistar un servidor.');
                  onOpenLoginModal();
                  return;
                }
                setShowAddModal(true);
              }}
              className="pz-btn-primary"
            >
              <span>📡 Iniciar Transmisión de Refugio</span>
            </button>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedMode('ALL');
                setSelectedRegion('ALL');
                setSelectedLoot('ALL');
              }}
              className="pz-btn-secondary"
            >
              Restablecer Filtros
            </button>
          </div>
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
