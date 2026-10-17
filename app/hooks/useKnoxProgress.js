'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadProgress, saveProgress } from '../lib/progressStorage';

/**
 * Hook Modular para Gestión del Progreso KnoxOS (100% Cloud-First)
 * - Para usuarios registrados: Sincroniza bidireccionalmente con Cloudflare D1 (/api/user/profile).
 * - Mantiene caché local para renderizado instantáneo sin parpadeos.
 */
export function useKnoxProgress(currentUser) {
  const [playerData, setPlayerData] = useState(null);
  const syncTimeoutRef = useRef(null);

  // 1. Carga inicial desde caché local
  useEffect(() => {
    const local = loadProgress();
    setPlayerData(local);
  }, []);

  // 2. Sincronización desde la nube al detectar sesión activa
  useEffect(() => {
    if (!currentUser) return;

    async function syncFromCloud() {
      try {
        const res = await fetch('/api/user/profile', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile) {
            const cloud = data.profile;
            setPlayerData((prev) => {
              if (!prev) return prev;
              const cloudXp = typeof cloud.xp === 'number' ? cloud.xp : prev.globalXp;
              const merged = {
                ...prev,
                globalXp: Math.max(prev.globalXp || 0, cloudXp),
                activeRouteId: cloud.active_route || prev.activeRouteId,
              };
              saveProgress(merged);
              return merged;
            });
          }
        }
      } catch (err) {
        // Red no disponible o modo offline
      }
    }

    syncFromCloud();
  }, [currentUser?.id]);

  // 3. Envío diferido (debounced) de progreso hacia Cloudflare D1
  const pushProgressToCloud = useCallback(
    (xp, activeRouteId, completedMilestones) => {
      if (!currentUser) return;

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(async () => {
        try {
          await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              xp,
              active_route: activeRouteId,
              completed_milestones: completedMilestones,
            }),
          });
        } catch (err) {
          // Fallo de red silencioso
        }
      }, 600);
    },
    [currentUser]
  );

  // 4. Actualizador central de estado
  const updateProgress = useCallback(
    (updater) => {
      setPlayerData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        saveProgress(next);

        // Extraer hitos completados de todas las rutas para sincronizar
        const allCompleted = [];
        if (next.routes) {
          Object.values(next.routes).forEach((r) => {
            if (Array.isArray(r.completedObjectives)) {
              allCompleted.push(...r.completedObjectives);
            }
          });
        }

        pushProgressToCloud(next.globalXp, next.activeRouteId, allCompleted);
        return next;
      });
    },
    [pushProgressToCloud]
  );

  // 5. Toggle de objetivo con cálculo de XP
  const toggleObjective = useCallback(
    (routeId, objId, xpReward, onActionSound) => {
      updateProgress((prev) => {
        const currentRoute = prev.routes?.[routeId] || { completedObjectives: [], earnedXp: 0 };
        const isCompleted = currentRoute.completedObjectives?.includes(objId);

        let newCompleted = [];
        let newRouteXp = currentRoute.earnedXp || 0;
        let newGlobalXp = prev.globalXp || 0;

        if (isCompleted) {
          if (onActionSound) onActionSound('click');
          newCompleted = currentRoute.completedObjectives.filter((k) => k !== objId);
          newRouteXp = Math.max(0, newRouteXp - xpReward);
          newGlobalXp = Math.max(0, newGlobalXp - xpReward);
        } else {
          if (onActionSound) onActionSound('success');
          newCompleted = [...(currentRoute.completedObjectives || []), objId];
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
    },
    [updateProgress]
  );

  return {
    playerData,
    setPlayerData,
    updateProgress,
    toggleObjective,
  };
}

export default useKnoxProgress;
