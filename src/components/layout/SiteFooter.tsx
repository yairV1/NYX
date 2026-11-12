import Link from "next/link";
import { ecosystem, navItems, site, STATUS_LABEL } from "@/content/site";
import { NyxLogo } from "@/components/ui/NyxLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-void/80">
      <div className="container-nyx grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <NyxLogo />
          <p className="label-tech mt-5 text-starlight">{site.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
            Ecosistema creativo y tecnológico impulsado por IA. El contenido de
            este sitio cambiará a medida que el proyecto avance.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="label-tech mb-4 text-mist">Navegación</h2>
          <ul>
            {[...navItems, { id: "roadmap", label: "Roadmap" }].map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="inline-flex min-h-11 items-center text-starlight/90 hover:text-signal">{item.label}</a>
              </li>
            ))}
            <li>
              <Link href="/casa-nodo" className="inline-flex min-h-11 items-center text-violet-soft hover:text-starlight">Abrir Casa Nodo →</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="label-tech mb-4 text-mist">Ecosistema</h2>
          <ul className="space-y-4">
            {ecosystem.items.map((item) => (
              <li key={item.id} className="text-starlight/90">
                {item.name}
                <span className="label-tech mt-1 block text-mist">{STATUS_LABEL[item.status]}</span>
              </li>
            ))}
            <li className="text-starlight/90">
              Comunidad
              <span className="label-tech mt-1 block text-mist">Próximamente</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-nyx label-tech flex flex-wrap justify-between gap-3 py-6 text-mist">
          <span>© {new Date().getFullYear()} {site.name} · Prototipo en desarrollo</span>
          <span>{site.author}</span>
        </p>
      </div>
    </footer>
  );
}
