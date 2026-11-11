import Image from "next/image";
import Link from "next/link";
import { nyxAssets } from "@/content/nyx-assets";

export function CasaNodoFeature() {
  return (
    <section
      id="casa-nodo"
      className="container-nyx room-feature"
      aria-labelledby="room-feature-title"
    >
      <div className="room-feature-image">
        <Image
          src={nyxAssets.roomPoster}
          alt="Casa Nodo de noche: NYX, un escritorio iluminado y una ventana a la ciudad."
          width={1600}
          height={1000}
          sizes="(max-width: 767px) 100vw, 60vw"
        />
        <span>EL HOGAR DE NYX / EXPLORACIÓN EN 3D</span>
        <Link href="/casa-nodo" aria-label="Entrar al espacio 3D de Casa Nodo">
          ↗
        </Link>
      </div>
      <div className="room-feature-copy">
        <p className="eyebrow">01 / TU LUGAR EN EL UNIVERSO</p>
        <h2 id="room-feature-title">
          La luz sigue encendida.
          <br />
          <em>Te estábamos esperando.</em>
        </h2>
        <p>
          El escritorio tiene ideas pendientes. La ventana, una ciudad por
          descubrir. Y la silla vacía es para ti.
        </p>
        <ul>
          <li>
            <span>01</span>Cambia de perspectiva y explora el espacio.
          </li>
          <li>
            <span>02</span>Encuentra tu luz: medianoche, aurora o concentración.
          </li>
          <li>
            <span>03</span>Conoce a NYX a través de sus expresiones.
          </li>
        </ul>
        <Link href="/casa-nodo" className="quiet-action">
          Hazte un lugar <span aria-hidden>↗</span>
        </Link>
      </div>
    </section>
  );
}
