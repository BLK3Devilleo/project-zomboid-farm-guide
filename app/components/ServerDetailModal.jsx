'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTacticalModal } from '../hooks/useTacticalModal';
import {
  CloudCheckIcon,
  RadarServerIcon,
  BackpackIcon,
  RadioAntennaIcon,
  HazardIcon,
  VoteIcon,
  CheckIcon,
  WrenchIcon,
  CloseCrossIcon,
} from './icons/KnoxIcons';

export default function ServerDetailModal({
  server,
  currentUser = null,
  onClose,
  onVote,
  onEdit,
  onDelete,
}) {
  const { modalContainerProps } = useTacticalModal(Boolean(server), onClose);
  const [copied, setCopied] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  if (!server) return null;

  const isOwner = Boolean(
    currentUser && (
      (server.owner_id && server.owner_id === currentUser.id) ||
      (server.owner_email && server.owner_email === currentUser.email) ||
      currentUser.role === 'admin'
    )
  );

  const fullAddress = `${server.ip}:${server.port || 16261}`;

  // Galería de imágenes (Soporte Cloudflare R2 y Fallbacks)
  const images = (server.gallery_images && server.gallery_images.length > 0)
    ? server.gallery_images
    : [server.banner_url || '/spiffo/spiffo_character.png'];

  const rawCurrentImage = images[selectedImgIndex] || images[0];
  const currentImage = failedImages[rawCurrentImage]
    ? (server.banner_url && !failedImages[server.banner_url] ? server.banner_url : '/spiffo/spiffo_character.png')
    : rawCurrentImage;

  const handleImageError = (imgUrl) => {
    setFailedImages((prev) => ({ ...prev, [imgUrl]: true }));
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {}
  };

  // Cálculo de VU-Meter (8 segmentos)
  const occupancyRatio = (server.players_online || 0) / (server.max_players || 32);
  const activeSegments = Math.min(8, Math.max(1, Math.round(occupancyRatio * 8)));

  const modeLower = (server.mode || 'pve').toLowerCase();
  const themeColor = modeLower.includes('hardcore')
    ? '#ef4444'
    : modeLower.includes('roleplay')
    ? '#f59e0b'
    : modeLower.includes('pvp')
    ? '#06b6d4'
    : '#10b981';

  return (
    <div className="server-modal-backdrop" onClick={onClose}>
      <div
        {...modalContainerProps}
        className="server-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: themeColor }}
      >
        {/* RETÍCULAS ANGULARES */}
        <div className="pz-corner-tick tl" />
        <div className="pz-corner-tick tr" />
        <div className="pz-corner-tick bl" />
        <div className="pz-corner-tick br" />

        {/* BARRA SUPERIOR RETRO CRT */}
        <div className="pz-dossier-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: themeColor, fontSize: 13, fontWeight: 900 }}>●</span>
            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.08em' }}>
              KNOX DEFENSE SYSTEM // DOSSIER DE FRECUENCIA #{server.id}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="pz-window-controls">
              <span className="pz-window-btn">_</span>
              <span className="pz-window-btn">□</span>
            </div>
            <button
              onClick={onClose}
              className="server-modal-close-btn"
              title="Cerrar Terminal [ESC]"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <CloseCrossIcon size={14} />
            </button>
          </div>
        </div>

        {/* VITRINA DE IMÁGENES / GALERÍA CLOUDFLARE R2 */}
        <div className="pz-gallery-showcase">
          {/* Badge Almacenamiento Verificado */}
          <div className="pz-r2-badge" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CloudCheckIcon size={14} color="#06b6d4" />
            <span>ALMACENAMIENTO MULTIMEDIA CLOUD VERIFICADO</span>
          </div>

          {/* Imagen Principal */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={currentImage}
              alt={server.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 820px) 100vw, 820px"
              priority
              onError={() => handleImageError(rawCurrentImage)}
            />
            {/* Overlay sutil de viñeta y textura CRT */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(9, 14, 27, 0.95) 0%, rgba(9, 14, 27, 0.2) 60%, rgba(9, 14, 27, 0.7) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Titular superpuesto sobre la imagen */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 20,
                right: 20,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                zIndex: 4,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span className="server-badge-mode" style={{ borderColor: themeColor, color: themeColor }}>
                    {server.mode}
                  </span>
                  <span className="server-badge-region" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <RadarServerIcon size={12} color="#94a3b8" />
                    <span>{server.region || 'Global'}</span>
                  </span>
                  <span className="server-badge-loot" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <BackpackIcon size={12} color="#94a3b8" />
                    <span>Botín {server.loot_tier || 'Normal'}</span>
                  </span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {server.name}
                </h1>
              </div>

              {/* Onda de Audio Telemetría */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.7)', padding: '6px 12px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8' }}>
                  SIGNAL
                </span>
                <div className="pz-audio-bar-row" style={{ color: themeColor }}>
                  {[6, 12, 16, 8, 14, 18, 10, 15, 7].map((h, i) => (
                    <div key={i} className="pz-audio-bar" style={{ height: h }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TIRA DE MINIATURAS (CAROUSEL / SELECTOR R2) */}
        {images.length > 1 && (
          <div className="pz-gallery-strip">
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748b', textTransform: 'uppercase', marginRight: 4, flexShrink: 0 }}>
              CAPTURAS [{images.length}]:
            </span>
            {images.map((img, idx) => {
              const thumbSrc = failedImages[img] ? '/spiffo/spiffo_character.png' : img;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`pz-thumb-item ${selectedImgIndex === idx ? 'active' : ''}`}
                  style={{ position: 'relative' }}
                >
                  <Image
                    src={thumbSrc}
                    alt={`Captura ${idx + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="68px"
                    onError={() => handleImageError(img)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* CUERPO INTERNO DEL DOSSIER */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* BARRA DE CONEXIÓN RÁPIDA Y ESTADO EN VIVO */}
          <div className="server-connect-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="server-status-dot" style={{ background: themeColor, boxShadow: `0 0 8px ${themeColor}` }} />
                    <span style={{ fontSize: 12, fontWeight: 900, color: themeColor, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'monospace' }}>
                      TRANSMISIÓN ONLINE B42
                    </span>
                  </div>

                  {/* VU-Meter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="pz-vu-meter" title={`Ocupación: ${server.players_online}/${server.max_players}`}>
                      {[...Array(8)].map((_, i) => {
                        const isActive = i < activeSegments;
                        let segColor = '';
                        if (isActive) {
                          if (i >= 6) segColor = 'active-red';
                          else if (i >= 4) segColor = 'active-yellow';
                          else segColor = 'active-green';
                        }
                        return <div key={i} className={`pz-vu-segment ${segColor}`} />;
                      })}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
                      {server.players_online || 0} / {server.max_players || 32} Supervivientes
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de Copiar IP con Frecuencia */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="server-ip-pill" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RadioAntennaIcon size={14} color="#38bdf8" />
                  <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace', color: '#38bdf8' }}>
                    FREQ: {fullAddress}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="btn-tactical"
                  style={{ padding: '8px 16px', fontSize: 12, borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  {copied ? (
                    <>
                      <CheckIcon size={14} color="#10b981" />
                      <span>FRECUENCIA COPIADA</span>
                    </>
                  ) : (
                    <>
                      <RadioAntennaIcon size={14} />
                      <span>COPIAR IP</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* DESCRIPCIÓN Y LORE DE COMUNIDAD */}
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: themeColor, letterSpacing: '0.08em', display: 'block', marginBottom: 8, fontFamily: 'monospace' }}>
              DIRECTIVA Y PROPÓSITO DEL REFUGIO
            </span>
            <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0, fontFamily: 'sans-serif' }}>
              {server.description || 'Sin transmisión de datos disponible.'}
            </p>
          </div>

          {/* ETIQUETAS Y MODS */}
          {server.tags && server.tags.length > 0 && (
            <div>
              <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.08em', display: 'block', marginBottom: 8, fontFamily: 'monospace' }}>
                PARCHES Y MODS ACTIVOS EN FRECUENCIA
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

          {/* REGLAS MILITARES DE CONVIVENCIA */}
          {server.rules && server.rules.length > 0 && (
            <div style={{ background: 'rgba(0, 0, 0, 0.65)', borderRadius: 4, padding: 16, border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <HazardIcon size={15} color="#f59e0b" />
                <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                  CÓDIGO DE PROTOCOLO Y SUPERVIVENCIA
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#e2e8f0', lineHeight: 1.5 }}>
                {server.rules.map((rule, idx) => (
                  <li key={idx} style={{ fontFamily: 'monospace' }}>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PIE DE ACCIONES: VOTAR + DISCORD + GESTIÓN DE PROPIETARIO */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => onVote(server.id)}
                className="server-vote-btn"
                style={{ padding: '9px 18px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <VoteIcon size={15} color="#f59e0b" />
                <span>Otorgar Reputación Knox ({server.votes || 0})</span>
              </button>

              {/* Botones de Propietario / Admin */}
              {isOwner && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onEdit(server)}
                    className="btn-tactical"
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.5)',
                      color: '#38bdf8',
                      padding: '9px 16px',
                      fontSize: 12,
                      borderRadius: 3,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                    title="Editar Frecuencia Militar"
                  >
                    <WrenchIcon size={14} />
                    <span>Modificar</span>
                  </button>
                  <button
                    onClick={() => onDelete(server.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      color: '#ef4444',
                      padding: '9px 14px',
                      fontSize: 12,
                      borderRadius: 3,
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                    title="Eliminar este servidor"
                  >
                    <CloseCrossIcon size={14} />
                    <span>Eliminar</span>
                  </button>
                </div>
              )}
            </div>

            {server.discord_url && (
              <a
                href={server.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactical"
                style={{ background: 'linear-gradient(135deg, #5865F2, #4752C4)', color: '#ffffff', textDecoration: 'none', padding: '9px 18px', borderRadius: 3, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <RadioAntennaIcon size={14} />
                <span>Sintonizar Radio Discord →</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
