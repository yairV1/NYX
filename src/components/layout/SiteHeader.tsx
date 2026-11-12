"use client";

import { useEffect, useId, useState } from "react";
import { navItems, type SectionId } from "@/content/site";
import { NyxLogo } from "@/components/ui/NyxLogo";

/**
 * Cabecera fija con navegación por anclas.
 * - Escritorio: enlaces en línea con la sección activa marcada (aria-current).
 * - Móvil: panel desplegable (disclosure) que se cierra con Escape o al navegar.
 * Sin JavaScript los enlaces de escritorio siguen funcionando como anclas.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId>("inicio");
  const menuId = useId();

  // Sección activa: la que cruza la franja central del viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navItems) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-void/70 backdrop-blur-xl">
      <div className="container-nyx flex h-(--header-h) items-center justify-between gap-6">
        <a
          href="#inicio"
          aria-label="NYX, ir al inicio"
          className="text-starlight"
        >
          <NyxLogo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const current = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={current ? "location" : undefined}
                    className={`text-xs relative rounded-control px-3.5 py-3 transition-colors hover:text-starlight ${
                      current ? "text-starlight" : "text-mist"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3.5 bottom-1 h-px bg-signal shadow-[0_0_8px_var(--color-signal)] transition-opacity ${
                        current ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-control border border-line-strong text-starlight lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id={menuId}
        aria-label="Principal, móvil"
        hidden={!open}
        className="border-t border-line bg-void/95 lg:hidden"
      >
        <ul className="container-nyx flex flex-col py-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line/60 text-sm font-medium tracking-wide text-starlight last:border-b-0 aria-[current]:text-signal"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
