import { NyxIllustration } from "./NyxIllustration";
import type { NyxRendererProps } from "./types";

/**
 * Punto único de decisión sobre CÓMO se representa a NYX.
 *
 * MVP: ilustración SVG renderizada en servidor (cero JS, cero peso extra).
 *
 * Futuro (no implementado): aquí se montará el renderer 3D como mejora
 * progresiva, manteniendo la ilustración como fallback y póster de carga:
 *
 *   <NyxModel3D fallback={<NyxIllustration … />} … />
 *
 * `NyxModel3D` será un Client Component cargado con `next/dynamic`
 * (`ssr: false`) sólo si hay WebGL, el usuario no pide reduced motion ni
 * ahorro de datos, y la escena entra en el viewport.
 */
export function NyxCharacter(props: NyxRendererProps) {
  return <NyxIllustration {...props} />;
}
