'use client';

import { useState, useEffect } from 'react';
import PillNav from './components/PillNav';
import OnboardingWizard from './components/OnboardingWizard';
import RouteView from './components/RouteView';
import LootView from './components/LootView';
import ServerList from './components/ServerList';
import GameGuideView from './components/GameGuideView';
import CommunityForumView from './components/CommunityForumView';
import LiveRadioChat from './components/LiveRadioChat';

import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import TacticalLogModal from './components/TacticalLogModal';
import AdminPanelModal from './components/AdminPanelModal';

import { routesDatabase } from './data/routesDatabase';
import { fetchServersList } from './lib/supabaseClient';
import { useKnoxAudio } from './hooks/useKnoxAudio';
import { useAuthSession } from './hooks/useAuthSession';
import { useKnoxProgress } from './hooks/useKnoxProgress';
import { CrosshairIcon, CheckIcon, RankChevronIcon } from './components/icons/KnoxIcons';

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

        {/* 6. MISIONES (Panel de Tareas del Superviviente & XP) */}
        {currentView === 'missions' && (
          <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="pz-mission-panel" style={{ padding: '24px 28px' }}>
              <div className="pz-mission-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CrosshairIcon size={14} color="#10b981" />
                  <span>REGISTRO DE OPERACIONES TÁCTICAS // MISIONES ACTIVAS</span>
                </div>
                <span style={{ color: '#38bdf8' }}>XP TOTAL: {playerData.globalXp || 0}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
                    Misiones & Directivas de Campo
                  </h1>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
                    Marca tus objetivos cumplidos en Kentucky para acumular XP y desbloquear rangos de veterano en tu perfil.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <RankChevronIcon size={16} color="#10b981" />
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>
                    Nivel {Math.floor((playerData.globalXp || 0) / 100) + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Listado de todas las misiones por ruta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {routesDatabase.map((r) => {
                const currentRouteProg = playerData.routes?.[r.id] || { completedObjectives: [] };
                return (
                  <div key={r.id} className="pz-mission-panel" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <strong style={{ fontSize: 16, color: '#38bdf8', fontFamily: 'monospace' }}>
                        {r.title}
                      </strong>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                        {r.difficulty} • {r.levels.length} Fases
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {r.levels.flatMap((lvl) => lvl.objectives).map((obj) => {
                        const isDone = currentRouteProg.completedObjectives?.includes(obj.id);
                        return (
                          <div
                            key={obj.id}
                            onClick={() => handleToggleObjective(r.id, obj.id, obj.xp)}
                            className={`task-card ${isDone ? 'checked' : ''}`}
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ width: 18, height: 18, borderRadius: 3, border: isDone ? '1px solid #10b981' : '1px solid #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#10b981' : 'transparent' }}>
                                {isDone && <CheckIcon size={12} color="#04120c" />}
                              </span>
                              <span style={{ fontSize: 13, color: isDone ? '#34d399' : '#f8fafc', textDecoration: isDone ? 'line-through' : 'none' }}>
                                {obj.label}
                              </span>
                            </div>
                            <span className="task-xp-badge">
                              +{obj.xp} XP
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
          setServerToEditInList(serverToEdit || null);
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
