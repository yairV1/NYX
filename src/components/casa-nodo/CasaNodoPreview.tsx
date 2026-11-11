"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import Link from "next/link";
import { NYX_CLIPS } from "@/lib/nyx/clips";
import { useNyxReactions } from "@/lib/nyx/useNyxReactions";
import { useReducedMotion, useSceneActivity } from "@/lib/nyx/useSceneActivity";
import { SceneBoundary } from "@/components/world/SceneBoundary";
import type { RoomMood } from "@/components/world/NodoRoom";
import type { RoomView } from "./CasaNodoScene";
import { nyxAssets } from "@/content/nyx-assets";

const Scene = dynamic(() => import("./CasaNodoScene"), { ssr: false });
const moods: { id: RoomMood; label: string }[] = [
  { id: "midnight", label: "Medianoche" },
  { id: "aurora", label: "Aurora" },
  { id: "focus", label: "Concentración" },
];
const views: { id: RoomView; label: string; description: string }[] = [
  {
    id: "welcome",
    label: "Conoce a NYX",
    description: "Tu compañero en el código y en la vida. Tócalo para saludar.",
  },
  {
    id: "desk",
    label: "El escritorio",
    description:
      "El siguiente proyecto empieza aquí. Prueba el primer lienzo de Studio.",
  },
  {
    id: "room",
    label: "El universo",
    description:
      "Una silla para ti. Un hogar para todas las ideas que aún no existen.",
  },
];

export function CasaNodoPreview() {
  const [warm, setWarm] = useState(true);
  const [view, setView] = useState<RoomView>("welcome");
  const [reset, setReset] = useState(0);
  const [mood, setMood] = useState<RoomMood>("midnight");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [retry, setRetry] = useState(0);
  const { playing, play, stop } = useNyxReactions();
  const { ref, seen, active } = useSceneActivity();
  const reducedMotion = useReducedMotion();
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const onSelect = useCallback(() => play("Wave"), [play]);
  const current = views.find((v) => v.id === view)!;
  const retryScene = () => {
    setFailed(false);
    setReady(false);
    setRetry((v) => v + 1);
  };
  return (
    <main className="nodo-experience">
      <header className="nodo-header">
        <Link
          href="/"
          aria-label="Volver al inicio de NYX"
          className="nodo-brand"
        >
          ← <strong>NYX</strong>
          <span>/ CASA NODO</span>
        </Link>
        <span className="nodo-edition">UN ESPACIO PARA LO POSIBLE</span>
        <Link href="/#studio" className="nodo-studio-link">
          Abrir Studio ↗
        </Link>
      </header>
      <div className="nodo-title">
        <p className="eyebrow">BIENVENIDO A CASA</p>
        <h1>
          Las mejores ideas
          <br />
          necesitan <em>un lugar.</em>
        </h1>
        <p>Este también es el tuyo.</p>
      </div>
      <div
        ref={ref}
        className="nodo-viewport"
        role="region"
        aria-label="Casa Nodo en 3D. Usa los encuadres o arrastra para explorar."
      >
        {(!ready || failed) && (
          <div className="nodo-fallback">
            <Image
              src={nyxAssets.roomPoster}
              alt="NYX espera en Casa Nodo"
              width={1600}
              height={1000}
              sizes="100vw"
            />
            <p role="status">
              {failed
                ? "No pudimos abrir el espacio 3D. La visita puede esperar; tus ideas, no."
                : "Encendiendo las luces de Casa Nodo…"}
            </p>
            {failed && <button onClick={retryScene}>Volver a intentar</button>}
          </div>
        )}
        {seen && !failed && (
          <SceneBoundary key={retry} onError={onError}>
            <Scene
              warm={warm}
              mood={mood}
              view={view}
              reset={reset}
              active={active}
              reducedMotion={reducedMotion}
              paused={paused}
              request={playing?.request ?? null}
              onReady={onReady}
              onError={onError}
              onClipEnd={stop}
              onSelect={onSelect}
            />
          </SceneBoundary>
        )}
        <div className="nodo-scene-label" aria-hidden>
          CASA NODO / {mood === "aurora" ? "AURORA" : "AFTER HOURS"}
          <span>01 — EL ORIGEN</span>
        </div>
      </div>
      <aside className="nodo-console" aria-label="Controles del espacio">
        <div className="nodo-console-top">
          <span className="live-dot" />
          <p role="status">
            {failed
              ? "Vista de respaldo"
              : !ready
                ? "Preparando a NYX…"
                : playing
                  ? `NYX · ${playing.clip.label}`
                  : paused || reducedMotion
                    ? "Un momento de calma"
                    : "NYX está contigo"}
          </p>
          <span className="console-mark" aria-hidden>
            ✧
          </span>
        </div>
        <div
          className="nodo-view-tabs"
          role="group"
          aria-label="Encuadres de cámara"
        >
          {views.map((item, i) => (
            <button
              key={item.id}
              aria-pressed={view === item.id}
              disabled={!ready}
              onClick={() => {
                setView(item.id);
                setReset((v) => v + 1);
              }}
            >
              <span>0{i + 1}</span>
              {item.label}
            </button>
          ))}
        </div>
        <p className="nodo-view-description">{current.description}</p>
        {view === "desk" && (
          <Link className="nodo-inline-link" href="/#studio">
            Crear en el lienzo de Studio →
          </Link>
        )}
        <div className="nodo-moods" role="group" aria-label="Ambiente de luz">
          {moods.map((item) => (
            <button
              key={item.id}
              aria-pressed={mood === item.id}
              onClick={() => setMood(item.id)}
            >
              <i className={`mood-dot ${item.id}`} aria-hidden />
              {item.label}
            </button>
          ))}
        </div>
        <div className="nodo-utilities">
          <button aria-pressed={warm} onClick={() => setWarm(!warm)}>
            Lámpara {warm ? "encendida" : "apagada"}
          </button>
          <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
            {paused ? "Reanudar ambiente" : "Pausar ambiente"}
          </button>
          <button
            onClick={() => {
              setView("welcome");
              setReset((v) => v + 1);
            }}
          >
            Restablecer cámara
          </button>
        </div>
        <div
          className="nodo-reactions"
          role="group"
          aria-label="Reacciones de NYX"
        >
          {["Wave", "Happy", "Think", "Celebrate"].map((id) => {
            const clip = NYX_CLIPS.find((c) => c.id === id)!;
            return (
              <button
                key={id}
                disabled={!ready}
                aria-pressed={playing?.clip.id === id}
                onClick={() => play(id)}
              >
                {clip.label}
              </button>
            );
          })}
        </div>
        <details className="nodo-more">
          <summary>Explora todas sus expresiones</summary>
          <div role="group" aria-label="Más expresiones">
            {NYX_CLIPS.filter(
              (c) => !["Wave", "Happy", "Think", "Celebrate"].includes(c.id),
            ).map((clip) => (
              <button
                key={clip.id}
                disabled={!ready}
                aria-pressed={playing?.clip.id === clip.id}
                onClick={() => play(clip.id)}
              >
                {clip.label}
              </button>
            ))}
          </div>
        </details>
      </aside>
      <footer className="nodo-footer">
        <span>Arrastra para explorar · Acerca con la rueda o dos dedos</span>
        <span>
          Casa Nodo es un prototipo en evolución. NYX AI sigue en desarrollo.
        </span>
      </footer>
    </main>
  );
}
