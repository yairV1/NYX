"use client";

import Image from "next/image";
import { useState } from "react";
import { withBase } from "@/content/nyx-assets";
import styles from "./Identity.module.css";

const portraits = [
  {
    id: "portrait",
    label: "Conócelo",
    caption: "Ojos curiosos. Ideas que no se quedan quietas.",
    alt: "Primer plano del modelo real de NYX: gato atigrado de ojos verdes con hoodie azul marino.",
  },
  {
    id: "wave",
    label: "Su saludo",
    caption: "Siempre hay un lugar para ti en Casa Nodo.",
    alt: "NYX levanta la pata para saludar, con su hoodie y mochila morada.",
  },
  {
    id: "back",
    label: "Su mochila",
    caption: "Una mochila lista para la siguiente idea.",
    alt: "Espalda de NYX y su mochila violeta, con cierre metálico y una pequeña luz cian.",
  },
] as const;

export function CharacterPortrait() {
  const [selected, setSelected] = useState(0);
  const portrait = portraits[selected];
  return (
    <div className={styles.portrait}>
      <div className={styles.coordinates} aria-hidden="true">
        <span>NYX / IDENTIDAD 01</span>
        <span>CASA NODO</span>
      </div>
      <span className={styles.orbit} aria-hidden="true" />
      <figure aria-live="polite" aria-atomic="true">
        <Image
          key={portrait.id}
          src={withBase(`/assets/nyx/character/identity-${portrait.id}.webp`)}
          alt={portrait.alt}
          width={800}
          height={800}
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <figcaption>{portrait.caption}</figcaption>
      </figure>
      <div className={styles.selector} role="group" aria-label="Vistas de NYX">
        {portraits.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
