import { broadcastLog } from './sseLogger';

/**
 * Sanitiza cadenas de texto o estructuras de error para neutralizar la fuga
 * de PII (correos), tokens de autenticación (Cloudflare/Bearer), contraseñas o datos sensibles.
 */
function sanitizeTelemetry(input) {
  if (!input) return '';
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  return text
    .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, '[EMAIL_REDACTED]')
    .replace(/cfoat_[a-zA-Z0-9_.-]+/gi, '[CLOUDFLARE_TOKEN_REDACTED]')
    .replace(/cfat_[a-zA-Z0-9_.-]+/gi, '[CLOUDFLARE_TOKEN_REDACTED]')
    .replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, 'Bearer [REDACTED]')
    .replace(/(password|secret|token|api_key|authorization)\s*[:=]\s*["'][^"']+["']/gi, '$1="[REDACTED]"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Respaldo de APIs y Circuit Breaker en Memoria para Cloudflare D1
 * Se activa ÚNICAMENTE ante caídas reales de infraestructura (5xx, timeouts o fallos de red).
 * Ignora por completo errores de validación, sintaxis o esquema (4xx).
 */
const circuitState = {
  status: 'CLOSED', // 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  failureCount: 0,
  lastFailureTime: 0,
  threshold: 5,
  resetTimeoutMs: 15 * 1000, // 15 segundos para reintentar recuperación
};

// Caché SWR (Stale-While-Revalidate) de respaldo en memoria
const swrCache = new Map();

function getCacheKey(sql, params) {
  return `${sql.trim().toLowerCase()}::${JSON.stringify(params || [])}`;
}

function invalidateTableCache(sql) {
  const lower = sql.toLowerCase();
  for (const key of swrCache.keys()) {
    if (
      (lower.includes('into servers') || lower.includes('update servers') || lower.includes('delete from servers')) && key.includes('from servers') ||
      (lower.includes('into server_events') || lower.includes('delete from server_events')) && key.includes('from server_events') ||
      (lower.includes('into forum_threads') || lower.includes('update forum_threads')) && key.includes('from forum_threads') ||
      (lower.includes('into server_reviews') || lower.includes('delete from server_reviews')) && key.includes('from server_reviews')
    ) {
      swrCache.delete(key);
    }
  }
}

/**
 * Ejecuta una consulta SQL parametrizada hacia Cloudflare D1 mediante la API REST.
 * Incorpora Circuit Breaker de infraestructura, Sanitización y Fallback SWR en memoria.
 * 
 * @param {string} sql Consulta SQL con marcadores de posición (?)
 * @param {Array<any>} params Parámetros vinculados
 * @returns {Promise<Array<any>|null>}
 */
export async function queryD1(sql, params = []) {
  const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID?.trim().replace(/^["']|["']$/g, '');
  const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim().replace(/^["']|["']$/g, '');
  let API_TOKEN = process.env.CLOUDFLARE_API_TOKEN?.trim().replace(/^["']|["']$/g, '');
  if (API_TOKEN && API_TOKEN.toLowerCase().startsWith('bearer ')) {
    API_TOKEN = API_TOKEN.slice(7).trim();
  }

  const required = [
    { key: 'CLOUDFLARE_ACCOUNT_ID', val: ACCOUNT_ID },
    { key: 'CLOUDFLARE_D1_DATABASE_ID', val: DATABASE_ID },
    { key: 'CLOUDFLARE_API_TOKEN', val: API_TOKEN },
  ];
  const missing = required.filter((item) => !item.val).map((item) => item.key);
  if (missing.length) {
    const errMsg = `Faltan variables D1: ${missing.join(', ')}`;
    broadcastLog('error', errMsg);
    throw new Error(errMsg);
  }

  const cleanSql = sanitizeTelemetry(sql);
  const isSelect = cleanSql.toLowerCase().startsWith('select');
  const cacheKey = getCacheKey(sql, params);
  const now = Date.now();

  // 1. Verificación de Circuit Breaker (Solo si Cloudflare sufrió caída de infraestructura)
  if (circuitState.status === 'OPEN') {
    if (now - circuitState.lastFailureTime > circuitState.resetTimeoutMs) {
      circuitState.status = 'HALF_OPEN';
      broadcastLog('warn', '[CIRCUIT-BREAKER] Transición a HALF_OPEN. Reintentando enlace con Cloudflare D1...');
    } else if (isSelect && swrCache.has(cacheKey)) {
      const cached = swrCache.get(cacheKey);
      broadcastLog('warn', `[CIRCUIT-BREAKER SWR] D1 bajo degradación. Sirviendo snapshot en memoria (${cached.data.length} filas).`);
      return cached.data;
    }
  }

  broadcastLog('d1', `[D1-SQL] Exec: ${cleanSql.substring(0, 100)}`, { paramsCount: Array.isArray(params) ? params.length : 0 });

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      const sanitizedError = sanitizeTelemetry(errorText);
      const isServerError = response.status >= 500;
      const err = new Error(`D1 HTTP Error ${response.status}: ${sanitizedError}`);
      err.isServerError = isServerError;
      throw err;
    }

    const data = await response.json();
    if (!data.success) {
      const rawErrMsg = data.errors?.[0]?.message || 'D1 query failed';
      const err = new Error(sanitizeTelemetry(rawErrMsg));
      err.isServerError = false; // Error lógico/esquema de SQLite, no caída de servidor
      throw err;
    }

    const results = data.result?.[0]?.results || [];

    // Si la llamada fue exitosa, restablecer el Circuit Breaker a CLOSED
    if (circuitState.status !== 'CLOSED') {
      circuitState.status = 'CLOSED';
      circuitState.failureCount = 0;
      broadcastLog('info', '[CIRCUIT-BREAKER] Enlace normal restablecido (CLOSED).');
    }

    // Actualizar o invalidar caché SWR
    if (isSelect) {
      swrCache.set(cacheKey, { data: results, timestamp: now });
    } else {
      invalidateTableCache(sql);
    }

    broadcastLog('info', `[D1-OK] ${results.length} filas retornadas.`);
    return results;
  } catch (error) {
    // Solo computar fallos de Circuit Breaker ante problemas reales de infraestructura
    const isInfrastructureDrop =
      error.isServerError ||
      error.name === 'AbortError' ||
      error.message?.includes('fetch failed') ||
      error.message?.includes('network');

    if (isInfrastructureDrop) {
      circuitState.failureCount += 1;
      circuitState.lastFailureTime = now;
      if (circuitState.failureCount >= circuitState.threshold) {
        circuitState.status = 'OPEN';
        broadcastLog('error', `[CIRCUIT-BREAKER] Umbral de caídas de red alcanzado. Circuito activado (OPEN).`);
      }
    }

    // Si es lectura (SELECT) y tenemos snapshot de respaldo SWR, responder con él
    if (isSelect && swrCache.has(cacheKey)) {
      const cached = swrCache.get(cacheKey);
      broadcastLog('warn', `[D1-FALLBACK SWR] D1 no respondió (${error.message}). Retornando respaldo en memoria (${cached.data.length} filas).`);
      return cached.data;
    }

    broadcastLog('error', `D1 Execution Error: ${error.message}`, { sql: cleanSql });
    throw error;
  }
}
