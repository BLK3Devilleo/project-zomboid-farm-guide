/**
 * Cliente de Servidores Dedicados KnoxOS
 * Conexión directa y canónica contra Cloudflare D1 vía API /api/servers.
 * Cero persistencia local en localStorage: la única fuente de verdad es la base de datos.
 */

// Cargar servidores ordenados por reputación desde Cloudflare D1
export async function fetchServersList() {
  const res = await fetch('/api/servers', { cache: 'no-store' });
  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.success) {
    const errorMsg = json.error || `Fallo de conexión con la base de datos (${res.status})`;
    throw new Error(errorMsg);
  }

  return Array.isArray(json.data) ? json.data : [];
}

// Agregar nuevo servidor en Cloudflare D1
export async function createServerEntry(serverData) {
  const res = await fetch('/api/servers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serverData),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al registrar el servidor en la base de datos.');
  }

  return json.data;
}

// Votar servidor (+1 Reputación en D1)
export async function upvoteServerEntry(serverId) {
  const res = await fetch('/api/servers', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: serverId }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'No se pudo computar el voto.');
  }

  return true;
}

// Actualizar servidor existente en D1 (PUT /api/servers)
export async function updateServerEntry(serverId, serverData) {
  const res = await fetch('/api/servers', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: serverId, ...serverData }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al actualizar el servidor en la base de datos.');
  }

  return json.data;
}

// Eliminar servidor de D1 (DELETE /api/servers?id=...)
export async function deleteServerEntry(serverId) {
  const res = await fetch(`/api/servers?id=${encodeURIComponent(serverId)}`, {
    method: 'DELETE',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al eliminar el servidor de la base de datos.');
  }

  return true;
}
