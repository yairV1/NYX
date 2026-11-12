import Link from "next/link";
import { ecosystem } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";
import styles from "./Ecosystem.module.css";

const destinations = [
  { href: "#asistente", label: "Descubre la visión", kind: "intelligence" },
  { href: "#studio", label: "Abre tu primer lienzo", kind: "studio" },
  { href: "#roadmap", label: "Conoce lo que viene", kind: "labs" },
];

export function Ecosystem() {
  return (
    <Section
      id="ecosistema"
      index="04"
      eyebrow={ecosystem.eyebrow}
      title={ecosystem.title}
      aside={<p className="max-w-2xl text-lg text-mist">{ecosystem.lead}</p>}
    >
      <ul className={styles.grid}>
        {ecosystem.items.map((item, i) => {
          const destination = destinations[i];
          return (
            <li
              key={item.id}
              className={`${styles.card} ${styles[destination.kind]}`}
            >
              <div className={styles.art} aria-hidden="true">
                <span className={styles.coordinate}>NYX / 0{i + 1}</span>
                {i === 0 ? (
                  <div className={styles.core}>
                    <span />
                    <span />
                    <span />
                    <b>✧</b>
                  </div>
                ) : i === 1 ? (
                  <div className={styles.planes}>
                    <span />
                    <span />
                    <span>
                      <b>
                        Make
                        <br />
                        possible.
                      </b>
                      <i />
                    </span>
                  </div>
                ) : (
                  <div className={styles.experiment}>
                    <span />
                    <span />
                    <span />
                    <b>+</b>
                  </div>
                )}
                <span className={styles.artLabel}>
                  {
                    [
                      "PENSAR CONTIGO",
                      "DAR FORMA A UNA IDEA",
                      "EXPLORAR LO QUE SIGUE",
                    ][i]
                  }
                </span>
              </div>
              <div className={styles.body}>
                <StatusBadge status={item.status} />
                <h3>{item.name}</h3>
                <p>{item.text}</p>
                <Link href={destination.href}>
                  {destination.label}
                  <span aria-hidden>↗</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
