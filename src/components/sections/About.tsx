import { site } from "@/content/site";

export function About() {
  return (
    <section
      id="que-es-nyx"
      className="container-nyx identity-note"
      aria-labelledby="identity-title"
    >
      <p className="eyebrow">MÁS QUE UN PERSONAJE</p>
      <h2 id="identity-title">
        Tecnología con curiosidad.
        <br />
        <span>Creatividad con compañía.</span>
      </h2>
      <div>
        <p>
          NYX es la identidad digital de <strong>{site.author}</strong>. Un gato
          curioso es el comienzo de algo más grande: un asistente que acompañe,
          un estudio que abra posibilidades y un hogar para experimentar.
        </p>
        <p>
          Estamos construyéndolo paso a paso. Aquí puedes explorar lo que ya
          existe y descubrir lo que viene.
        </p>
      </div>
    </section>
  );
}
