import { initialServerEvents } from '../data/eventsDatabase';

const EVENTS_STORAGE_KEY = 'knox_community_server_events_v1';
export const MAX_EVENTS_PER_OWNER = 2;

/**
 * Obtener todos los eventos activos del tablón (iniciales + comunitarios guardados)
 */
export function fetchServerEvents() {
  if (typeof window === 'undefined') return initialServerEvents;

  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialServerEvents));
      return initialServerEvents;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Error leyendo eventos de localStorage:', err);
  }

  return initialServerEvents;
}

/**
 * Contar cuántos eventos activos tiene registrados un usuario / owner
 */
export function countOwnerActiveEvents(events, currentUser) {
  if (!currentUser) return 0;
  return events.filter(
    (e) =>
      (e.ownerId && e.ownerId === currentUser.id) ||
      (e.ownerEmail && e.ownerEmail === currentUser.email)
  ).length;
}

/**
 * Crear un nuevo evento de servidor publicado por su dueño
 * Valida:
 * 1. Usuario autenticado
 * 2. Dueño del servidor seleccionado
 * 3. Máximo 2 eventos activos por dueño
 */
export function createServerEvent(eventData, currentUser, userServers) {
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

  const currentEvents = fetchServerEvents();
  const currentCount = countOwnerActiveEvents(currentEvents, currentUser);

  if (currentCount >= MAX_EVENTS_PER_OWNER) {
    throw new Error(
      `Límite alcanzado: Tienes ${currentCount}/${MAX_EVENTS_PER_OWNER} eventos activos. Elimina un anuncio anterior para publicar uno nuevo.`
    );
  }

  const newEvent = {
    id: `evt-${Date.now()}`,
    serverId: matchedServer.id,
    serverName: matchedServer.name,
    serverIp: `${matchedServer.ip}${matchedServer.port ? `:${matchedServer.port}` : ''}`,
    ownerId: currentUser.id,
    ownerEmail: currentUser.email,
    title: eventData.title.trim().toUpperCase(),
    type: eventData.type || 'EVENTO COMUNITARIO',
    urgency: eventData.urgency || 'OPORTUNIDAD',
    tag: matchedServer.name,
    status: eventData.status || 'PROGRAMADO',
    dateDisplay: eventData.dateDisplay || 'Próximamente',
    frequency: eventData.frequency || `${matchedServer.name} Broadcast`,
    hostServer: matchedServer.name,
    description: eventData.description.trim(),
    directives: Array.isArray(eventData.directives) && eventData.directives.length > 0
      ? eventData.directives
      : ['Conéctate a la hora acordada para coordinar con la comunidad.'],
    createdAt: new Date().toISOString(),
  };

  const updatedEvents = [newEvent, ...currentEvents];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    } catch (e) {
      console.warn('Error guardando evento en localStorage:', e);
    }
  }

  return { success: true, event: newEvent, allEvents: updatedEvents };
}

/**
 * Eliminar un evento (Solo el owner o admin puede hacerlo)
 */
export function deleteServerEvent(eventId, currentUser) {
  if (!currentUser) {
    throw new Error('Acceso no autorizado.');
  }

  const currentEvents = fetchServerEvents();
  const eventToDelete = currentEvents.find((e) => e.id === eventId);

  if (!eventToDelete) {
    throw new Error('Evento no encontrado.');
  }

  const isOwner =
    (eventToDelete.ownerId && eventToDelete.ownerId === currentUser.id) ||
    (eventToDelete.ownerEmail && eventToDelete.ownerEmail === currentUser.email);
  const isAdmin = currentUser.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new Error('Solo el propietario del servidor o un administrador puede eliminar este anuncio.');
  }

  const updatedEvents = currentEvents.filter((e) => e.id !== eventId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    } catch (e) {
      console.warn('Error guardando eventos tras eliminación:', e);
    }
  }

  return { success: true, allEvents: updatedEvents };
}
