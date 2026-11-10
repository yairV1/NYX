import { nyxAssets } from "@/content/nyx-assets";

/**
 * Contrato de animaciones de NYX para la web.
 *
 * `source` es el nombre real del clip dentro del GLB (el de la acción en Blender).
 * `id` es el nombre canónico que usa el código de la web. Siguen la convención del
 * proyecto del personaje: PascalCase en inglés, y los nombres antiguos se conservan
 * en el GLB como alias hasta que la biblioteca se estabilice.
 *
 * Solo se listan clips que existen en el GLB publicado. Ver docs/phase-3/README.md.
 */

/** Rutas con el basePath de GitHub Pages ya aplicado. */
export const NYX_MODEL_URL = nyxAssets.model;
export const DRACO_DECODER_PATH = nyxAssets.dracoDecoder;

/** Ciclo de reposo: el único clip en bucle. */
export const IDLE_CLIP = "Idle_Secondary";

export type NyxClipGroup = "action" | "emotion";

export type NyxClip = {
  /** Nombre canónico. */
  id: string;
  /** Nombre del clip en el GLB. */
  source: string;
  /** Texto del botón. */
  label: string;
  group: NyxClipGroup;
};

/** Clips de una sola reproducción. Al terminar, NYX vuelve al reposo. */
export const NYX_CLIPS: readonly NyxClip[] = [
  { id: "Wave", source: "Wave", label: "Saludar", group: "action" },
  { id: "Point", source: "Point", label: "Señalar", group: "action" },
  { id: "Talk", source: "Talking", label: "Hablar", group: "action" },
  { id: "Idle_LookAround", source: "LookAround", label: "Mirar alrededor", group: "action" },
  { id: "Blink", source: "Blink", label: "Parpadear", group: "action" },
  { id: "Wink", source: "Wink", label: "Guiñar", group: "action" },
  { id: "Happy", source: "Happy", label: "Alegría", group: "emotion" },
  { id: "Celebrate", source: "Celebrating", label: "Celebrar", group: "emotion" },
  { id: "Laugh", source: "Laughing", label: "Reír", group: "emotion" },
  { id: "Curious", source: "Curious", label: "Curiosidad", group: "emotion" },
  { id: "Think", source: "Thinking", label: "Pensar", group: "emotion" },
  { id: "Surprise", source: "Surprised", label: "Sorpresa", group: "emotion" },
  { id: "Confused", source: "Confused", label: "Confusión", group: "emotion" },
  { id: "Sad", source: "Sad", label: "Tristeza", group: "emotion" },
  { id: "Angry", source: "Angry", label: "Enfado", group: "emotion" },
  { id: "Tired", source: "Tired", label: "Cansancio", group: "emotion" },
];

export const NYX_CLIP_GROUPS: readonly { id: NyxClipGroup; label: string }[] = [
  { id: "action", label: "Acciones" },
  { id: "emotion", label: "Emociones" },
];

/** Clip que se reproduce al tocar a NYX en la escena. */
export const NYX_TOUCH_CLIP = "Wave";

export function findClip(id: string): NyxClip | undefined {
  return NYX_CLIPS.find((clip) => clip.id === id);
}
