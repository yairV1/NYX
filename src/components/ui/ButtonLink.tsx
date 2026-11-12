import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-control px-6 whitespace-nowrap text-body-sm font-semibold transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-violet-soft text-[#171126] hover:bg-[#d4c7ff] shadow-[0_6px_32px_rgb(124_58_237/0.15)]",
  secondary:
    "border border-line-strong bg-starlight/[0.04] text-starlight hover:border-violet-soft/70 hover:bg-starlight/[0.08]",
};

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  variant?: Variant;
};

/**
 * Enlace con apariencia de botón. Las rutas internas (`/casa-nodo`) usan
 * `next/link`, que aplica el basePath; las anclas (`#studio`) son enlaces nativos.
 */
export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  ...props
}: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;
  return href.startsWith("/") ? (
    <Link href={href} className={classes} {...props} />
  ) : (
    <a href={href} className={classes} {...props} />
  );
}
