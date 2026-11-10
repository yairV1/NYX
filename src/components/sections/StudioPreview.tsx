import Image from "next/image";
import { nyxAssets } from "@/content/nyx-assets";
import { studio } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

function Bar({ className = "" }: { className?: string }) {
  return <span className={`block h-1.5 rounded-full ${className}`} />;
}

/** Maqueta ESTÁTICA de NYX Studio: sin campos ni botones reales. */
export function StudioPreview() {
  return (
    <div className="border-y border-line bg-nebula/40">
      <Section id="studio" index="05" eyebrow={studio.eyebrow} title={studio.title} aside={<StatusBadge status={studio.status} />}>
        <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <p className="reveal text-lg leading-relaxed text-mist">{studio.body}</p>
          <ul className="reveal space-y-3">
            {studio.principles.map((principle, i) => (
              <li key={principle} className="flex gap-4 text-starlight/90">
                <span aria-hidden className="label-tech mt-1 text-signal">0{i + 1}</span>
                {principle}
              </li>
            ))}
          </ul>
        </div>

        <figure className="reveal">
          <div role="img" aria-label={studio.mockAlt} className="panel hud-corners overflow-hidden shadow-[0_50px_100px_-50px_rgb(99_102_241/0.7)]">
            <div aria-hidden className="select-none">
              <div className="flex items-center gap-4 border-b border-line px-5 py-3.5">
                <div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-starlight/25" /><span className="size-2.5 rounded-full bg-starlight/25" /><span className="size-2.5 rounded-full bg-starlight/25" /></div>
                <span className="label-tech text-starlight/80">NYX / Studio</span>
                <span className="label-tech ml-auto rounded-md border border-dashed border-violet-soft/60 px-2.5 py-1.5 text-violet-soft">Vista conceptual</span>
              </div>

              <div className="grid grid-cols-[3rem_minmax(0,1fr)] md:grid-cols-[3.5rem_minmax(0,1fr)_13rem]">
                <div className="flex flex-col items-center gap-3 border-r border-line py-5">
                  <span className="size-8 rounded-lg bg-violet/50 ring-1 ring-violet-soft/60" />
                  <span className="size-8 rounded-lg bg-starlight/[0.07]" />
                  <span className="size-8 rounded-lg bg-starlight/[0.07]" />
                  <span className="size-8 rounded-lg bg-starlight/[0.07]" />
                </div>

                <div className="relative bg-[radial-gradient(rgb(148_163_255/0.16)_1px,transparent_1px)] bg-size-[20px_20px] p-[5%]">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-linear-to-br from-nebula via-[#1a1440] to-void ring-1 ring-line-strong">
                    <div className="absolute inset-y-0 left-0 flex w-[58%] flex-col justify-center p-[7%]">
                      <span className="label-tech text-signal">Creative intelligence</span>
                      <p className="mt-[6%] font-display text-[clamp(0.9rem,2.6vw,2.1rem)] leading-[1.12] font-bold uppercase">Ideas que se vuelven <span className="text-gradient-nyx">universos</span></p>
                      <div className="mt-[8%] flex gap-2"><Bar className="w-16 bg-signal" /><Bar className="w-8 bg-violet-soft" /><Bar className="w-4 bg-starlight/30" /></div>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-[44%]">
                      <div className="absolute inset-[12%] rounded-full bg-violet/40 blur-2xl" />
                      <Image src={nyxAssets.posterIdle} alt="" width={640} height={1040} sizes="(max-width: 768px) 35vw, 22vw" className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto object-contain" />
                      <span className="absolute inset-x-[14%] top-[6%] bottom-[2%] rounded-md outline-2 outline-offset-2 outline-signal/80" />
                    </div>
                  </div>
                </div>

                <div className="hidden space-y-5 border-l border-line p-5 md:block">
                  <span className="label-tech text-mist">Propiedades</span>
                  <Bar className="w-2/3 bg-starlight/30" />
                  <div className="grid grid-cols-2 gap-2"><span className="h-7 rounded-md bg-starlight/[0.07]" /><span className="h-7 rounded-md bg-starlight/[0.07]" /></div>
                  <Bar className="w-1/2 bg-starlight/30" />
                  <div className="flex gap-2"><span className="size-6 rounded-full bg-violet" /><span className="size-6 rounded-full bg-indigo" /><span className="size-6 rounded-full bg-cyan" /><span className="size-6 rounded-full bg-emerald" /></div>
                  <Bar className="w-3/4 bg-starlight/15" />
                  <Bar className="w-1/2 bg-starlight/15" />
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-line px-5 py-3.5 text-sm text-mist">
                <span className="size-1.5 rounded-full bg-signal" />
                <span className="truncate">Describe el universo que quieres crear…</span>
                <span className="label-tech ml-auto shrink-0 rounded-md bg-starlight/10 px-2.5 py-1.5">No disponible</span>
              </div>
            </div>
          </div>
          <figcaption className="mt-5 text-sm leading-relaxed text-mist">{studio.disclaimer}</figcaption>
        </figure>
      </Section>
    </div>
  );
}
