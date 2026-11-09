/** Rutas de recursos compartidos, compatibles con GitHub Pages y localhost. */
const basePath = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/NYX" : "";

export const nyxAssets = {
  logoSymbol: `${basePath}/assets/nyx/logos/nyx-symbol.svg`,
  labBackdrop: `${basePath}/assets/nyx/backgrounds/lab-atmosphere.svg`,
} as const;
