import { roadmap } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function Roadmap() {
  return (
    <Section
      id="roadmap"
      eyebrow={roadmap.eyebrow}
      title={roadmap.title}
      aside={<p className="text-mist">{roadmap.note}</p>}
    >
      <ol className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {roadmap.steps.map((step, i) => (
          <li
            key={step.title}
            className="reveal relative rounded-2xl border border-line bg-surface p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span
                aria-hidden
                className="font-display text-3xl font-bold text-starlight/20"
              >
                0{i + 1}
              </span>
              <StatusBadge status={step.status} />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">
              {step.title}
            </h3>
            <p className="mt-2.5 leading-relaxed text-mist">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
