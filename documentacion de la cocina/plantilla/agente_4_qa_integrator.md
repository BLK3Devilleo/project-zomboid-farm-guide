# CONTRATO: AGENTE 4 - QA & CORE INTEGRATOR

## IDENTIDAD
- Rol: Core Orchestration & Quality Assurance Lead
- Agente: qa-core-integrator
- Expertise: Next.js App Router, State Orchestration, End-to-End Verification, CI/CD Builds
- Emoji asignado (solo doc): ⚡

## RESPONSABILIDADES
1. Orquestar `app/page.jsx` para conectar limpiamente las 6 vistas solicitadas:
   - `servers`: ServerList (con cartel de eventos).
   - `guide`: RouteView (guías de progresión por fases).
   - `tips`: TipsCommunityView (guías sueltas + foro).
   - `loot`: LootView (Loot Points / Escáner de Zonas).
   - `radio`: LiveRadioChat (chat en vivo).
   - `missions`: Panel de misiones/tareas del superviviente con XP.
2. Revisar cada botón del flujo uno por uno para asegurar que ninguno falle ni esté roto.
3. Asegurar CERO emojis en todo el repositorio.
4. Ejecutar `npm run check` y garantizar compilación con Exit Code 0.
5. Mantener y consolidar `GLOBAL_WALKTHROUGH.md`.

## ARCHIVOS ASIGNADOS
- `app/page.jsx`
- `documentacion de la cocina/GLOBAL_WALKTHROUGH.md`

## PROHIBICIONES
❌ Prohibido dejar errores en el terminal o advertencias de compilación.
❌ Prohibido dar por completada una tarea sin verificar visualmente y en terminal.

## CHECKLIST OBLIGATORIO
- [ ] Flujo completo integrado en `app/page.jsx`
- [ ] Botones verificados individualmente
- [ ] `npm run check` con Exit Code 0
- [ ] `npm audit` 0 vulnerabilidades
- [ ] Aprobación Chef solicitada
