import type { CSSProperties, ReactNode } from "react";
import { PointerParallax } from "./PointerParallax";

const depth = (px: number) => ({ "--depth": `${px}px` }) as CSSProperties;

/**
 * Escena «Creative Lab»: un estudio futurista hecho sólo con CSS/SVG.
 *
 * Capas (de fondo a frente): resplandor, estrellas, suelo en rejilla,
 * portal, paneles flotantes y, en el centro, el personaje (`children`).
 * Todo lo ambiental es decorativo (aria-hidden); la única parte con
 * significado es el personaje, que aporta su propia etiqueta accesible.
 *
 * El hueco `children` es el punto de montaje del futuro modelo 3D: la
 * escena no sabe ni necesita saber qué renderer hay dentro.
 */
export function CreativeLabScene({ children }: { children: ReactNode }) {
  return (
    <PointerParallax className="lab-scene enter-scene mx-auto aspect-[10/9] w-full max-w-[48rem] lg:aspect-square lg:max-h-[min(84svh,49rem)]">
      <div aria-hidden className="contents">
        <div className="lab-layer lab-glow" style={depth(-6)} />
        <div className="lab-layer lab-stars" style={depth(-10)} />
        <div className="lab-layer lab-floor" style={depth(-4)} />

        <div className="lab-layer" style={depth(8)}>
          <div className="lab-ring lab-ring--core" />
          <div className="lab-ring lab-ring--inner" />
          <div className="lab-ring lab-ring--outer" />
        </div>

        {/* Panel: paleta */}
        <div className="lab-layer" style={depth(22)}>
          <div
            className="lab-panel glass float top-[9%] left-[2%] w-[27%] max-w-36"
            style={{ "--float-d": "8s" } as CSSProperties}
          >
            <div className="mb-2 h-1.5 w-1/2 rounded-full bg-starlight/30" />
            <div className="grid grid-cols-4 gap-1.5">
              <span className="aspect-square rounded-md bg-violet" />
              <span className="aspect-square rounded-md bg-signal" />
              <span className="aspect-square rounded-md bg-starlight" />
              <span className="aspect-square rounded-md bg-nebula ring-1 ring-starlight/20" />
            </div>
          </div>
        </div>

        {/* Panel: trazo vectorial */}
        <div className="lab-layer" style={depth(30)}>
          <div
            className="lab-panel glass float top-[16%] right-[1%] w-[30%] max-w-40"
            style={
              { "--float-d": "9s", "--float-delay": "-3s" } as CSSProperties
            }
          >
            <svg viewBox="0 0 120 70" fill="none" className="w-full">
              <path
                d="M8 58C30 58 28 12 60 12s30 46 52 46"
                stroke="var(--color-signal)"
                strokeWidth="2"
              />
              <path
                d="M60 12H22M60 12h38"
                stroke="rgb(245 247 255 / .4)"
                strokeDasharray="3 3"
              />
              <rect x="56" y="8" width="8" height="8" fill="#f5f7ff" />
              <circle cx="22" cy="12" r="3" fill="var(--color-violet-soft)" />
              <circle cx="98" cy="12" r="3" fill="var(--color-violet-soft)" />
            </svg>
          </div>
        </div>

        {/* Panel: capas */}
        <div className="lab-layer" style={depth(16)}>
          <div
            className="lab-panel glass float bottom-[16%] left-[0%] w-[28%] max-w-40 space-y-1.5"
            style={
              { "--float-d": "10s", "--float-delay": "-5s" } as CSSProperties
            }
          >
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-signal" />
              <span className="h-1.5 flex-1 rounded-full bg-starlight/35" />
            </div>
            <div className="flex items-center gap-2 rounded-md bg-violet/30 p-1 ring-1 ring-violet-soft/50">
              <span className="size-2.5 rounded-sm bg-violet-soft" />
              <span className="h-1.5 flex-1 rounded-full bg-starlight/60" />
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-starlight/60" />
              <span className="h-1.5 w-2/3 rounded-full bg-starlight/25" />
            </div>
          </div>
        </div>

        {/* Destello */}
        <div className="lab-layer" style={depth(38)}>
          <svg
            viewBox="0 0 24 24"
            className="float absolute right-[10%] bottom-[24%] w-[7%] text-signal"
            style={{ "--float-d": "6s" } as CSSProperties}
          >
            <path
              fill="currentColor"
              d="M12 1c1.200 6.400 3.600 8.800 10 10-6.400 1.200-8.800 3.600-10 10-1.200-6.400-3.600-8.800-10-10 6.400-1.200 8.800-3.600 10-10Z"
            />
          </svg>
        </div>
      </div>

      <div aria-hidden="true" className="lab-scene-label absolute top-[4%] left-[5%] z-10">NYX / CREATIVE SYSTEM <span>001</span></div>
      <div aria-hidden="true" className="lab-scene-label absolute right-[5%] bottom-[5%] z-10">EXPERIMENTAL LAB · 2026</div>

      {/* Punto de montaje del personaje (SVG hoy, 3D en el futuro) */}
      <div
        data-nyx-stage
        className="lab-layer flex items-end justify-center"
        style={depth(14)}
      >
        {children}
      </div>
    </PointerParallax>
  );
}
