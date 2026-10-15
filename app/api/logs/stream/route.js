import { getRecentLogs, subscribeLogs, broadcastLog } from '../../../lib/sseLogger';
import { getSessionUser, hasRequiredRole } from '../../../lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  // Verificación RLS: Solo Super Admin y Admin tienen acceso a la terminal SSE
  const sessionUser = await getSessionUser(request);
  if (!sessionUser || !hasRequiredRole(sessionUser.role, 'admin')) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Acceso no autorizado a la terminal de telemetría de superadministrador.',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const encoder = new TextEncoder();

  // Emite evento de conexión de cliente al stream
  broadcastLog('info', `🛰️ Terminal de telemetría SSE conectada por ${sessionUser.name || sessionUser.email}.`);

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
