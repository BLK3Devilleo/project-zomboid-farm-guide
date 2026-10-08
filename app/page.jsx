'use client';

import { useState, useEffect } from 'react';
import PillNav from './components/PillNav';
import OnboardingWizard from './components/OnboardingWizard';
import RouteView from './components/RouteView';
import LootView from './components/LootView';
import { routesDatabase } from './data/routesDatabase';
import { loadProgress, saveProgress } from './lib/progressStorage';

// Sonidos sintéticos con Web Audio API (cero dependencias externas)
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {}
}

export default function SpiffoOSApp() {
  const [playerData, setPlayerData] = useState(null);

  // Carga inicial del progreso guardado en localStorage
  useEffect(() => {
    const loaded = loadProgress();
    setPlayerData(loaded);
  }, []);

  // Actualizar y persistir el estado centralizado
  const updateStateAndSave = (updater) => {
    setPlayerData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveProgress(next);
      return next;
    });
  };

  // 1. Manejo del Wizard de Onboarding
  const handleCompleteOnboarding = ({ routeId, experience, interest }) => {
    playSound('success');
    updateStateAndSave((prev) => ({
      ...prev,
      activeRouteId: routeId,
      activeView: 'route',
      onboarding: { experience, interest },
    }));
  };

  // 2. Selección de Ruta desde el Navbar
  const handleSelectRoute = (routeId) => {
    playSound('click');
    updateStateAndSave((prev) => ({
      ...prev,
      activeRouteId: routeId,
      activeView: 'route',
    }));
  };

  // 3. Selección de Categoría de Loot desde el Navbar
  const handleSelectLootCategory = (catId) => {
    playSound('click');
    updateStateAndSave((prev) => ({
      ...prev,
      activeView: 'loot',
      selectedLootCategory: catId,
    }));
  };

  // 4. Volver al Onboarding (sin borrar el progreso ya ganado)
  const handleResetToOnboarding = () => {
    playSound('click');
    updateStateAndSave((prev) => ({
      ...prev,
      activeView: 'onboarding',
    }));
  };

  // 5. Marcar / Desmarcar objetivo en la checklist
  const handleToggleObjective = (routeId, objectiveId, xpValue) => {
    playSound('click');
    updateStateAndSave((prev) => {
      const currentRoute = prev.routes[routeId] || { completedObjectives: [], earnedXp: 0 };
      const alreadyChecked = currentRoute.completedObjectives.includes(objectiveId);

      let newCompleted;
      let newRouteXp;
      let newGlobalXp;

      if (alreadyChecked) {
        newCompleted = currentRoute.completedObjectives.filter((id) => id !== objectiveId);
        newRouteXp = Math.max(0, currentRoute.earnedXp - xpValue);
        newGlobalXp = Math.max(0, prev.globalXp - xpValue);
      } else {
        playSound('success');
        newCompleted = [...currentRoute.completedObjectives, objectiveId];
        newRouteXp = currentRoute.earnedXp + xpValue;
        newGlobalXp = prev.globalXp + xpValue;
      }

      return {
        ...prev,
        globalXp: newGlobalXp,
        routes: {
          ...prev.routes,
          [routeId]: {
            ...currentRoute,
            completedObjectives: newCompleted,
            earnedXp: newRouteXp,
          },
        },
      };
    });
  };

  if (!playerData) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center text-[#10b981] font-mono tracking-widest text-sm">
        INICIALIZANDO SPIFFO-OS TACTICAL HUD...
      </div>
    );
  }

  // Determinar vista activa
  const isViewingOnboarding = playerData.activeView === 'onboarding' || !playerData.activeRouteId;
  const isViewingLoot = playerData.activeView === 'loot';
  const activeRoute = routesDatabase.find((r) => r.id === playerData.activeRouteId) || routesDatabase[0];

  return (
    <div className="min-h-screen bg-[#060913] text-[#f8fafc] flex flex-col font-sans">
      {/* NAVBAR EN CÁPSULA FLOTANTE REACT BITS */}
      <PillNav
        activeView={playerData.activeView}
        onSelectView={(v) => updateStateAndSave((p) => ({ ...p, activeView: v }))}
        activeRouteId={playerData.activeRouteId}
        onSelectRoute={handleSelectRoute}
        onSelectLootCategory={handleSelectLootCategory}
        onResetToOnboarding={handleResetToOnboarding}
        globalXp={playerData.globalXp}
      />

      {/* CONTENIDO PRINCIPAL SEGÚN ESTADO */}
      <main className="flex-1 flex flex-col">
        {isViewingOnboarding && (
          <OnboardingWizard onComplete={handleCompleteOnboarding} />
        )}

        {isViewingLoot && (
          <LootView
            selectedCategory={playerData.selectedLootCategory}
            onSelectRoute={handleSelectRoute}
          />
        )}

        {!isViewingOnboarding && !isViewingLoot && (
          <RouteView
            route={activeRoute}
            progress={playerData}
            onToggleObjective={handleToggleObjective}
            onOpenLootCategory={handleSelectLootCategory}
          />
        )}
      </main>
    </div>
  );
}
