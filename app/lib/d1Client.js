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
    .replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, 'Bearer [REDACTED]')
    .replace(/(password|secret|token|api_key|authorization)\s*[:=]\s*["'][^"']+["']/gi, '$1="[REDACTED]"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Ejecuta una consulta SQL parametrizada hacia Cloudflare D1 mediante la API REST.
 * Previene 100% inyecciones SQL mediante binding seguro de parámetros y transmite telemetría SSE sanitizada.
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
  broadcastLog('d1', `[D1-SQL] Exec: ${cleanSql.substring(0, 100)}`, { paramsCount: Array.isArray(params) ? params.length : 0 });

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    const sanitizedError = sanitizeTelemetry(errorText);
    broadcastLog('error', `D1 HTTP Error ${response.status}: ${sanitizedError}`, { sql: cleanSql });
    throw new Error(`D1 HTTP Error ${response.status}: ${sanitizedError}`);
  }

  const data = await response.json();
  if (!data.success) {
    const rawErrMsg = data.errors?.[0]?.message || 'D1 query failed';
    const errMessage = sanitizeTelemetry(rawErrMsg);
    const sanitizedErrors = Array.isArray(data.errors)
      ? data.errors.map((e) => ({
          code: e?.code,
          message: sanitizeTelemetry(e?.message),
        }))
      : [];
    broadcastLog('error', `D1 SQL Error: ${errMessage}`, { errors: sanitizedErrors, sql: cleanSql });
    throw new Error(errMessage);
  }

  const results = data.result?.[0]?.results || [];
  broadcastLog('info', `[D1-OK] ${results.length} filas retornadas.`);
  return results;
}
