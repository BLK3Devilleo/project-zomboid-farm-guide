// Centralizador de almacenamiento en localStorage para Spiffo-OS
// Maneja un único objeto estructurado con versión, migraciones y tolerancia a fallos.

const STORAGE_KEY = 'spiffo_os_player_data';
const CURRENT_VERSION = 1;

export const DEFAULT_STORAGE_STATE = {
  version: CURRENT_VERSION,
  activeRouteId: null, // null muestra el Onboarding Wizard por defecto
  activeView: 'route', // 'onboarding' | 'route' | 'loot'
  selectedLootCategory: 'all',
  onboarding: {
    experience: null, // 'new' | 'experienced'
    interest: null,   // 'explore' | 'vehicles' | 'farm' | 'base' | 'combat' | 'roleplay'
  },
  routes: {},
  globalXp: 0,
  updatedAt: new Date().toISOString(),
};

export function loadProgress() {
  if (typeof window === 'undefined') return DEFAULT_STORAGE_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORAGE_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_STORAGE_STATE;
    return {
      ...DEFAULT_STORAGE_STATE,
      ...parsed,
      routes: parsed.routes || {},
      onboarding: { ...DEFAULT_STORAGE_STATE.onboarding, ...(parsed.onboarding || {}) },
    };
  } catch (err) {
    console.error('Error al cargar progreso de Spiffo-OS:', err);
    return DEFAULT_STORAGE_STATE;
  }
}

export function saveProgress(state) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...state,
      version: CURRENT_VERSION,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Error al guardar progreso de Spiffo-OS:', err);
  }
}

export function resetProgress() {
  if (typeof window === 'undefined') return DEFAULT_STORAGE_STATE;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return DEFAULT_STORAGE_STATE;
}
