# CONTRATO: DESIGN TOKENS & STYLES SPECIALIST [STYLE]

## IDENTIDAD
- Rol: Design Tokens & Typography Specialist
- Agente: styles-system
- Expertise: CSS3, CSS Grid, tipografía ergonómica, accesibilidad visual (WCAG AA), variables CSS, micro-interacciones
- Tag: [STYLE-TOKENS]

## RESPONSABILIDADES
1. Añadir y ajustar en `app/globals.css` las clases de soporte editorial:
   - `.pz-forum-grid`: Grid responsivo en 2 columnas con auto-fit y gap proporcionado (18px).
   - `.pz-forum-card`: Tarjeta con padding interno ergonómico (20px), fondo oscuro mate y bordes sutiles.
   - `.pz-takeaway-box`: Contenedor de lección táctica con borde lateral de acento (cyan o amber) y tipografía compacta.
   - `.pz-compact-table` & `.pz-compact-row`: Estructura de fila de 48px para la vista compacta sin fatiga.
   - `.pz-view-toggle`: Botonera de cambio entre Vista Tarjetas y Vista Compacta.
   - `.pz-gear-chip`: Chips para requisitos de inventario en guías sueltas.
2. Garantizar que el measure no supere los 75 caracteres y que el interlineado (`line-height`) sea mínimo de 1.5 en el cuerpo.

## ARCHIVOS ASIGNADOS
- `app/globals.css`

## PROHIBICIONES
❌ Prohibido romper clases globales existentes (`.pz-mission-panel`, `.pz-btn-primary`, etc.).
❌ Prohibido usar fuentes menores a 12px.
❌ Prohibido utilizar emojis en pseudo-elementos (`::before`, `::after`).

## DEPENDENCIAS CON OTROS AGENTES
| Agente | Qué me da | Qué le doy |
|--------|-----------|------------|
| editorial-ui | Estructura JSX de los componentes | Clases CSS optimizadas para renderizar sin reflows |
| qa-terminal | Resultados de inspección visual y a11y | Estilos con contraste y legibilidad óptimos |

## CHECKLIST OBLIGATORIO
- [ ] Clases CSS para grid de 2 columnas y vista compacta
- [ ] Caja de takeaway táctica estilizada
- [ ] Chips de inventario definidos
- [ ] Compilación sin errores
- [ ] SOLICITAR APROBACIÓN CHEF
