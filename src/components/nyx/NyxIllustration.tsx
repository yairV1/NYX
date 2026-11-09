import type { NyxRendererProps } from "./types";

const FUR = "#8f877b";
const FUR_LIGHT = "#cbc2b4";
const STRIPE = "#3a332d";
const HOODIE = "#22346b";
const HOODIE_DARK = "#17234b";
const BACKPACK = "#7c3aed";

/**
 * Ilustración vectorial PROVISIONAL de NYX, dibujada para este prototipo a
 * partir de la descripción del brief (no es un activo oficial).
 * Sirve de marcador de posición y de póster/fallback del futuro modelo 3D.
 */
export function NyxIllustration({ label, className = "" }: NyxRendererProps) {
  return (
    <svg
      viewBox="0 0 400 460"
      role="img"
      aria-label={label}
      className={className}
    >
      <defs>
        <linearGradient id="nyx-eye" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a7f3c4" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="nyx-hoodie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b4184" />
          <stop offset="1" stopColor={HOODIE} />
        </linearGradient>
        <radialGradient id="nyx-rim" cx="0.5" cy="0.1" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="nyx-breathe">
        {/* Mochila morada, detrás de los hombros */}
        <rect x="94" y="314" width="212" height="156" rx="44" fill="#4c1d95" />

        {/* Sudadera */}
        <path
          d="M52 460C52 390 96 340 150 328h100c54 12 98 62 98 132Z"
          fill="url(#nyx-hoodie)"
          stroke="#4a62ad"
          strokeWidth="2"
        />
        <path
          d="M128 332c12-32 132-32 144 0-10 32-134 32-144 0Z"
          fill={HOODIE_DARK}
        />

        {/* Correas de la mochila */}
        <path
          d="M118 344c-10 36-12 76-8 116h24c-4-40-2-76 6-122Z"
          fill={BACKPACK}
        />
        <path
          d="M282 344c10 36 12 76 8 116h-24c4-40 2-76-6-122Z"
          fill={BACKPACK}
        />

        {/* Cordones */}
        <g stroke="#f5f7ff" strokeWidth="4" strokeLinecap="round">
          <path d="M184 356l-3 30M216 356l3 30" />
        </g>

        {/* Huella blanca */}
        <g fill="#f5f7ff">
          <ellipse cx="200" cy="436" rx="17" ry="13" />
          <circle cx="179" cy="417" r="6.5" />
          <circle cx="192.500" cy="407" r="6.5" />
          <circle cx="207.500" cy="407" r="6.5" />
          <circle cx="221" cy="417" r="6.5" />
        </g>

        <g transform="translate(0 18)">
        {/* Orejas */}
        <g strokeLinejoin="round" strokeWidth="10">
          <path d="M112 150 98 54l84 52Z" fill={FUR} stroke={FUR} />
          <path d="M288 150l14-96-84 52Z" fill={FUR} stroke={FUR} />
          <path d="M122 132l-8-52 46 30Z" fill="#c9a39a" stroke="#c9a39a" />
          <path d="M278 132l8-52-46 30Z" fill="#c9a39a" stroke="#c9a39a" />
        </g>

        {/* Cabeza */}
        <ellipse cx="200" cy="205" rx="112" ry="98" fill={FUR} />
        <ellipse cx="200" cy="205" rx="112" ry="98" fill="url(#nyx-rim)" />
        <ellipse cx="200" cy="252" rx="62" ry="42" fill={FUR_LIGHT} />

        {/* Rayas atigradas */}
        <g stroke={STRIPE} strokeLinecap="round" fill="none">
          <path d="M200 112v38M176 116l6 32M224 116l-6 32" strokeWidth="9" />
          <path
            d="M92 198l30 9M94 228h30M308 198l-30 9M306 228h-30"
            strokeWidth="8"
          />
        </g>

        {/* Ojos verdes */}
        <g className="nyx-blink">
          <g stroke="#2a2420" strokeWidth="3">
            <ellipse cx="155" cy="205" rx="24" ry="26" fill="url(#nyx-eye)" />
            <ellipse cx="245" cy="205" rx="24" ry="26" fill="url(#nyx-eye)" />
          </g>
          <ellipse cx="155" cy="206" rx="9" ry="19" fill="#0b1020" />
          <ellipse cx="245" cy="206" rx="9" ry="19" fill="#0b1020" />
          <circle cx="148" cy="196" r="5" fill="#fff" />
          <circle cx="238" cy="196" r="5" fill="#fff" />
        </g>

        {/* Nariz rosada y boca */}
        <path
          d="M190 244q10-4 20 0-4 12-10 14-6-2-10-14Z"
          fill="#f4a6b7"
        />
        <path
          d="M200 258v10m0 0q-10 12-22 4m22-4q10 12 22 4"
          stroke={STRIPE}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bigotes */}
        <g stroke="#ece6dc" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <path d="M140 256l-56-8M140 266l-54 6M260 256l56-8M260 266l54 6" />
        </g>
        </g>
      </g>
    </svg>
  );
}
