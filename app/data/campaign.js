// Base de datos de Campañas, Arquetipos de Supervivencia, Horarios de TV y Ubicaciones Top

export const TV_SHOWS = [
  { hour: 6, title: 'Cocina Casera (Cooking)', channel: 'Life and Living (99.2 MHz)', xpSkill: 'Cocina', icon: '🍳', desc: 'Aprende recetas, valor nutricional y aprovecha la comida perecedera.' },
  { hour: 12, title: 'Bricolaje y Carpintería (Carpentry)', channel: 'Life and Living (99.2 MHz)', xpSkill: 'Carpintería', icon: '🔨', desc: 'Sube niveles clave de carpintería antes de tener clavos o sierra.' },
  { hour: 18, title: 'Supervivencia Salvaje (Survival)', channel: 'Life and Living (99.2 MHz)', xpSkill: 'Pesca / Trampeo / Forrajeo', icon: '⛺', desc: 'Enseña técnicas de captura de presas, forrajeo de bayas y pesca.' }
];

export const ARCHETYPES = [
  {
    id: 'nomada',
    title: 'El Nómada Errante',
    subtitle: 'Vida en carretera, autocaravana y exploración continua',
    icon: '🚐',
    spiffoBanner: '/spiffo/spiffo_vehicle.png',
    philosophy: 'Tu coche es tu fortaleza móvil. No te atas a ninguna casa. Duermes donde cae la noche y vives de los maleteros de autopista.',
    recommendedTraits: ['Conductor dominguero (evitar)', 'Organizado', 'Mecánico aficionado', 'Poco comedor'],
    keyStats: ['Mecánica', 'Mantenimiento de vehículos', 'Fuerza de acarreo', 'Orientación'],
    daysPlan: [
      {
        day: 1,
        title: 'Búsqueda del Vehículo Clave',
        objectives: [
          'Encuentra una furgoneta o camioneta pickup en condiciones aceptables.',
          'Revisa las guanteras y el suelo de las casas cercanas en busca de las llaves del auto.',
          'Consigue un destornillador para poder desarmar radios y puentear vehículos si no hay llave.'
        ],
        tip: 'Si no encuentras llaves, busca zombis con ropa de mecánico o zombis abatidos cerca del vehículo.'
      },
      {
        day: 2,
        title: 'El Santo Grial: La Lata de Gasolina',
        objectives: [
          'Saquea cobertizos y garajes hasta encontrar al menos una lata de gasolina (Gas Can).',
          'Localiza la gasolinera más cercana y extrae combustible antes del corte eléctrico general.',
          'Llena el depósito del coche y guarda 2 latas llenas de reserva en el maletero.'
        ],
        tip: 'Anota en el mapa la ubicación exacta de las gasolineras para cuando tengas un generador.'
      },
      {
        day: 3,
        title: 'Taller Mecánico Rodante',
        objectives: [
          'Consigue una llave de cruceta (Lug Wrench) y un gato hidráulico (Jack).',
          'Revisa la presión de los neumáticos con la bomba de aire (Tire Pump); neumáticos bajos provocan derrapes mortales.',
          'Instala una radio de emergencia con frecuencia automatizada en el tablero del coche.'
        ],
        tip: 'Conducir por el arcén de tierra daña las suspensiones; mantente en el asfalto siempre que sea posible.'
      },
      {
        day: 4,
        title: 'Cama Móvil y Vidrios de Seguridad',
        objectives: [
          'Cubre las ventanillas del vehículo con sábanas para que los zombis no te vean dormir dentro.',
          'Empaca un botiquín de primeros auxilios completo en la guantera.',
          'Establece un hábito de estacionamiento: siempre aparca de cara a la salida para escapar rápido.'
        ],
        tip: 'Nunca duermas en el asiento del conductor con el motor encendido si estás herido o exhausto.'
      },
      {
        day: 5,
        title: 'Ruta de Carreteras Interurbanas',
        objectives: [
          'Viaja entre Rosewood y Muldraugh saqueando pequeños puestos de control y gasolineras aisladas.',
          'Recoge comida enlatada no perecedera y un abrelatas fijo.',
          'Instala un silenciador si juegas con mods o usa bocinazos calculados para limpiar cruces peligrosos.'
        ],
        tip: 'Las barricadas policiales en la autopista suelen tener ambulancias con suministros médicos raros.'
      },
      {
        day: 6,
        title: 'Alerta de la Ventana del Helicóptero',
        objectives: [
          'Mantén el vehículo con el depósito al 100% y listo para rodar.',
          'Si escuchas el helicóptero mientras conduces, no pares: conduce lentamente por campo abierto alejando la horda de las ciudades.',
          'Regresa a tus zonas de paso solo 24 horas después de que el evento haya terminado.'
        ],
        tip: 'En el rol nómada, el helicóptero es una ventaja: te permite limpiar ciudades enteras atrayendo a los zombis a los bosques.'
      },
      {
        day: 7,
        title: 'Autonomía Total en Ruta',
        objectives: [
          'Alcanza nivel 2 de Mecánica y 1 de Electricidad para poder puentear cualquier vehículo sin llaves.',
          'Consigue una batería de repuesto y un cargador de baterías en almacenes de autos.',
          'Celebra tu primera semana vivo dominando las carreteras de Kentucky.'
        ],
        tip: 'El nómada nunca pierde una base porque su base rueda con él.'
      }
    ]
  },
  {
    id: 'colono',
    title: 'El Colono y Constructor',
    subtitle: 'Fortificación de base impenetrable, agricultura y autosuficiencia',
    icon: '🏰',
    spiffoBanner: '/spiffo/spiffo_farming.png',
    philosophy: 'Una fortaleza bien defendida y comida infinita. Construyes perímetros seguros, recolectas agua de lluvia y miras el apocalipsis desde un segundo piso.',
    recommendedTraits: ['Manitas', 'Carpintero', 'Fuerte', 'Lector rápido'],
    keyStats: ['Carpintería', 'Agricultura', 'Fontanería', 'Trampeo'],
    daysPlan: [
      {
        day: 1,
        title: 'Elección del Santuario y Primeras Defensas',
        objectives: [
          'Elige un edificio de 2 pisos con pocas ventanas en la planta baja.',
          'Coloca sábanas o cortinas en todas las ventanas del primer piso para evitar línea de visión.',
          'Sintoniza Life and Living a las 06:00, 12:00 y 18:00 sin falta.'
        ],
        tip: 'Las casas con vallas altas preconstruidas ahorran semanas de tala y carpintería.'
      },
      {
        day: 2,
        title: 'Arsenal de Carpintería',
        objectives: [
          'Consigue un martillo, una sierra de mano y cajas de clavos.',
          'Lee el manual "Carpintería Vol. 1" para obtener multiplicador x3 de experiencia.',
          'Desmonta muebles inservibles de vecinos para recolectar clavos y tablas.'
        ],
        tip: 'Nunca leas libros de habilidades cansado o con pánico; hazlo en un lugar seguro y con luz.'
      },
      {
        day: 3,
        title: 'Preparación del Huerto Seguro',
        objectives: [
          'Consigue paleta de mano, paquetes de semillas (patata y repollo) y regadera.',
          'Sube tierra en sacos a un tejado plano accesible para cultivar sin riesgo de que los zombis pisen los brotes.',
          'Cava los primeros surcos en patrón ajedrezado para prevenir plagas.'
        ],
        tip: 'El cultivo en techos es 100% inmune al pisoteo de hordas errantes.'
      },
      {
        day: 4,
        title: 'Colectores de Lluvia y Fontanería',
        objectives: [
          'Alcanza nivel 4 o 7 de Carpintería construyendo vallas de entrenamiento.',
          'Fabrica 4 barriles de lluvia con tablas, clavos y bolsas de basura.',
          'Ubica un barril exactamente sobre el fregadero de la cocina.'
        ],
        tip: 'Conectar un barril con llave inglesa purifica el agua automáticamente por el grifo.'
      },
      {
        day: 5,
        title: 'Perímetro con Vallas y Zanja',
        objectives: [
          'Tala árboles perimetrales para crear línea de tiro limpia y obtener troncos.',
          'Construye una doble puerta para vehículos en la entrada del patio.',
          'Instala cuerdas de escape en todas las ventanas del segundo piso.'
        ],
        tip: 'Destruir la escalera interior con un mazo convierte tu segundo piso en una fortaleza invencible.'
      },
      {
        day: 6,
        title: 'Búnker durante el Helicóptero',
        objectives: [
          'Apaga todas las luces, radios y televisores de la base.',
          'Sube al segundo piso y permanece en silencio absoluto leyendo libros o descansando.',
          'Espera a que el sonido del helicóptero se aleje por completo antes de asomarte.'
        ],
        tip: 'Si no te ven entrar ni escuchan ruido en la casa, la horda pasará de largo por la calle.'
      },
      {
        day: 7,
        title: 'La Granja Autosuficiente Activa',
        objectives: [
          'Revisa el nivel de agua de tus primeros cultivos y retira malas hierbas.',
          'Instala una compostera en el patio para comida podrida.',
          'Prepara trampas de jaula en la linde del bosque a más de 75 casillas de la base.'
        ],
        tip: 'Cuando la luz y el agua se corten en Kentucky, tu base seguirá teniendo grifos y comida fresca.'
      }
    ]
  },
  {
    id: 'combatiente',
    title: 'El Depurador Urbano (PvP / Limpieza)',
    subtitle: 'Dominio de armas, tácticas de combate y saqueo militar',
    icon: '⚔️',
    spiffoBanner: '/spiffo/spiffo_combat.png',
    philosophy: 'No huyes de los zombis: los cazas metódicamente. Dominas el espacio, los ángulos muertos, la gestión del pánico y el control de la fatiga muscular.',
    recommendedTraits: ['En forma', 'Fuerte', 'Valiente', 'Ojos de lince', 'Cazador'],
    keyStats: ['Armas contundentes / Filo', 'Puntería', 'Recarga rápida', 'Agilidad'],
    daysPlan: [
      {
        day: 1,
        title: 'Control de Masa y Arma Principal',
        objectives: [
          'Consigue un bate de béisbol, una palanca o un hacha.',
          'Aprende a usar el empujón (espacio) para derribar zombis y pisarles la cabeza.',
          'Nunca luches con más de 2 o 3 zombis a la vez: sepáralos usando cercas y esquinas.'
        ],
        tip: 'Pisar la cabeza de un zombi caído garantiza un golpe crítico instantáneo sin gastar durabilidad de armas.'
      },
      {
        day: 2,
        title: 'Botiquín de Asalto Táctico',
        objectives: [
          'Consigue desinfectante, pinzas, hilo de sutura y vendas estériles.',
          'Saquea una clínica o farmacia antes de que se llene de zombis infectados.',
          'Equipa ropa protectora de cuero o chaleco antibalas ligero sin penalizar exceso de calor.'
        ],
        tip: 'El calor excesivo aumenta el cansancio un 200%. Si hace calor, quítate capas gruesas.'
      },
      {
        day: 3,
        title: 'Incursión a la Armería',
        objectives: [
          'Asalta la estación de policía local o una tienda de armas de caza.',
          'Prioriza escopetas (Shotguns) y cartuchos: son el único arma efectiva con Puntería nivel 0 a 3.',
          'Guarda las pistolas y rifles para cuando tengas al menos nivel 4 de Puntería.'
        ],
        tip: 'La escopeta impacta hasta en 4 zombis por disparo, subiendo puntos de Puntería a velocidad récord.'
      },
      {
        day: 4,
        title: 'Técnica de Conducción y Conga de Horda',
        objectives: [
          'Atrae a una horda de más de 50 zombis caminando en círculos ("hacer la conga").',
          'Llévalos a campo abierto o quémalos con una botella molotov con cuidado del viento.',
          'Asegura la zona principal de saqueo de la ciudad.'
        ],
        tip: 'Nunca corras en sprint (Shift); caminar rápido es más veloz que el paso de cualquier zombi normal.'
      },
      {
        day: 5,
        title: 'Mantenimiento y Reparación de Arsenal',
        objectives: [
          'Lee libros de Mantenimiento para multiplicar la durabilidad de tus armas.',
          'Repara tus bates con clavos o cinta de carrocero.',
          'Fabrica lanzas de madera afiladas como armas secundarias de altísimo daño crítico.'
        ],
        tip: 'La lanza tiene el golpe mortal de perforación más rápido del juego, pero se rompe con facilidad.'
      },
      {
        day: 6,
        title: 'Día del Helicóptero: El Gran Exterminio',
        objectives: [
          'Aprovecha el helicóptero para atraer a todos los zombis del distrito a una zona despejada.',
          'Usa la escopeta con al menos 100 cartuchos para limpiar la oleada concentrada.',
          'Recoge botín militar de los zombis caídos (mochilas Alice, chalecos y munición).'
        ],
        tip: 'Ten siempre una ruta de escape libre a tu espalda; nunca te dejes acorralar contra una pared ciega.'
      },
      {
        day: 7,
        title: 'Señor de la Ciudad Limpia',
        objectives: [
          'Establece un puesto de avanzada fortificado en el centro urbano.',
          'Consigue una mochila militar de gran capacidad (Large Backpack o Alice Pack).',
          'Monitorea las calles y elimina rezagados para mantener el respawn controlado.'
        ],
        tip: 'Un combatiente bien alimentado y descansado es una máquina de matar en Project Zomboid.'
      }
    ]
  },
  {
    id: 'especialista',
    title: 'El Especialista de Oficios (Rol y Servidores)',
    subtitle: 'El médico, sastre, cocinero o herrero vital para tu comunidad',
    icon: '🤝',
    spiffoBanner: '/spiffo/spiffo_multiplayer.png',
    philosophy: 'En un apocalipsis en equipo, el valor está en la especialización. Provees medicina, reparas armaduras impenetrables de cuero y cocinas guisos de alta moral.',
    recommendedTraits: ['Primeros auxilios', 'Costurero', 'Cocinero', 'Sociable'],
    keyStats: ['Primeros auxilios', 'Sastrería', 'Cocina', 'Metalistería / Herrería B42'],
    daysPlan: [
      {
        day: 1,
        title: 'El Consultorio y los Primeros Auxilios',
        objectives: [
          'Reúne alcohol médico, antibióticos, férulas y apósitos.',
          'Aprende a tratar fracturas y quemaduras en otros jugadores.',
          'Establece una sala de cuarentena médica en la base del grupo.'
        ],
        tip: 'Las heridas por corte con cristales sangran a velocidad mortal; quita los cristales con pinzas antes de vendar.'
      },
      {
        day: 2,
        title: 'El Taller de Sastrería de Combate',
        objectives: [
          'Consigue tijeras, varias agujas de coser y cientos de hilos rasgando ropa.',
          'Lee "Sastrería Vol. 1 y 2" para desbloquear multiplicadores.',
          'Empieza a coser parches de tela en la ropa de tus compañeros para subir nivel.'
        ],
        tip: 'A nivel 8 de Sastrería, los parches de cuero otorgan 100% de protección contra mordeduras en ropa clave.'
      },
      {
        day: 3,
        title: 'Nutrición y Control de Depresión',
        objectives: [
          'Consigue cacerolas, sartenes y especias (sal, pimienta, kétchup).',
          'Cocina guisos calientes con verduras y carne cazada; reducen el estrés y aburrimiento a 0.',
          'Prepara conservas en tarros antes de que se pudra la verdura fresca.'
        ],
        tip: 'La comida cocinada en cacerola rinde el doble de porciones que comer los ingredientes crudos.'
      },
      {
        day: 4,
        title: 'Comercio y Suministros con Otros Grupos',
        objectives: [
          'Establece una lista de precios o intercambios en el servidor de rol.',
          'Ofrece servicios de reparación de blindaje textil a cambio de clavos o balas.',
          'Instala una radio de alta frecuencia para comunicarte con otras facciones.'
        ],
        tip: 'En servidores multijugador, un sastre o médico con reputación honesta nunca carece de protectores armados.'
      },
      {
        day: 5,
        title: 'Metalistería y Herrería Artesanal',
        objectives: [
          'Consigue soplete, careta de soldador y varillas de soldadura.',
          'Instala barras metálicas reforzadas en las ventanas críticas de la sede comunitaria.',
          'Fabrica cajas fuertes de metal para almacenar los objetos más valiosos del grupo.'
        ],
        tip: 'Las ventanas con barras de metal permiten ver hacia afuera y atacar con lanzas con total seguridad.'
      },
      {
        day: 6,
        title: 'Coordinación Táctica durante el Helicóptero',
        objectives: [
          'Prepara el kit médico de trauma con suturas listas en caso de que alguien resulte herido.',
          'Coordina al equipo por radio para no salir del refugio.',
          'Distribuye raciones cocinadas de alta energía a los defensores de guardia.'
        ],
        tip: 'La moral alta previene que los personajes caigan en depresión severa durante encierros prolongados.'
      },
      {
        day: 7,
        title: 'Pilar Inmortal de la Comunidad',
        objectives: [
          'Alcanza nivel maestro en tu oficio principal.',
          'Equipa a todo tu grupo con chaquetas blindadas con parches de cuero nivel máximo.',
          'Crea un banco de semillas y botiquín de emergencia para futuras generaciones de supervivientes.'
        ],
        tip: 'Un grupo con un especialista dedicado sobrevive 5 veces más tiempo que un grupo de lobos solitarios.'
      }
    ]
  }
];

