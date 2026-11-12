import Link from "next/link";
import { site } from "@/content/site";
import { CharacterPortrait } from "./CharacterPortrait";
import styles from "./Identity.module.css";

export function About() {
  return (
    <section
      id="que-es-nyx"
      className={`container-nyx ${styles.identity}`}
      aria-labelledby="identity-title"
    >
      <CharacterPortrait />
      <div className={styles.copy}>
        <p className="eyebrow">
          <span aria-hidden className="eyebrow-index">
            01 /
          </span>
          Un personaje. Una forma de ver el mundo.
        </p>
        <h2 id="identity-title">
          La tecnología tiene
          <br />
          <em>un lado cercano.</em>
        </h2>
        <p>
          NYX es la identidad digital de <strong>{site.author}</strong>. Curioso
          por naturaleza, creativo por impulso. Un compañero para quienes ven
          una idea donde otros solo ven una pantalla.
        </p>
        <dl className={styles.traits}>
          <div>
            <dt>
              <span aria-hidden>01</span> Su esencia
            </dt>
            <dd>
              Un gato atigrado, una mirada curiosa y ganas de descubrir contigo.
            </dd>
          </div>
          <div>
            <dt>
              <span aria-hidden>02</span> Su universo
            </dt>
            <dd>
              Casa Nodo: luz cálida, noches de código y espacio para imaginar.
            </dd>
          </div>
          <div>
            <dt>
              <span aria-hidden>03</span> Lo que viene
            </dt>
            <dd>
              Un asistente con esta misma personalidad. NYX AI sigue en
              desarrollo.
            </dd>
          </div>
        </dl>
        <Link href="/casa-nodo" className="quiet-action">
          Conócelo en su mundo <span aria-hidden>↗</span>
        </Link>
      </div>
    </section>
  );
}
