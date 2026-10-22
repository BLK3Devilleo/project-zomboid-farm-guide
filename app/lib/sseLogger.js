// Sistema Centralizado de Logging Backend para KnoxOS B42
// Imprime directamente a stdout y stderr de Node.js / Docker / Dokploy en tiempo real.

/**
 * Emite un log formateado directamente a stdout o stderr de Node.js.
 * Visible en la consola del contenedor Dokploy / Docker sin buffers en memoria.
 * 
 * @param {'info'|'warn'|'error'|'d1'|'auth'} level 
 * @param {string} message 
 * @param {object} [details] 
 */
export function broadcastLog(level, message, details = {}) {
  const timestamp = new Date().toISOString();
  const lvl = (level || 'info').toUpperCase();
  const detailsStr = details && Object.keys(details).length > 0 ? ` ${JSON.stringify(details)}` : '';
  const formatted = `[${timestamp}] [KNOX-${lvl}] ${message}${detailsStr}\n`;

  try {
    if (level === 'error') {
      if (typeof process !== 'undefined' && process.stderr?.write) {
        process.stderr.write(formatted);
      } else {
        console.error(formatted.trim());
      }
    } else {
      if (typeof process !== 'undefined' && process.stdout?.write) {
        process.stdout.write(formatted);
      } else {
        console.log(formatted.trim());
      }
    }
  } catch (e) {
    console.log(`[${timestamp}] [KNOX-${lvl}] ${message}`);
  }

  return { timestamp, level, message, details };
}

// Helpers para compatibilidad con cualquier suscriptor heredado
export function subscribeLogs() {
  return () => {};
}

export function getRecentLogs() {
  return [];
}