export const TOP_LOCATIONS_BY_CITY = {
  rosewood: {
    cityName: 'Rosewood',
    difficulty: 'Fácil / Equilibrada (Ideal principiantes)',
    locations: [
      {
        name: 'Estación de Bomberos (Fire Station)',
        type: 'Mejor Base Estratégica',
        badge: 'Base Top 1',
        icon: '🚒',
        whyGood: 'Segundo piso espacioso, cocina completa, garaje para vehículos, taquillas con hachas de bombero y ropa blindada contra mordidas. Justo enfrente de la estación de policía.',
        dangerLevel: 'Bajo - Medio'
      },
      {
        name: 'Estación de Policía (Police Station)',
        type: 'Punto Caliente de Armas',
        badge: 'Loot Armas',
        icon: '👮',
        whyGood: 'Armería cerrada con escopetas, pistolas y munición. Requiere desarmar la puerta o atraer un zombi policía que tire la llave del edificio.',
        dangerLevel: 'Medio'
      },
      {
        name: 'Instituto / Escuela Secundaria (Rosewood High)',
        type: 'Conocimiento y Mochilas',
        badge: 'Libros y Mochilas',
        icon: '📚',
        whyGood: 'Biblioteca inmensa con todos los manuales de habilidades (Carpintería, Mecánica, Cocina) y casilleros con mochilas escolares.',
        dangerLevel: 'Medio - Alto'
      }
    ]
  },
  riverside: {
    cityName: 'Riverside',
    difficulty: 'Muy Fácil (Río con agua y pesca infinita)',
    locations: [
      {
        name: 'Casas cerradas del Country Club / Urbanización',
        type: 'Mejor Base Estratégica',
        badge: 'Base Segura',
        icon: '🏡',
        whyGood: 'Vallas altas preconstruidas de hierro que los zombis no pueden saltar, chimeneas de leña para el invierno y grandes patios cultivables.',
        dangerLevel: 'Bajo'
      },
      {
        name: 'Ferretería y Farmacia del Centro',
        type: 'Herramientas y Medicina',
        badge: 'Loot Crítico',
        icon: '🔨',
        whyGood: 'Palancas, mazos, clavos y palas garantizadas en la ferretería; analgésicos y antibióticos en la botica contigua.',
        dangerLevel: 'Medio'
      },
      {
        name: 'Muelle del Río y Tienda de Pesca',
        type: 'Alimento y Agua Infinita',
        badge: 'Recursos Infinitos',
        icon: '🎣',
        whyGood: 'Acceso continuo a agua dulce sin límite y cañas de pescar con cebos para nunca pasar hambre.',
        dangerLevel: 'Muy Bajo'
      }
    ]
  },
  muldraugh: {
    cityName: 'Muldraugh',
    difficulty: 'Media (Mucha madera, autopista muy densa)',
    locations: [
      {
        name: 'Almacén Grande del Norte (Large Warehouse)',
        type: 'Mejor Base y Herramientas',
        badge: 'Base Industrial',
        icon: '🏭',
        whyGood: 'Cientos de cajas de madera repletas de clavos, hachas, palas y semillas. Techo plano perfecto para agricultura y colector de lluvia.',
        dangerLevel: 'Medio - Alto'
      },
      {
        name: 'Comisaría y Zona de Oficinas',
        type: 'Armas y Seguridad',
        badge: 'Loot Táctico',
        icon: '🚔',
        whyGood: 'Armería con armamento policial y furgonetas policiales en el aparcamiento.',
        dangerLevel: 'Alto'
      },
      {
        name: 'Taberna / Cortijo Aislado al Sur',
        type: 'Refugio Rústico Tranquilo',
        badge: 'Paz Rural',
        icon: '🌲',
        whyGood: 'Rodeado de bosque para tala infinita y lejos del tráfico de la autopista central.',
        dangerLevel: 'Muy Bajo'
      }
    ]
  },
  westpoint: {
    cityName: 'West Point',
    difficulty: 'Difícil / Hardcore (Densidad extrema, botín militar)',
    locations: [
      {
        name: 'Mansiones a orillas del Río (Norte)',
        type: 'Mejor Base de Supervivencia',
        badge: 'Base de Lujo',
        icon: '🏰',
        whyGood: 'Propiedades enormes aisladas de la masa de la ciudad con acceso directo al río para agua y pesca.',
        dangerLevel: 'Bajo'
      },
      {
        name: 'Tienda de Armas de la Autopista (Gun Shop)',
        type: 'El Santo Grial Armamentístico',
        badge: 'Armamento Máximo',
        icon: '🎯',
        whyGood: 'El mayor arsenal del este del mapa. Protegida por rejas de seguridad que requieren mazo para entrar.',
        dangerLevel: 'Extremo'
      },
      {
        name: 'Ferretería Central y Gasolinera Gigante',
        type: 'Suministros Críticos',
        badge: 'Combustible y Acero',
        icon: '⛽',
        whyGood: 'Gasolina suficiente para años y todas las herramientas pesadas de construcción.',
        dangerLevel: 'Muy Alto'
      }
    ]
  }
};
