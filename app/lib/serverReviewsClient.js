// Cliente API de Reseñas y Comentarios de Servidores KnoxOS
// Conexión directa a Cloudflare D1 mediante /api/servers/[id]/reviews
// Cero persistencia en localStorage - Cumplimiento de arquitectura cloud pura

/**
 * Obtener reseñas para un servidor dado desde Cloudflare D1
 * @param {string} serverId
 * @returns {Promise<{ reviews: Array, stats: { total: number, avgRating: number } }>}
 */
export async function fetchServerReviews(serverId) {
  if (!serverId) return { reviews: [], stats: { total: 0, avgRating: 0 } };

  try {
    const res = await fetch(`/api/servers/${encodeURIComponent(serverId)}/reviews`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`Respuesta no exitosa (${res.status}) obteniendo reseñas para ${serverId}`);
      return { reviews: [], stats: { total: 0, avgRating: 0 } };
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return { reviews: [], stats: { total: 0, avgRating: 0 } };
  } catch (err) {
    console.warn('Error comunicando con API de reseñas D1:', err);
    return { reviews: [], stats: { total: 0, avgRating: 0 } };
  }
}

/**
 * Agregar o actualizar la reseña de un servidor
 * @param {string} serverId
 * @param {{ rating: number, comment: string }} reviewData
 * @param {object} currentUser
 * @returns {Promise<{ success: boolean, reviews: Array, stats: object, message: string }>}
 */
export async function addServerReview(serverId, reviewData, currentUser) {
  if (!currentUser) {
    throw new Error('Debes iniciar sesión con tu cuenta de Google para publicar una reseña.');
  }

  if (!reviewData.comment || !reviewData.comment.trim()) {
    throw new Error('Por favor escribe tu reseña u observación sobre el servidor.');
  }

  const res = await fetch(`/api/servers/${encodeURIComponent(serverId)}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      rating: Number(reviewData.rating) || 2,
      comment: reviewData.comment.trim(),
      knox_protocol_trap: '', // Honeypot field
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Fallo al publicar la reseña en la red militar D1.');
  }

  return {
    success: true,
    reviews: json.data?.reviews || [],
    stats: json.data?.stats || { total: 0, avgRating: 0 },
    message: json.message || 'Reseña confirmada en el registro.',
  };
}

/**
 * Eliminar una reseña (solo autor o admin)
 * @param {string} serverId
 * @param {string} reviewId
 * @param {object} currentUser
 * @returns {Promise<{ success: boolean, reviews: Array, stats: object }>}
 */
export async function deleteServerReview(serverId, reviewId, currentUser) {
  if (!currentUser) {
    throw new Error('Acceso no autorizado.');
  }

  const res = await fetch(
    `/api/servers/${encodeURIComponent(serverId)}/reviews?reviewId=${encodeURIComponent(reviewId)}`,
    {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Error al eliminar la reseña.');
  }

  return {
    success: true,
    reviews: json.data?.reviews || [],
    stats: json.data?.stats || { total: 0, avgRating: 0 },
  };
}
