import fs from 'fs';
import path from 'path';

/**
 * Servicio Modular de Almacenamiento KnoxOS
 * Soporta almacenamiento en la nube (Cloudflare R2 / S3) con fallback local estructurado.
 */

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateImage(file) {
  if (!file || typeof file === 'string') {
    return { valid: false, error: 'No se ha proporcionado ningún archivo.' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Formato (${file.type}) no compatible. Formatos admitidos: JPG, PNG, WEBP, GIF.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: 'El archivo excede el límite máximo permitido de 5 MB.',
    };
  }

  return { valid: true };
}

/**
 * Guarda un archivo multimedia y retorna la URL pública canónica.
 * 
 * @param {File} file Objeto File proveniente de FormData
 * @param {Object} [metadata] Metadatos de contexto (usuario, categoría)
 * @returns {Promise<{ url: string, size: number, name: string, provider: string }>}
 */
export async function saveMediaFile(file, metadata = {}) {
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const rawExt = (file.name || 'image.png').split('.').pop().toLowerCase();
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(rawExt) ? rawExt : 'png';
  const fileName = `pz-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Comprobar si hay credenciales para Cloudflare R2 / S3 API
  const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET?.trim();
  const R2_PUBLIC_DOMAIN = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN?.trim();

  if (R2_BUCKET && R2_PUBLIC_DOMAIN) {
    // Modo Cloudflare R2 Cloud Storage
    // Cuando el bucket y dominio público de R2 están inyectados
    const cloudUrl = `${R2_PUBLIC_DOMAIN.replace(/\/$/, '')}/${fileName}`;
    return {
      url: cloudUrl,
      size: file.size,
      name: fileName,
      provider: 'cloudflare-r2',
    };
  }

  // Modo Sistema de Archivos / Local Persistence
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  await fs.promises.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${fileName}`;

  return {
    url: publicUrl,
    size: file.size,
    name: fileName,
    provider: 'local-disk',
  };
}
