import Link from "next/link";
import { HeroStage } from "./HeroStage";

export function Hero() {
  return (
    <section id="inicio" className="arrival" aria-labelledby="inicio-titulo">
      <div className="arrival-world">
        <HeroStage />
      </div>
      <div className="container-nyx arrival-copy">
        <p className="eyebrow">
          <span className="live-dot" /> YAIR // AI{" "}
          <span className="eyebrow-divider" /> CREATIVE UNIVERSE
        </p>
        <h1 id="inicio-titulo">
          El futuro tiene
          <br />
          un lado <em>curioso.</em>
        </h1>
        <p className="arrival-lead">
          Y se llama NYX. Un compañero, un laboratorio de ideas y un universo
          que estamos construyendo contigo.
        </p>
        <div className="arrival-actions">
          <Link href="/casa-nodo" className="primary-action">
            Entra a Casa Nodo <span aria-hidden>↗</span>
          </Link>
          <a href="#studio" className="quiet-action">
            Crea tu primera pieza <span aria-hidden>→</span>
          </a>
        </div>
        <p className="arrival-note">Tu compañero en el código y en la vida.</p>
      </div>
      <div className="arrival-caption">
        <span>01 / CASA NODO</span>
        <span>Donde las ideas se quedan despiertas.</span>
      </div>
      <nav className="arrival-path container-nyx" aria-label="Explora NYX">
        <Link href="/casa-nodo">
          <span className="path-number">01</span>
          <span>
            <strong>Un lugar para imaginar</strong>
            <small>Explora el hogar de NYX · 3D interactivo</small>
          </span>
          <span aria-hidden>↗</span>
        </Link>
        <a href="#asistente">
          <span className="path-number">02</span>
          <span>
            <strong>Una inteligencia cercana</strong>
            <small>Conoce la visión de NYX AI</small>
          </span>
          <span aria-hidden>↓</span>
        </a>
        <a href="#studio">
          <span className="path-number">03</span>
          <span>
            <strong>De idea a primera creación</strong>
            <small>Prueba el lienzo de Studio</small>
          </span>
          <span aria-hidden>↓</span>
        </a>
      </nav>
    </section>
  );
}
