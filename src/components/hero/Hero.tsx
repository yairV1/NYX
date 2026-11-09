import type { CSSProperties } from "react";
import { hero } from "@/content/site";
import { NyxCharacter } from "@/components/nyx/NyxCharacter";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CreativeLabScene } from "./CreativeLabScene";

const order = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Hero «NYX Creative Lab».
 * Escritorio: texto ≈42 % / escena ≈58 %. Móvil: apilado, con el texto y
 * los CTA antes que la escena para que las acciones queden visibles.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="relative overflow-clip pt-(--header-h)"
    >
      {/* Atmósfera de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_78%_38%,rgb(124_58_237/0.2),transparent_70%),radial-gradient(50%_50%_at_8%_90%,rgb(34_211_238/0.1),transparent_70%),linear-gradient(to_bottom,var(--color-void),var(--color-nebula)_140%)]"
      />

      <div className="container-nyx relative grid items-center gap-10 py-12 sm:py-16 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-6 lg:py-10">
        <div className="max-w-xl">
          <p
            className="enter mb-5 inline-flex items-center gap-2.5 rounded-full border border-line bg-starlight/5 px-4 py-1.5 font-display text-xs font-medium tracking-[0.22em] text-signal uppercase"
            style={order(0)}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-signal" />
            {hero.eyebrow}
          </p>

          <h1
            id="inicio-titulo"
            className="font-display text-[clamp(2.75rem,11vw,5.5rem)] leading-[0.98] font-bold tracking-tight lg:text-[clamp(3.25rem,5.6vw,5.75rem)]"
          >
            {hero.titleWords.map((word, i) => (
              <span
                key={word}
                className={`enter block ${i === hero.titleWords.length - 1 ? "text-gradient-nyx pb-2" : ""}`}
                style={order(i + 1)}
              >
                {word}{" "}
              </span>
            ))}
          </h1>

          <p
            className="enter mt-6 max-w-md text-lg leading-relaxed text-mist sm:text-xl"
            style={order(4)}
          >
            {hero.lead}
          </p>

          <div
            className="enter mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={order(5)}
          >
            <ButtonLink href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          <p className="enter mt-6 text-sm text-mist" style={order(6)}>
            {hero.note}
          </p>
        </div>

        <CreativeLabScene>
          <NyxCharacter
            label={hero.characterAlt}
            className="h-[84%] w-auto drop-shadow-[0_24px_40px_rgb(0_0_0/0.55)]"
          />
        </CreativeLabScene>
      </div>
    </section>
  );
}
