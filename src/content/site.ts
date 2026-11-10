/**
 * Contenido editable de la web oficial de NYX.
 *
 * Regla del proyecto: aquí no se inventan funcionalidades, cifras ni historia.
 * Todo lo que todavía no existe lleva un `status` explícito y los textos
 * provisionales se marcan con `provisional: true` para que la UI lo muestre.
 */

export type Status =
  | "in-progress" // se está construyendo ahora
  | "in-development" // en desarrollo, sin versión pública
  | "defining" // alcance todavía por definir
  | "planned" // previsto, sin empezar
  | "ready" // preparado, pendiente de integrar
  | "available"; // prototipo que ya se puede probar

export const STATUS_LABEL: Record<Status, string> = {
  "in-progress": "En curso",
  "in-development": "En desarrollo",
  defining: "En definición",
  planned: "Planeado",
  ready: "Preparado",
  available: "Prototipo disponible",
};

export const site = {
  name: "NYX",
  tagline: "Imagina. Crea. Transforma.",
  description:
    "NYX es un ecosistema creativo y tecnológico impulsado por IA. Conoce al personaje, el proyecto y lo que estamos construyendo.",
  /** Lema de la hoja de identidad del autor. */
  motto: "Tu compañero en el código y en la vida.",
  author: "YAIR // AI",
} as const;

