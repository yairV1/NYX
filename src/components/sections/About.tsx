import { about } from "@/content/site";
import { Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section id="que-es-nyx" index="01" eyebrow={about.eyebrow} title={about.title}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="reveal space-y-5 text-lg leading-relaxed text-mist">
          {about.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>

        <ol className="grid gap-4 sm:grid-cols-3">
          {about.pillars.map((pillar, i) => (
            <li key={pillar.title} className="reveal panel panel-interactive flex flex-col p-6">
              <span aria-hidden className="font-display text-4xl font-bold text-transparent [-webkit-text-stroke:1px_var(--color-line-strong)]">0{i + 1}</span>
              <h3 className="mt-6 font-display text-lg font-semibold tracking-wide uppercase">{pillar.title}</h3>
              <p className="mt-3 leading-relaxed text-mist">{pillar.text}</p>
              <span aria-hidden className="mt-auto block h-px w-full translate-y-6 bg-linear-to-r from-signal/70 to-transparent" />
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
