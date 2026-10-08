// Base de datos de Metalurgia y Forja profunda para Project Zomboid (Build 42)
// Incluye herramientas de soldadura, estructuras de fortificación, revistas y el nuevo árbol de forja/fundición.

export const METALWORKING_DATABASE = {
  overview: {
    title: 'Metalistería & Forja Artesanal (B42)',
    description: 'La metalistería permite levantar las defensas más resistentes del juego, desguazar vehículos y, con el nuevo sistema de forja de la Build 42, fundir minerales y chatarra para forjar herramientas de acero infinitas.',
    keyStats: [
      { label: 'Resistencia Estructural', value: '+300% vs Madera', icon: '🛡️' },
      { label: 'Visibilidad Táctica', value: 'Barras transparentes', icon: '👁️' },
      { label: 'Autosuficiencia B42', value: 'Herrería y Fundición', icon: '🔥' },
    ]
  },
  
  categories: [
    { id: 'all', name: 'Todo el Arsenal' },
    { id: 'tools', name: 'Herramientas de Taller' },
    { id: 'forge', name: 'Forja & Fundición B42' },
    { id: 'defenses', name: 'Defensas & Barricadas' },
    { id: 'magazines', name: 'Manuales & Revistas' }
  ],

  items: [
    // --- HERRAMIENTAS Y EQUIPO DE TALLER ---
    {
      id: 'blowtorch',
      category: 'tools',
      name: 'Soplete de Propano (Propane Blowtorch)',
      rarity: 'Rara',
      icon: '/items/BlowTorch.png',
      summary: 'La herramienta fundamental para soldar barras, cortar chapa y reparar carrocerías.',
      usage: [
        'Instalar y reparar barricadas de metal en puertas y ventanas.',
        'Desmantelar coches destruidos y bañeras para extraer chatarra y láminas de metal.',
        'Reparar el chasis, capó y maletero de tus vehículos.',
        'Fabricar estanterías metálicas de alta durabilidad.'
      ],
      consumption: 'Consume unidades de gas propano por cada soldadura o corte.',
      proTip: 'Lleva siempre una bombona de propano de barbacoa a tu base; puedes recargar el soplete directamente haciendo clic derecho en la bombona grande.'
    },
    {
      id: 'welder_mask',
      category: 'tools',
      name: 'Máscara de Soldador (Welder Mask)',
      rarity: 'Poco común',
      icon: '/items/WelderMask.png',
      summary: 'Protección visual obligatoria requerida por el juego para operar con soplete.',
      usage: [
        'Equipamiento obligatorio en la cabeza/rostro para cualquier acción de soldadura.',
        'Brinda un 100% de protección contra rasguños y mordeduras en el cuello y la cara.',
        'Reduce ligeramente el campo de visión periférico mientras se lleva puesta.'
      ],
      consumption: 'No se desgasta por uso en soldadura.',
      proTip: 'En situaciones de combate contra hordas, es una de las mejores piezas de armadura facial temprana.'
    },
    {
      id: 'welding_rods',
      category: 'tools',
      name: 'Electrodos de Soldadura (Welding Rods)',
      rarity: 'Común / Consumible',
      icon: '/items/WeldingRods.png',
      summary: 'Consumible indispensable de aporte metálico para unir piezas de hierro y acero.',
      usage: [
        'Se consumen por cada barra, lámina o marco soldado.',
        'Obligatorios para unir estructuras grandes de metalistería.',
        'Se encuentran habitualmente en cajas de herramientas de obras y ferreterías.'
      ],
      consumption: 'Consumo directo de 1 a 4 unidades por receta.',
      proTip: 'Acumula todos los electrodos que encuentres en los almacenes industriales; se agotan rápido al blindar una base completa.'
    },
    {
      id: 'pipe_wrench',
      category: 'tools',
      name: 'Llave Grifa / Tubo (Pipe Wrench)',
      rarity: 'Poco común',
      icon: '/items/pipe_wrench.png',
      summary: 'Manipulación de tuberías metálicas y fontanería pesada conectada a depósitos.',
      usage: [
        'Desinstalar y conectar fregaderos con barriles de agua limpia.',
        'Ajustar tuberías metálicas para canalizaciones de agua y defensas.',
        'Arma contundente a una mano de gran daño de derribo.'
      ],
      consumption: 'Indestructible en fontanería.',
      proTip: 'Imprescindible para crear sistemas de agua potable limpia en bases fortificadas.'
    },

    // --- FORJA & FUNDICIÓN B42 (NUEVO ÁRBOL ARTESANAL) ---
    {
      id: 'primitive_furnace',
      category: 'forge',
      name: 'Horno Primitivo de Fundición (Clay Furnace)',
      rarity: 'Fabricable / B42',
      icon: '/spiffo/category_crafting.png',
      summary: 'El núcleo de la fundición rústica: transforma chatarra y mineral en metal maleable.',
      usage: [
        'Fundir chatarra metálica, latas vacías y armas rotas en lingotes de metal.',
        'Alcanzar temperaturas superiores a 1.000 °C mediante carbón vegetal y soplador.',
        'Paso 1 para romper la dependencia del looting moderno en Kentucky.'
      ],
      consumption: 'Consume combustible (carbón vegetal / leña seca) continuamente.',
      proTip: 'Constrúyelo siempre al aire libre o en una zona con extractor para evitar asfixia por humo y peligro de incendio.'
    },
    {
      id: 'anvil',
      category: 'forge',
      name: 'Yunque de Forja (Anvil)',
      rarity: 'Fabricable o Saqueable / B42',
      icon: '/spiffo/spiffo_crafting.png',
      summary: 'Superficie de impacto para golpear el metal al rojo vivo con martillo.',
      usage: [
        'Moldear clavos infinitos a partir de alambre y chatarra caliente.',
        'Forjar cabezas de hachas, puntas de lanzas y machetes de acero templado.',
        'Reparar herramientas metálicas desgastadas sin penalización de daño.'
      ],
      consumption: 'No se degrada.',
      proTip: 'En early game puedes crear un yunque de piedra tallada (Stone Anvil) antes de fundir tu primer bloque de acero industrial.'
    },
    {
      id: 'bellows',
      category: 'forge',
      name: 'Fuelle de Cuero (Bellows)',
      rarity: 'Fabricable / B42',
      icon: '/spiffo/category_ranching.png',
      summary: 'Inyector de oxígeno para elevar la temperatura de las brasas al punto de forja.',
      usage: [
        'Fabricado con 2 tablas de madera tallada + cuero curtido + 1 tubo metálico.',
        'Aumenta drásticamente el flujo de aire en el horno primitivo.',
        'Permite fundir aceros duros que no se licúan con fogatas normales.'
      ],
      consumption: 'Requiere mantenimiento periódico del cuero.',
      proTip: 'Cría vacas o caza ciervos en B42 para tener reservas de cuero para fuelles y delantales de herrero ignífugos.'
    },
    {
      id: 'clay_molds',
      category: 'forge',
      name: 'Moldes de Arcilla (Clay Molds)',
      rarity: 'Fabricable / B42',
      icon: '/spiffo/category_foraging_mining.png',
      summary: 'Moldes cocidos para verter metal fundido y crear piezas de precisión.',
      usage: [
        'Moldes para hojas de cuchillo, cabezas de martillo y lingotes estandarizados.',
        'Se modelan forrajeando arcilla cerca de ríos y se cuecen en el horno de alfarería.',
        'Permiten producir clavos masivos para carpintería sin saquear ferreterías.'
      ],
      consumption: 'Se pueden romper tras varios vertidos de choque térmico.',
      proTip: 'Mantén siempre 10 moldes de clavos listos antes de encender el horno para aprovechar el calor de cada tanda de carbón.'
    },

    // --- DEFENSAS Y BARRICADAS ---
    {
      id: 'metal_bars',
      category: 'defenses',
      name: 'Barricada de Barras de Metal (Metal Bars)',
      rarity: 'Construcción / Avanzada',
      icon: '/items/plank.png',
      summary: 'La defensa suprema para ventanas: máxima salud y visión táctica 100% despejada.',
      usage: [
        'Se colocan con 3 barras de metal + soplete de propano + máscara.',
        'Permiten ver el exterior y apuntar con armas de fuego o lanzas a través de ellas.',
        'No bloquean la entrada de luz solar a cultivos de interior en invernaderos.'
      ],
      consumption: 'Requiere Nivel 4 de Metalistería.',
      proTip: 'Muy superior a las tablas de madera, ya que no te quita la visibilidad cuando los zombis se amontonan en la ventana.'
    },
    {
      id: 'metal_sheet_defense',
      category: 'defenses',
      name: 'Barricada de Lámina Metálica (Metal Sheet)',
      rarity: 'Construcción / Blindaje',
      icon: '/items/BlowTorch.png',
      summary: 'Cierre ciego impenetrable que anula por completo la visión y el paso de luz.',
      usage: [
        'Bloquea al 100% la línea de visión de los zombis hacia el interior de tu dormitorio.',
        'Resiste decenas de impactos de zombis antes de deformarse.',
        'Ideal para plantas bajas y almacenes de provisiones críticas.'
      ],
      consumption: 'Requiere 1 lámina de metal grande + soplete.',
      proTip: 'Instálala en ventanas donde duermas para que los zombis errantes no te vean de noche al pasar cerca.'
    },
    {
      id: 'wire_fence_tall',
      category: 'defenses',
      name: 'Valla Alta de Reja de Acero (Tall Wire Fence)',
      rarity: 'Construcción / Perímetro',
      icon: '/items/rope.png',
      summary: 'Perímetro militar exterior que frena hordas enteras mientras las eliminas a distancia.',
      usage: [
        'Fabricada con tuberías metálicas + postes + alambre de espino trenzado.',
        'Los zombis no pueden treparla ni derribarla fácilmente.',
        'Permite crear pasillos de fuego cruzado con lanzas o armas de fuego.'
      ],
      consumption: 'Requiere Nivel 6+ de Metalistería.',
      proTip: 'Crea un doble perímetro con portón metálico para aislar tus corrales de animales en la Build 42.'
    },

    // --- MANUALES Y REVISTAS ---
    {
      id: 'metal_mag_1',
      category: 'magazines',
      name: 'The Metalwork Magazine Vol. 1',
      rarity: 'Poco común',
      icon: '/items/Screwdriver.png',
      summary: 'Desbloquea las recetas iniciales de cercas y soldadura básica.',
      usage: [
        'Enseña a fabricar cercas de alambre bajas y soldadura de paredes simples.',
        'Se encuentra en estanterías de libros, quioscos y mesillas de noche residenciales.'
      ],
      consumption: 'Lectura única para aprender la receta permanente.',
      proTip: 'Búscala en las bibliotecas municipales de Rosewood o Riverside al comenzar la partida.'
    },
    {
      id: 'metal_mag_2',
      category: 'magazines',
      name: 'The Metalwork Magazine Vol. 2',
      rarity: 'Poco común',
      icon: '/items/Screwdriver.png',
      summary: 'Enseña a fabricar contenedores metálicos y estanterías industriales.',
      usage: [
        'Permite crear cajas de metal con capacidad de 60+ kg y armarios blindados contra incendios.',
        'Fundamental para organizar almacenes de munición seguros.'
      ],
      consumption: 'Lectura única.',
      proTip: 'Habitual en talleres mecánicos y ferreterías de Muldraugh.'
    },
    {
      id: 'metal_mag_3',
      category: 'magazines',
      name: 'The Metalwork Magazine Vol. 3',
      rarity: 'Rara',
      icon: '/items/Screwdriver.png',
      summary: 'La clave para fabricar y reparar puertas de metal y portones vehiculares.',
      usage: [
        'Permite soldar puertas de metal con cerrojo para tu refugio.',
        'Enseña a fabricar portones de garaje dobles para proteger vehículos de expedición.'
      ],
      consumption: 'Lectura única.',
      proTip: 'Suele spawnear en almacenes grandes de polígonos industriales y estaciones de bomberos.'
    },
    {
      id: 'metal_mag_4',
      category: 'magazines',
      name: 'The Metalwork Magazine Vol. 4',
      rarity: 'Muy Rara',
      icon: '/items/Screwdriver.png',
      summary: 'El pináculo defensivo: vallas altas militares y barricadas de reja pesada.',
      usage: [
        'Desbloquea las vallas de reja alta y portones dobles de seguridad máxima.',
        'Permite crear las defensas definitivas contra eventos de helicóptero.'
      ],
      consumption: 'Lectura única.',
      proTip: 'Revisa las librerías de Louisville y las armerías de West Point para encontrar este volumen.'
    }
  ]
};
