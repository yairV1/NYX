"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Respuesta sutil al cursor: publica --px / --py (rango -1..1) en el
 * contenedor y las capas `.lab-layer` se desplazan según su --depth.
 *
 * No esencial por diseño: sólo se activa con puntero fino y sin
 * prefers-reduced-motion; no hay re-render de React (escribe CSS vars).
 */
export function PointerParallax({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const query = window.matchMedia(
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
    );
    let frame = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };

    const sync = () => {
      window.removeEventListener("pointermove", onMove);
      reset();
      if (query.matches) {
        window.addEventListener("pointermove", onMove, { passive: true });
      }
    };

    sync();
    query.addEventListener("change", sync);
    document.documentElement.addEventListener("pointerleave", reset);

    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
