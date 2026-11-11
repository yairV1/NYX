import { nyxAssets } from "@/content/nyx-assets";

/** Horizontal web adaptation of the cat + Nyx identity from the reference sheet. */
export function NyxLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center ${className}`}>
      {/* Native SVG: precise edges and no raster enlargement at navigation sizes. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={nyxAssets.logo}
        alt="Nyx"
        width={126}
        height={56}
        className="h-12 w-auto"
      />
    </span>
  );
}
