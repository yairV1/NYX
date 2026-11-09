import { story } from "@/content/site";
import { Section } from "@/components/ui/Section";

/**
 * Historia. El texto real debe escribirlo el autor del proyecto: mientras
 * `story.provisional` sea true, la sección lo indica de forma visible.
 */
export function Story() {
  return (
    <div className="border-y border-line bg-nebula/25">
      <Section
        id="historia"
        eyebrow={story.eyebrow}
        title={story.title}
        aside={
          story.provisional ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-violet-soft/60 px-3 py-1 text-xs font-medium tracking-wide text-violet-soft">
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              {story.provisionalLabel}
            </span>
          ) : null
        }
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <p className="reveal max-w-xl text-lg leading-relaxed text-mist">
            {story.body}
          </p>

          <div className="reveal glass rounded-2xl p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">
              {story.factsTitle}
            </h3>
            <ul className="mt-5 space-y-4">
              {story.facts.map((fact) => (
                <li key={fact} className="flex gap-3 leading-relaxed text-mist">
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal"
                  />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
