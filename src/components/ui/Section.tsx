import type { ReactNode } from "react";

type Props = {
  id: string;
  /** Número de sección visible en la cabecera («02»). */
  index: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  /** Contenido extra junto al encabezado (por ejemplo, una insignia). */
  aside?: ReactNode;
  className?: string;
};

/** Sección estándar: landmark etiquetado por su título y cabecera de sistema. */
export function Section({ id, index, eyebrow, title, children, aside, className = "" }: Props) {
  const headingId = `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={headingId} className={`container-nyx py-20 sm:py-28 ${className}`}>
      <header className="reveal mb-12 sm:mb-16">
        <div className="mb-6 flex items-center gap-4">
          <span aria-hidden className="font-display text-sm font-semibold text-signal">{index}</span>
          <span aria-hidden className="h-px w-10 bg-signal/70" />
          <p className="label-tech text-mist">{eyebrow}</p>
          <span aria-hidden className="rule-glow hidden flex-1 sm:block" />
        </div>
        <h2 id={headingId} className="max-w-4xl font-display text-[clamp(1.6rem,5.4vw,2.2rem)] leading-[1.15] font-bold tracking-tight text-balance uppercase lg:text-[2.75rem]">
          {title}
        </h2>
        {aside ? <div className="mt-6">{aside}</div> : null}
      </header>
      {children}
    </section>
  );
}
