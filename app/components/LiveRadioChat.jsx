'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ROLE_LABELS } from '../lib/authClient';

export default function LiveRadioChat({
  currentUser = null,
  onOpenLoginModal = () => {},
  serversList = [],
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedServerRef, setSelectedServerRef] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatFeedback, setChatFeedback] = useState('');
  const chatScrollRef = useRef(null);

  // Carga inicial y sondeo periódico (Polling ligero cada 4.5 segundos)
  useEffect(() => {
    let isMounted = true;

    async function fetchMessages() {
      try {
        const res = await fetch('/api/chat', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && isMounted) {
            setMessages(json.messages || []);
          }
        }
      } catch (err) {
        // Silencioso en caso de caída temporal
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMessages();
    const interval = setInterval(fetchMessages, 4500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto scroll al último mensaje recibido
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!currentUser) {
      setChatFeedback('Debes identificarte con Google para transmitir por radio.');
      onOpenLoginModal();
      return;
    }

    setSending(true);
    setChatFeedback('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputText.trim(),
          server_ref_id: selectedServerRef || '',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Fallo al transmitir en la frecuencia.');
      }

      // Añadir mensaje optimista
      setMessages((prev) => [...prev, json.message]);
      setInputText('');
      setSelectedServerRef('');
    } catch (err) {
      setChatFeedback(`⚠️ ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(6, 10, 20, 0.95)',
        border: '1.5px solid rgba(16, 185, 129, 0.35)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 520,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* SINTONIZADOR DE RADIO MILITAR (CABECERA) */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>📻</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#10b981',
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                }}
              >
                FRECUENCIA 91.5 MHz · RADIO COMUNITARIA
              </span>
              <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800 }}>
                ● EN VIVO
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Transmisión abierta para coordinar partidas y supervivencia
            </span>
          </div>
        </div>

        {!currentUser && (
          <button
            onClick={onOpenLoginModal}
            className="btn-tactical"
            style={{ padding: '6px 14px', fontSize: 11, borderRadius: 20 }}
          >
            🔑 Conectar Radio
          </button>
        )}
      </div>

      {/* ÁREA DE MENSAJES (CANAL DE RADIO) */}
      <div
        ref={chatScrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', color: '#10b981', fontFamily: 'monospace', fontSize: 12, padding: 30 }}>
            📡 SINTONIZANDO SEÑAL DE KNOX COUNTY...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 30 }}>
            Canal en silencio. Sé el primero en mandar una transmisión de auxilio o reclutamiento.
          </div>
        ) : (
          messages.map((msg) => {
            const roleMeta = ROLE_LABELS[msg.user_role] || ROLE_LABELS.usuario;
            const timeFormatted = new Date(msg.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: '#040d12',
                    border: `1px solid ${roleMeta.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={msg.avatar || '/spiffo/spiffo_combat.png'}
                    alt={msg.user_name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                {/* Contenido del mensaje */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#ffffff' }}>
                      {msg.user_name}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 900,
                        color: roleMeta.color,
                        fontFamily: 'monospace',
                        background: roleMeta.glow,
                        padding: '1px 6px',
                        borderRadius: 3,
                      }}
                    >
                      {roleMeta.label}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginLeft: 'auto' }}>
                      {timeFormatted}
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, wordBreak: 'break-word', lineHeight: 1.4 }}>
                    {msg.message}
                  </p>

                  {/* Servidor referenciado si lo tiene */}
                  {msg.server_ref_id && (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 11,
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.1)',
                        padding: '2px 8px',
                        borderRadius: 4,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      🌐 Servidor: {msg.server_ref_id}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {chatFeedback && (
        <div
          style={{
            padding: '6px 18px',
            fontSize: 11,
            color: '#f87171',
            background: 'rgba(239, 68, 68, 0.1)',
            borderTop: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {chatFeedback}
        </div>
      )}

      {/* ÁREA DE TRANSMISIÓN (INPUT) */}
      <form
        onSubmit={handleSendMessage}
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 16px',
          background: 'rgba(10, 15, 30, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentUser
                ? '📻 Transmitir mensaje en la frecuencia de radio (máx 280 caracteres)...'
                : '🔒 Inicia sesión con Google para transmitir por radio...'
            }
            disabled={!currentUser || sending}
            className="form-input"
            maxLength={280}
            style={{ flex: 1, fontSize: 13 }}
          />

          <button
            type="submit"
            disabled={!currentUser || sending || !inputText.trim()}
            className="btn-tactical"
            style={{ padding: '8px 18px', fontSize: 12, borderRadius: 8, flexShrink: 0 }}
          >
            {sending ? '...' : '📡 Transmitir'}
          </button>
        </div>

        {/* Opcional: Vincular invitación a un servidor */}
        {serversList.length > 0 && currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
              Vincular a Servidor:
            </span>
            <select
              value={selectedServerRef}
              onChange={(e) => setSelectedServerRef(e.target.value)}
              className="form-select"
              style={{ padding: '2px 8px', fontSize: 11, width: 'auto', height: 26 }}
            >
              <option value="">Ninguno (Mensaje general)</option>
              {serversList.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>
    </div>
  );
}
