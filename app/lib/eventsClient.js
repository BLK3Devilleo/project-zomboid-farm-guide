export const MAX_EVENTS_PER_OWNER = 2;

/**
 * Obtener todos los eventos activos del tablón desde Cloudflare D1 (/api/events)
 * Cero persistencia local: la base de datos es la única fuente de verdad.
 */
export async function fetchServerEvents() {
  try {
    const res = await fetch('/api/events', { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.warn('Fallo consultando /api/events en D1:', err.message);
  }

  return [];
}

/**
 * Contar cuántos eventos activos tiene registrados un usuario / owner
 */
export function countOwnerActiveEvents(events, currentUser) {
  if (!currentUser || !Array.isArray(events)) return 0;
  return events.filter(
    (e) =>
      (e.ownerId && e.ownerId === currentUser.id) ||
      (e.ownerEmail && e.ownerEmail === currentUser.email)
  ).length;
}

/**
 * Crear un nuevo evento de servidor publicado por su dueño en Cloudflare D1
 */
export async function createServerEvent(eventData, currentUser, userServers) {
  if (!currentUser) {
    throw new Error('Debes iniciar sesión con tu cuenta verificada para publicar un evento.');
  }

  if (!userServers || userServers.length === 0) {
    throw new Error('No tienes servidores registrados. Debes registrar tu servidor primero en el directorio.');
  }

  // Verificar que el servidor seleccionado pertenezca al usuario
  const matchedServer = userServers.find(
    (s) =>
      s.id === eventData.serverId &&
      ((s.owner_id && s.owner_id === currentUser.id) ||
       (s.owner_email && s.owner_email === currentUser.email) ||
       currentUser.role === 'admin')
  );

  if (!matchedServer) {
    throw new Error('Solo puedes publicar eventos para un servidor del cual eres propietario.');
  }

  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serverId: matchedServer.id,
      title: eventData.title.trim().toUpperCase(),
      type: eventData.type || 'EVENTO COMUNITARIO',
      urgency: eventData.urgency || 'OPORTUNIDAD',
      tag: matchedServer.name,
      status: eventData.status || 'PROGRAMADO',
      dateDisplay: eventData.dateDisplay || 'Próximamente',
      frequency: eventData.frequency || `${matchedServer.name} Broadcast`,
      description: eventData.description.trim(),
      directives: Array.isArray(eventData.directives) && eventData.directives.length > 0
        ? eventData.directives
        : ['Conéctate a la hora acordada para coordinar con la comunidad.'],
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al registrar el evento en la base de datos.');
  }

  const freshEvents = await fetchServerEvents();
  return { success: true, event: json.data, allEvents: freshEvents };
}

/**
 * Eliminar un evento de Cloudflare D1 (Solo el owner o staff)
 */
export async function deleteServerEvent(eventId, currentUser) {
  if (!currentUser) {
    throw new Error('Acceso no autorizado.');
  }

  const res = await fetch(`/api/events?id=${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al eliminar el evento de la base de datos.');
  }

  const freshEvents = await fetchServerEvents();
  return { success: true, allEvents: freshEvents };
}
