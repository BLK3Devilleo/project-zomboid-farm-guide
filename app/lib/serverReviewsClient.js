// Cliente y Almacenamiento Local de Reseñas y Comentarios de Servidores KnoxOS
// Cero emojis - Metadatos militares de bitácora

const REVIEWS_PREFIX = 'knox_server_reviews_';

/**
 * Obtener reseñas para un servidor dado
 */
export function fetchServerReviews(serverId) {
  if (typeof window === 'undefined' || !serverId) return [];

  try {
    const raw = localStorage.getItem(`${REVIEWS_PREFIX}${serverId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error leyendo reseñas del servidor:', err);
    return [];
  }
}

/**
 * Agregar una nueva reseña a un servidor
 */
export function addServerReview(serverId, reviewData, currentUser) {
  if (!currentUser) {
    throw new Error('Debes iniciar sesión con Google para publicar una reseña.');
  }

  if (!reviewData.comment || !reviewData.comment.trim()) {
    throw new Error('Por favor escribe un comentario u opinión sobre el servidor.');
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    serverId,
    userId: currentUser.id,
    userName: currentUser.name || 'Superviviente Anónimo',
    userAvatar: currentUser.picture || null,
    userRole: currentUser.role || 'usuario',
    rating: reviewData.rating === 'warning' ? 'warning' : 'recommended',
    comment: reviewData.comment.trim(),
    createdAt: new Date().toISOString(),
  };

  const currentReviews = fetchServerReviews(serverId);
  const updated = [newReview, ...currentReviews];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${REVIEWS_PREFIX}${serverId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error guardando reseña en localStorage:', err);
    }
  }

  return { success: true, review: newReview, allReviews: updated };
}

/**
 * Eliminar una reseña (solo autor o admin)
 */
export function deleteServerReview(serverId, reviewId, currentUser) {
  if (!currentUser) {
    throw new Error('Acceso no autorizado.');
  }

  const currentReviews = fetchServerReviews(serverId);
  const reviewToDelete = currentReviews.find((r) => r.id === reviewId);

  if (!reviewToDelete) {
    throw new Error('Reseña no encontrada.');
  }

  const isAuthor = reviewToDelete.userId === currentUser.id;
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  if (!isAuthor && !isAdmin) {
    throw new Error('Solo el autor o un administrador puede eliminar esta reseña.');
  }

  const updated = currentReviews.filter((r) => r.id !== reviewId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${REVIEWS_PREFIX}${serverId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error actualizando reseñas tras eliminar:', err);
    }
  }

  return { success: true, allReviews: updated };
}
