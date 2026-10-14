# Manifiesto de Diseño y Sistema de Tokens: SpiffoOS (Project Zomboid B42)

## 1. Filosofía de Diseño: "Knox County 1993 Diegetic HUD"
Toda la interfaz debe reflejar la atmósfera de supervivencia de julio de 1993 en Kentucky:
- **Cero Estética SaaS/Web3**: Prohibidas las esquinas excesivamente redondeadas (`border-radius: 20px / 24px`), brillos difusos de app móvil moderna y textos minúsculos.
- **Chasis Militar y Terminal CRT**: Esquinas biseladas (*chamfer* a 45°), remaches mecánicos, cantoneras de retícula `┌ ┐ └ ┘`, bandas de peligro (*hazard stripes*) y tipografía monoespaciada de alta legibilidad.
- **Regla de Escaneo Rápido (Anti-Fatiga Visual)**: Los jugadores escanean datos; no leen muros de texto. Párrafos reducidos al mínimo, apoyados en fichas interactivas, barras segmentadas, chips y medidores visuales.

---

## 2. Escala Tipográfica Ergonómica
**Regla Estricta**: No se permite ningún texto por debajo de `12px` en toda la aplicación.

| Token | Tamaño | Interlineado | Uso Exclusivo |
| :--- | :--- | :--- | :--- |
| `--pz-text-xs` | `12px` | `1.3` | Metadatos secundarios, tags de inventario, chips de estado, badges de rol. |
| `--pz-text-sm` | `13px` | `1.4` | Etiquetas de formulario, botones compactos, coordenadas de mapa. |
| `--pz-text-base` | `14px - 15px`| `1.6` | Cuerpo de lectura principal, descripciones de refugios y directivas. |
| `--pz-text-md` | `16px - 17px`| `1.4` | Subtítulos de módulos, nombres de servidores, armas y ubicaciones. |
| `--pz-text-lg` | `20px - 22px`| `1.3` | Títulos de tarjeta, cabeceras de diálogo y categorías principales. |
| `--pz-text-xl` | `28px - 34px`| `1.1` | Títulos de sección (H1), titulares de consola y alertas críticas. |

**Fuentes**:
- **Títulos y Rótulos Técnicos**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.
- **Cuerpo y Lectura Continua**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

---

## 3. Paleta de Tokens de Color (Diegética 1993)

### Chasis y Superficies
- `--pz-chassis-deep`: `#050812` (Fondo exterior de pantalla)
- `--pz-chassis-base`: `#090e1b` (Panel de consola base)
- `--pz-chassis-surface`: `#0f172a` (Tarjetas y módulos de trabajo)
- `--pz-chassis-elevated`: `#162238` (Elementos activos / hover de inventario)
- `--pz-border-steel`: `rgba(255, 255, 255, 0.12)` (Línea de chasis estándar)
- `--pz-border-highlight`: `rgba(255, 255, 255, 0.24)` (Línea superior de bisel)

### Fósforo y Señalización
- `--pz-phosphor-green`: `#10b981` (Señal segura, servidor online, maestría completada)
  - Glow: `0 0 14px rgba(16, 185, 129, 0.4)`
- `--pz-phosphor-amber`: `#f59e0b` (Transmisión civil, advertencia, botín medio, roleplay)
  - Glow: `0 0 14px rgba(245, 158, 11, 0.4)`
- `--pz-hazard-red`: `#ef4444` (Alerta biológica, combate hostil, sprinters, riesgo extremo)
  - Glow: `0 0 14px rgba(239, 68, 68, 0.45)`
- `--pz-tactical-cyan`: `#06b6d4` / `#38bdf8` (Telemetría de radio, coordenadas, IPs)
  - Glow: `0 0 14px rgba(6, 182, 212, 0.4)`
- `--pz-tactical-purple`: `#8b5cf6` (Facciones especiales, equipo militar)

### Bandas de Peligro Industrial (*Hazard Stripes*)
- `--pz-hazard-amber`: `repeating-linear-gradient(45deg, #f59e0b, #f59e0b 6px, #78350f 6px, #78350f 12px)`
- `--pz-hazard-red`: `repeating-linear-gradient(45deg, #ef4444, #ef4444 6px, #7f1d1d 6px, #7f1d1d 12px)`
- `--pz-hazard-green`: `repeating-linear-gradient(45deg, #10b981, #10b981 6px, #064e3b 6px, #064e3b 12px)`

---

## 4. Componentes y Botones Estandarizados

### Paneles de Misión (`.pz-mission-panel`)
- Reemplazo directo de las cajas redondeadas `.hud-panel` y `.glass-panel`.
- Esquinas biseladas con retículas en cantoneras `┌ ┐ └ ┘`.
- Barra superior técnica integrada con código de sector y remaches mecánicos.
- Padding interno generoso: `24px - 28px` para evitar la sensación de congestión.

### Familia de Botones Tácticos
- **Altura estándar**: `42px - 46px` (pulsación táctil óptima).
- **`.pz-btn-primary`**: Interruptor de emisión militar en verde fósforo con bisel y relieve.
- **`.pz-btn-secondary`**: Tecla de consola en acero oscuro con borde reforzado.
- **`.pz-btn-danger`**: Botón de purga o alarma en carmesí industrial.
- **`.pz-switch-tab`**: Interruptor rectangular de frecuencia (no píldoras redondeadas).

---

## 5. Reglas de Contenido y Datos de la Wiki
Para la integración de los más de 5.600 artículos de la Wiki de Project Zomboid Build 42 (`Axe.md`, `Player.md`, etc.):
1. **Ficha Rápida Superior**: Cada artículo debe resumir en una tarjeta compacta los datos clave (Daño, Alcance, Durabilidad, Requisitos).
2. **Pestañas de Navegación**: Desglosar contenidos extensos en pestañas (*Estadísticas*, *Fabricación*, *Dónde Encontrar*).
3. **Tablas de Estadísticas Estilizadas**: Encabezados oscuros en monospace con datos numéricos en contraste alto.
