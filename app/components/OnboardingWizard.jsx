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
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 flex flex-col gap-6">
      {/* CABECERA TÁCTICA 2026 CON HOLOCARD */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden border border-[rgba(255,255,255,0.1)]">
        <div className="flex-1 z-10 text-center sm:text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#10b981] bg-[#10b9811f] border border-[#10b9814d] px-3 py-1 rounded-md inline-block font-mono">
            SPIFFO-OS TACTICAL ADVISOR
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 mb-2">
            {currentData.question}
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-xl m-0">
            {currentData.subtitle}
          </p>
        </div>

        <div className="z-10 flex flex-col items-center gap-1">
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
          <span className="text-[9px] font-mono text-[#94a3b8] tracking-widest uppercase">
            TOUCH / TILT
          </span>
        </div>
      </div>

      {/* BOTÓN RETORNO */}
      {currentStep === 'step2_newbie' && (
        <button
          onClick={() => setCurrentStep('step1')}
          className="self-start text-xs font-black text-[#38bdf8] flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          <span>←</span>
          <span>Volver a opciones principales</span>
        </button>
      )}

      {/* GRID DE OPCIONES TÁCTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentData.options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => handleOptionClick(opt)}
            className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col gap-3 relative group border border-[rgba(255,255,255,0.08)] hover:border-[#10b981] transition-all duration-200"
          >
            {opt.badge && (
              <span className="absolute top-4 right-4 text-[9px] font-mono font-black uppercase tracking-wider bg-[#10b98126] text-[#34d399] border border-[#10b98180] px-2 py-0.5 rounded-md">
                {opt.badge}
              </span>
            )}

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
                {opt.icon}
              </div>
              <h3 className="text-base font-black text-white m-0 tracking-tight">
                {opt.title}
              </h3>
            </div>

            <p className="text-xs text-[#cbd5e1] leading-relaxed m-0">
              {opt.desc}
            </p>

            <div className="mt-auto pt-2 flex justify-end">
              <span className="text-[11px] font-black text-[#10b981] group-hover:translate-x-1 transition-transform">
                {opt.action === 'next_step' ? 'Continuar →' : 'Empezar esta ruta →'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
