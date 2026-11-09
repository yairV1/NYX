import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  /** Contenido extra junto al encabezado (por ejemplo, una insignia). */
  aside?: ReactNode;
  className?: string;
};

/** Sección estándar: landmark etiquetado por su título + encabezado consistente. */
export function Section({
  id,
  eyebrow,
  title,
  children,
  aside,
  className = "",
}: Props) {
  const headingId = `${id}-titulo`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`container-nyx py-24 sm:py-32 ${className}`}
    >
      <header className="reveal mb-12 max-w-3xl sm:mb-16">
        <p className="mb-3 font-display text-sm font-medium tracking-[0.2em] text-signal uppercase">
          {eyebrow}
        </p>
        <h2
          id={headingId}
          className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
        >
          {title}
        </h2>
        {aside ? <div className="mt-5">{aside}</div> : null}
      </header>
      {children}
    </section>
  );
}
