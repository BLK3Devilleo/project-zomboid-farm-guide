import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
 * Instancia el cliente de Cloudflare R2 utilizando la API compatible con S3.
 */
function getR2Client() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
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

  // Verificación estricta de Magic Numbers binarios para neutralizar archivos maliciosos camuflados
  if (buffer.length < 4) {
    throw new Error('Archivo corrupto o incompleto.');
  }

  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isGif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
  const isWebp = buffer.length > 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

  if (!isPng && !isJpeg && !isGif && !isWebp) {
    throw new Error('VIOLACIÓN DE SEGURIDAD: La firma binaria (Magic Numbers) no corresponde a una imagen válida.');
  }

  // 1. Intentar subida a Cloudflare R2 vía S3 API
  const r2Client = getR2Client();
  const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET?.trim();
  const R2_PUBLIC_DOMAIN = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN?.trim();

  if (r2Client && R2_BUCKET && R2_PUBLIC_DOMAIN) {
    try {
      const putCommand = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: file.type || 'image/png',
        CacheControl: 'public, max-age=31536000, immutable',
      });

      await r2Client.send(putCommand);

      const cloudUrl = `${R2_PUBLIC_DOMAIN.replace(/\/$/, '')}/${fileName}`;
      return {
        url: cloudUrl,
        size: file.size,
        name: fileName,
        provider: 'cloudflare-r2',
      };
    } catch (r2Error) {
      console.error('Fallo al subir a Cloudflare R2, recurriendo a disco local:', r2Error);
    }
  }

  // 2. Modo Sistema de Archivos / Local Persistence (Fallback)
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
