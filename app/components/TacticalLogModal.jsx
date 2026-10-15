'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function TacticalLogModal({ isOpen, onClose, currentUser = null }) {
  const [logs, setLogs] = useState([]);
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const logsEndRef = useRef(null);

  const isAdmin = Boolean(
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin')
  );

  useEffect(() => {
    if (!isOpen || !isAdmin) return;

    let eventSource = null;
    let isMounted = true;

    try {
      eventSource = new EventSource('/api/logs/stream');

      eventSource.onopen = () => {
        if (isMounted) setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const newEntry = JSON.parse(event.data);
          setLogs((prev) => {
            // Prevenir duplicados si se reconecta
            const exists = prev.some((l) => l.id === newEntry.id);
            if (exists) return prev;
            const updated = [...prev, newEntry];
            return updated.slice(-300); // Guardar máximo 300 en cliente
          });
        } catch (e) {}
      };

      eventSource.onerror = () => {
        if (isMounted) setIsConnected(false);
      };
    } catch (e) {
      setIsConnected(false);
    }

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isOpen, isAdmin]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="server-modal-backdrop" onClick={onClose}>
        <div
          className="server-modal-box"
          style={{ maxWidth: 440, textAlign: 'center', borderColor: '#ef4444' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
          <h2 style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: 16, margin: '0 0 8px' }}>
            ACCESO CLASIFICADO // RESTRINGIDO
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5, margin: '0 0 16px' }}>
            La terminal de telemetría y logs SSE en tiempo real está reservada exclusivamente para Super Administradores y Administradores de Knox-OS.
          </p>
          <button
            onClick={onClose}
            className="btn-tactical"
            style={{ width: '100%', padding: '10px' }}
          >
            Cerrar Terminal
          </button>
        </div>
      </div>
    );
  }

  const filteredLogs = logs.filter((l) => {
    const matchesLevel =
      filterLevel === 'ALL' ||
      (filterLevel === 'error' && l.level === 'error') ||
      (filterLevel === 'warn' && l.level === 'warn') ||
      (filterLevel === 'd1' && l.level === 'd1');

    const matchesSearch =
      !searchFilter.trim() ||
      l.message.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (l.details?.source && l.details.source.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesLevel && matchesSearch;
  });

  const getLevelBadgeStyle = (level) => {
    switch (level) {
      case 'error':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)' };
      case 'warn':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)' };
      case 'd1':
        return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)' };
      default:
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)' };
    }
  };

  return (
    <div className="server-modal-backdrop" onClick={onClose}>
      <div
        className="server-modal-card corner-reticle"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 880, width: '95vw', height: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Cabecera del terminal diegético */}
        <div className="pz-dossier-header" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: isConnected ? '#10b981' : '#ef4444',
                boxShadow: isConnected ? '0 0 10px #10b981' : '0 0 10px #ef4444',
              }}
            />
            <div>
              <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.08em', fontFamily: 'monospace', display: 'block' }}>
                KNOX_NET // RECEPTOR SSE DE TELEMETRÍA Y ERRORES
              </span>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
                TERMINAL DE LOGS EN VIVO {isConnected ? '[TRANSMISIÓN ACTIVA]' : '[RECONECTANDO...]'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ fontSize: 18, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
          >
            ✕
          </button>
        </div>

        {/* Barra de Filtros y Control */}
        <div style={{ padding: '10px 16px', background: 'rgba(10, 14, 24, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={() => setFilterLevel('ALL')}
              className={`pz-switch-tab ${filterLevel === 'ALL' ? 'active' : ''}`}
              style={{ fontSize: 11, padding: '4px 10px' }}
            >
              Todos ({logs.length})
            </button>
            <button
              onClick={() => setFilterLevel('error')}
              className={`pz-switch-tab ${filterLevel === 'error' ? 'active' : ''}`}
              style={{ fontSize: 11, padding: '4px 10px', color: filterLevel === 'error' ? '#ef4444' : undefined }}
            >
              Errores ({logs.filter((l) => l.level === 'error').length})
            </button>
            <button
              onClick={() => setFilterLevel('d1')}
              className={`pz-switch-tab ${filterLevel === 'd1' ? 'active' : ''}`}
              style={{ fontSize: 11, padding: '4px 10px', color: filterLevel === 'd1' ? '#38bdf8' : undefined }}
            >
              D1 SQL ({logs.filter((l) => l.level === 'd1').length})
            </button>
            <button
              onClick={() => setFilterLevel('warn')}
              className={`pz-switch-tab ${filterLevel === 'warn' ? 'active' : ''}`}
              style={{ fontSize: 11, padding: '4px 10px', color: filterLevel === 'warn' ? '#f59e0b' : undefined }}
            >
              Avisos ({logs.filter((l) => l.level === 'warn').length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar en logs..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 4,
                fontFamily: 'monospace',
                width: 140,
              }}
            />
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 800,
                padding: '4px 8px',
                borderRadius: 4,
                background: autoScroll ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: autoScroll ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
                color: autoScroll ? '#34d399' : '#94a3b8',
                cursor: 'pointer',
              }}
            >
              {autoScroll ? 'AUTO-SCROLL ON' : 'AUTO-SCROLL OFF'}
            </button>
            <button
              onClick={() => setLogs([])}
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 800,
                padding: '4px 8px',
                borderRadius: 4,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                cursor: 'pointer',
              }}
            >
              LIMPIAR
            </button>
          </div>
        </div>

        {/* Visor de terminal CRT */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 18px',
            background: '#040711',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          {filteredLogs.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '40px 0' }}>
              Esperando señales o telemetría en el canal SSE...
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getLevelBadgeStyle(log.level);
              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    padding: '4px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  }}
                >
                  <span style={{ color: '#64748b', fontSize: 10, flexShrink: 0, marginTop: 2 }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      padding: '1px 5px',
                      borderRadius: 3,
                      background: badge.bg,
                      color: badge.color,
                      border: badge.border,
                      flexShrink: 0,
                    }}
                  >
                    {log.level}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      wordBreak: 'break-all',
                      color: log.level === 'error' ? '#fca5a5' : log.level === 'warn' ? '#fde047' : log.level === 'd1' ? '#bae6fd' : '#e2e8f0',
                    }}
                  >
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
