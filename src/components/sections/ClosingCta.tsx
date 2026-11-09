import { closing, hero } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function ClosingCta() {
  return (
    <section
      aria-labelledby="cierre-titulo"
      className="container-nyx pb-24 sm:pb-32"
    >
      <div className="reveal relative overflow-hidden rounded-3xl border border-line px-6 py-16 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_50%_0%,rgb(124_58_237/0.4),transparent_70%),radial-gradient(40%_60%_at_85%_100%,rgb(34_211_238/0.16),transparent_70%)] bg-nebula/60"
        />
        <h2
          id="cierre-titulo"
          className="mx-auto max-w-2xl font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl"
        >
          {closing.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-mist">{closing.text}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={closing.cta.href} variant="secondary">
            {closing.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
