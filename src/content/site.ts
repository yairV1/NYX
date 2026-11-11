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

export const assistant = {
  eyebrow: "NYX AI · Visión",
  title: "Una inteligencia con la que conectar",
  status: "defining" as Status,
  body: "Estamos diseñando a NYX como un asistente de inteligencia artificial con personalidad propia. Un compañero para explorar ideas, entender lo complejo y encontrar el siguiente paso de tus proyectos.",
  capabilities: [
    {
      title: "Piensa contigo",
      text: "La visión es ayudarte a ordenar ideas y convertir preguntas en un plan.",
    },
    {
      title: "Crea a tu lado",
      text: "Conectar la conversación con herramientas creativas dentro de Studio.",
    },
    {
      title: "Aprende y explora",
      text: "Explicar conceptos y acompañarte mientras construyes.",
    },
  ],
  demo: {
    user: "Tengo una idea para un proyecto. ¿Por dónde empiezo?",
    answer:
      "Empecemos por lo que imaginas. ¿Qué quieres crear y a quién te gustaría ayudar?",
    suggestions: ["Explorar la idea", "Dar el primer paso"],
  },
  disclaimer:
    "Conversación ilustrativa. El asistente está en definición y todavía no está disponible.",
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
  lead: "Un hogar que puedes explorar, un primer lienzo que puedes usar y una inteligencia que seguimos imaginando. Cada pieza muestra su estado real.",
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
      status: "available" as Status,
      text: "Ya puedes probar el primer lienzo: escribe, elige una atmósfera y exporta tu diseño. La generación con IA y el editor completo siguen en desarrollo.",
    },
    {
      id: "nyx-labs",
      name: "NYX Labs",
      status: "defining" as Status,
      text: "El espacio para experimentos y prototipos del ecosistema. Todavía sin contenido público.",
    },
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
      title: "Primer lienzo de Studio",
      status: "available" as Status,
      text: "Composición local con texto, atmósferas y descarga PNG. El editor completo y la IA son el siguiente paso.",
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
