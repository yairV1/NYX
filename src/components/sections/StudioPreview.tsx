import { studio } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

/**
 * Muestra ESTÁTICA de NYX Studio. Es una maqueta conceptual: no hay
 * campos ni botones reales para no sugerir que el editor funciona.
 */
export function StudioPreview() {
  return (
    <div className="border-y border-line bg-nebula/25">
      <Section
        id="studio"
        eyebrow={studio.eyebrow}
        title={studio.title}
        aside={<StatusBadge status={studio.status} />}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
          <div className="reveal">
            <p className="text-lg leading-relaxed text-mist">{studio.body}</p>
            <ul className="mt-7 space-y-3">
              {studio.principles.map((principle) => (
                <li key={principle} className="flex gap-3 text-starlight/90">
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    className="mt-1 size-4 shrink-0 text-signal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                  {principle}
                </li>
              ))}
            </ul>
          </div>

          <figure className="reveal">
            <div
              role="img"
              aria-label={studio.mockAlt}
              className="glass overflow-hidden rounded-2xl shadow-[0_40px_80px_-40px_rgb(124_58_237/0.6)]"
            >
              <StudioMock />
            </div>
            <figcaption className="mt-4 flex gap-2.5 text-sm leading-relaxed text-mist">
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="mt-0.5 size-4 shrink-0 text-violet-soft"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="10" cy="10" r="7.5" />
                <path d="M10 9v4.5M10 6.500v.010" />
              </svg>
              {studio.disclaimer}
            </figcaption>
          </figure>
        </div>
      </Section>
    </div>
  );
}

function Bar({ className = "" }: { className?: string }) {
  return <span className={`block h-1.5 rounded-full ${className}`} />;
}

function StudioMock() {
  return (
    <div aria-hidden className="select-none">
      {/* Barra superior */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-starlight/25" />
          <span className="size-2.5 rounded-full bg-starlight/25" />
          <span className="size-2.5 rounded-full bg-starlight/25" />
        </div>
        <Bar className="w-24 bg-starlight/25" />
        <span className="ml-auto rounded-full border border-dashed border-violet-soft/60 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider text-violet-soft uppercase">
          Concepto
        </span>
      </div>

      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)_9.5rem]">
        {/* Herramientas */}
        <div className="flex flex-col items-center gap-2.5 border-r border-line py-4">
          <span className="size-7 rounded-lg bg-violet/50 ring-1 ring-violet-soft/60" />
          <span className="size-7 rounded-lg bg-starlight/8" />
          <span className="size-7 rounded-lg bg-starlight/8" />
          <span className="size-7 rounded-lg bg-starlight/8" />
        </div>

        {/* Lienzo */}
        <div className="relative aspect-[4/3] bg-[radial-gradient(rgb(245_247_255/0.1)_1px,transparent_1px)] bg-size-[18px_18px] p-[7%]">
          <div className="relative h-full rounded-xl bg-linear-to-br from-nebula to-void p-[7%] ring-1 ring-starlight/15">
            <Bar className="w-1/4 bg-signal/80" />
            <div className="mt-[6%] h-[9%] w-3/5 rounded-md bg-starlight/85" />
            <div className="mt-[3%] h-[9%] w-2/5 rounded-md bg-linear-to-r from-violet-soft to-signal" />
            <div className="mt-[8%] grid grid-cols-3 gap-[4%]">
              <div className="aspect-[4/3] rounded-lg bg-starlight/10" />
              <div className="aspect-[4/3] rounded-lg bg-violet/45 outline-2 outline-offset-2 outline-signal" />
              <div className="aspect-[4/3] rounded-lg bg-starlight/10" />
            </div>
          </div>
        </div>

        {/* Propiedades */}
        <div className="hidden space-y-4 border-l border-line p-4 sm:block">
          <Bar className="w-2/3 bg-starlight/40" />
          <div className="grid grid-cols-2 gap-2">
            <span className="h-6 rounded-md bg-starlight/8" />
            <span className="h-6 rounded-md bg-starlight/8" />
          </div>
          <Bar className="w-1/2 bg-starlight/40" />
          <div className="flex gap-1.5">
            <span className="size-5 rounded-full bg-violet" />
            <span className="size-5 rounded-full bg-signal" />
            <span className="size-5 rounded-full bg-starlight" />
          </div>
          <Bar className="w-3/4 bg-starlight/20" />
          <Bar className="w-1/2 bg-starlight/20" />
        </div>
      </div>

      {/* Barra de descripción (decorativa, no es un campo) */}
      <div className="flex items-center gap-3 border-t border-line px-4 py-3">
        <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-signal">
          <path
            fill="currentColor"
            d="M12 1c1.200 6.400 3.600 8.800 10 10-6.400 1.200-8.800 3.600-10 10-1.200-6.400-3.600-8.800-10-10 6.400-1.200 8.800-3.600 10-10Z"
          />
        </svg>
        <span className="truncate text-sm text-mist">
          Describe lo que imaginas…
        </span>
        <span className="ml-auto h-6 w-14 shrink-0 rounded-full bg-starlight/10" />
      </div>
    </div>
  );
}
