'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ONBOARDING_FLOW } from '../data/onboardingOptions';

export default function OnboardingWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState('step1');

  const handleOptionClick = (option) => {
    if (option.action === 'next_step') {
      setCurrentStep('step2_newbie');
    } else if (option.routeId) {
      onComplete({
        routeId: option.routeId,
        experience: currentStep === 'step2_newbie' ? 'new' : option.id,
        interest: option.id,
      });
    }
  };

  const currentData = ONBOARDING_FLOW[currentStep];

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '48px 20px 80px' }}>
      {/* CABECERA ULTRA-MODERNA */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ zIndex: 2 }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            Asistente Táctico 2026
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px', letterSpacing: '-0.02em' }}>
            {currentData.question}
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0, maxWidth: '580px' }}>
            {currentData.subtitle}
          </p>
        </div>
        <div className="float-spiffo" style={{ width: '72px', height: '72px', flexShrink: 0, zIndex: 2 }}>
          <Image src="/spiffo/spiffo_character.png" alt="Spiffo" width={72} height={72} style={{ objectFit: 'contain' }} />
        </div>
      </div>

      {/* BOTÓN RETORNO */}
      {currentStep === 'step2_newbie' && (
        <button
          onClick={() => setCurrentStep('step1')}
          style={{
            marginBottom: '20px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          ← Volver a opciones principales
        </button>
      )}

      {/* GRID DE OPCIONES 2026 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {currentData.options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => handleOptionClick(opt)}
            className="glass-card"
            style={{
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative',
            }}
          >
            {opt.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  fontSize: '9px',
                  fontWeight: 900,
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid #10b981',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {opt.badge}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                {opt.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                {opt.title}
              </h3>
            </div>

            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
              {opt.desc}
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981' }}>
                {opt.action === 'next_step' ? 'Continuar →' : 'Empezar esta ruta →'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
