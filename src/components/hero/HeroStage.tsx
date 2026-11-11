"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { nyxAssets } from "@/content/nyx-assets";
import { useNyxReactions } from "@/lib/nyx/useNyxReactions";
import { useReducedMotion, useSceneActivity } from "@/lib/nyx/useSceneActivity";
import { SceneBoundary } from "@/components/world/SceneBoundary";

const Scene = dynamic(() => import("@/components/casa-nodo/CasaNodoScene"), {
  ssr: false,
});

export function HeroStage() {
  const { ref, seen, active } = useSceneActivity();
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const { playing, play, stop } = useNyxReactions();
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const onSelect = useCallback(() => play("Wave"), [play]);
  const showScene = seen && (!reducedMotion || enabled) && !failed;
  return (
    <div
      ref={ref}
      className="arrival-stage"
      aria-label="Casa Nodo, el hogar nocturno de NYX"
    >
      <div className={`arrival-poster ${ready && !failed ? "is-hidden" : ""}`}>
        <Image
          src={nyxAssets.roomPoster}
          alt="NYX te espera en Casa Nodo, un estudio iluminado frente a la ciudad nocturna."
          width={1600}
          height={1000}
          preload
          sizes="(max-width: 767px) 100vw, 75vw"
        />
      </div>
      {showScene && (
        <SceneBoundary onError={onError}>
          <Scene
            hero
            warm
            mood="midnight"
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
      <div className="world-coordinate" aria-hidden>
        <span className="live-dot" /> CASA NODO <span>NYX / HOME</span>
      </div>
      <div className="host-message">
        <span className="host-avatar">N</span>
        <div>
          <span>NYX</span>
          <p>
            {playing
              ? "Las buenas ideas empiezan con una chispa."
              : "Llegas justo a tiempo. ¿Creamos algo?"}
          </p>
        </div>
      </div>
      <div className="world-controls">
        {ready && !failed ? (
          <>
            <button onClick={() => play("Wave")} aria-label="Saludar a NYX">
              Saluda a NYX <span aria-hidden>✧</span>
            </button>
            <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
              {paused ? "Reanudar" : "Pausar"}
            </button>
          </>
        ) : reducedMotion && !enabled ? (
          <button onClick={() => setEnabled(true)}>Explorar en 3D</button>
        ) : null}
        <span role="status">
          {failed
            ? "Vista de respaldo"
            : ready
              ? (playing?.clip.label ?? "3D en vivo")
              : reducedMotion
                ? "Vista tranquila"
                : "Preparando el espacio…"}
        </span>
      </div>
    </div>
  );
}
