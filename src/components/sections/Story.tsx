import { site, story } from "@/content/site";
import { Section } from "@/components/ui/Section";

/**
 * Historia. Mientras `story.provisional` sea true, la sección lo indica de
 * forma visible.
 */
export function Story() {
  return (
    <Section
      id="historia"
      index="06"
      eyebrow={story.eyebrow}
      title={story.title}
      aside={story.provisional ? (
        <span className="label-tech inline-flex items-center gap-2 rounded-control border border-dashed border-violet-soft/60 px-2.5 py-1.5 text-violet-soft">
          <span aria-hidden className="size-1.5 rounded-full bg-current" />
          {story.provisionalLabel}
        </span>
      ) : null}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <blockquote className="reveal panel hud-corners p-7 sm:p-10">
          <p className="text-lead leading-relaxed text-starlight/95 sm:text-title sm:leading-relaxed">{story.body}</p>
          <footer className="label-tech mt-8 flex items-center gap-3 text-violet-soft">
            <span aria-hidden className="h-px w-10 bg-violet-soft" />
            {site.motto}
          </footer>
        </blockquote>

        <div className="reveal">
          <h3 className="label-tech text-mist">{story.factsTitle}</h3>
          <ul className="mt-5 space-y-px overflow-hidden rounded-card border border-line bg-line">
            {story.facts.map((fact, i) => (
              <li key={fact} className="flex gap-4 bg-void/80 p-5 leading-relaxed text-mist">
                <span aria-hidden className="label-tech mt-1 text-violet-soft">0{i + 1}</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
