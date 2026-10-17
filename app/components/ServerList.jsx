'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { fetchServersList, createServerEntry, updateServerEntry, deleteServerEntry, upvoteServerEntry } from '../lib/supabaseClient';
import ServerDetailModal from './ServerDetailModal';
import AddServerModal from './AddServerModal';
import { serverEvents } from '../data/eventsDatabase';
import {
  SignalPulseIcon,
  UserProfileIcon,
  RadarServerIcon,
  RadioAntennaIcon,
  VoteIcon,
  WrenchIcon,
  HazardIcon,
  CloseCrossIcon,
  BackpackIcon,
} from './icons/KnoxIcons';

export default function ServerList({
  currentUser = null,
  onOpenLoginModal = () => {},
  serverToEdit = null,
  onClearServerToEdit = () => {},
}) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedLoot, setSelectedLoot] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('votes'); // 'votes' | 'players'
  
  const [activeModalServer, setActiveModalServer] = useState(null);
  const [showEventsBoard, setShowEventsBoard] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Apertura externa para edición (desde ProfileModal)
  useEffect(() => {
    if (serverToEdit) {
      setEditingServer(serverToEdit);
      setShowAddModal(true);
      onClearServerToEdit();
    }
  }, [serverToEdit, onClearServerToEdit]);

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

  // Crear o actualizar servidor (CRUD)
  const handleSaveServer = async (serverData, serverId) => {
    if (serverId) {
      const updated = await updateServerEntry(serverId, serverData);
      setServers((prev) => prev.map((s) => (s.id === serverId ? { ...s, ...updated } : s)));
      if (activeModalServer && activeModalServer.id === serverId) {
        setActiveModalServer((prev) => ({ ...prev, ...updated }));
      }
      showToast('¡Frecuencia militar actualizada con éxito!');
    } else {
      const created = await createServerEntry(serverData);
      setServers((prev) => [created, ...prev]);
      showToast('¡Servidor publicado con éxito en el ranking!');
    }
    setEditingServer(null);
    setShowAddModal(false);
  };

  // Eliminar servidor
  const handleDeleteServer = async (serverId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este servidor del ranking?')) return;
    try {
      await deleteServerEntry(serverId);
      setServers((prev) => prev.filter((s) => s.id !== serverId));
      if (activeModalServer && activeModalServer.id === serverId) {
        setActiveModalServer(null);
      }
      showToast('Servidor eliminado correctamente.');
    } catch (err) {
      showToast(err.message || 'Error al eliminar servidor.');
    }
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
              <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <SignalPulseIcon size={12} color="#10b981" />
                <span>{servers.length} Servidores Activos</span>
              </span>
              <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                • <UserProfileIcon size={13} color="#94a3b8" />
                <span>{totalPlayers} Supervivientes Jugando</span>
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
              <RadarServerIcon size={28} color="#38bdf8" />
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <RadioAntennaIcon size={16} color="currentColor" />
              <span>Transmitir Mi Servidor</span>
            </button>
            <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
              {currentUser ? `Operador: ${currentUser.name}` : 'Requiere cuenta de Google verificada'}
            </span>
          </div>
        </div>
      </div>

      {/* CARTEL DE ANUNCIOS DE EVENTOS Y DIRECTIVAS GLOBALES */}
      <div className="pz-mission-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HazardIcon size={14} color="#f59e0b" />
            <span>TABLÓN MILITAR DE ANUNCIOS // EVENTOS DE SERVIDORES</span>
          </div>
          <button
            type="button"
            onClick={() => setShowEventsBoard(!showEventsBoard)}
            style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', fontWeight: 800 }}
          >
            {showEventsBoard ? '[-] COLAPSAR ANUNCIOS' : '[+] EXPANDIR ANUNCIOS'}
          </button>
        </div>

        {showEventsBoard && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {serverEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 6,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  position: 'relative',
                  borderTop: evt.urgency === 'CRÍTICA' || evt.urgency === 'PELIGRO MÁXIMO' ? '3px solid #ef4444' : '3px solid #38bdf8',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(239, 68, 68, 0.15)', color: evt.urgency === 'CRÍTICA' ? '#fca5a5' : '#38bdf8', fontFamily: 'monospace', fontWeight: 800 }}>
                    {evt.type}
                  </span>
                  <span style={{ fontSize: 10, color: '#10b981', fontFamily: 'monospace' }}>
                    {evt.status}
                  </span>
                </div>

                <strong style={{ fontSize: 13, color: '#ffffff', fontFamily: 'monospace', lineHeight: 1.3 }}>
                  {evt.title}
                </strong>

                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  {evt.description}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                    {evt.frequency}
                  </span>
                  <span style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700 }}>
                    {evt.dateDisplay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RACK DE SINTONIZACIÓN Y FILTROS TÁCTICOS */}
      <div className="pz-mission-panel" style={{ padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HazardIcon size={14} color="#38bdf8" />
            <span>ESCÁNER DE RADIOFRECUENCIAS // SINTONIZADOR</span>
          </div>
          <span>B42.18 SCANNER</span>
        </div>

        {/* Input de Búsqueda Grande y Legible */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Escanear por nombre de servidor, IP, mod o tag (Sprinters, RP, Brita)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pz-scanner-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              aria-label="Borrar búsqueda"
            >
              <CloseCrossIcon size={14} color="#94a3b8" />
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
              <option value="votes">Más Votados</option>
              <option value="players">Más Jugadores</option>
            </select>
          </div>
        </div>
      </div>

      {/* LISTADO DE TARJETAS O ESTADO VACÍO */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#10b981', fontFamily: 'monospace', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <SignalPulseIcon size={20} color="#10b981" />
          <span>ESCANEANDO SEÑALES EN EL CONDADO DE KNOX...</span>
        </div>
      ) : filteredServers.length === 0 ? (
        <div className="pz-mission-panel" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div className="pz-mission-bar">
            <span>TELEMETRÍA DE RED</span>
            <span style={{ color: '#ef4444' }}>● SILENCIO DE RADIO</span>
          </div>

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
            <RadarServerIcon size={44} color="#64748b" />
          </div>
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <RadioAntennaIcon size={16} color="currentColor" />
              <span>Iniciar Transmisión de Refugio</span>
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
                {/* Cabecera sutil y minimalista */}
                <div className="server-card-topbar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`server-rank-pill ${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''}`}>
                      #{rank}
                    </span>
                    <span className="server-freq-code">
                      KNOX FREQ-0{rank}
                    </span>
                    <span style={{ color: '#475569' }}>•</span>
                    <span className="server-status-pill">{statusLabel}</span>
                  </div>

                  <div className="server-tags-strip">
                    <span className="server-badge-mode">{server.mode}</span>
                    <span className="server-badge-region" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <RadarServerIcon size={11} color="currentColor" />
                      <span>{server.region}</span>
                    </span>
                    <span className="server-badge-loot" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <BackpackIcon size={11} color="currentColor" />
                      <span>{server.loot_tier}</span>
                    </span>
                  </div>
                </div>

                {/* Cuerpo principal limpio */}
                <div className="server-card-body">
                  {/* LADO IZQUIERDO: BANNER/ICONO + TITULAR + DESCRIPCIÓN + OCUPACIÓN */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
                    <div className="server-avatar-box">
                      <Image
                        src={server.banner_url || '/spiffo/ferret_mascot.jpg'}
                        alt={server.name}
                        width={42}
                        height={42}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <h3 className="server-title-text">
                          {server.name}
                        </h3>

                        {/* VU-Meter de Capacidad */}
                        <div className="server-occupancy-row" title={`Ocupación: ${server.players_online || 0}/${server.max_players || 32}`}>
                          <div className="pz-vu-meter">
                            {[...Array(8)].map((_, i) => {
                              const isActive = i < activeSegments;
                              let segmentColor = '';
                              if (isActive) {
                                if (i >= 6) segmentColor = 'active-red';
                                else if (i >= 4) segmentColor = 'active-yellow';
                                else segmentColor = 'active-green';
                              }
                              return (
                                <div key={i} className={`pz-vu-segment ${segmentColor}`} />
                              );
                            })}
                          </div>
                          <span className="server-occupancy-num">
                            {server.players_online || 0}/{server.max_players || 32}
                          </span>
                        </div>
                      </div>

                      <p className="server-desc-text">
                        {server.description || 'Frecuencia comunitaria abierta para supervivientes en el Condado de Knox.'}
                      </p>
                    </div>
                  </div>

                  {/* LADO DERECHO: ACCIONES DIRECTAS */}
                  <div className="server-actions-cluster">
                    {/* Botón Copiar IP */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyIP(e, server)}
                      className="server-ip-btn"
                      title="Copiar Frecuencia / IP de Conexión"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <RadioAntennaIcon size={14} color="currentColor" style={{ opacity: 0.7 }} />
                      <span>{fullAddress}</span>
                    </button>

                    {/* Botón de Votar */}
                    <button
                      type="button"
                      onClick={(e) => handleVote(e, server.id)}
                      className="server-vote-btn"
                      title="Otorgar voto de reputación"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <VoteIcon size={13} color="#eab308" />
                      <span>{server.votes || 0}</span>
                    </button>

                    {/* Botón Editar Frecuencia (Solo Dueño o Admin) */}
                    {Boolean(
                      currentUser && (
                        (server.owner_id && server.owner_id === currentUser.id) ||
                        (server.owner_email && server.owner_email === currentUser.email) ||
                        currentUser.role === 'admin'
                      )
                    ) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingServer(server);
                          setShowAddModal(true);
                        }}
                        className="btn-tactical-edit"
                        title="Modificar Frecuencia Militar"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <WrenchIcon size={12} color="currentColor" />
                        <span>Editar</span>
                      </button>
                    )}

                    {/* Ver Ficha Dossier */}
                    <button
                      type="button"
                      onClick={() => setActiveModalServer(server)}
                      className="btn-tactical-dossier"
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
          currentUser={currentUser}
          onClose={() => setActiveModalServer(null)}
          onVote={(id) => handleVote(null, id)}
          onEdit={(srv) => {
            setActiveModalServer(null);
            setEditingServer(srv);
            setShowAddModal(true);
          }}
          onDelete={(id) => handleDeleteServer(id)}
        />
      )}

      {/* MODAL DE ENLISTAR / EDITAR SERVIDOR */}
      {showAddModal && (
        <AddServerModal
          editingServer={editingServer}
          onClose={() => {
            setShowAddModal(false);
            setEditingServer(null);
          }}
          onSubmit={handleSaveServer}
        />
      )}
    </div>
  );
}
