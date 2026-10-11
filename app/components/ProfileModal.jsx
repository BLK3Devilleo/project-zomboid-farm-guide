'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ROLE_LABELS } from '../lib/authClient';

export const PZ_AVATARS = [
  { id: 'spiffo_combat.png', label: 'Spiffo Combatiente' },
  { id: 'spiffo_crafting.png', label: 'Ingeniero / Carpintero' },
  { id: 'spiffo_farming.png', label: 'Granjero de Knox' },
  { id: 'spiffo_fishing.png', label: 'Pescador Solitario' },
  { id: 'spiffo_foraging.png', label: 'Recolector Nómada' },
  { id: 'spiffo_vehicle.png', label: 'Mecánico de Blindados' },
  { id: 'spiffo_food.png', label: 'Chef del Refugio' },
  { id: 'spiffo_character.png', label: 'Spiffo Clásico' },
];

export const PZ_PROFESSIONS = [
  'Desempleado',
  'Policía',
  'Bombero',
  'Carpintero',
  'Mecánico',
  'Médico',
  'Veterinario',
  'Granjero',
  'Pescador',
  'Soldado / Veterano',
  'Electricista',
  'Cocinero',
  'Cerrajero',
];

export const PZ_PLAYSTYLES = [
  'PvE Cooperativo',
  'PvP Hardcore',
  'Roleplay Inmersivo',
  'Nómada Solitario',
  'Constructor de Bases',
  'Looter / Asaltante',
];

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  globalXp = 0,
  onProfileUpdated = () => {},
  onOpenAddServer = () => {},
}) {
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'servers'
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [myServers, setMyServers] = useState([]);

  // Datos editables de la Ficha
  const [profileData, setProfileData] = useState({
    nickname: '',
    profession: 'Desempleado',
    playstyle: 'PvE Cooperativo',
    discord_tag: '',
    bio: '',
    avatar_pz: 'spiffo_combat.png',
  });

  // Calcular Nivel y Rango
  const playerLevel = Math.floor(globalXp / 100) + 1;
  const currentRoleMeta = currentUser
    ? ROLE_LABELS[currentUser.role] || ROLE_LABELS.usuario
    : null;

  // Cargar datos del perfil y servidores del usuario
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    async function loadData() {
      setLoading(true);
      try {
        // Cargar perfil
        const resProf = await fetch('/api/user/profile');
        if (resProf.ok) {
          const jsonProf = await resProf.json();
          if (jsonProf.success && jsonProf.profile) {
            setProfileData({
              nickname: jsonProf.profile.nickname || currentUser.name || '',
              profession: jsonProf.profile.profession || 'Desempleado',
              playstyle: jsonProf.profile.playstyle || 'PvE Cooperativo',
              discord_tag: jsonProf.profile.discord_tag || '',
              bio: jsonProf.profile.bio || '',
              avatar_pz: jsonProf.profile.avatar_pz || 'spiffo_combat.png',
            });
          }
        }

        // Cargar servidores del usuario
        const resServ = await fetch('/api/user/servers');
        if (resServ.ok) {
          const jsonServ = await resServ.json();
          if (jsonServ.success) {
            setMyServers(jsonServ.servers || []);
          }
        }
      } catch (e) {
        console.warn('Error cargando datos de usuario:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isOpen, currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al guardar el perfil.');
      }

      setFeedback('¡Ficha militar de superviviente actualizada!');
      onProfileUpdated(json.profile);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(`⚠️ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteServer = async (serverId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este servidor del ranking?')) return;
    try {
      const res = await fetch(`/api/servers?id=${serverId}`, { method: 'DELETE' });
      if (res.ok) {
        setMyServers((prev) => prev.filter((s) => s.id !== serverId));
        setFeedback('Servidor eliminado correctamente.');
        setTimeout(() => setFeedback(''), 2500);
      }
    } catch (err) {
      alert('Error al eliminar servidor.');
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="server-modal-backdrop" onClick={onClose}>
      <div
        className="server-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 780, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="pz-corner-tick tl" />
        <div className="pz-corner-tick tr" />
        <div className="pz-corner-tick bl" />
        <div className="pz-corner-tick br" />

        {/* Cabecera Táctica del Dossier */}
        <div className="pz-dossier-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: currentRoleMeta?.color || '#10b981', fontSize: 16 }}>●</span>
            <div>
              <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: currentRoleMeta?.color || '#10b981', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                DOCUMENTO DE IDENTIDAD · CONDADO DE KNOX
              </span>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', margin: 0 }}>
                {profileData.nickname || currentUser.name}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 900,
                color: currentRoleMeta?.color,
                background: currentRoleMeta?.glow || 'rgba(16, 185, 129, 0.2)',
                border: `1px solid ${currentRoleMeta?.color}`,
                padding: '3px 10px',
                borderRadius: 4,
                fontFamily: 'monospace',
              }}
            >
              {currentRoleMeta?.badge}
            </div>
            <button onClick={onClose} className="server-modal-close-btn">
              ✕
            </button>
          </div>
        </div>

        {/* PESTAÑAS DEL PERFIL */}
        <div style={{ display: 'flex', gap: 10, padding: '12px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setActiveTab('card')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'card' ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === 'card' ? '#10b981' : '#94a3b8',
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🪪 Tarjeta de Superviviente (PZ)
          </button>
          <button
            onClick={() => setActiveTab('servers')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'servers' ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === 'servers' ? '#10b981' : '#94a3b8',
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🌐 Mis Servidores ({myServers.length})
          </button>
        </div>

        {feedback && (
          <div
            style={{
              margin: '16px 24px 0',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              background: feedback.includes('⚠️') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: feedback.includes('⚠️') ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
              color: feedback.includes('⚠️') ? '#f87171' : '#34d399',
            }}
          >
            {feedback}
          </div>
        )}

        <div style={{ padding: 24 }}>
          {/* TAB 1: TARJETA DE SUPERVIVIENTE */}
          {activeTab === 'card' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Tarjeta Visual de Personaje PZ */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(6, 9, 19, 0.95))',
                  border: '1.5px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    background: '#040d12',
                    border: '1.5px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={`/spiffo/${profileData.avatar_pz}`}
                    alt="PZ Avatar"
                    width={70}
                    height={70}
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 10, color: '#10b981', fontWeight: 900, fontFamily: 'monospace' }}>
                    NIVEL {playerLevel} · {globalXp} XP ACUMULADA
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                    {profileData.nickname || currentUser.name}
                  </h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                    <span style={{ fontSize: 11, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                      🔨 {profileData.profession}
                    </span>
                    <span style={{ fontSize: 11, background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                      🎮 {profileData.playstyle}
                    </span>
                    {profileData.discord_tag && (
                      <span style={{ fontSize: 11, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                        💬 Discord: {profileData.discord_tag}
                      </span>
                    )}
                  </div>
                  {profileData.bio && (
                    <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', margin: '8px 0 0 0' }}>
                      "{profileData.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Selector de Avatar de Spiffo */}
              <div>
                <label className="form-label">SELECCIONA TU AVATAR DE PROJECT ZOMBOID</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: 10, marginTop: 8 }}>
                  {PZ_AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setProfileData((p) => ({ ...p, avatar_pz: av.id }))}
                      title={av.label}
                      style={{
                        background: profileData.avatar_pz === av.id ? 'rgba(16, 185, 129, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                        border: profileData.avatar_pz === av.id ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 8,
                        padding: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Image
                        src={`/spiffo/${av.id}`}
                        alt={av.label}
                        width={44}
                        height={44}
                        style={{ objectFit: 'contain' }}
                      />
                      <span style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {av.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos del formulario */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div>
                  <label className="form-label">APODO DE SUPERVIVIENTE</label>
                  <input
                    type="text"
                    value={profileData.nickname}
                    onChange={(e) => setProfileData((p) => ({ ...p, nickname: e.target.value }))}
                    className="form-input"
                    placeholder="Ej: Rick el Herrero"
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="form-label">USUARIO DE DISCORD</label>
                  <input
                    type="text"
                    value={profileData.discord_tag}
                    onChange={(e) => setProfileData((p) => ({ ...p, discord_tag: e.target.value }))}
                    className="form-input"
                    placeholder="Ej: superviviente#1234 o nombre_de_usuario"
                    maxLength={36}
                  />
                </div>

                <div>
                  <label className="form-label">PROFESIÓN PRINCIPAL (PZ)</label>
                  <select
                    value={profileData.profession}
                    onChange={(e) => setProfileData((p) => ({ ...p, profession: e.target.value }))}
                    className="form-select"
                  >
                    {PZ_PROFESSIONS.map((prof) => (
                      <option key={prof} value={prof}>
                        {prof}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">ESTILO DE JUEGO</label>
                  <select
                    value={profileData.playstyle}
                    onChange={(e) => setProfileData((p) => ({ ...p, playstyle: e.target.value }))}
                    className="form-select"
                  >
                    {PZ_PLAYSTYLES.map((ps) => (
                      <option key={ps} value={ps}>
                        {ps}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">LEMA / BIO DE SUPERVIVENCIA</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                  className="form-textarea"
                  rows={2}
                  placeholder="Cuéntanos un poco sobre cómo juegas o qué buscas en tu clan..."
                  maxLength={300}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-tactical"
                  style={{ padding: '10px 24px', fontSize: 13 }}
                >
                  {saving ? 'Guardando...' : '💾 Guardar Ficha de Superviviente'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: GESTIÓN DE MIS SERVIDORES (CRUD) */}
          {activeTab === 'servers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                  Servidores registrados bajo tu cuenta de Google. Puedes administrarlos directamente.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddServer();
                  }}
                  className="btn-tactical"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                >
                  ➕ Enlistar Nuevo
                </button>
              </div>

              {myServers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📡</div>
                  <p style={{ fontSize: 13, margin: 0 }}>Aún no has registrado ningún servidor.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {myServers.map((srv) => (
                    <div
                      key={srv.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 8,
                        padding: 14,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
                            {srv.region} · {srv.mode}
                          </span>
                          <span style={{ fontSize: 11, color: '#38bdf8' }}>
                            ⭐ {srv.votes || 0} Votos
                          </span>
                        </div>
                        <h4 style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', margin: '3px 0' }}>
                          {srv.name}
                        </h4>
                        <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
                          IP: {srv.ip}:{srv.port || 16261}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleDeleteServer(srv.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#ef4444',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
