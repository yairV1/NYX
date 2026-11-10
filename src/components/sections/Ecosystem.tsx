import { ecosystem } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

/** Un glifo por módulo: asistente (núcleo), estudio (lienzo) y laboratorio (matraz). */
const glyphs: Record<string, React.ReactNode> = {
  "nyx-ai": <><circle cx="24" cy="24" r="7" /><circle cx="24" cy="24" r="17" strokeDasharray="3 5" /><path d="M24 3v8M24 37v8M3 24h8M37 24h8" /></>,
  "nyx-studio": <><rect x="7" y="9" width="34" height="26" rx="3" /><path d="M7 17h34M15 41h18M19 25l5 5 8-9" /></>,
  "nyx-labs": <><path d="M19 6h10M21 6v13L9 39a2 2 0 0 0 2 3h26a2 2 0 0 0 2-3L27 19V6" /><path d="M15 31h18" /></>,
};

export function Ecosystem() {
  return (
    <Section id="ecosistema" index="04" eyebrow={ecosystem.eyebrow} title={ecosystem.title} aside={<p className="max-w-2xl text-lg text-mist">{ecosystem.lead}</p>}>
      <ul className="grid gap-5 md:grid-cols-3">
        {ecosystem.items.map((item, i) => (
          <li key={item.id} className="reveal panel panel-interactive flex min-h-72 flex-col p-7">
            <div className="flex items-start justify-between gap-4">
              <svg aria-hidden viewBox="0 0 48 48" className="size-12 text-signal" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{glyphs[item.id]}</svg>
              <span aria-hidden className="label-tech text-mist">Módulo 0{i + 1}</span>
            </div>
            <h3 className="mt-8 font-display text-xl font-semibold tracking-wide uppercase">{item.name}</h3>
            <p className="mt-3 mb-7 leading-relaxed text-mist">{item.text}</p>
            <div className="mt-auto"><StatusBadge status={item.status} /></div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
