/** Marca tipográfica provisional. Sustituir por el logotipo oficial cuando exista. */
export function NyxLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-[0.28em] ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="12" r="9.2" stroke="var(--color-violet-soft)" />
        <path
          d="M12 5.2c.7 3.6 2.2 5.1 5.8 5.8-3.6.7-5.1 2.2-5.8 5.8-.7-3.6-2.2-5.1-5.8-5.8 3.6-.7 5.1-2.2 5.8-5.8Z"
          fill="var(--color-signal)"
        />
      </svg>
      NYX
    </span>
  );
}
