import { createClient } from '@supabase/supabase-js';
import { initialServers } from '../data/serversDatabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const STORAGE_KEY = 'spiffo_servers_directory_v1';

// Cargar servidores (Supabase o Fallback Local)
export async function fetchServersList() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('votes', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Fallo al conectar con Supabase, usando respaldo local:', e);
    }
  }

  // Fallback a LocalStorage o Seed inicial
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
    max_players: parseInt(serverData.max_players) || 32,
    is_online: true,
    created_at: new Date().toISOString(),
    ...serverData,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('servers')
        .insert([newServer])
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Error guardando en Supabase, guardando en local:', e);
    }
  }

  // Guardar en LocalStorage
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
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('increment_server_vote', {
        server_id: serverId,
      });
      if (!error) return true;
    } catch (e) {}
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
