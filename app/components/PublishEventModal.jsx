'use client';

import React, { useState, useEffect } from 'react';
import {
  HazardIcon,
  CloseCrossIcon,
  RadarServerIcon,
  RadioAntennaIcon,
  CheckIcon,
} from './icons/KnoxIcons';
import { MAX_EVENTS_PER_OWNER } from '../lib/eventsClient';

export default function PublishEventModal({
  isOpen,
  onClose,
  currentUser,
  userServers = [],
  userActiveEventsCount = 0,
  onSubmitEvent,
}) {
  const [selectedServerId, setSelectedServerId] = useState('');
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('LOOT ESPECIAL');
  const [urgency, setUrgency] = useState('OPORTUNIDAD');
  const [status, setStatus] = useState('PROGRAMADO');
  const [dateDisplay, setDateDisplay] = useState('');
  const [description, setDescription] = useState('');
  const [directive1, setDirective1] = useState('');
  const [directive2, setDirective2] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Preseleccionar el primer servidor del usuario si existe
  useEffect(() => {
    if (userServers.length > 0 && !selectedServerId) {
      setSelectedServerId(userServers[0].id);
    }
  }, [userServers, selectedServerId]);

  if (!isOpen) return null;

  const isLimitReached = userActiveEventsCount >= MAX_EVENTS_PER_OWNER;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLimitReached) {
      setErrorMsg(`Has alcanzado el límite máximo de ${MAX_EVENTS_PER_OWNER} eventos activos.`);
      return;
    }

    if (!selectedServerId) {
      setErrorMsg('Debes seleccionar uno de tus servidores registrados.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Por favor ingresa un título para el evento.');
      return;
    }

    if (!dateDisplay.trim()) {
      setErrorMsg('Por favor indica la fecha y hora del evento (ej: Martes 17:00 UTC).');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Ingresa una descripción táctica para los jugadores.');
      return;
    }

    setSubmitting(true);
    try {
      const directives = [directive1.trim(), directive2.trim()].filter(Boolean);
      onSubmitEvent({
        serverId: selectedServerId,
        title,
        type: eventType,
        urgency,
        status,
        dateDisplay,
        description,
        directives,
      });
      // Limpiar formulario y cerrar
      setTitle('');
      setDateDisplay('');
      setDescription('');
      setDirective1('');
      setDirective2('');
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error al publicar el evento.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="pz-mission-panel"
        style={{
          maxWidth: 620,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px 28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior militar */}
        <div className="pz-mission-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RadioAntennaIcon size={14} color="#38bdf8" />
            <span>TRANSMISOR TÁCTICO // PUBLICAR EVENTO COMUNITARIO</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            aria-label="Cerrar modal"
          >
            <CloseCrossIcon size={14} color="#94a3b8" />
          </button>
        </div>

        {/* Encabezado y Cuota de Eventos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
              Anunciar Evento en el Tablón Militar
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Promociona eventos de loot, purgas o torneos en tu servidor para toda la comunidad de KnoxOS.
            </p>
          </div>

          {/* Badge de cuota del dueño */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: isLimitReached ? '1px solid #ef4444' : '1px solid rgba(56, 189, 248, 0.4)',
              background: isLimitReached ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.12)',
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: 800,
              color: isLimitReached ? '#fca5a5' : '#38bdf8',
            }}
          >
            CUOTA: {userActiveEventsCount} / {MAX_EVENTS_PER_OWNER} ACTIVOS
          </div>
        </div>

        {/* Alerta de límite alcanzado */}
        {isLimitReached && (
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 6,
              color: '#fca5a5',
              fontSize: 12,
              fontFamily: 'monospace',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <HazardIcon size={16} color="#ef4444" />
            <span>
              Has alcanzado el límite máximo de {MAX_EVENTS_PER_OWNER} eventos activos por propietario. Para publicar uno nuevo, debes eliminar uno anterior desde el carrusel.
            </span>
          </div>
        )}

        {/* Alerta de error si ocurre */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: 4,
              color: '#fecaca',
              fontSize: 12,
              fontFamily: 'monospace',
              marginBottom: 16,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 1. Selector de Servidor Propio */}
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800, marginBottom: 6 }}>
              SERVIDOR ANFITRIÓN (DEBE SER DE TU PROPIEDAD):
            </label>
            {userServers.length > 0 ? (
              <select
                value={selectedServerId}
                onChange={(e) => setSelectedServerId(e.target.value)}
                disabled={isLimitReached}
                style={{
                  width: '100%',
                  background: '#040814',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 4,
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: 13,
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              >
                {userServers.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} ({srv.ip}:{srv.port || 16261})
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ color: '#ef4444', fontSize: 12, fontFamily: 'monospace' }}>
                No tienes servidores registrados a tu nombre. Registra uno antes de continuar.
              </div>
            )}
          </div>

          {/* 2. Título del Evento */}
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace', fontWeight: 700, marginBottom: 6 }}>
              TÍTULO DEL ANUNCIO (EJ: EVENTO DE LOOT X2 Y AIRDROPS):
            </label>
            <input
              type="text"
              placeholder="Ej: GRAN PURGA NOCTURNA CON SPRINTERS..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLimitReached}
              maxLength={80}
              className="pz-scanner-input"
              style={{ minHeight: 40 }}
            />
          </div>

          {/* 3. Fila Doble: Tipo de Evento & Estado */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace', fontWeight: 700, marginBottom: 6 }}>
                TIPO DE ACTIVIDAD:
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                disabled={isLimitReached}
                style={{
                  width: '100%',
                  background: '#040814',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 4,
                  padding: '9px 12px',
                  color: '#ffffff',
                  fontSize: 12,
                  fontFamily: 'monospace',
                }}
              >
                <option value="LOOT ESPECIAL">LOOT ESPECIAL (x2 / Reaparición)</option>
                <option value="NOCHE DE PURGA">NOCHE DE PURGA (Sprinters / Hordas)</option>
                <option value="TORNEO PVP">TORNEO PVP / GUERRA DE CLANES</option>
                <option value="AIRDROP MILITAR">AIRDROP MILITAR / SUMINISTROS</option>
                <option value="REINICIO DE BOTÍN">REINICIO DE BOTÍN (WIPE PARCIAL)</option>
                <option value="EVENTO DE ROL">EVENTO DE ROL / HISTORIA</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace', fontWeight: 700, marginBottom: 6 }}>
                FECHA Y HORA (FORMATO TEXTO LEGIBLE):
              </label>
              <input
                type="text"
                placeholder="Ej: Martes 17:00 UTC • Duración 3h"
                value={dateDisplay}
                onChange={(e) => setDateDisplay(e.target.value)}
                disabled={isLimitReached}
                className="pz-scanner-input"
                style={{ minHeight: 40 }}
              />
            </div>
          </div>

          {/* 4. Descripción Táctica */}
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace', fontWeight: 700, marginBottom: 6 }}>
              DESCRIPCIÓN DEL EVENTO PARA LA COMUNIDAD:
            </label>
            <textarea
              rows={3}
              placeholder="Explica qué sucederá en el servidor, zonas afectadas, premios o peligros..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLimitReached}
              maxLength={260}
              style={{
                width: '100%',
                background: '#040814',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 4,
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: 12,
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
              }}
            />
          </div>

          {/* 5. Directivas de Combate (Recomendaciones) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 4 }}>
                Directiva 1 (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ej: Traer vehículos de gran tonelaje..."
                value={directive1}
                onChange={(e) => setDirective1(e.target.value)}
                disabled={isLimitReached}
                className="pz-scanner-input"
                style={{ minHeight: 36, fontSize: 11 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 4 }}>
                Directiva 2 (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ej: No destruir bases ajenas..."
                value={directive2}
                onChange={(e) => setDirective2(e.target.value)}
                disabled={isLimitReached}
                className="pz-scanner-input"
                style={{ minHeight: 36, fontSize: 11 }}
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              className="pz-btn-secondary"
              style={{ fontSize: 12, padding: '8px 18px' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLimitReached || submitting || userServers.length === 0}
              className="pz-btn-primary"
              style={{ fontSize: 12, padding: '8px 22px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <CheckIcon size={14} color="currentColor" />
              <span>{submitting ? 'Emitiendo Anuncio...' : 'Publicar Anuncio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
