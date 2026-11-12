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

/**
 * Sección estándar. Cabecera única de toda la página: rótulo «NN / tema» y
 * título. Las secciones con maquetación propia (personaje, Casa Nodo) usan el
 * mismo rótulo `.eyebrow` y el mismo título para que la página se lea seguida.
 */
export function Section({
  id,
  index,
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
      className={`container-nyx py-20 sm:py-28 ${className}`}
    >
      <header className="reveal mb-10 sm:mb-12">
        <p className="eyebrow mb-6">
          <span aria-hidden className="eyebrow-index">
            {index} /
          </span>
          {eyebrow}
        </p>
        <h2 id={headingId} className="max-w-4xl text-heading">
          {title}
        </h2>
        {aside ? <div className="mt-6">{aside}</div> : null}
      </header>
      {children}
    </section>
  );
}
