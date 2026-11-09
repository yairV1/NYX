import { studio } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

/** Experiencia visual conceptual. No es un editor funcional. */
export function StudioPreview() {
  return (
    <div className="nyx-studio-section relative overflow-hidden border-y border-line">
      <Section id="studio" eyebrow={studio.eyebrow} title={studio.title}
        aside={<div className="flex flex-wrap items-center gap-4"><StatusBadge status={studio.status} /><span className="text-sm text-mist">Una ventana al futuro de NYX</span></div>}>
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <p className="reveal max-w-xl text-lg leading-relaxed text-mist">{studio.body}</p>
          <ul className="reveal grid gap-3 sm:grid-cols-2">
            {studio.principles.map((principle) => <li key={principle} className="flex items-start gap-3 text-sm text-starlight/90"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-signal shadow-[0_0_12px_#22d3ee]" />{principle}</li>)}
          </ul>
        </div>
        <figure className="reveal">
          <div className="nyx-studio-shell" role="img" aria-label={studio.mockAlt}>
            <div className="nyx-studio-topbar">
              <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#fb7185]" /><span className="size-2.5 rounded-full bg-[#fbbf24]" /><span className="size-2.5 rounded-full bg-[#34d399]" /></div>
              <span className="font-display text-xs tracking-[0.18em] text-starlight/80">NYX / STUDIO</span>
              <span className="rounded-full border border-violet-soft/40 px-3 py-1 text-[0.65rem] tracking-widest text-violet-soft uppercase">Vista conceptual</span>
            </div>
            <div className="nyx-studio-workspace">
              <aside className="nyx-studio-tools" aria-hidden="true">
                {["✦","▣","◈","⌘","◉"].map((tool,i)=><span key={i} className={i===0?"nyx-tool-active":""}>{tool}</span>)}
              </aside>
              <div className="nyx-studio-canvas">
                <div className="nyx-studio-canvas-inner">
                  <div className="nyx-preview-glow" aria-hidden="true" />
                  <div className="relative z-10">
                    <span className="text-[0.6rem] font-semibold tracking-[0.3em] text-signal uppercase">Creative intelligence</span>
                    <h3 className="mt-4 max-w-lg font-display text-[clamp(1.6rem,4vw,4rem)] leading-[1.04] font-bold tracking-tight">Ideas que se convierten en <span className="text-gradient-nyx">universos.</span></h3>
                    <div className="mt-6 flex gap-2"><span className="h-1 w-16 rounded-full bg-signal"/><span className="h-1 w-7 rounded-full bg-violet-soft"/><span className="h-1 w-4 rounded-full bg-white/30"/></div>
                  </div>
                  <div className="nyx-preview-orbit" aria-hidden="true"><span>✦</span></div>
                  <div className="nyx-canvas-tag">LANDING / CONCEPT 01</div>
                </div>
              </div>
              <aside className="nyx-studio-inspector" aria-hidden="true">
                <p className="mb-5 text-[0.65rem] tracking-widest text-mist uppercase">Propiedades</p>
                <div className="space-y-4">
                  <div className="h-2 w-2/3 rounded bg-white/20" /><div className="h-8 rounded-lg border border-white/10 bg-white/5" />
                  <div className="h-2 w-1/2 rounded bg-white/20" />
                  <div className="flex gap-2"><span className="size-7 rounded-full bg-violet"/><span className="size-7 rounded-full bg-signal"/><span className="size-7 rounded-full bg-starlight"/></div>
                  <div className="h-2 w-3/4 rounded bg-white/20"/><div className="h-8 rounded-lg border border-white/10 bg-white/5"/>
                  <div className="mt-8 rounded-xl border border-violet-soft/20 bg-violet/10 p-3 text-xs leading-relaxed text-violet-soft">✦ Diseña con imaginación</div>
                </div>
              </aside>
            </div>
            <div className="nyx-studio-prompt"><span className="text-signal">✦</span><span className="truncate">Describe el universo que quieres crear…</span><span className="ml-auto shrink-0 rounded-lg bg-violet/30 px-3 py-1 text-xs text-violet-soft">IA</span></div>
          </div>
          <figcaption className="mt-5 text-center text-sm leading-relaxed text-mist">{studio.disclaimer}</figcaption>
        </figure>
      </Section>
    </div>
  );
}
