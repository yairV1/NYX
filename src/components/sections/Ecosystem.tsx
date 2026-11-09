import { ecosystem } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function Ecosystem() {
  return (
    <Section
      id="ecosistema"
      eyebrow={ecosystem.eyebrow}
      title={ecosystem.title}
      aside={<p className="text-lg text-mist">{ecosystem.lead}</p>}
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {ecosystem.items.map((item) => (
          <li
            key={item.id}
            className="reveal glass nyx-ecosystem-card group relative flex min-h-64 flex-col overflow-hidden rounded-2xl p-6 sm:p-8"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-soft/70 to-transparent"
            />
            <StatusBadge status={item.status} />
            <h3 className="mt-6 font-display text-2xl font-semibold">
              {item.name}
            </h3>
            <p className="mt-3 leading-relaxed text-mist">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
