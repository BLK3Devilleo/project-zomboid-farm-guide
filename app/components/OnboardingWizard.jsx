'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HoloCard from './HoloCard';
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
    <div className="hud-container">
      {/* CABECERA TÁCTICA CON HOLOCARD */}
      <div className="hud-panel">
        <div className="hud-hero">
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                textTransform: 'uppercase',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                padding: '2px 8px',
                borderRadius: 6,
                fontFamily: 'monospace',
                letterSpacing: '0.06em',
                alignSelf: 'flex-start',
              }}
            >
              SPIFFO-OS ASESOR TÁCTICO
            </span>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#ffffff',
                margin: '4px 0 0',
                letterSpacing: '-0.02em',
              }}
            >
              {currentData.question}
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: 0, maxWidth: 540 }}>
              {currentData.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <HoloCard
              image="/spiffo/spiffo_character.png"
              alt="Spiffo Guía"
              preset="bursts"
              width={110}
              radius={14}
              intensity={0.9}
              edgeSparkle={0.8}
              tiltMax={14}
            />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
              TOCA / INCLINA 3D
            </span>
          </div>
        </div>
      </div>

      {/* BOTÓN RETORNO */}
      {currentStep === 'step2_newbie' && (
        <button
          onClick={() => setCurrentStep('step1')}
          className="btn-secondary"
          style={{ alignSelf: 'flex-start' }}
        >
          <span>←</span>
          <span>Volver a opciones principales</span>
        </button>
      )}

      {/* GRID DE OPCIONES TÁCTICAS */}
      <div className="onboarding-grid">
        {currentData.options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => handleOptionClick(opt)}
            className="onboarding-card"
          >
            {opt.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  fontSize: 9,
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.45)',
                  padding: '2px 6px',
                  borderRadius: 6,
                }}
              >
                {opt.badge}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                {opt.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: 0 }}>
                {opt.title}
              </h3>
            </div>

            <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              {opt.desc}
            </p>

            <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#10b981' }}>
                {opt.action === 'next_step' ? 'Continuar →' : 'Empezar esta ruta →'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
