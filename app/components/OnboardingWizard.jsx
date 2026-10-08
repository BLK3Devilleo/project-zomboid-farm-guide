'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ONBOARDING_FLOW } from '../data/onboardingOptions';

export default function OnboardingWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState('step1'); // 'step1' | 'step2_newbie'

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
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* CABECERA SPIFFO */}
      <div
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(51, 65, 85, 0.8)',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Asistente Táctico de Kentucky
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
            {currentData.question}
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
            {currentData.subtitle}
          </p>
        </div>
        <div className="float-spiffo" style={{ width: '64px', height: '64px', flexShrink: 0 }}>
          <Image src="/spiffo/spiffo_character.png" alt="Spiffo" width={64} height={64} style={{ objectFit: 'contain' }} />
        </div>
      </div>

      {/* BOTÓN VOLVER (SI ESTÁ EN EL PASO 2) */}
      {currentStep === 'step2_newbie' && (
        <button
          onClick={() => setCurrentStep('step1')}
          style={{
            marginBottom: '16px',
            fontSize: '12px',
            fontWeight: 700,
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

      {/* TARJETAS INTERACTIVAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {currentData.options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => handleOptionClick(opt)}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '2px solid #334155',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.85)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#334155';
              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {opt.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  fontSize: '9px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid #10b981',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  textTransform: 'uppercase',
                }}
              >
                {opt.badge}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{opt.icon}</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {opt.title}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
              {opt.desc}
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>
                {opt.action === 'next_step' ? 'Continuar →' : 'Empezar esta ruta →'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
