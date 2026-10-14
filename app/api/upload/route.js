import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSessionUser } from '../../lib/session';
import { broadcastLog } from '../../lib/sseLogger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request) {
  // Comprobar sesión de usuario (solo usuarios autenticados pueden subir multimedia)
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json(
      { success: false, error: 'Debes iniciar sesión con Google para subir imágenes.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No se ha proporcionado ningún archivo de imagen.' },
        { status: 400 }
      );
    }

    // 1. Validar tipo MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Formato de archivo no soportado (${file.type}). Usa JPG, PNG, WEBP o GIF.`,
        },
        { status: 400 }
      );
    }

    // 2. Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'La imagen excede el límite máximo permitido de 5 MB.' },
        { status: 400 }
      );
    }

    // 3. Crear directorio uploads si no existe
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 4. Nombre seguro y único
    const rawExt = (file.name || 'image.png').split('.').pop().toLowerCase();
    const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(rawExt) ? rawExt : 'png';
    const fileName = `pz-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${safeExt}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    broadcastLog('info', `📸 Imagen subida por ${sessionUser.email}: ${publicUrl} (${Math.round(file.size / 1024)} KB)`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      size: file.size,
      name: file.name,
    });
  } catch (error) {
    console.error('Error al procesar subida de imagen:', error);
    broadcastLog('error', `Fallo al procesar subida de imagen: ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message || 'Fallo interno al procesar la imagen.' },
      { status: 500 }
    );
  }
}
