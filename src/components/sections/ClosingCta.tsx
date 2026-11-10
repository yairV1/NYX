import { closing, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function ClosingCta() {
  return (
    <section aria-labelledby="cierre-titulo" className="container-nyx py-20 sm:py-28">
      <div className="reveal panel hud-corners relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-24">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_50%_0%,rgb(124_58_237/0.45),transparent_70%),radial-gradient(40%_60%_at_85%_100%,rgb(6_182_212/0.2),transparent_70%)]" />
        <p className="label-tech text-signal">{site.motto}</p>
        <h2 id="cierre-titulo" className="mx-auto mt-6 max-w-3xl font-display text-[clamp(1.6rem,5.6vw,3rem)] leading-[1.15] font-bold tracking-tight text-balance uppercase">{closing.title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-mist">{closing.text}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={closing.primaryCta.href}>{closing.primaryCta.label}</ButtonLink>
          <ButtonLink href={closing.cta.href} variant="secondary">{closing.cta.label}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
