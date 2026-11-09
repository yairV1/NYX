import { NyxIllustration } from "./NyxIllustration";
import type { NyxRendererProps } from "./types";

/**
 * Renderer compartido de NYX.
 * Conserva el SVG original como fallback hasta que el usuario aporte
 * y apruebe un archivo oficial para /public/assets/nyx/character/.
 * Así evitamos mostrar imágenes inexistentes o cambiar su identidad.
 */
export function NyxCharacter(props: NyxRendererProps) {
  return <NyxIllustration {...props} />;
}
