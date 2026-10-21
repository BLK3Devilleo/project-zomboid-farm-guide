'use client';

import { useState, useEffect } from 'react';
import PillNav from './components/PillNav';
import OnboardingWizard from './components/OnboardingWizard';
import LootView from './components/LootView';
import ServerList from './components/ServerList';
import GameGuideView from './components/GameGuideView';
import CommunityForumView from './components/CommunityForumView';
import LiveRadioChat from './components/LiveRadioChat';
import MissionsView from './components/MissionsView';

import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import TacticalLogModal from './components/TacticalLogModal';
import AdminPanelModal from './components/AdminPanelModal';

import { routesDatabase } from './data/routesDatabase';
import { fetchServersList } from './lib/supabaseClient';
import { useKnoxAudio } from './hooks/useKnoxAudio';
import { useAuthSession } from './hooks/useAuthSession';
import { useKnoxProgress } from './hooks/useKnoxProgress';

export default function SpiffoOSApp() {
  const { playClick, playSuccess, playSound } = useKnoxAudio();
  const { currentUser, isStaff, logout, updateProfileLocal, setSessionUser } = useAuthSession();
  const { playerData, updateProgress, toggleObjective } = useKnoxProgress(currentUser);

  // Estados de Modales y Servidores
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [serversList, setServersList] = useState([]);
  const [serverToEditInList, setServerToEditInList] = useState(null);

  // Carga inicial de servidores
  useEffect(() => {
    async function loadServers() {
      const servers = await fetchServersList();
      if (servers) setServersList(servers);
    }
    loadServers();
  }, []);

  // 1. Manejo del Wizard de Onboarding
  const handleCompleteOnboarding = ({ routeId, experience, interest }) => {
    playSuccess();
    updateProgress((prev) => ({
      ...prev,
      activeRouteId: routeId,
      activeView: 'guide',
      onboarding: { experience, interest },
    }));
  };

  // 2. Navegación y Rutas
  const handleSelectRoute = (routeId) => {
    playClick();
    updateProgress((prev) => ({
      ...prev,
      activeRouteId: routeId,
      activeView: 'guide',
    }));
  };

  const handleSelectLootCategory = (catId) => {
    playClick();
    updateProgress((prev) => ({
      ...prev,
      selectedLootCategory: catId,
      activeView: 'loot',
    }));
  };

  const handleResetToOnboarding = () => {
    playClick();
    updateProgress((prev) => ({
      ...prev,
      activeView: 'onboarding',
    }));
  };

  // 3. Manejo de Autenticación
  const handleAuthSuccess = (user) => {
    setSessionUser(user);
    playSuccess();
  };

  const handleProfileUpdated = (updatedProfile) => {
    updateProfileLocal(updatedProfile);
    playSuccess();
  };

  const handleLogout = async () => {
    await logout();
    playClick();
  };

  // 4. Objetivos y XP
  const handleToggleObjective = (routeId, objId, xpReward) => {
    toggleObjective(routeId, objId, xpReward, playSound);
  };

  // URL ↔ State sync: read ?view= on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const validViews = ['servers', 'guide', 'forum', 'loot', 'radio', 'missions', 'onboarding'];
    if (viewParam && validViews.includes(viewParam)) {
      updateProgress((p) => ({ ...p, activeView: viewParam }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // URL ↔ State sync: browser back/forward buttons
  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view') || 'servers';
      updateProgress((p) => ({ ...p, activeView: v }));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [updateProgress]);

  if (!playerData) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#060913', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
        INICIALIZANDO KNOX-OS TACTICAL HUD...
      </div>
    );
  }

  // Vista activa normalizada a las 6 secciones solicitadas
  const rawView = playerData.activeView || 'servers';
  const currentView =
    rawView === 'route' ? 'guide' :
    rawView === 'events' ? 'servers' :
    rawView;

  const activeRoute = routesDatabase.find((r) => r.id === playerData.activeRouteId) || routesDatabase[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060913', color: '#f8fafc', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* CAPA DIEGÉTICA DE LÍNEAS CRT STITCH */}
      <div
        className="crt-scanlines"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0.22,
        }}
        aria-hidden="true"
      />

      {/* NAVBAR EN CÁPSULA FLOTANTE (EXACTAMENTE 6 SECCIONES + ACCEDER/PERFIL) */}
      <PillNav
        activeView={currentView}
        onSelectView={(v) => {
          playClick();
          window.history.pushState({}, '', '/?view=' + v);
          updateProgress((p) => ({ ...p, activeView: v }));
        }}
        activeRouteId={playerData.activeRouteId}
        onSelectRoute={handleSelectRoute}
        onSelectLootCategory={handleSelectLootCategory}
        onResetToOnboarding={handleResetToOnboarding}
        globalXp={playerData.globalXp}
        currentUser={currentUser}
        isStaff={isStaff}
        onOpenLoginModal={() => setAuthModalOpen(true)}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        onOpenLogsModal={() => setLogsModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* CONTENIDO PRINCIPAL SEGÚN ESTADO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Onboarding Asistente */}
        {currentView === 'onboarding' && (
          <OnboardingWizard onComplete={handleCompleteOnboarding} />
        )}

        {/* 1. SERVIDORES (con Cartel de Anuncios de Eventos) */}
        {currentView === 'servers' && (
          <ServerList
            currentUser={currentUser}
            onOpenLoginModal={() => setAuthModalOpen(true)}
            serverToEdit={serverToEditInList}
            onClearServerToEdit={() => setServerToEditInList(null)}
          />
        )}

        {/* 2. GUÍA DE JUEGO (Manuales Tácticos Oficiales con Misiones XP & Debate) */}
        {currentView === 'guide' && (
          <GameGuideView
            currentUser={currentUser}
            playerData={playerData}
            toggleObjective={(objId, xp) => handleToggleObjective('guide', objId, xp)}
            playSound={playSound}
          />
        )}

        {/* 3. FORO COMUNITARIO (Hilos de Debate Reddit-Style) */}
        {(currentView === 'forum' || currentView === 'tips') && (
          <CommunityForumView
            currentUser={currentUser}
            onOpenLoginModal={() => setAuthModalOpen(true)}
          />
        )}

        {/* 4. LOOT POINTS (Escáner Táctico de Zonas & POIs por Mapa) */}
        {currentView === 'loot' && (
          <LootView
            onSelectRoute={handleSelectRoute}
          />
        )}

        {/* 5. RADIO (CHAT EN VIVO FRECUENCIA 91.5 MHz) */}
        {currentView === 'radio' && (
          <div style={{ maxWidth: 840, width: '100%', margin: '0 auto', padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <LiveRadioChat
              currentUser={currentUser}
              onOpenLoginModal={() => setAuthModalOpen(true)}
              serversList={serversList}
            />
          </div>
        )}

        {/* 6. MISIONES (Panel Modular de Tareas del Superviviente & XP) */}
        {currentView === 'missions' && (
          <MissionsView
            playerData={playerData}
            onToggleObjective={handleToggleObjective}
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
        onOpenAddServer={(serverToEdit) => {
          setServerToEditInList(serverToEdit || { __isNew: true });
          window.history.pushState({}, '', '/?view=servers');
          updateProgress((p) => ({ ...p, activeView: 'servers' }));
        }}
      />

      {/* MODAL PANEL DE ADMINISTRACIÓN Y MODERACIÓN TÁCTICA */}
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        currentUser={currentUser}
      />

      {/* MODAL TERMINAL DE LOGS SSE EN VIVO */}
      <TacticalLogModal
        isOpen={logsModalOpen}
        onClose={() => setLogsModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
