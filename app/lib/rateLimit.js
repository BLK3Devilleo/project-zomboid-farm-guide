/**
 * Rate Limiter en memoria con algoritmo Sliding Window Counter
 * Protege contra spam, fuerza bruta y saturación de peticiones.
 */

// Almacén en memoria por prefijo de ruta/clave
const rateLimitMap = new Map();

// Limpieza periódica automática cada 5 minutos para evitar fugas de memoria
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (record.resetAt < now) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Verifica si una clave supera el límite de peticiones.
 * @param {string} key Identificador único (ej: IP o ID de usuario + acción)
 * @param {number} limit Máximo de peticiones permitidas en la ventana
 * @param {number} windowMs Duración de la ventana en milisegundos
 * @returns {{ allowed: boolean, remaining: number, resetInSeconds: number }}
 */
export function checkRateLimit(key, limit = 60, windowMs = 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt < now) {
    // Nueva ventana
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  // Ventana activa
  if (record.count >= limit) {
    const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSeconds,
  };
}

/**
 * Extrae la IP del cliente a partir de los encabezados de Next.js
 */
export function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }
  return '127.0.0.1';
}
