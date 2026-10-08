// Opciones del Wizard de Onboarding de Spiffo-OS

export const ONBOARDING_FLOW = {
  step1: {
    question: '¿Cómo quieres jugar Project Zomboid?',
    subtitle: 'Elige tu punto de partida. Te guiaremos paso a paso según tu objetivo.',
    options: [
      {
        id: 'new',
        title: 'Soy nuevo en el juego',
        badge: 'Recomendado',
        icon: '🔰',
        desc: 'Acabo de empezar, no sé qué hacer primero y los zombis me matan rápido.',
        action: 'next_step',
      },
      {
        id: 'vehicles',
        title: 'Quiero usar vehículos / ser nómada',
        icon: '🚐',
        desc: 'Mi coche es mi hogar. Quiero explorar Kentucky por carretera.',
        routeId: 'first-vehicle',
      },
      {
        id: 'farm',
        title: 'Quiero tener una granja y base segura',
        icon: '🌾',
        desc: 'Construir fortificaciones, plantar comida y sobrevivir al corte de agua.',
        routeId: 'farming-b42',
      },
      {
        id: 'explore',
        title: 'Quiero explorar y saquear',
        icon: '🎒',
        desc: 'Aprender rutas de botín seguras, entrar y salir con vida de ciudades.',
        routeId: 'survival-basics',
      },
      {
        id: 'combat',
        title: 'Quiero aprender combate y armas',
        icon: '⚔️',
        desc: 'Controlar hordas cuerpo a cuerpo y disparar sin atraer a toda la ciudad.',
        routeId: 'combat-basics',
      },
      {
        id: 'roleplay',
        title: 'Quiero jugar Roleplay multijugador',
        icon: '🎭',
        desc: 'Especializarme en un oficio, interactuar y convivir en servidores RP.',
        routeId: 'roleplay-community',
      },
    ],
  },
  step2_newbie: {
    question: '¿Qué es lo que más te llama la atención?',
    subtitle: 'Diseñaremos tu primera ruta de supervivencia según tu curiosidad.',
    options: [
      {
        id: 'explore',
        title: 'Explorar y saquear casas',
        icon: '🎒',
        desc: 'Sobrevivir los primeros 3 días, moverme con sigilo y equiparme bien.',
        routeId: 'survival-basics',
      },
      {
        id: 'vehicles',
        title: 'Conseguir un coche y conducir',
        icon: '🚐',
        desc: 'Encontrar llaves, gasolina y aprender a manejar sin destrozar el motor.',
        routeId: 'first-vehicle',
      },
      {
        id: 'farm',
        title: 'Plantar semillas y cosechar comida',
        icon: '🌱',
        desc: 'Aprender el ciclo de agua, abono y cultivo antes de que se corte el grifo.',
        routeId: 'farming-b42',
      },
      {
        id: 'build',
        title: 'Construir barricadas y muebles',
        icon: '🔨',
        desc: 'Carpintería, tablas, clavos y recolectores de lluvia.',
        routeId: 'carpentry-bases',
      },
      {
        id: 'fight',
        title: 'Aprender a defenderme y pelear',
        icon: '⚔️',
        desc: 'Manejo del espacio, empujones, pisotones a la cabeza y armas blancas.',
        routeId: 'combat-basics',
      },
    ],
  },
};
