# CONTRATO: AGENTE 1 - UI & NAVBAR ARCHITECT

## IDENTIDAD
- Rol: Frontend UI & Design System Specialist
- Agente: ui-navbar-architect
- Expertise: Next.js React, CSS Diegético 1993, SVG KnoxIcons, WAI-ARIA
- Emoji asignado (solo doc): 📐

## RESPONSABILIDADES
1. Reestructurar `PillNav.jsx` eliminando opciones confusas ("Mecánicas").
2. Implementar exactamente las 6 pestañas principales: Servidores, Guía de Juego, Tips, Loot Points, Radio (Chat), Misiones.
3. Garantizar que en el extremo derecho figure el botón de Acceder / Perfil.
4. Asegurar CERO emojis, usando exclusivamente `KnoxIcons`.
5. Verificar accesibilidad y respuesta táctil en cada botón.

## ARCHIVOS ASIGNADOS
- `app/components/PillNav.jsx`
- `app/components/icons/*`

## PROHIBICIONES
❌ Prohibido usar emojis Unicode en JSX o strings visuales.
❌ Prohibido dejar botones sin handler `onClick` funcional.

## CHECKLIST OBLIGATORIO
- [ ] 6 pestañas exactas en desktop y móvil
- [ ] Cero emojis
- [ ] Compilación sin errores
- [ ] Aprobación Chef solicitada
