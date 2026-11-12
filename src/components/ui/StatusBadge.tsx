import { STATUS_LABEL, type Status } from "@/content/site";

const tone: Record<Status, string> = {
  available: "border-emerald/60 text-emerald",
  "in-progress": "border-signal/50 text-signal",
  "in-development": "border-violet-soft/50 text-violet-soft",
  ready: "border-signal/40 text-signal",
  planned: "border-line-strong text-mist",
  defining: "border-line-strong text-mist",
};

/** Estado real de una pieza del ecosistema. Texto visible, no sólo color. */
export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`label-tech inline-flex w-fit items-center gap-2 rounded-control border bg-void/50 px-2.5 py-1.5 ${tone[status]}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      <span className="sr-only">Estado: </span>
      {STATUS_LABEL[status]}
    </span>
  );
}
