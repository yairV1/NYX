import { STATUS_LABEL, type Status } from "@/content/site";

const tone: Record<Status, string> = {
  "in-progress": "border-signal/50 text-signal",
  "in-development": "border-violet-soft/50 text-violet-soft",
  ready: "border-signal/40 text-signal",
  planned: "border-starlight/25 text-mist",
  defining: "border-starlight/25 text-mist",
};

/** Estado real de una pieza del ecosistema. Texto visible, no sólo color. */
export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${tone[status]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      <span className="sr-only">Estado: </span>
      {STATUS_LABEL[status]}
    </span>
  );
}
