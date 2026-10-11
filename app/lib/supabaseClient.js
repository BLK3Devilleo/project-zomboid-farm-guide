import { initialServers } from '../data/serversDatabase';

const STORAGE_KEY = 'spiffo_servers_directory_v1';

// Cargar servidores (API /api/servers con fallback a LocalStorage)
export async function fetchServersList() {
  try {
    const res = await fetch('/api/servers', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Guardar copia local de caché
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
          } catch (e) {}
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API /api/servers unreachable, usando caché local:', err);
  }

  // Fallback a LocalStorage o datos iniciales
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialServers));
    } catch (e) {}
  }

  return initialServers;
}

// Agregar nuevo servidor
export async function createServerEntry(serverData) {
  const newServer = {
    id: `srv-${Date.now()}`,
    votes: 0,
    players_online: Math.floor(Math.random() * 8) + 2,
    max_players: parseInt(serverData.max_players, 10) || 32,
    is_online: true,
    ...serverData,
  };

  try {
    const res = await fetch('/api/servers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newServer),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        // Actualizar cache local
        if (typeof window !== 'undefined') {
          try {
            const current = await fetchServersList();
            const exists = current.some((s) => s.id === json.data.id);
            if (!exists) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify([json.data, ...current]));
            }
          } catch (e) {}
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Fallo al registrar servidor en API, guardando en local:', err);
  }

  // Fallback Local
  if (typeof window !== 'undefined') {
    try {
      const current = await fetchServersList();
      const updated = [newServer, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  return newServer;
}

// Votar servidor (+1 Reputación)
export async function upvoteServerEntry(serverId) {
  try {
    const res = await fetch('/api/servers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: serverId }),
    });

    if (res.ok) {
      // Actualizar local
      if (typeof window !== 'undefined') {
        try {
          const current = await fetchServersList();
          const updated = current.map((s) =>
            s.id === serverId ? { ...s, votes: (s.votes || 0) + 1 } : s
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {}
      }
      return true;
    }
  } catch (err) {
    console.warn('Fallo al registrar voto en API:', err);
  }

  // Fallback Local
  if (typeof window !== 'undefined') {
    try {
      const current = await fetchServersList();
      const updated = current.map((s) =>
        s.id === serverId ? { ...s, votes: (s.votes || 0) + 1 } : s
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {}
  }

  return false;
}
