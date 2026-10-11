'use client';

import { useState, useEffect } from 'react';
import PillNav from './components/PillNav';
import OnboardingWizard from './components/OnboardingWizard';
import RouteView from './components/RouteView';
import LootView from './components/LootView';
import ServerList from './components/ServerList';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import LiveRadioChat from './components/LiveRadioChat';
import { routesDatabase } from './data/routesDatabase';
import { loadProgress, saveProgress } from './lib/progressStorage';
import { getActiveSession, logoutUser } from './lib/authClient';
import { fetchServersList } from './lib/supabaseClient';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [serversList, setServersList] = useState([]);

  // Carga inicial del progreso guardado en localStorage, sesión activa y lista de servers
  useEffect(() => {
    const loaded = loadProgress();
    setPlayerData(loaded);

    async function checkUser() {
      const user = await getActiveSession();
      if (user) {
        setCurrentUser(user);
      }
    }
    checkUser();

    async function loadServers() {
      const servers = await fetchServersList();
      if (servers) setServersList(servers);
    }
    loadServers();
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
      selectedLootCategory: catId,
      activeView: 'loot',
    }));
  };

  // 4. Reiniciar al Asistente
  const handleResetToOnboarding = () => {
    playSound('click');
    updateStateAndSave((prev) => ({
      ...prev,
      activeView: 'onboarding',
    }));
  };

  // 5. Manejo de Autenticación y Perfil
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    playSound('success');
  };

  const handleProfileUpdated = (updatedProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
    playSound('success');
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    playSound('click');
  };

  // 6. Marcar/Desmarcar Objetivo de Ruta
  const handleToggleObjective = (routeId, levelId, objIndex, xpReward) => {
    updateStateAndSave((prev) => {
      const currentRoute = prev.routes?.[routeId] || { completedObjectives: [], earnedXp: 0 };
      const objKey = `${levelId}-${objIndex}`;
      const isCompleted = currentRoute.completedObjectives?.includes(objKey);

      let newCompleted = [];
      let newRouteXp = currentRoute.earnedXp || 0;
      let newGlobalXp = prev.globalXp || 0;

      if (isCompleted) {
        playSound('click');
        newCompleted = currentRoute.completedObjectives.filter((k) => k !== objKey);
        newRouteXp = Math.max(0, newRouteXp - xpReward);
        newGlobalXp = Math.max(0, newGlobalXp - xpReward);
      } else {
        playSound('success');
        newCompleted = [...(currentRoute.completedObjectives || []), objKey];
        newRouteXp += xpReward;
        newGlobalXp += xpReward;
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
      <div style={{ minHeight: '100vh', backgroundColor: '#060913', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
        INICIALIZANDO SPIFFO-OS TACTICAL HUD...
      </div>
    );
  }

  // Determinar vista activa
  const isViewingServers = playerData.activeView === 'servers';
  const isViewingRadio = playerData.activeView === 'radio';
  const isViewingLoot = playerData.activeView === 'loot';
  const isViewingOnboarding =
    playerData.activeView === 'onboarding' ||
    (!playerData.activeRouteId && !isViewingServers && !isViewingLoot && !isViewingRadio);
  const activeRoute = routesDatabase.find((r) => r.id === playerData.activeRouteId) || routesDatabase[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060913', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR EN CÁPSULA FLOTANTE */}
      <PillNav
        activeView={playerData.activeView}
        onSelectView={(v) => updateStateAndSave((p) => ({ ...p, activeView: v }))}
        activeRouteId={playerData.activeRouteId}
        onSelectRoute={handleSelectRoute}
        onSelectLootCategory={handleSelectLootCategory}
        onResetToOnboarding={handleResetToOnboarding}
        globalXp={playerData.globalXp}
        currentUser={currentUser}
        onOpenLoginModal={() => setAuthModalOpen(true)}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* CONTENIDO PRINCIPAL SEGÚN ESTADO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {isViewingOnboarding && (
          <OnboardingWizard onComplete={handleCompleteOnboarding} />
        )}

        {isViewingServers && (
          <ServerList
            currentUser={currentUser}
            onOpenLoginModal={() => setAuthModalOpen(true)}
          />
        )}

        {isViewingRadio && (
          <div style={{ maxWidth: 840, width: '100%', margin: '0 auto', padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <LiveRadioChat
              currentUser={currentUser}
              onOpenLoginModal={() => setAuthModalOpen(true)}
              serversList={serversList}
            />
          </div>
        )}

        {isViewingLoot && (
          <LootView
            selectedCategory={playerData.selectedLootCategory}
            onSelectRoute={handleSelectRoute}
          />
        )}

        {!isViewingOnboarding && !isViewingLoot && !isViewingServers && !isViewingRadio && (
          <RouteView
            route={activeRoute}
            progress={playerData}
            onToggleObjective={handleToggleObjective}
            onOpenLootCategory={handleSelectLootCategory}
          />
        )}
      </main>

      {/* MODAL DE AUTENTICACIÓN GOOGLE */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* MODAL DE FICHA DE SUPERVIVIENTE & MIS SERVIDORES */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={currentUser}
        globalXp={playerData.globalXp}
        onProfileUpdated={handleProfileUpdated}
        onOpenAddServer={() => {
          updateStateAndSave((p) => ({ ...p, activeView: 'servers' }));
        }}
      />
    </div>
  );
}
