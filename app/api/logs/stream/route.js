import { getRecentLogs, subscribeLogs, broadcastLog } from '../../../lib/sseLogger';
import { getSessionUser, hasRequiredRole } from '../../../lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  // 1. Verificación de autenticación (401 si no hay sesión activa)
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Acceso no autorizado a telemetría. Sesión requerida.',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 2. Verificación de autorización RLS: Requiere rol admin o super_admin (403 si carece de privilegios)
  if (!hasRequiredRole(sessionUser.role, 'admin')) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Acceso denegado. Se requieren privilegios de administrador para la telemetría.',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const encoder = new TextEncoder();

  // Emite evento de conexión de cliente al stream (anonimizado para evitar fuga de PII)
  const operatorLabel = sessionUser.name
    ? sessionUser.name
    : `Operador [ID: ${sessionUser.id ? String(sessionUser.id).substring(0, 8) : 'anon'}]`;
  broadcastLog('info', `[SYS] Terminal de telemetría SSE conectada por ${operatorLabel}.`);

  const stream = new ReadableStream({
    start(controller) {
      // 1. Enviar el búfer reciente de logs al conectar
      const recent = getRecentLogs();
      for (const item of recent) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(item)}\n\n`));
      }

      // 2. Suscribirse a logs en tiempo real
      const unsubscribe = subscribeLogs((entry) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(entry)}\n\n`));
        } catch (e) {
          // El stream fue cerrado por el cliente
        }
      });

      // 3. Heartbeat / Keepalive cada 15 segundos
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch (e) {
          clearInterval(pingInterval);
        }
      }, 15000);

      // 4. Limpieza al desconectar
      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        unsubscribe();
        try {
          controller.close();
        } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
