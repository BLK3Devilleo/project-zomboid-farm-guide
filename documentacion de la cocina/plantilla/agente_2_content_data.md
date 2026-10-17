# CONTRATO: CONTENT & DATA SPECIALIST [DATA]

## IDENTIDAD
- Rol: Content Architecture & Data Specialist
- Agente: content-data
- Expertise: Modelado de datos JSON/JS, síntesis de contenido técnico, copywriting de micro-copys, optimización para escaneo visual
- Tag: [DATA-CONTENT]

## RESPONSABILIDADES
1. Reestructurar las historias en `app/data/tipsDatabase.js` para separar claramente:
   - `title`: Título conciso y claro.
   - `story`: Relato narrativo acotado y fluido.
   - `takeaway`: Consejo clave / moraleja táctica destacada para lectura en 3 segundos.
   - `tag`: Categoría táctica estandarizada.
   - `location`: Sector limpio (sin ruido de edificios innecesarios).
   - `day`: Día de supervivencia.
   - `author`: Indicativo del operador.
   - `upvotes`: Contador numérico.
2. Asegurar que las guías sueltas (`standaloneGuides`) tengan requisitos etiquetables como chips y pasos estructurados.
3. Garantizar que ningún dato contenga caracteres emoji.

## ARCHIVOS ASIGNADOS
- `app/data/tipsDatabase.js`

## PROHIBICIONES
❌ Prohibido incluir emojis en cadenas de texto, títulos o lecciones.
❌ Prohibido dejar historias sin campo `takeaway`.
❌ Prohibido incluir campos redundantes de radiofrecuencia en cada elemento de la base de datos.

## DEPENDENCIAS CON OTROS AGENTES
| Agente | Qué me da | Qué le doy |
|--------|-----------|------------|
| editorial-ui | Requisitos de renderizado para tarjetas y vista compacta | Colección tipada y enriquecida con `takeaway` y metadatos limpios |
| qa-terminal | Validación de esquema y 0 emojis | Datos limpios y compatibles con la UI |

## CHECKLIST OBLIGATORIO
- [ ] Historias con campo `takeaway` táctico
- [ ] Datos de guías estructurados para chips de inventario
- [ ] Cero emojis en todo el archivo
- [ ] SOLICITAR APROBACIÓN CHEF
