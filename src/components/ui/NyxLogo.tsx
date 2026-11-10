import { nyxAssets } from "@/content/nyx-assets";

/** Marca provisional compartida por navegación y pie de página. */
export function NyxLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-[0.3em] ${className}`}>
      {/* SVG propio servido desde la biblioteca visual compartida. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={nyxAssets.logoSymbol} alt="" aria-hidden="true" width="28" height="28" className="size-7 shrink-0" />
      NYX
    </span>
  );
}
