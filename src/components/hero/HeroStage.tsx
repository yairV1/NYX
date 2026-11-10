"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { nyxAssets } from "@/content/nyx-assets";
import { hero } from "@/content/site";
import { findClip, NYX_TOUCH_CLIP } from "@/lib/nyx/clips";
import { useNyxReactions } from "@/lib/nyx/useNyxReactions";

const HeroNyxCanvas = dynamic(() => import("./HeroNyxCanvas"), { ssr: false });

/** Si WebGL falla, el render de respaldo sigue visible y no se rompe la página. */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * Escenario del hero.
 *
 * Mejora progresiva en tres niveles:
 * 1. Siempre: render estático del modelo 3D real (se pinta con el HTML).
 * 2. Con WebGL y sin `prefers-reduced-motion`: el mismo modelo en vivo, animado,
 *    que sigue al cursor y reacciona. Se carga cuando el hero entra en pantalla.
 * 3. Fuera de pantalla: el render en vivo se pausa.
 */
export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);
  const [live, setLive] = useState(false);
  const { playing, play, stop } = useNyxReactions();

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setSeen(true);
    }, { rootMargin: "120px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleReady = useCallback(() => setLive(true), []);
  const handleSelect = useCallback(() => play(NYX_TOUCH_CLIP), [play]);
  const use3d = seen && !reducedMotion;
  const showLive = use3d && live;

  return (
    <div className="enter-scene">
      <div ref={stageRef} className="stage panel hud-corners mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden lg:max-h-[min(78svh,44rem)] lg:max-w-none">
        <div aria-hidden className="stage-beam" />
        <div aria-hidden className="stage-orbit" />
        <div aria-hidden className="stage-orbit stage-orbit--arc" />
        <div aria-hidden className="stage-floor" />

        <Image
          src={nyxAssets.posterIdle}
          alt={hero.characterAlt}
          width={640}
          height={1040}
          preload
          sizes="(max-width: 1023px) 70vw, 30vw"
          className={`absolute inset-x-0 bottom-[7%] mx-auto h-[84%] w-auto object-contain transition-opacity duration-700 ${showLive ? "opacity-0" : "opacity-100"}`}
        />

        {use3d ? (
          <div className={`absolute inset-0 transition-opacity duration-700 ${showLive ? "opacity-100" : "opacity-0"}`}>
            <CanvasBoundary>
              <HeroNyxCanvas active={visible} request={playing?.request ?? null} onReady={handleReady} onClipEnd={stop} onSelect={handleSelect} />
            </CanvasBoundary>
          </div>
        ) : null}

        <div aria-hidden className="stage-scan" />

        <p className="label-tech pointer-events-none absolute top-4 left-5 flex max-w-[62%] items-center gap-2 text-starlight/90">
          <span className={`size-1.5 rounded-full ${showLive ? "pulse-dot bg-emerald" : "bg-mist"}`} />
          {hero.stageLabel}
        </p>
        <p role="status" className="label-tech pointer-events-none absolute top-4 right-5 text-signal">
          {playing ? playing.clip.label : showLive ? "En vivo" : "Render"}
        </p>
      </div>
      {showLive ? (
        <div role="group" aria-label="Reacciones de NYX" className="mt-4 flex flex-wrap justify-center gap-2">
          {hero.reactions.map((id) => {
            const clip = findClip(id);
            if (!clip) return null;
            const active = playing?.clip.id === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => play(id)}
                className={`label-tech min-h-11 rounded-lg border px-3.5 transition-colors ${
                  active ? "border-signal bg-signal/15 text-signal" : "border-line-strong bg-starlight/[0.04] text-starlight hover:border-signal/70"
                }`}
              >
                {clip.label}
              </button>
            );
          })}
        </div>
      ) : null}
      <p className="label-tech mt-4 text-center text-mist">
        {showLive ? hero.stageHint : "Render del modelo 3D de NYX"}
      </p>
    </div>
  );
}
