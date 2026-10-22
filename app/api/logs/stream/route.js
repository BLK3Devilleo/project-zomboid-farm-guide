import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Telemetría SSE deshabilitada en cliente. Toda la observabilidad se emite en tiempo real a stdout/stderr de la consola del contenedor Dokploy / Docker.',
  });
}
