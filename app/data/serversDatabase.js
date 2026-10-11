// Base de datos de Servidores Dedicados de Project Zomboid (Seed Data)
export const initialServers = [
  {
    id: 'srv-1',
    name: 'Kentucky Reborn Roleplay',
    ip: '142.44.215.89',
    port: 16261,
    region: 'LATAM',
    mode: 'Roleplay',
    loot_tier: 'Escaso',
    players_online: 28,
    max_players: 32,
    is_online: true,
    votes: 142,
    discord_url: 'https://discord.gg/kentuckyreborn',
    banner_url: '/spiffo/spiffo_character.png',
    tags: ['Roleplay', 'Whitelist', 'Economía', 'B42 Ready'],
    description: 'Servidor de Roleplay serio ambientado 6 meses tras el brote. Facciones de supervivientes, comercio con moneda propia, eventos semanales con directores de juego (DMs) y radiofrecuencias activas en tiempo real.',
    rules: [
      'Respetar el rol y mantenerse en personaje dentro del juego.',
      'Prohibido el asesinato sin justificación de rol previa (No RDM).',
      'Uso obligatorio de chat de voz por proximidad o radio in-game.',
      'Bases permitidas únicamente en zonas no comerciales.'
    ]
  },
  {
    id: 'srv-2',
    name: 'Apocalipsis Hardcore | 100% Sprinters',
    ip: '51.38.112.44',
    port: 16261,
    region: 'España',
    mode: 'Hardcore',
    loot_tier: 'Escaso',
    players_online: 19,
    max_players: 24,
    is_online: true,
    votes: 98,
    discord_url: 'https://discord.gg/apocalipsishardcore',
    banner_url: '/spiffo/spiffo_combat.png',
    tags: ['Hardcore', 'Sprinters', 'Permadeath', 'PVP Nocturno'],
    description: 'Dificultad extrema para veteranos curtidos. Zombis corredores durante la noche, botín extremadamente bajo y muerte permanente. La oscuridad es tu sentencia si no estás protegido.',
    rules: [
      'Fuego amigo activado en todo el mapa.',
      'El combate PvP es libre de 22:00 a 06:00 in-game.',
      'Prohibido el uso de hacks, exploits o trampas de mapa.',
      'Reinicio de personaje al morir (sin recuperar cadáver).'
    ]
  },
  {
    id: 'srv-3',
    name: 'Zona Cero: PvP & Raids de Fin de Semana',
    ip: '190.217.48.12',
    port: 16261,
    region: 'LATAM',
    mode: 'PvP',
    loot_tier: 'Normal',
    players_online: 30,
    max_players: 32,
    is_online: true,
    votes: 125,
    discord_url: 'https://discord.gg/zonaceropvp',
    banner_url: '/spiffo/spiffo_vehicle.png',
    tags: ['PvP', 'Raids', 'Facciones', 'Safezones'],
    description: 'Construcción pacífica y comercio protegido de lunes a viernes con safezones impenetrables. Los sábados y domingos se desata la purga total con asaltos a bases y guerras de clanes.',
    rules: [
      'Raideos a bases habilitados únicamente sábados y domingos.',
      'Máximo 6 miembros por facción registrada.',
      'Las safezones del centro de Rosewood y West Point son neutrales.',
      'Respeto en el chat global entre facciones rivales.'
    ]
  },
  {
    id: 'srv-4',
    name: 'Supervivientes de Knox (PvE Comunitario)',
    ip: '181.215.100.5',
    port: 16261,
    region: 'LATAM',
    mode: 'PvE',
    loot_tier: 'Abundante',
    players_online: 22,
    max_players: 30,
    is_online: true,
    votes: 110,
    discord_url: 'https://discord.gg/knoxpve',
    banner_url: '/spiffo/spiffo_farming.png',
    tags: ['PvE', 'Cooperativo', 'Novatos', 'Vehículos'],
    description: 'Comunidad relajada y amigable centrada en construcción de ciudadelas comunitarias, agricultura a gran escala y expediciones conjuntas de convoyes mecánicos. Ideal para nuevos jugadores.',
    rules: [
      'Estrictamente prohibido el daño entre jugadores o robo de propiedad.',
      'Respeta los cultivos y vehículos ajenos con cartel de reclamo.',
      'Zona comunitaria en Riverside para nuevos supervivientes.',
      'Ayuda a los novatos que soliciten apoyo en el chat.'
    ]
  },
  {
    id: 'srv-5',
    name: 'España Vanilla 24/7 Puro',
    ip: '82.223.14.77',
    port: 16261,
    region: 'España',
    mode: 'PvE',
    loot_tier: 'Normal',
    players_online: 15,
    max_players: 20,
    is_online: true,
    votes: 76,
    discord_url: 'https://discord.gg/espaniavanilla',
    banner_url: '/spiffo/spiffo_character.png',
    tags: ['Vanilla', 'Sin Mods', '24/7', 'B42 Ready'],
    description: 'Experiencia pura y original de Project Zomboid tal y como la concibió The Indie Stone. Cero mods de terceros, rendimiento impecable y reinicio mensual de botín en contenedores.',
    rules: [
      'Juego limpio vanilla sin modificaciones de cliente.',
      'No bloquear carreteras principales con barricadas.',
      'Respawn de objetos configurado cada 30 días de juego.',
      'Servidor alojado en datacenter de Madrid con baja latencia.'
    ]
  },
  {
    id: 'srv-6',
    name: 'Overhaul Militar: Brita & Blindados',
    ip: '167.114.156.90',
    port: 16261,
    region: 'NA',
    mode: 'PvP',
    loot_tier: 'Abundante',
    players_online: 26,
    max_players: 32,
    is_online: true,
    votes: 89,
    discord_url: 'https://discord.gg/overhaulmilitar',
    banner_url: '/spiffo/spiffo_combat.png',
    tags: ['Modded', 'Brita Weapons', 'Blindados', 'Hordas'],
    description: 'Pack curado con más de 50 mods: arsenal táctico Britas Weapons, vehículos blindados APC, silenciadores y hordas errantes masivas de más de 300 zombis en carreteras.',
    rules: [
      'Descarga previa del modpack en Steam Workshop recomendada.',
      'PvP abierto con helicópteros y eventos de drop aéreo militar.',
      'Límite de 3 vehículos blindados por base fortificada.',
      'Tolerancia cero con abuso de bugs o exploits de mods.'
    ]
  }
];
