import { broadcastLog } from './sseLogger';


/**
 * Ejecuta una consulta SQL parametrizada hacia Cloudflare D1 mediante la API REST.
 * Previene 100% inyecciones SQL mediante binding seguro de parámetros y transmite telemetría SSE.
 * 
 * @param {string} sql Consulta SQL con marcadores de posición (?)
 * @param {Array<any>} params Parámetros vinculados
 * @returns {Promise<Array<any>|null>}
 */
export async function queryD1(sql, params = []) {
  const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

  const required = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_D1_DATABASE_ID',
    'CLOUDFLARE_API_TOKEN',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    const errMsg = `Faltan variables D1: ${missing.join(', ')}`;
    broadcastLog('error', errMsg);
    throw new Error(errMsg);
  }

  const cleanSql = sql.replace(/\s+/g, ' ').trim();
  broadcastLog('d1', `⚡ D1 Exec: ${cleanSql.substring(0, 100)}`, { paramsCount: params.length });

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
    broadcastLog('error', `D1 HTTP Error ${response.status}: ${errorText}`, { sql: cleanSql });
    throw new Error(`D1 HTTP Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  if (!data.success) {
    const errMessage = data.errors?.[0]?.message || 'D1 query failed';
    broadcastLog('error', `D1 SQL Error: ${errMessage}`, { errors: data.errors, sql: cleanSql });
    throw new Error(errMessage);
  }

  const results = data.result?.[0]?.results || [];
  broadcastLog('info', `✓ D1 OK: ${results.length} filas retornadas.`);
  return results;
}
