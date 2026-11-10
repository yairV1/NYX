import type { CSSProperties } from "react";
import { hero, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroStage } from "./HeroStage";

const order = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Hero: el protagonista es el modelo 3D real de NYX, en vivo.
 * Escritorio: texto a la izquierda y escenario a la derecha. Móvil: apilado,
 * con el texto y las acciones antes del escenario.
 */
export function Hero() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className="relative pt-(--header-h)">
      <div className="container-nyx grid items-center gap-12 py-12 sm:py-16 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14 lg:py-10">
        <div>
          <p className="enter label-tech mb-6 flex items-center gap-3 text-signal" style={order(0)}>
            <span aria-hidden className="h-px w-10 bg-signal" />
            {hero.eyebrow}
          </p>

          <h1 id="inicio-titulo" className="font-display text-[clamp(2rem,8.4vw,3.4rem)] leading-[1.08] font-bold tracking-tight uppercase lg:text-[clamp(2.4rem,4.3vw,4.4rem)]">
            {hero.titleLines.map((line, i) => (
              <span key={line} className="enter block" style={order(i + 1)}>{line}</span>
            ))}
            <span className="enter text-gradient-nyx block pb-1" style={order(hero.titleLines.length + 1)}>{hero.titleAccent}</span>
          </h1>

          <p className="enter mt-7 max-w-xl text-lg leading-relaxed text-mist sm:text-xl" style={order(4)}>{hero.lead}</p>

          <div className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={order(5)}>
            <ButtonLink href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary">{hero.secondaryCta.label}</ButtonLink>
          </div>

          <dl className="enter mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4" style={order(6)}>
            {hero.specs.map((spec) => (
              <div key={spec.label} className="flex flex-col-reverse bg-void/85 px-4 py-3.5">
                <dt className="label-tech mt-1 text-mist">{spec.label}</dt>
                <dd className="font-display text-xl font-semibold text-starlight">{spec.value}</dd>
              </div>
            ))}
          </dl>
          <p className="enter label-tech mt-4 text-mist" style={order(7)}>Datos del modelo 3D publicado · {hero.note}</p>
        </div>

        <HeroStage />
      </div>

      <div className="border-y border-line bg-void/60 py-4" aria-hidden>
        <div className="ticker label-tech text-mist">
          {[0, 1, 2].map((copy) => (
            <div key={copy} className="ticker-track">
              {["Imagina", "Crea", "Transforma", site.motto, site.author, "NYX AI", "NYX Studio", "NYX Labs", "Casa Nodo"].map((word) => (
                <span key={word} className="flex items-center gap-12 whitespace-nowrap">
                  {word}
                  <span className="size-1 rounded-full bg-signal" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
