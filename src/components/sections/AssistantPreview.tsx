import Image from "next/image";
import { nyxAssets } from "@/content/nyx-assets";
import { assistant } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

/** Visión de NYX AI. La conversación es ilustrativa y está rotulada como concepto. */
export function AssistantPreview() {
  return (
    <div className="border-y border-line bg-nebula/40">
      <Section
        id="asistente"
        index="03"
        eyebrow={assistant.eyebrow}
        title={assistant.title}
        aside={<StatusBadge status={assistant.status} />}
      >
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <p className="text-lg leading-relaxed text-mist">
              {assistant.body}
            </p>
            <ol className="mt-9 space-y-px overflow-hidden rounded-xl border border-line bg-line">
              {assistant.capabilities.map((item, i) => (
                <li key={item.title} className="flex gap-5 bg-void/80 p-5">
                  <span aria-hidden className="label-tech mt-1 text-signal">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold tracking-wide uppercase">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-mist">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <figure className="reveal">
            <div className="panel hud-corners overflow-hidden">
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-lg bg-linear-to-br from-violet to-indigo font-display text-sm font-bold"
                >
                  <Image
                    src={nyxAssets.logoSymbol}
                    alt=""
                    width={36}
                    height={36}
                  />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold tracking-wide">
                    NYX AI
                  </p>
                  <p className="text-xs text-mist">
                    Tu futuro compañero creativo
                  </p>
                </div>
                <span className="label-tech ml-auto rounded-md border border-dashed border-violet-soft/60 px-2.5 py-1.5 text-violet-soft">
                  Concepto
                </span>
              </div>
              <div className="space-y-5 p-5 sm:p-7">
                <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm border border-line bg-starlight/[0.06] px-4 py-3">
                  {assistant.demo.user}
                </p>
                <div className="max-w-[90%]">
                  <p className="label-tech mb-2 text-violet-soft">NYX</p>
                  <p className="rounded-2xl rounded-tl-sm border border-violet-soft/25 bg-violet/15 px-4 py-3 leading-relaxed">
                    {assistant.demo.answer}
                  </p>
                  <div aria-hidden className="mt-3 flex flex-wrap gap-2">
                    {assistant.demo.suggestions.map((text) => (
                      <span
                        key={text}
                        className="rounded-lg border border-signal/40 px-3 py-1.5 text-sm text-signal"
                      >
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div
                aria-hidden
                className="flex items-center gap-3 border-t border-line px-5 py-4 text-sm text-mist"
              >
                <span className="size-1.5 rounded-full bg-signal" />
                Escribe tu idea…
                <span className="label-tech ml-auto rounded-md bg-starlight/10 px-2.5 py-1.5">
                  No disponible
                </span>
              </div>
            </div>
            <figcaption className="mt-4 text-sm leading-relaxed text-mist">
              {assistant.disclaimer}
            </figcaption>
          </figure>
        </div>
      </Section>
    </div>
  );
}
