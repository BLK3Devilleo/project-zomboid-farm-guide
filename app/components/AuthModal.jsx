'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { loginWithGoogleCredential } from '../lib/authClient';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const googleBtnRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Inicializar Google Sign-In SDK
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const initGoogleGSI = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId || 'GOOGLE_CLIENT_ID_PLACEHOLDER',
          callback: async (response) => {
            if (response?.credential) {
              setLoading(true);
              setErrorMessage('');
              try {
                const user = await loginWithGoogleCredential(response.credential);
                onAuthSuccess(user);
                onClose();
              } catch (err) {
                setErrorMessage(err.message || 'Error al conectar con el servidor.');
              } finally {
                setLoading(false);
              }
            }
          },
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            locale: 'es',
            width: 280,
          });
        }
      }
    };

    const timer = setTimeout(initGoogleGSI, 150);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, onAuthSuccess]);

  if (!isOpen) return null;

  return (
    <div className="server-modal-backdrop" onClick={onClose}>
      <div
        className="server-modal-content"
        style={{ maxWidth: 440, padding: 28, textAlign: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ICONO / LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#060913',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src="/spiffo/spiffo_character.png"
                alt="Spiffo"
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>
          Identificación de Superviviente
        </h2>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          Inicia sesión con tu cuenta de Google para enlistar y administrar tus servidores en el ranking oficial de Project Zomboid.
        </p>

        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 12,
              marginBottom: 18,
              textAlign: 'left',
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* CONTENEDOR DEL BOTÓN DE GOOGLE */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: 48,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          {loading ? (
            <div style={{ color: '#10b981', fontWeight: 800, fontSize: 13, fontFamily: 'monospace' }}>
              ⚙️ Verificando credenciales militares...
            </div>
          ) : (
            <div ref={googleBtnRef}></div>
          )}
        </div>

        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, marginBottom: 20 }}>
          🔒 Protección por Cloudflare D1 y Zod. Tu sesión es cifrada y segura.
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: 13,
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Cancelar y continuar como invitado
        </button>
      </div>
    </div>
  );
}
