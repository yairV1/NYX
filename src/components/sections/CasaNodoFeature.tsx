import Image from "next/image";
import { nyxAssets } from "@/content/nyx-assets";
import { casaNodo } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";

/** La única pieza que ya se puede probar: enlaza al prototipo real en /casa-nodo. */
export function CasaNodoFeature() {
  return (
    <Section id="casa-nodo" index="02" eyebrow={casaNodo.eyebrow} title={casaNodo.title} aside={<StatusBadge status={casaNodo.status} />}>
      <div className="reveal panel hud-corners grid overflow-hidden lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div className="p-7 sm:p-10 lg:p-12">
          <p className="text-lg leading-relaxed text-mist">{casaNodo.body}</p>
          <ul className="mt-8 space-y-4">
            {casaNodo.features.map((feature, i) => (
              <li key={feature} className="flex gap-4 text-starlight/90">
                <span aria-hidden className="label-tech mt-1 text-signal">0{i + 1}</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink href={casaNodo.cta.href}>
              {casaNodo.cta.label}
              <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
            </ButtonLink>
            <p className="text-sm text-mist">{casaNodo.note}</p>
          </div>
        </div>

        <div className="stage relative min-h-80 border-t border-line lg:min-h-[30rem] lg:border-t-0 lg:border-l">
          <div aria-hidden className="stage-beam" />
          <div aria-hidden className="stage-floor" />
          <Image
            src={nyxAssets.posterWave}
            alt={casaNodo.imageAlt}
            width={640}
            height={1040}
            sizes="(max-width: 1023px) 60vw, 28vw"
            className="absolute inset-x-0 bottom-[7%] mx-auto h-[86%] w-auto object-contain"
          />
          <p aria-hidden className="label-tech absolute top-4 left-5 text-mist">Clip · Wave</p>
          <p aria-hidden className="label-tech absolute right-5 bottom-4 text-mist">Render del modelo real</p>
        </div>
      </div>
    </Section>
  );
}
