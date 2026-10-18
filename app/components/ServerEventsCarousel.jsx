'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HazardIcon,
  RadioAntennaIcon,
  CloseCrossIcon,
  UserProfileIcon,
  RadarServerIcon,
  CheckIcon,
} from './icons/KnoxIcons';

export default function ServerEventsCarousel({
  events = [],
  currentUser = null,
  onOpenPublishModal = () => {},
  onDeleteEvent = () => {},
  onSelectServer = () => {},
  showToast = () => {},
}) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // Comprobar límites de scroll para habilitar/deshabilitar flechas
  const updateScrollButtons = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    const currentTrack = trackRef.current;
    if (currentTrack) {
      currentTrack.addEventListener('scroll', updateScrollButtons, { passive: true });
      window.addEventListener('resize', updateScrollButtons);
    }
    return () => {
      if (currentTrack) currentTrack.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [events]);

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = 360;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCopyIp = (e, ip, eventId) => {
    e.stopPropagation();
    if (!ip) return;
    try {
      navigator.clipboard.writeText(ip);
      setCopiedId(eventId);
      showToast(`¡IP ${ip} copiada al portapapeles!`);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      showToast(`IP del Servidor: ${ip}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      {/* Barra de cabecera del carrusel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
            Desliza para ver transmisiones activas ({events.length} anuncios)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={onOpenPublishModal}
            className="pz-btn-primary"
            style={{ fontSize: 11, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RadioAntennaIcon size={13} color="currentColor" />
            <span>+ Anunciar Evento de Mi Servidor</span>
          </button>
        </div>
      </div>

      {/* Contenedor relativo del carrusel con flechas o estado vacío */}
      {events.length === 0 ? (
        <div style={{ padding: '24px 20px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', border: '1px dashed rgba(56, 189, 248, 0.25)', borderRadius: 8, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <RadioAntennaIcon size={26} color="#64748b" />
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
            No hay anuncios ni eventos programados en este momento.
          </span>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            Los administradores y dueños de servidores verificados pueden publicar transmisiones tácticas con el botón superior.
          </span>
        </div>
      ) : (
        <div className="pz-carousel-wrapper">
          {/* Flecha Izquierda */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className="pz-carousel-nav-btn prev"
            aria-label="Desplazar eventos a la izquierda"
          >
          <ChevronLeftIcon size={20} color="currentColor" />
        </button>

        {/* Pista deslizable con scroll suave */}
        <div ref={trackRef} className="pz-carousel-track">
          {events.map((evt) => {
            const isOwner =
              currentUser &&
              ((evt.ownerId && evt.ownerId === currentUser.id) ||
                (evt.ownerEmail && evt.ownerEmail === currentUser.email));
            const isAdmin = currentUser && currentUser.role === 'admin';

            const borderTopColor =
              evt.urgency === 'CRÍTICA' || evt.urgency === 'PELIGRO MÁXIMO'
                ? '#ef4444'
                : evt.urgency === 'EXTREMA'
                ? '#f97316'
                : evt.type?.includes('LOOT')
                ? '#10b981'
                : '#38bdf8';

            return (
              <div
                key={evt.id}
                className="pz-carousel-card"
                style={{ borderTop: `3px solid ${borderTopColor}` }}
              >
                {/* Cabecera de la tarjeta: Tipo, Estado y Acciones Owner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      padding: '2px 7px',
                      borderRadius: 3,
                      background: evt.type?.includes('LOOT') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      color: evt.type?.includes('LOOT') ? '#34d399' : '#38bdf8',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {evt.type}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        color: evt.status === 'ACTIVO' || evt.status === 'EN VIVO' ? '#10b981' : '#f59e0b',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}
                    >
                      {evt.status}
                    </span>

                    {(isOwner || isAdmin) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar el anuncio "${evt.title}" del tablón?`)) {
                            onDeleteEvent(evt.id);
                          }
                        }}
                        title="Eliminar mi anuncio"
                        style={{
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 3,
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        aria-label="Eliminar anuncio"
                      >
                        <CloseCrossIcon size={11} color="currentColor" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Título del evento */}
                <strong
                  style={{
                    fontSize: 14,
                    color: '#ffffff',
                    fontFamily: 'monospace',
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {evt.title}
                </strong>

                {/* Badge del Servidor Anfitrión si es un servidor real */}
                {evt.serverName && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <div className="pz-server-host-pill" title={`Servidor anfitrión: ${evt.serverName}`}>
                      <RadarServerIcon size={12} color="#38bdf8" />
                      <span>{evt.serverName}</span>
                    </div>

                    {evt.serverIp && (
                      <button
                        type="button"
                        onClick={(e) => handleCopyIp(e, evt.serverIp, evt.id)}
                        style={{
                          background: copiedId === evt.id ? '#10b981' : 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 3,
                          color: copiedId === evt.id ? '#04120c' : '#94a3b8',
                          fontSize: 10,
                          fontFamily: 'monospace',
                          padding: '2px 8px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s ease',
                        }}
                        title={`Copiar IP directa: ${evt.serverIp}`}
                      >
                        {copiedId === evt.id ? (
                          <>
                            <CheckIcon size={10} color="#04120c" />
                            <span>¡COPIADA!</span>
                          </>
                        ) : (
                          <span>COPIAR IP</span>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Descripción / Táctica */}
                <p
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    margin: 0,
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {evt.description}
                </p>

                {/* Pie de tarjeta: Horario y Frecuencia */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 8,
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: '#64748b',
                      fontFamily: 'monospace',
                      maxWidth: '45%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={evt.frequency}
                  >
                    {evt.frequency}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#f59e0b',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      textAlign: 'right',
                    }}
                  >
                    {evt.dateDisplay}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flecha Derecha */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          className="pz-carousel-nav-btn next"
          aria-label="Desplazar eventos a la derecha"
        >
          <ChevronRightIcon size={20} color="currentColor" />
        </button>
      </div>
      )}
    </div>
  );
}
