import { about } from "@/content/site";
import { Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section id="que-es-nyx" eyebrow={about.eyebrow} title={about.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="reveal space-y-5 text-lg leading-relaxed text-mist">
          {about.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ol className="grid gap-4 sm:grid-cols-3 lg:gap-5">
          {about.pillars.map((pillar, i) => (
            <li key={pillar.title} className="reveal glass rounded-2xl p-6">
              <span
                aria-hidden
                className="font-display text-sm font-medium text-signal"
              >
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-2xl font-semibold">
                {pillar.title}
              </h3>
              <p className="mt-3 leading-relaxed text-mist">{pillar.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
