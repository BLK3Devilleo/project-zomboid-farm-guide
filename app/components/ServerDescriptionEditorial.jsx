'use client';

import React from 'react';
import {
  SignalPulseIcon,
  CrosshairIcon,
  WrenchIcon,
  RadioAntennaIcon,
  CheckIcon,
  RadarServerIcon,
  RankChevronIcon,
} from './icons/KnoxIcons';

/**
 * Parsea el texto del servidor para separar la introducción,
 * las mecánicas clave en viñetas y las notas de cierre.
 */
function parseServerDescription(rawText) {
  if (!rawText) {
    return { intro: 'Sin transmisión de datos disponible para este refugio.', features: [], outro: '' };
  }

  // Normalizar saltos de línea y guiones/viñetas
  const normalized = rawText
    .replace(/(\r\n|\r|\n)/g, ' ')
    .replace(/(\s|^)[-•*]\s*/g, '___BULLET___');

  const rawParts = normalized.split('___BULLET___').map((p) => p.trim()).filter(Boolean);

  if (rawParts.length <= 1) {
    return { intro: rawText.trim(), features: [], outro: '' };
  }

  const intro = rawParts[0];
  const features = [];
  let outro = '';

  for (let i = 1; i < rawParts.length; i++) {
    const item = rawParts[i];
    // Si es el último elemento y contiene una despedida o exclamación
    if (i === rawParts.length - 1) {
      const matchSplit = item.match(/([.!?])\s+([A-Z¿¡].*)/);
      if (matchSplit && matchSplit.index) {
        features.push(item.substring(0, matchSplit.index + 1).trim());
        outro = matchSplit[2].trim();
      } else {
        features.push(item);
      }
    } else {
      features.push(item);
    }
  }

  return { intro, features, outro };
}

export default function ServerDescriptionEditorial({ server, themeColor = '#10b981' }) {
  const { intro, features, outro } = parseServerDescription(server.description);

  const is24_7 = server.schedule_type === '24/7' || (!server.schedule_type && !server.schedule_details);
  const platform = server.platform || 'PC';
  const hasMods = Boolean(server.mods_count || server.mods_list);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Tira de Fichas Técnicas: Disponibilidad, Plataforma y Mods */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        {/* Horario / 24/7 */}
        <div
          className="pz-meta-pill"
          style={{
            background: is24_7 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.12)',
            borderColor: is24_7 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(56, 189, 248, 0.35)',
            color: is24_7 ? '#34d399' : '#38bdf8',
          }}
          title={is24_7 ? 'Servidor disponible 24 horas al día' : `Horario: ${server.schedule_details}`}
        >
          <SignalPulseIcon size={12} color="currentColor" />
          <span>{is24_7 ? 'DISPONIBILIDAD: 24/7 ACTIVO' : `HORARIO: ${server.schedule_details || 'PROGRAMADO'}`}</span>
        </div>

        {/* Plataforma */}
        <div
          className="pz-meta-pill"
          style={{
            background: 'rgba(148, 163, 184, 0.1)',
            borderColor: 'rgba(148, 163, 184, 0.3)',
            color: '#e2e8f0',
          }}
          title={`Plataforma: ${platform}`}
        >
          <RadarServerIcon size={12} color="#94a3b8" />
          <span>PLATAFORMA: {platform.toUpperCase()}</span>
        </div>

        {/* Mods */}
        {hasMods && (
          <div
            className="pz-meta-pill"
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              borderColor: 'rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
            }}
            title={server.mods_list ? `Mods activos: ${server.mods_list}` : 'Mods activos'}
          >
            <WrenchIcon size={12} color="#fbbf24" />
            <span>MODS: {server.mods_count || 'ACTIVOS'}</span>
          </div>
        )}

        {/* Estado Operativo */}
        <div
          className="pz-meta-pill"
          style={{
            background: server.is_online !== false ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            borderColor: server.is_online !== false ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
            color: server.is_online !== false ? '#10b981' : '#f87171',
          }}
        >
          <span style={{ fontSize: 9 }}>●</span>
          <span>{server.is_online !== false ? 'SISTEMA OPERATIVO' : 'EN MANTENIMIENTO'}</span>
        </div>
      </div>

      {/* 2. Caja Editorial de Directiva General (Introducción) */}
      <div
        style={{
          background: 'rgba(6, 11, 24, 0.85)',
          padding: '16px 20px',
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <CrosshairIcon size={13} color={themeColor} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              textTransform: 'uppercase',
              color: themeColor,
              letterSpacing: '0.08em',
              fontFamily: 'monospace',
            }}
          >
            DIRECTIVA Y PROPÓSITO DEL REFUGIO
          </span>
        </div>
        <p style={{ fontSize: 13.5, color: '#e2e8f0', lineHeight: 1.65, margin: 0, fontFamily: 'sans-serif' }}>
          {intro}
        </p>
      </div>

      {/* 3. Desglose Táctico de Mecánicas / Características Clave */}
      {features.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RankChevronIcon size={12} color="#38bdf8" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                textTransform: 'uppercase',
                color: '#38bdf8',
                letterSpacing: '0.08em',
                fontFamily: 'monospace',
              }}
            >
              MECÁNICAS Y SISTEMAS ACTIVOS ({features.length})
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 8,
            }}
          >
            {features.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  borderLeft: `3px solid ${themeColor}`,
                  borderRadius: 4,
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ marginTop: 2, flexShrink: 0 }}>
                  <CheckIcon size={12} color={themeColor} />
                </div>
                <span
                  style={{
                    fontSize: 12.5,
                    color: '#cbd5e1',
                    lineHeight: 1.45,
                    fontFamily: 'sans-serif',
                  }}
                >
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Lista Detallada de Mods si existen */}
      {server.mods_list && (
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px 16px', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
            MODS DESTACADOS DE LA FRECUENCIA:
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
            {server.mods_list}
          </span>
        </div>
      )}

      {/* 5. Nota de Convocatoria / Despedida del Administrador */}
      {outro && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 6,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <RadioAntennaIcon size={16} color="#10b981" />
          <span style={{ fontSize: 12.5, color: '#a7f3d0', lineHeight: 1.5, fontFamily: 'sans-serif' }}>
            {outro}
          </span>
        </div>
      )}
    </div>
  );
}
