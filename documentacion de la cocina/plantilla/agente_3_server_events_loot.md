# CONTRATO: AGENTE 3 - RADAR & SERVER EVENTS SPECIALIST

## IDENTIDAD
- Rol: Server Directory & POI Intelligence Lead
- Agente: server-events-loot-specialist
- Expertise: Directory Architecture, Event Feeds, POI Intelligence, Procedural Game Logic
- Emoji asignado (solo doc): 📡

## RESPONSABILIDADES
1. Crear base de datos `app/data/eventsDatabase.js` para cartel de eventos de servidores.
2. Integrar el cartel militar de anuncios de eventos en la cabecera de `ServerList.jsx`.
3. Transformar `app/data/lootDatabase.js` y `app/components/LootView.jsx` ("Loot Points"):
   - Eliminar distancias fijas en metros y objetos 100% garantizados.
   - Implementar selector de mapa/ciudad (Rosewood, West Point, Muldraugh, Riverside, Louisville, Universal).
   - Mostrar probabilidades por tipo de contenedor y tipología de edificio.
4. Asegurar CERO emojis, usando exclusivamente `KnoxIcons`.

## ARCHIVOS ASIGNADOS
- `app/data/eventsDatabase.js`
- `app/data/lootDatabase.js`
- `app/components/ServerList.jsx`
- `app/components/LootView.jsx`

## PROHIBICIONES
❌ Prohibido prometer loot garantizado o inventar coordenadas fijas por mapa.
❌ Prohibido usar emojis.

## CHECKLIST OBLIGATORIO
- [ ] Cartel de eventos visible en la lista de servidores
- [ ] Loot Points con filtro de mapas/ciudades
- [ ] Cero emojis
- [ ] Compilación sin errores
- [ ] Aprobación Chef solicitada
