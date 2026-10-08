// Base de datos de Rutas por Niveles de Spiffo-OS
// Las 3 rutas principales están 100% completas y funcionales.
// Las demás rutas están preparadas como 'coming_soon' para expansión continua sin romper la navegación.

export const routesDatabase = [
  {
    id: 'survival-basics',
    slug: 'supervivencia-basica',
    title: 'Supervivencia Básica: Primeros Días',
    icon: '🎒',
    description: 'Aprende a moverte con sigilo, asegurar tu primera casa refugio y equiparte sin llamar la atención de hordas.',
    category: 'basics',
    difficulty: 'Principiante',
    estimatedTime: 'Días 1 a 3 in-game',
    status: 'available',
    levels: [
      {
        id: 'survival-basics-l1',
        levelNumber: 1,
        title: 'Nivel 1: Los Primeros 10 Minutos',
        requirement: 'Apareces vivo en una casa aleatoria',
        objectives: [
          { id: 'sb1-sneak', label: 'Agáchate inmediatamente con tecla [C] y muévete en sigilo', xp: 20 },
          { id: 'sb1-curtains', label: 'Cierra todas las cortinas de la casa o coloca sábanas en las ventanas', xp: 25 },
          { id: 'sb1-water-container', label: 'Consigue una botella vacía o cacerola en la cocina y llénala de agua', xp: 20 },
          { id: 'sb1-weapon', label: 'Encuentra un arma improvisada inicial (sartén, cuchillo de cocina o rodillo)', xp: 15 },
          { id: 'sb1-digital-watch', label: 'Busca un reloj digital en cajones o zombis para ver la hora exacta', xp: 20 }
        ],
        unlockReward: 'Tienes un refugio inicial seguro y no te detectarán desde la calle.',
        recommendedLootCategory: 'groceries',
        build42Note: 'En Build 42 la iluminación por ventanas es más realista; las cortinas son obligatorias para no ser visto de noche.'
      },
      {
        id: 'survival-basics-l2',
        levelNumber: 2,
        title: 'Nivel 2: La Rutina de la Televisión y Botiquín',
        requirement: 'Tener una casa con televisor y reloj digital',
        objectives: [
          { id: 'sb2-tv-channel', label: 'Sintoniza el canal "Life and Living TV" (99.2 MHz) a las 06:00, 12:00 o 18:00', xp: 35 },
          { id: 'sb2-first-aid-kit', label: 'Reúne 5 vendas limpias o rasga ropa limpia con clic derecho', xp: 25 },
          { id: 'sb2-backpack', label: 'Consigue una mochila escolar o bolsa deportiva para aumentar capacidad de carga', xp: 30 },
          { id: 'sb2-peep-window', label: 'Aprende a mirar por esquinas manteniendo clic derecho antes de abrir puertas', xp: 20 }
        ],
        unlockReward: 'Subes habilidades pasivas gratis y puedes transportar suministros entre casas.',
        recommendedLootCategory: 'hospitals',
        build42Note: 'Las emisiones de Life and Living terminan alrededor del día 9; aprovéchalas al máximo.'
      },
      {
        id: 'survival-basics-l3',
        levelNumber: 3,
        title: 'Nivel 3: El Perímetro y Escape Seguro',
        requirement: 'Nivel de sigilo y arma básica equipada',
        objectives: [
          { id: 'sb3-clear-yard', label: 'Elimina de 1 en 1 a los zombis que merodeen cerca de tu puerta trasera', xp: 40 },
          { id: 'sb3-sheet-rope', label: 'Instala una cuerda de sábanas (Sheet Rope) con clavos en una ventana del 2º piso', xp: 35 },
          { id: 'sb3-stash-canned', label: 'Almacena comida enlatada no perecedera y un abrelatas en la alacena', xp: 30 },
          { id: 'sb3-emergency-bag', label: 'Prepara una "bolsa de escape" con comida, agua y vendas por si la horda cerca la casa', xp: 45 }
        ],
        unlockReward: 'Tu base tiene ruta de escape de emergencia vertical y reservas para 1 semana.',
        recommendedLootCategory: 'tools',
        build42Note: 'Los zombis pueden romper cuerdas de escape desde abajo; ten siempre al menos dos ventanas preparadas.'
      }
    ]
  },
  {
    id: 'first-vehicle',
    slug: 'primer-vehiculo',
    title: 'Primer Vehículo / Nómada',
    icon: '🚐',
    description: 'Consigue, revisa y usa tu primer vehículo para explorar Kentucky con seguridad y convertirlo en base móvil.',
    category: 'vehicles',
    difficulty: 'Principiante / Intermedio',
    estimatedTime: 'Días 2 a 5 in-game',
    status: 'available',
    levels: [
      {
        id: 'first-vehicle-l1',
        levelNumber: 1,
        title: 'Camión Nivel 1: Consigue Movilidad Básica',
        requirement: 'No requiere experiencia técnica previa',
        objectives: [
          { id: 'fv1-find-keys', label: 'Inspecciona guanteras, suelo alrededor del vehículo o casas adyacentes para hallar la llave', xp: 30 },
          { id: 'fv1-check-status', label: 'Abre el menú radial [V] frente al capó y pulsa "Mecánica" para ver el estado general', xp: 20 },
          { id: 'fv1-battery-fuel', label: 'Comprueba que la batería tenga carga y que el depósito tenga al menos un 10% de combustible', xp: 25 },
          { id: 'fv1-drive-carefully', label: 'Arranca y conduce sin chocar contra árboles ni postes (los choques destruyen el motor)', xp: 25 }
        ],
        unlockReward: 'Tienes movilidad y puedes recorrer distancias interurbanas sin agotar la resistencia de tu personaje.',
        recommendedLootCategory: 'vehicles',
        build42Note: 'Si juegas con el rasgo "Conductor dominguero", la velocidad en caminos de tierra se reduce drásticamente.'
      },
      {
        id: 'first-vehicle-l2',
        levelNumber: 2,
        title: 'Camión Nivel 2: Conducción Segura y Mantenimiento',
        requirement: 'Lata de gasolina (Gas Can) y bomba de aire para neumáticos',
        objectives: [
          { id: 'fv2-gas-can', label: 'Encuentra al menos 1 lata de gasolina en cobertizos, gasolineras o maleteros', xp: 35 },
          { id: 'fv2-refuel-pump', label: 'Llena la lata en una gasolinera y reposta el coche antes del corte eléctrico general', xp: 30 },
          { id: 'fv2-tire-pressure', label: 'Revisa la presión de los 4 neumáticos; ruedas desinfladas causan trompos mortales', xp: 25 },
          { id: 'fv2-hotwire-prep', label: 'Aprende los requisitos de puentear sin llave: Electricidad Nv. 1 + Mecánica Nv. 2 (o rasgo Ladrón)', xp: 40 }
        ],
        unlockReward: 'Autonomía de combustible prolongada y capacidad de puentear vehículos en cualquier aparcamiento.',
        recommendedLootCategory: 'tools',
        build42Note: 'Puentear un coche tiene probabilidad de fallar y encender la alarma del vehículo; ten despejada la zona.'
      },
      {
        id: 'first-vehicle-l3',
        levelNumber: 3,
        title: 'Camión Nivel 3: La Base Rodante Indestructible',
        requirement: 'Furgoneta o camioneta pickup grande con maletero amplio',
        objectives: [
          { id: 'fv3-curtains', label: 'Cubre los cristales laterales con sábanas para dormir dentro sin que los zombis te vean', xp: 35 },
          { id: 'fv3-spare-battery', label: 'Lleva una batería de repuesto cargada y un gato hidráulico (Jack) en el maletero', xp: 30 },
          { id: 'fv3-first-aid-glovebox', label: 'Equipa la guantera como botiquín médico exclusivo de emergencia', xp: 20 },
          { id: 'fv3-trunk-organization', label: 'Organiza el maletero con herramientas esenciales, 2 latas de nafta y comida enlatada', xp: 40 }
        ],
        unlockReward: 'Tu vehículo es ahora un refugio 100% autosuficiente para cruzar el mapa entero.',
        recommendedLootCategory: 'vehicles',
        build42Note: 'En la Build 42, el desgaste de amortiguación en caminos irregulares impacta directamente en el frenado.'
      }
    ]
  },
  {
    id: 'farming-b42',
    slug: 'agricultura-granja',
    title: 'Agricultura y Granja Autosuficiente',
    icon: '🌾',
    description: 'Prepara el sustrato perfecto, domina el ciclo hídrico y garantiza comida eterna sin depender de latas.',
    category: 'farming',
    difficulty: 'Intermedio',
    estimatedTime: 'Días 4 a 20 in-game',
    status: 'available',
    levels: [
      {
        id: 'farming-b42-l1',
        levelNumber: 1,
        title: 'Granja Nivel 1: El Suelo Seguro y la Siembra',
        requirement: 'Paleta de mano o pala, semillas y regadera',
        objectives: [
          { id: 'fb1-furrow', label: 'Cava surcos de tierra con una paleta (nunca caves con las manos desnudas para evitar cortes)', xp: 25 },
          { id: 'fb1-spacing', label: 'Deja 1 casilla vacía entre surcos para que las enfermedades no se contagien entre plantas', xp: 30 },
          { id: 'fb1-open-packets', label: 'Abre paquetes de semillas de patata o repollo desde el menú de inventario', xp: 20 },
          { id: 'fb1-initial-water', label: 'Siembra y riega de inmediato cada casilla hasta que el agua supere 65 unidades', xp: 25 }
        ],
        unlockReward: 'Primeros brotes sembrados con resistencia óptima contra plagas.',
        recommendedLootCategory: 'tools',
        build42Note: 'La Build 42 añade mayor impacto del pH del suelo y temporadas climáticas más rigurosas.'
      },
      {
        id: 'farming-b42-l2',
        levelNumber: 2,
        title: 'Granja Nivel 2: Agua de Lluvia y Sanidad Vegetal',
        requirement: 'Carpintería para barriles colectores y botellas pulverizadoras',
        objectives: [
          { id: 'fb2-rain-barrel', label: 'Construye al menos 2 colectores de lluvia cerca del bancal con tablas y bolsas de basura', xp: 35 },
          { id: 'fb2-spray-cure', label: 'Prepara cura contra pulgones (agua + cigarrillos) o mildiu (agua + leche) en un spray', xp: 35 },
          { id: 'fb2-potato-cabbage', label: 'Equilibra patatas (duran semanas en despensa) con repollo (crecimiento ultrarrápido)', xp: 30 },
          { id: 'fb2-daily-check', label: 'Inspecciona la barra de salud e hidratación de cada planta a primera hora de la mañana', xp: 25 }
        ],
        unlockReward: 'Independencia total del suministro hídrico de la red antes del corte de agua.',
        recommendedLootCategory: 'tools',
        build42Note: 'Las plantas pueden ahogarse por exceso de lluvia prolongada; si llueve mucho, techar una sección previene podredumbre.'
      },
      {
        id: 'farming-b42-l3',
        levelNumber: 3,
        title: 'Granja Nivel 3: Ciclo de Semillas y Conservas',
        requirement: 'Cosechas en fase floreciente y tarros de cristal',
        objectives: [
          { id: 'fb3-seed-phase', label: 'Espera a cosechar en la fase "Floreciente para semillas" para reponer tu reserva de siembra', xp: 40 },
          { id: 'fb3-composter', label: 'Construye una compostera para convertir verduras podridas en tierra fertilizada con nitrógeno', xp: 35 },
          { id: 'fb3-jarring', label: 'Envasa verduras en frascos de cristal con vinagre y azúcar hirviéndolos al baño maría', xp: 45 },
          { id: 'fb3-winter-reserve', label: 'Almacena una despensa con más de 30 patatas listas para la llegada del invierno', xp: 40 }
        ],
        unlockReward: 'Ciclo infinito y cerrado de calorías frescas los 365 días del año.',
        recommendedLootCategory: 'groceries',
        build42Note: 'El abono de compost acelera la maduración de cosechas un 25% y enriquece el sustrato desgastado.'
      }
    ]
  },
  {
    id: 'carpentry-bases',
    slug: 'carpinteria-fortificaciones',
    title: 'Carpintería y Fortificaciones',
    icon: '🔨',
    description: 'Barricadas reforzadas, escaleras, tejados habitables y perímetros de troncos impenetrables.',
    category: 'building',
    difficulty: 'Intermedio',
    estimatedTime: 'Días 3 a 15 in-game',
    status: 'coming_soon',
    levels: []
  },
  {
    id: 'combat-basics',
    slug: 'combate-armas',
    title: 'Combate y Armas Tácticas',
    icon: '⚔️',
    description: 'Control de espacio, empuje con espacio, uso de escopetas y gestión del pánico y fatiga.',
    category: 'combat',
    difficulty: 'Avanzado',
    estimatedTime: 'Días 1 a 10 in-game',
    status: 'coming_soon',
    levels: []
  },
  {
    id: 'roleplay-community',
    slug: 'roleplay-comunidad',
    title: 'Roleplay y Servidores Multijugador',
    icon: '🎭',
    description: 'Oficios especializados, comercio entre supervivientes, protocolos de radio y normas de facción.',
    category: 'roleplay',
    difficulty: 'Todos los niveles',
    estimatedTime: 'Continuo',
    status: 'coming_soon',
    levels: []
  }
];
