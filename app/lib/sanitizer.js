/**
 * Sanitizador y Guardia de Ciberseguridad de Aplicación (Anti-XSS, Anti-Bot & Input Hygiene)
 * Diseñado para entornos militares de KnoxOS Build 42.
 */

/**
 * Neutraliza inyecciones XSS y limpia cadenas de texto de entrada.
 * @param {string} input - Texto a sanitizar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {string} - Cadena limpia e inocua
 */
export function sanitizeText(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';

  let sanitized = input
    .trim()
    // Elimina etiquetas de script, iframe, object, embed, style y enlaces javascript:
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '') // Elimina handlers de eventos como onclick=, onerror=, onload=
    // Escapa caracteres HTML críticos para impedir inyecciones en el DOM
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Valida la trampa Honeypot para detectar bots automatizados sin fricción para humanos.
 * @param {object} payload - Cuerpo de la petición
 * @param {string} trapFieldName - Nombre del campo trampa invisible (default: 'knox_protocol_trap')
 * @returns {boolean} - true si es un bot (el campo fue completado), false si es humano
 */
export function isBotHoneypotTriggered(payload, trapFieldName = 'knox_protocol_trap') {
  if (!payload || typeof payload !== 'object') return false;
  const trapValue = payload[trapFieldName];
  // Si el campo trampa tiene contenido o no está vacío, fue completado por un robot
  return typeof trapValue === 'string' && trapValue.trim().length > 0;
}
