import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl px-6 whitespace-nowrap font-display text-sm font-semibold tracking-[0.08em] uppercase transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-r from-violet to-indigo text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_14px_40px_-14px_rgb(124_58_237/0.95)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_18px_48px_-12px_rgb(99_102_241/1)] hover:brightness-110",
  secondary:
    "border border-line-strong bg-starlight/[0.04] text-starlight hover:border-signal/70 hover:bg-starlight/[0.08]",
};

type Props = Omit<ComponentProps<"a">, "href"> & { href: string; variant?: Variant };

/**
 * Enlace con apariencia de botón. Las rutas internas (`/casa-nodo`) usan
 * `next/link`, que aplica el basePath; las anclas (`#studio`) son enlaces nativos.
 */
export function ButtonLink({ variant = "primary", className = "", href, ...props }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;
  return href.startsWith("/")
    ? <Link href={href} className={classes} {...props} />
    : <a href={href} className={classes} {...props} />;
}
