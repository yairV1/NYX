import { Section } from "@/components/ui/Section";
import { StudioCanvas } from "@/components/studio/StudioCanvas";

export function StudioPreview() {
  return (
    <div className="studio-section">
      <Section
        id="studio"
        index="05"
        eyebrow="NYX Studio / El primer experimento"
        title="Las ideas se entienden mejor cuando toman forma."
        aside={
          <p className="max-w-xl text-mist leading-relaxed">
            Escribe algo que todavía no existe. Elige su atmósfera. Llévate tu
            primera pieza. Así empieza nuestro estudio creativo.
          </p>
        }
      >
        <StudioCanvas />
      </Section>
    </div>
  );
}
