# CHEF MASTER PLAN v4.0 - KNOXOS

## Resumen del Proyecto
KnoxOS Tactical HUD - Plataforma diegética militar para Project Zomboid Build 42.

## Fase Actual: FASE 2 - REDISEÑO EDITORIAL Y ERGONOMÍA UI/UX (FORO & TIPS)
**Objetivo**: Erradicar la fatiga de lectura y la sobrecarga de micro-textos en el Foro Comunitario y Guías Sueltas implementando estándares de la industria (Discourse, Reddit, DEV.to):
1. Grid responsivo de 2 columnas (measure acotado a 65 caracteres por línea).
2. Selector de densidad de visualización: **Vista Tarjetas Editorial** vs. **Vista Compacta de 1 Fila**.
3. Poda radical de micro-textos en el *eyebrow* (regla de los 2 metadatos).
4. Bloque destacado de **Clave Táctica / Takeaway** en cada historia.
5. Formulario de publicación plegable en drawer/acordeón.
6. Requisitos de guías convertidos en chips de inventario visuales.

## Equipo de Subagentes Especializados
| Agente | Tag | Rol Principal | Archivos Asignados |
|--------|-----|---------------|-------------------|
| Agente 1 | `[UI-EDITORIAL]` | Editorial UI & Layout Specialist | `app/components/TipsCommunityView.jsx` |
| Agente 2 | `[DATA-CONTENT]` | Content Architecture & Data Specialist | `app/data/tipsDatabase.js` |
| Agente 3 | `[STYLE-TOKENS]` | Design Tokens & Typography Specialist | `app/globals.css` |
| Agente 4 | `[QA-TERMINAL]` | QA, Accessibility & Terminal Master | Verificación, tests, `task.md`, `GLOBAL_WALKTHROUGH.md` |

## Plan de Ejecución por Fases
- **Paso 1: Content Data Specialist**: Enriquecer `tipsDatabase.js` con campo `takeaway` y metadatos limpios (0 emojis).
- **Paso 2: Styles System Specialist**: Agregar clases en `app/globals.css` para el grid de 2 columnas, takeaway box, vista compacta y chips de inventario.
- **Paso 3: Editorial UI Specialist**: Reestructurar `TipsCommunityView.jsx` con el selector de densidad, tarjetas en 2 columnas, vista compacta y drawer de publicación.
- **Paso 4: QA & Terminal Integrator**: Ejecutar `next build` en terminal (Exit Code 0), auditoría de 0 emojis y pruebas end-to-end.
