/**
 * Contrato común de cualquier representación de NYX dentro de la escena.
 *
 * Hoy sólo existe `NyxIllustration` (SVG). El futuro renderer 3D
 * (`NyxModel3D`, WebGL) debe aceptar estas mismas props para poder
 * intercambiarse en `NyxCharacter` sin tocar la escena ni el hero.
 * Ver docs/ARCHITECTURE.md → «Integración del personaje 3D».
 */
export type NyxRendererProps = {
  /** Descripción accesible del personaje. */
  label: string;
  className?: string;
};
