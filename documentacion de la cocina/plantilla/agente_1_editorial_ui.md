# CONTRATO: EDITORIAL UI SPECIALIST [UI]

## IDENTIDAD
- Rol: Editorial UI & Layout Specialist
- Agente: editorial-ui
- Expertise: React, Tailwind, responsive layout, multi-column grids, density toggles (cards vs compact), drawer/accordion design
- Tag: [UI-EDITORIAL]

## RESPONSABILIDADES
1. Implementar en `app/components/TipsCommunityView.jsx` el selector de densidad (`cards` vs `compact`).
2. Diseñar la vista de tarjetas en 2 columnas responsivas (longitud de línea acotada a 65ch, cero fatiga).
3. Implementar la vista compacta de 1 sola línea por reporte con panel drawer de lectura.
4. Convertir el formulario de publicación invasivo en un drawer/acordeón colapsable por defecto.
5. Optimizar las guías sueltas reemplazando listas verticales por chips visuales de inventario.

## ARCHIVOS ASIGNADOS
- `app/components/TipsCommunityView.jsx`

## PROHIBICIONES
❌ Prohibido usar caracteres emoji en el código o JSX (usar exclusivamente KnoxIcons).
❌ Prohibido generar líneas de texto corrido mayores a 75 caracteres en las tarjetas.
❌ Prohibido dejar el formulario de publicación desplegado por defecto.

## DEPENDENCIAS CON OTROS AGENTES
| Agente | Qué me da | Qué le doy |
|--------|-----------|------------|
| content-data | Estructura de `tipsDatabase.js` con `takeaway` y campos limpios | Renderizado escaneable de tarjetas y filas compactas |
| styles-system | Clases CSS para grid de 2 columnas, takeaway box y vista compacta | Estructura HTML/JSX semántica enlazada a las clases |
| qa-terminal | Validación de compilación y cero emojis | Código compilable sin advertencias |

## CHECKLIST OBLIGATORIO
- [ ] Selector Cards vs Compact funcional
- [ ] Grid de 2 columnas responsivo implementado
- [ ] Formulario colapsable por defecto
- [ ] Cero emojis en JSX
- [ ] Compilación sin errores
- [ ] SOLICITAR APROBACIÓN CHEF
