// Base de datos de Meta-Eventos de Project Zomboid (Build 42 y Vanilla)
// Contiene la telemetría acústica, radio de atracción en tiles, ventanas temporales y protocolos tácticos.

export const metaEventsDatabase = [
  {
    id: 'distant-gunshots',
    name: 'Disparos Lejanos',
    subtitle: 'Meta-evento acústico aleatorio',
    category: 'acoustic',
    categoryLabel: 'Acústico Menor',
    icon: 'gunshot',
    threatLevel: 'Crítico',
    threatColor: '#ef4444',
    timeWindow: 'Aleatorio (Día y Noche, toda la partida)',
    frequency: 'Cada 1 a 3 días in-game (Sandbox: Sometimes)',
    noiseRadius: 350,
    noiseRadiusUnit: 'tiles (casillas)',
    soundType: 'Pistola 9mm, escopeta calibre 12 o rifle de caza',
    summary: 'Perturbación acústica virtual que rompe la estática de las hordas y las empuja en estampida hacia el origen del disparo.',
    mechanics: `El motor de Project Zomboid no genera supervivientes armados reales disparando en el mapa vanilla. En su lugar, proyecta un origen de sonido artificial a cientos de casillas de tu posición.

Todos los zombis ociosos dentro del radio de 300 a 400 casillas abandonan sus puestos y se desplazan en línea recta hacia la detonación, destruyendo puertas y ventanas a su paso si quedan atrapadas en su trayectoria.`,
    dos: [
      'Agáchate de inmediato con la tecla [C] para entrar en sigilo y minimizar tu propia visibilidad.',
      'Evalúa si estás posicionado entre una concentración de zombis y la fuente del disparo.',
      'Cierra cortinas y mantén silencio absoluto; evita correr, encender luces o usar radios.',
      'Ten identificada tu ruta de evacuación secundaria si tu refugio queda en la línea de marcha de la horda.',
      'Aprovecha para saquear edificios si el disparo ocurrió en dirección contraria y vació la zona.'
    ],
    donts: [
      'NUNCA salgas corriendo a buscar a quien disparó: no hay NPCs que rescatar ni armas que lootear.',
      'No salgas al exterior a comprobar qué ocurre; quedarás expuesto a los rezagados de la horda.',
      'No dispares tus propias armas de fuego en respuesta, pues duplicarás el radio de atracción hacia ti.'
    ],
    recommendedGear: [
      { name: 'Reloj Digital', desc: 'Para controlar el ciclo de movimiento y la hora' },
      { name: 'Calzado Ligero / Zapatillas', desc: 'Reduce el ruido al caminar dentro del refugio' },
      { name: 'Arma Corta Silenciosa', desc: 'Cuchillo de caza o palanca para remates sigilosos' }
    ],
    build42Notes: 'En Build 42, el nuevo sistema acústico y de propagación de sonido hace que las detonaciones reboten en edificios altos y callejones, alterando la dirección de migración según la densidad urbana.'
  },
  {
    id: 'distant-screams',
    name: 'Gritos Humanos Lejanos',
    subtitle: 'Meta-evento de agonía / auxilio',
    category: 'acoustic',
    categoryLabel: 'Acústico Menor',
    icon: 'screams',
    threatLevel: 'Alto',
    threatColor: '#f59e0b',
    timeWindow: 'Aleatorio (Predominante en noches y atardeceres)',
    frequency: 'Cada 1 a 4 días in-game',
    noiseRadius: 200,
    noiseRadiusUnit: 'tiles (casillas)',
    soundType: 'Gritos agudos masculinos o femeninos',
    summary: 'Simulación de supervivientes siendo devorados; genera un foco de atracción mediano que redistribuye grupos locales.',
    mechanics: `Similar a los disparos, los gritos lejanos son eventos ambientales programados. Su radio acústico es inferior al de las armas de fuego (aprox. 150 a 250 casillas), pero suficiente para limpiar esquinas de calles o arrastrar zombis hacia jardines y callejones.

Si el grito se escucha muy nítido y cercano, significa que un grupo cercano de infectados se activó y estará en estado de alerta máxima durante los próximos minutos.`,
    dos: [
      'Detén cualquier actividad ruidosa (carpintería, talar árboles, encender vehículos).',
      'Pégate a paredes interiores y espera agachado a que el marcador de audio concluya.',
      'Si estás fuera explorando, busca cobertura de arbustos o muros altos para romper línea de visión.'
    ],
    donts: [
      'No salgas a intentar salvar a la supuesta víctima: es un audio ambiental procedural.',
      'No abras puertas exteriores de golpe inmediatamente después de oír un grito cercano.'
    ],
    recommendedGear: [
      { name: 'Sábana limpia', desc: 'Para tapar ventanas expuestas de inmediato' },
      { name: 'Vendajes estériles', desc: 'Por si te sorprende un zombi rezagado en la retirada' }
    ],
    build42Notes: 'Build 42 añade sutiles gemidos y ecos que indican si el sonido rebotó en interiores o en campo abierto.'
  },
  {
    id: 'dog-barking',
    name: 'Ladridos de Perros',
    subtitle: 'Meta-evento ambiental canino',
    category: 'acoustic',
    categoryLabel: 'Acústico Menor',
    icon: 'dog',
    threatLevel: 'Moderado',
    threatColor: '#38bdf8',
    timeWindow: 'Aleatorio en zonas residenciales y granjas',
    frequency: 'Cada 2 a 5 días in-game',
    noiseRadius: 180,
    noiseRadiusUnit: 'tiles (casillas)',
    soundType: 'Ladridos repetitivos y aullidos',
    summary: 'Ruidos de animales abandonados en el condado que atraen a grupos dispersos en vecindarios.',
    mechanics: `En el juego base sin mods no existen perros vivos interactuables en el mapa. Este evento simula animales atrapados o vagabundos tras la evacuación militar. Los ladridos se mantienen durante varias ráfagas de 5 a 10 segundos, lo que hace que los zombis mantengan un rumbo constante hacia ese punto durante más tiempo que con un solo disparo.`,
    dos: [
      'Observa desde un segundo piso la dirección en la que caminan los infectados.',
      'Aprovecha las calles que queden despejadas para mover suministros hacia tu vehículo.'
    ],
    donts: [
      'No asumas que la zona estará vacía permanentemente; los zombis regresan a dispersarse cuando el sonido cesa.'
    ],
    recommendedGear: [
      { name: 'Prismáticos / Mira Telescópica', desc: 'Para escanear el movimiento de hordas desde tejados' }
    ],
    build42Notes: 'Build 42 introduce animales reales de granja y fauna silvestre (ciervos, ovejas, vacas, gallinas) con mecánicas de domesticación y depredadores.'
  },
  {
    id: 'helicopter-event',
    name: 'El Helicóptero Militar',
    subtitle: 'Meta-evento mayor del Early-Game',
    category: 'major',
    categoryLabel: 'Meta-Evento Mayor',
    icon: 'helicopter',
    threatLevel: 'Extremo',
    threatColor: '#dc2626',
    timeWindow: 'Día 6 al Día 9 (09:00 AM a 19:00 PM)',
    frequency: '1 sola vez por partida (en configuración por defecto)',
    noiseRadius: 650,
    noiseRadiusUnit: 'tiles (masivo / nivel ciudad)',
    soundType: 'Rotores pesados volando bajo sobre el jugador',
    summary: 'Un helicóptero militar de reconocimiento sobrevuela la zona de exclusión. Si te detecta, te seguirá durante horas creando una mega-horda mortal.',
    mechanics: `El helicóptero no aterriza, no arroja suministros ni rescata a nadie. Su inteligencia artificial busca al jugador:
1. Si estás en el exterior cuando llega, te fijará como objetivo y se mantendrá orbitando sobre tu cabeza durante horas.
2. Si estás en el interior de un edificio con ventanas cerradas y cortinas puestas ANTES de que llegue, no te detectará y tras 1 o 2 pasadas aleatorias abandonará la zona.
3. El estruendo de los motores atrae a TODOS los zombis de varios distritos hacia el punto donde esté el helicóptero.`,
    dos: [
      'Sintoniza diariamente la Frecuencia de Emergencia Automatizada (AEBS) a las 08:00 o 09:00 AM: si anuncia "Air activity detected", el helicóptero llegará ese mismo día.',
      'Si estás dentro de tu base con cortinas cerradas antes de que empiece el sonido: QUÉDATE QUIETO DENTRO, lee libros, come y no te asomes.',
      'Si te atrapa al aire libre o en una base precaria: súbete de inmediato a un vehículo con combustible y conduce hacia una autopista o campo abierto lejos de tu base.',
      'Espera a que el sonido del helicóptero desaparezca por completo durante al menos 1 hora in-game antes de regresar a pie.'
    ],
    donts: [
      'NUNCA te quedes en tu base principal si el helicóptero ya te vio afuera: atraerá cientos de zombis que demolerán tus defensas.',
      'No intentes dispararle ni llamar su atención; no hay interacción posible con el piloto.',
      'No corras a pie sin rumbo: te quedarás sin resistencia (exhausto) y serás rodeado por la masa de infectados.'
    ],
    recommendedGear: [
      { name: 'Radio con frecuencia AEBS', desc: 'Alerta anticipada de sobrevuelo militar a las 09:00 AM' },
      { name: 'Vehículo listo con combustible', desc: 'Para evacuar a carreteras secundarias si te descubren' },
      { name: 'Mochila de emergencia (Bug-out Bag)', desc: 'Con comida enlatada, abrelatas, agua y medicamentos para 48h' }
    ],
    build42Notes: 'En Build 42, el sonido del rotor interactúa con la meteorología; días con tormenta o niebla densa pueden enmascarar su detección o alterar la visión del piloto.'
  },
  {
    id: 'water-shutoff',
    name: 'Corte de Suministro de Agua',
    subtitle: 'Evento de colapso de infraestructura',
    category: 'world-shutoff',
    categoryLabel: 'Corte de Servicios',
    icon: 'water',
    threatLevel: 'Crítico',
    threatColor: '#06b6d4',
    timeWindow: 'Día 0 a Día 30 (Promedio: Días 7 a 14)',
    frequency: 'Permanente una vez ocurrido',
    noiseRadius: 0,
    noiseRadiusUnit: 'tiles (evento pasivo)',
    soundType: 'Goteo seco en grifos y tuberías',
    summary: 'Las plantas de tratamiento dejan de bombear agua potable. Los grifos solo conservan una pequeña reserva residual.',
    mechanics: `Tras el corte, los grifos, bañeras e inodoros ya no proveen agua infinita. Cada accesorio conserva entre 10 y 20 unidades de agua residual potable.

Una vez agotadas esas reservas, beber agua de ríos, lagos o charcos sin hervir causará intoxicación estomacal severa y la muerte. Se vuelve indispensable construir Colectores de Lluvia (*Rain Barrels*) y conectarlos con tuberías a un fregadero inferior con llave inglesa.`,
    dos: [
      'Almacena agua en todas las botellas, ollas, cacerolas y teteras desde el Día 1.',
      'Llena bañeras completas en tu refugio antes de que ocurra el corte (almacenan hasta 100 unidades).',
      'Sube nivel de Carpintería a Nivel 4 o Nivel 7 para fabricar Colectores de Lluvia con bolsas de basura y tablas.',
      'Hierve siempre el agua recolectada de la lluvia en una fogata, estufa o microondas antes de beberla.'
    ],
    donts: [
      'Nunca bebas agua de lluvia directamente del barril sin hervir ni purificar.',
      'No dejes recipientes vacíos guardados en cajones cuando llueve: déjalos afuera para recolectar agua.'
    ],
    recommendedGear: [
      { name: 'Cacerolas y Ollas de Cocina', desc: 'Para hervir agua en estufas o fogatas' },
      { name: 'Bolsas de Basura (4 por barril)', desc: 'Material indispensable para crear Colectores de Lluvia' },
      { name: 'Llave Inglesa (Pipe Wrench)', desc: 'Para conectar barriles de lluvia a grifos interiores' }
    ],
    build42Notes: 'Build 42 incluye un sistema hidrológico mejorado con fluidos dinámicos, pozos de agua rurales y mayor interacción con la contaminación del agua.'
  },
  {
    id: 'power-shutoff',
    name: 'Corte de Red Eléctrica',
    subtitle: 'Evento de apagón total en Knox County',
    category: 'world-shutoff',
    categoryLabel: 'Corte de Servicios',
    icon: 'electricity',
    threatLevel: 'Crítico',
    threatColor: '#f59e0b',
    timeWindow: 'Día 0 a Día 30 (Promedio: Días 10 a 16)',
    frequency: 'Permanente una vez ocurrido',
    noiseRadius: 0,
    noiseRadiusUnit: 'tiles (evento pasivo)',
    soundType: 'Chispazo, apagado de refrigeradores y luces urbanas',
    summary: 'La red eléctrica de Kentucky se apaga por completo. Los refrigeradores pierden energía y la comida fresca se pudre en 48h.',
    mechanics: `Con el corte eléctrico:
1. Todas las luces de calles y casas se apagan; la oscuridad nocturna se vuelve absoluta.
2. Los refrigeradores y congeladores se desactivan; carnes, verduras y lácteos frescos se pudren en pocos días.
3. Las bombas de las gasolineras dejan de despachar combustible, obligando a conectar un generador a la estación para repostar.
4. Las televisiones y radios conectadas a pared dejan de encender a menos que tengan baterías o generador.`,
    dos: [
      'Consigue y lee la revista "¿Cómo usar generadores?" (*How to Use Generators*) de inmediato.',
      'Localiza un Generador portátil y una garrafa de gasolina llena antes de que ocurra el apagón.',
      'Congela toda la comida perecedera en congeladores industriales (Helados Pops) para ganar días extra.',
      'Aprende a conservar alimentos mediante agricultura, conservas en tarros, ahumado o deshidratación.'
    ],
    donts: [
      'NUNCA enciendas un generador dentro de una casa o garaje cerrado: el monóxido de carbono te matará en minutos.',
      'No coloques el generador pegado a tu dormitorio exterior sin silenciador o muro; el ruido atraerá zombis.',
      'No dejes que la condición del generador caiga por debajo del 50%; podría explotar e incendiar tu base.'
    ],
    recommendedGear: [
      { name: 'Generador Portátil', desc: 'Restaura electricidad a una casa o bomba de gasolina' },
      { name: 'Garrafa de Combustible (Gas Can)', desc: 'Para transportar gasolina desde las estaciones' },
      { name: 'Revista: Cómo usar generadores', desc: 'Imprescindible para desbloquear la acción de conectar generador' }
    ],
    build42Notes: 'Build 42 renueva el sistema de cables, iluminación volumétrica y permite crear fuentes de energía alternativas como hornos de leña y herrería avanzada.'
  },
  {
    id: 'life-and-living-tv',
    name: 'Emisiones Life and Living TV',
    subtitle: 'Eventos diarios de transmisión educativa',
    category: 'broadcast',
    categoryLabel: 'Transmisiones',
    icon: 'tv',
    threatLevel: 'Estratégico',
    threatColor: '#10b981',
    timeWindow: 'Día 1 al Día 9 (Horarios fijos)',
    frequency: 'Diario a las 06:00, 12:00 y 18:00 in-game',
    noiseRadius: 20,
    noiseRadiusUnit: 'tiles (regulable con volumen)',
    soundType: 'Sintonía de televisión y narración de cocina/carpintería',
    summary: 'Programas de televisión del canal Life and Living que otorgan miles de puntos de experiencia gratuitos en habilidades vitales.',
    mechanics: `Hasta aproximadamente el día 9, el canal Life and Living emite cursos guiados que suben niveles enteros de habilidad sin gastar materiales:
- 06:00 AM: Cocina (Cooking)
- 12:00 PM: Carpintería (Carpentry) — La más importante para hacer Colectores de Lluvia
- 18:00 PM: Supervivencia (Trampas, Pesca o Forrajeo)

Si lees los libros de habilidad correspondientes (ej: Carpintería Vol. 1) antes de ver el programa, el multiplicador de XP se aplica a la transmisión, multiplicando los puntos obtenidos hasta por 16x.`,
    dos: [
      'Consigue un reloj digital con alarma para no perderte las emisiones de las 06:00, 12:00 y 18:00.',
      'Baja el volumen del televisor a 1 o 2 barras, o usa auriculares (*Earbuds*) para no atraer zombis.',
      'Lee los libros de habilidades de nivel 1 antes de sintonizar el canal para maximizar la XP ganada.'
    ],
    donts: [
      'No dejes la televisión a volumen alto: atraerá a todos los zombis del vecindario directamente a la sala.',
      'No salgas en expediciones largas durante el mediodía si no has alcanzado Carpintería nivel 4 o 7.'
    ],
    recommendedGear: [
      { name: 'Reloj Digital con Alarma', desc: 'Configura alarmas a las 05:40, 11:40 y 17:40' },
      { name: 'Libro: Carpintería Vol. 1', desc: 'Otorga multiplicador de hasta 3x-8x de experiencia' },
      { name: 'Auriculares (Earbuds)', desc: 'Permiten escuchar la TV a volumen cero hacia el exterior' }
    ],
    build42Notes: 'En Build 42, el audio de las televisiones se transmite con oclusión física según si las puertas de la habitación están cerradas.'
  },
  {
    id: 'house-car-alarms',
    name: 'Alarmas de Casas y Vehículos',
    subtitle: 'Eventos de intrusión accidentales',
    category: 'world-story',
    categoryLabel: 'Alarmas y Trampas',
    icon: 'siren',
    threatLevel: 'Extremo',
    threatColor: '#dc2626',
    timeWindow: 'Al forzar puertas, ventanas o abrir vehículos',
    frequency: 'Según rasgo Desafortunado o dificultad sandbox',
    noiseRadius: 400,
    noiseRadiusUnit: 'tiles (sirena estridente)',
    soundType: 'Sirena electrónica continua durante 30 a 60 segundos',
    summary: 'Sistemas de seguridad activos que alertan a todas las hordas en un radio de 4 manzanas.',
    mechanics: `Muchas casas y coches conservan sus baterías y sistemas antirrobo operativos. Al romper una ventana, forzar una cerradura o abrir una puerta, la alarma se dispara.

La sirena suena durante casi un minuto in-game y genera una fuerza de succión que vacía vecindarios completos en dirección al inmueble.`,
    dos: [
      'Si suena la alarma de una casa que intentabas saquear: HUYE DE INMEDIATO en sentido contrario.',
      'Rompe la línea de visión entrando y saliendo por otra casa o cruzando bosques espesos.',
      'Marca la casa en tu mapa con un icono de calavera para recordar que estará rodeada de zombis por días.'
    ],
    donts: [
      'NUNCA te escondas dentro de la misma casa cuya alarma acaba de sonar: quedarás atrapado en un callejón sin salida.',
      'No intentes apagar o desconectar la alarma; el juego no permite desactivarla una vez activada.'
    ],
    recommendedGear: [
      { name: 'Bolígrafo o Lápiz con Mapa', desc: 'Para marcar zonas rojas de alarmas activadas' },
      { name: 'Bebida Energética / Vitaminas', desc: 'Para aguantar carreras de escape sin agotarte' }
    ],
    build42Notes: 'Build 42 añade mayor variedad de circuitos eléctricos y cerraduras mecánicas complejas que pueden ser examinadas con ganzúas.'
  }
];
