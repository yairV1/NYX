/**
 * Rutas de recursos públicos de NYX.
 *
 * El sitio se publica en GitHub Pages bajo `/NYX`. Next no antepone el basePath
 * a las rutas de `public/` escritas a mano (ni en `next/image`), así que todo
 * recurso estático debe pasar por `withBase`.
 */
const basePath = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/NYX" : "";

export function withBase(path: string): string {
  return `${basePath}${path}`;
}

export const nyxAssets = {
  logo: withBase("/assets/nyx/logos/nyx-logo.svg"),
  logoSymbol: withBase("/assets/nyx/logos/nyx-emblem.svg"),
  appIcon: withBase("/assets/nyx/logos/nyx-app-icon.svg"),
  labBackdrop: withBase("/assets/nyx/backgrounds/lab-atmosphere.svg"),
  /** Renders del modelo 3D real (Blender), usados como respaldo del hero en vivo. */
  posterIdle: withBase("/assets/nyx/character/nyx-3d-idle.webp"),
  posterWave: withBase("/assets/nyx/character/nyx-3d-wave.webp"),
  roomPoster: withBase("/assets/nyx/backgrounds/casa-nodo-after-hours.webp"),
  model: withBase("/assets/nyx/models/nyx-v2-refined.glb"),
  dracoDecoder: withBase("/draco/"),
} as const;
