import { NextResponse } from 'next/server';
import { getSessionUser } from '../../lib/session';
import { broadcastLog } from '../../lib/sseLogger';
import { saveMediaFile, validateImage } from '../../lib/storage/storageService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    const validation = validateImage(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Procesar subida mediante el servicio de almacenamiento
    const result = await saveMediaFile(file, { userId: sessionUser.id });

    const operatorId = sessionUser.id
      ? `[OPERADOR ID: ${String(sessionUser.id).substring(0, 8)}...]`
      : '[OPERADOR ANONIMIZADO]';

    broadcastLog(
      'info',
      `[UPLOAD] Imagen subida por ${operatorId}: ${result.url} (${Math.round(result.size / 1024)} KB, provider: ${result.provider})`
    );

    return NextResponse.json({
      success: true,
      url: result.url,
      size: result.size,
      name: result.name,
      provider: result.provider,
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
