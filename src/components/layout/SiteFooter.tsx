import { ecosystem, navItems, site, STATUS_LABEL } from "@/content/site";
import { NyxLogo } from "@/components/ui/NyxLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-nebula/30">
      <div className="container-nyx grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <NyxLogo />
          <p className="mt-4 font-display text-lg text-starlight">
            {site.tagline}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">
            Ecosistema creativo y tecnológico impulsado por IA. Sitio en su
            primera versión: el contenido cambiará a medida que el proyecto
            avance.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-mist uppercase">
            Navegación
          </h2>
          <ul className="space-y-1">
            {[...navItems, { id: "roadmap", label: "Roadmap" }].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center text-starlight/90 hover:text-signal"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-mist uppercase">
            Ecosistema
          </h2>
          <ul className="space-y-3">
            {ecosystem.items.map((item) => (
              <li key={item.id} className="text-starlight/90">
                {item.name}
                <span className="block text-sm text-mist">
                  {STATUS_LABEL[item.status]}
                </span>
              </li>
            ))}
            <li className="text-starlight/90">
              Comunidad
              <span className="block text-sm text-mist">Próximamente</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-nyx py-6 text-sm text-mist">
          © {new Date().getFullYear()} {site.name}. Prototipo en desarrollo.
        </p>
      </div>
    </footer>
  );
}