export const navItems = [
  { id: "inicio", label: "Inicio" },
  { id: "casa-nodo", label: "Casa Nodo" },
  { id: "asistente", label: "NYX AI" },
  { id: "ecosistema", label: "Ecosistema" },
  { id: "studio", label: "Studio" },
  { id: "historia", label: "Historia" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];

export const hero = {
  eyebrow: "El siguiente capítulo de la creatividad",
  titleLines: ["Tu imaginación.", "Su próximo"],
  titleAccent: "universo.",
  lead: "Conoce a NYX. Estamos construyendo un asistente de IA con personalidad y un estudio donde tus ideas encontrarán nuevas formas de existir.",
  primaryCta: { label: "Entrar a Casa Nodo", href: "/casa-nodo" },
  secondaryCta: { label: "Explorar el ecosistema", href: "#ecosistema" },
  note: "Proyecto independiente · En desarrollo",
  characterAlt:
    "NYX en 3D: un gato atigrado gris de rayas oscuras y ojos verdes, con sudadera azul marino con una huella blanca y mochila morada.",
  stageLabel: "NYX · 3D en tiempo real",
  stageHint: "Mueve el cursor o toca a NYX",
  /** Datos reales del modelo publicado (public/assets/nyx/models/*.report.json). */
  specs: [
    { value: "51 032", label: "triángulos" },
    { value: "89", label: "huesos" },
    { value: "17", label: "animaciones" },
    { value: "2,5 MB", label: "modelo web" },
  ],
  /** Reacciones que se pueden lanzar desde el hero (ids de src/lib/nyx/clips.ts). */
  reactions: ["Wave", "Celebrate", "Think", "Surprise"],
} as const;

export const assistant = {
  eyebrow: "NYX AI · Visión",
  title: "Una inteligencia con la que conectar",
  status: "defining" as Status,
  body: "Estamos diseñando a NYX como un asistente de inteligencia artificial con personalidad propia. Un compañero para explorar ideas, entender lo complejo y encontrar el siguiente paso de tus proyectos.",
  capabilities: [
    { title: "Piensa contigo", text: "La visión es ayudarte a ordenar ideas y convertir preguntas en un plan." },
    { title: "Crea a tu lado", text: "Conectar la conversación con herramientas creativas dentro de Studio." },
    { title: "Aprende y explora", text: "Explicar conceptos y acompañarte mientras construyes." },
  ],
  demo: {
    user: "Tengo una idea para un proyecto. ¿Por dónde empiezo?",
    answer: "Empecemos por lo que imaginas. ¿Qué quieres crear y a quién te gustaría ayudar?",
    suggestions: ["Explorar la idea", "Dar el primer paso"],
  },
  disclaimer: "Conversación ilustrativa. El asistente está en definición y todavía no está disponible.",
} as const;

export const casaNodo = {
  eyebrow: "Casa Nodo · 3D en vivo",
  title: "El hogar de NYX ya se puede visitar",
  status: "available" as Status,
  body: "Casa Nodo es el primer espacio 3D del proyecto: una habitación que puedes girar y acercar, con NYX animado en tiempo real dentro del navegador.",
  features: [
    "NYX en 3D con su rig completo y 17 animaciones.",
    "16 reacciones que puedes lanzar tú: saludar, celebrar, pensar, reír…",
    "Cámara libre, luz de escritorio y versión para móvil.",
  ],
  cta: { label: "Entrar a Casa Nodo", href: "/casa-nodo" },
  note: "Es un prototipo: la escena y las animaciones seguirán cambiando.",
  imageAlt: "NYX en 3D saludando con la pata levantada.",
} as const;

export const about = {
  eyebrow: "¿Qué es NYX?",
  title: "Una personalidad. Todo un universo.",
  body: [
    "NYX da rostro y personalidad a un ecosistema de inteligencia artificial. Su evolución reúne un asistente, un estudio creativo y un espacio para experimentar.",
    "La curiosidad del personaje es el punto de partida. La visión es acompañarte desde la primera pregunta hasta una idea que puedas desarrollar.",
  ],
  pillars: [
    {
      title: "Imagina",
      text: "Todo empieza con una idea. NYX quiere ser el sitio donde empezar a darle forma.",
    },
    {
      title: "Crea",
      text: "Herramientas pensadas para ser intuitivas, con la IA como asistente y no como obstáculo.",
    },
    {
      title: "Transforma",
      text: "Iterar, editar y llevar lo creado un paso más allá, a tu ritmo.",
    },
  ],
} as const;

export const story = {
  eyebrow: "Historia",
  title: "Cada proyecto empieza con curiosidad",
  provisional: false,
  provisionalLabel: "Texto provisional",
  body: "NYX nació como el compañero digital de YAIR // AI para acompañar a quienes programan, aprenden y construyen. Su curiosidad técnica, su paciencia y su mochila siempre lista dan personalidad a este nuevo laboratorio creativo.",
  factsTitle: "Lo que sí podemos decir hoy",
  facts: [
    "NYX es un gato atigrado gris de rayas oscuras, ojos verdes y nariz rosada.",
    "Viste una sudadera azul marino con una huella blanca y lleva una mochila morada.",
    "La web oficial está en su primera versión y crecerá junto con el proyecto.",
  ],
} as const;

export const ecosystem = {
  eyebrow: "Ecosistema",
  title: "Tres piezas, un mismo universo",
  lead: "Cada pieza indica su estado real. Ninguna está disponible al público todavía.",
  items: [
    {
      id: "nyx-ai",
      name: "NYX AI",
      status: "defining" as Status,
      text: "Un futuro asistente con personalidad propia para pensar contigo, explorar ideas y acompañarte en tus proyectos. Estamos definiendo sus capacidades.",
    },
    {
      id: "nyx-studio",
      name: "NYX Studio",
      status: "in-development" as Status,
      text: "Combinará generación asistida con IA y edición visual intuitiva: la idea de un editor de diseño, pero accesible. Aún no hay una versión utilizable.",
    },
    {
      id: "nyx-labs",
      name: "NYX Labs",
      status: "defining" as Status,
      text: "El espacio para experimentos y prototipos del ecosistema. Todavía sin contenido público.",
    },
  ],
} as const;

export const studio = {
  eyebrow: "NYX Studio",
  title: "Crear con IA, editar con las manos",
  body: "NYX Studio unirá dos formas de trabajar: describir lo que imaginas y ajustar el resultado directamente sobre el lienzo, con herramientas pensadas para facilitar los primeros pasos.",
  status: "in-development" as Status,
  disclaimer:
    "Maqueta conceptual. NYX Studio todavía no está disponible y esta imagen no representa un producto en funcionamiento.",
  mockAlt:
    "Maqueta conceptual de la interfaz de NYX Studio: una barra de herramientas, un lienzo con una composición y un panel de propiedades.",
  principles: [
    "Generación asistida con IA como punto de partida.",
    "Edición visual directa sobre el lienzo.",
    "Pensado para personas sin experiencia en diseño.",
  ],
} as const;

export const roadmap = {
  eyebrow: "Roadmap",
  title: "Lo que viene",
  note: "Orden orientativo. Sin fechas comprometidas.",
  steps: [
    {
      title: "Web oficial",
      status: "in-progress" as Status,
      text: "El sitio que estás viendo. Crece junto con el proyecto.",
    },
    {
      title: "NYX en 3D",
      status: "available" as Status,
      text: "NYX ya vive en Casa Nodo con animaciones y reacciones. Sigue en fase de prototipo.",
    },
    {
      title: "Demo de NYX Studio",
      status: "planned" as Status,
      text: "Una demostración acotada del editor cuando exista algo real que mostrar.",
    },
    {
      title: "NYX AI",
      status: "defining" as Status,
      text: "El asistente con personalidad. Estamos definiendo sus capacidades.",
    },
    {
      title: "Comunidad",
      status: "defining" as Status,
      text: "Un espacio para quienes sigan el proyecto. Por definir.",
    },
  ],
} as const;

export const closing = {
  title: "El futuro se crea acompañado.",
  text: "Un asistente, un estudio y muchas ideas por explorar. Este es el comienzo del universo NYX.",
  primaryCta: { label: "Entrar a Casa Nodo", href: "/casa-nodo" },
  cta: { label: "Volver al inicio", href: "#inicio" },
} as const;
