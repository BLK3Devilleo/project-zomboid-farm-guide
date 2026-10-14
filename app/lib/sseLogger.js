// Sistema de Streaming de Logs en Vivo (SSE) para KnoxOS B42
// Captura eventos del servidor, consultas a Cloudflare D1, errores de autenticación y transacciones.

const MAX_LOGS = 250;
const subscribers = new Set();
const logBuffer = [];

let isConsolePatched = false;

// Inicializa interceptor de consola para capturar errores de forma transparente
function ensureConsolePatch() {
  if (isConsolePatched || typeof process === 'undefined') return;
  isConsolePatched = true;

  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args) => {
    try {
      const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      broadcastLog('error', msg, { source: 'console.error' });
    } catch (e) {}
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    try {
      const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      broadcastLog('warn', msg, { source: 'console.warn' });
    } catch (e) {}
    originalWarn.apply(console, args);
  };
}

ensureConsolePatch();

/**
 * Emite un log en el bus de streaming SSE y lo guarda en el búfer circular.
 * @param {'info'|'warn'|'error'|'d1'|'auth'} level 
 * @param {string} message 
 * @param {object} [details] 
 */
export function broadcastLog(level, message, details = {}) {
  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    level: level || 'info',
    message: String(message || '').substring(0, 1000),
    details: details || {},
  };

  logBuffer.push(entry);
  if (logBuffer.length > MAX_LOGS) {
    logBuffer.shift();
  }

  for (const listener of subscribers) {
    try {
      listener(entry);
    } catch (err) {
      subscribers.delete(listener);
    }
  }

  return entry;
}

/**
 * Suscribe un cliente al flujo de logs SSE.
 * @param {(entry: object) => void} callback 
 * @returns {() => void} Función para desuscribirse
 */
export function subscribeLogs(callback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Obtiene los últimos logs registrados en memoria.
 * @returns {Array<object>}
 */
export function getRecentLogs() {
  return [...logBuffer];
}
