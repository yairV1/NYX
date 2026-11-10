import { roadmap } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

/** Línea de ruta: una guía luminosa con un nodo por paso. */
export function Roadmap() {
  return (
    <div className="border-t border-line bg-nebula/40">
      <Section id="roadmap" index="07" eyebrow={roadmap.eyebrow} title={roadmap.title} aside={<p className="text-mist">{roadmap.note}</p>}>
        <ol className="relative grid gap-x-5 gap-y-10 md:grid-cols-2 xl:grid-cols-5">
          <span aria-hidden className="rule-glow absolute inset-x-0 top-[0.4rem] hidden xl:block" />
          {roadmap.steps.map((step, i) => (
            <li key={step.title} className="reveal relative">
              <span aria-hidden className={`relative block size-3.5 rounded-full border-2 ${step.status === "available" || step.status === "in-progress" ? "border-signal bg-signal shadow-[0_0_14px_var(--color-signal)]" : "border-line-strong bg-void"}`} />
              <p aria-hidden className="label-tech mt-5 text-mist">Paso 0{i + 1}</p>
              <h3 className="mt-2 font-display text-base font-semibold tracking-wide uppercase">{step.title}</h3>
              <p className="mt-2.5 mb-5 leading-relaxed text-mist">{step.text}</p>
              <StatusBadge status={step.status} />
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
