import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-violet text-white shadow-[0_0_0_1px_rgb(185_162_255/0.35),0_12px_40px_-12px_rgb(124_58_237/0.9)] hover:bg-[#8b4df5] hover:shadow-[0_0_0_1px_rgb(185_162_255/0.6),0_16px_48px_-10px_rgb(124_58_237/1)]",
  secondary:
    "border border-starlight/25 bg-starlight/5 text-starlight hover:border-signal/70 hover:bg-starlight/10",
};

type Props = ComponentProps<"a"> & { variant?: Variant };

/** Enlace con apariencia de botón. Los CTA de esta web navegan a anclas internas. */
export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
