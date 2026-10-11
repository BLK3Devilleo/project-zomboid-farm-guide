'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ServerDetailModal({
  server,
  onClose,
  onVote,
}) {
  const [copied, setCopied] = useState(false);

  if (!server) return null;

  const fullAddress = `${server.ip}:${server.port || 16261}`;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {}
  };

  return (
    <div className="server-modal-backdrop" onClick={onClose}>
      <div
        className="server-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA DEL MODAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Image
                src={server.banner_url || '/spiffo/spiffo_character.png'}
                alt={server.name}
                width={36}
                height={36}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span className="server-badge-mode">
                  {server.mode}
                </span>
                <span className="server-badge-region">
                  🌍 {server.region || 'Global'}
                </span>
                <span className="server-badge-loot">
                  📦 Loot {server.loot_tier || 'Normal'}
                </span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                {server.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="server-modal-close-btn"
            title="Cerrar Ficha"
          >
            ✕
          </button>
        </div>

        {/* BARRA DE ESTADO EN VIVO Y CONEXIÓN RÁPIDA */}
        <div className="server-connect-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="server-status-dot" />
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                  Servidor Online
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>
                  Jugadores: <strong style={{ color: '#ffffff' }}>{server.players_online || 0}</strong> / {server.max_players || 32}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="server-ip-pill">
                <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>
                  {fullAddress}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="btn-tactical"
                style={{ padding: '8px 14px', fontSize: 11 }}
              >
                {copied ? '✅ ¡Copiado!' : '📋 Copiar IP'}
              </button>
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN Y LORE */}
        <div>
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
            Sobre esta Comunidad
          </span>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            {server.description || 'Sin descripción detallada disponible.'}
          </p>
        </div>

        {/* ETIQUETAS Y MODS */}
        {server.tags && server.tags.length > 0 && (
          <div>
            <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
              Características y Tags
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {server.tags.map((tag, idx) => (
                <span key={idx} className="server-tag-chip">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* REGLAS DEL SERVIDOR */}
        {server.rules && server.rules.length > 0 && (
          <div style={{ background: 'rgba(8, 13, 27, 0.7)', borderRadius: 14, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
              📜 Reglas Básicas de Convivencia
            </span>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#cbd5e1', lineHeight: 1.4 }}>
              {server.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ACCIONES INFERIORES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => onVote(server.id)}
            className="btn-secondary"
            style={{ padding: '8px 16px', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.35)', background: 'rgba(245, 158, 11, 0.1)' }}
          >
            <span>⭐</span>
            <span>Votar Servidor ({server.votes || 0})</span>
          </button>

          {server.discord_url && (
            <a
              href={server.discord_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactical"
              style={{ background: 'linear-gradient(135deg, #5865F2, #4752C4)', color: '#ffffff', textDecoration: 'none' }}
            >
              <span>💬 Unirse al Discord Oficial →</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
