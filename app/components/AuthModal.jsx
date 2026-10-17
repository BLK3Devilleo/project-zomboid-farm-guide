'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { loginWithGoogleCredential } from '../lib/authClient';
import { useTacticalModal } from '../hooks/useTacticalModal';
import {
  HazardIcon,
  ShieldAdminIcon,
  RefreshIcon,
  CloseCrossIcon,
} from './icons/KnoxIcons';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { modalContainerProps } = useTacticalModal(isOpen, onClose);
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
        {...modalContainerProps}
        className="server-modal-content"
        style={{ maxWidth: 440, padding: 28, textAlign: 'center', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
          }}
          title="Cerrar [ESC]"
        >
          <CloseCrossIcon size={16} />
        </button>

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
                overflow: 'hidden',
              }}
            >
              <Image
                src="/spiffo/ferret_mascot.jpg"
                alt="Huron Superviviente"
                width={54}
                height={54}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>
          Identificación de Superviviente
        </h2>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          Inicia sesión con tu cuenta de Google para sincronizar tu progreso y nivel en la nube y administrar tus servidores.
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
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <HazardIcon size={14} color="#f87171" />
            <span>{errorMessage}</span>
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
            <div style={{ color: '#10b981', fontWeight: 800, fontSize: 13, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshIcon size={14} className="animate-spin" />
              <span>Verificando credenciales militares...</span>
            </div>
          ) : (
            <div ref={googleBtnRef}></div>
          )}
        </div>

        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <ShieldAdminIcon size={13} color="#64748b" />
          <span>Protección por Cloudflare D1 y Zod. Sesión cifrada y segura.</span>
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
          Cancelar y continuar como invitado [ESC]
        </button>
      </div>
    </div>
  );
}
