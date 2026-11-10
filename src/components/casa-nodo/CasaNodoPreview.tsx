"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useState, type ReactNode } from "react";
import Link from "next/link";
import { findClip, NYX_CLIP_GROUPS, NYX_CLIPS, NYX_TOUCH_CLIP } from "@/lib/nyx/clips";
import type { ClipRequest } from "./NyxModel";

const Scene = dynamic(() => import("./CasaNodoScene"), {
  ssr: false,
  loading: () => <p className="p-8 text-mist" role="status">Preparando Casa Nodo…</p>,
});

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="p-8 text-mist" role="alert">No se pudo abrir la vista 3D. Prueba con aceleración gráfica activada en tu navegador.</p>
      : this.props.children;
  }
}

type Playing = { clipId: string; request: ClipRequest };

export function CasaNodoPreview() {
  const [warm, setWarm] = useState(true);
  const [view, setView] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState<Playing | null>(null);

  const play = useCallback((clipId: string) => {
    const clip = findClip(clipId);
    if (!clip) return;
    setPlaying((current) => ({ clipId, request: { source: clip.source, id: (current?.request.id ?? 0) + 1 } }));
  }, []);
  const handleReady = useCallback(() => setReady(true), []);
  const handleClipEnd = useCallback(() => setPlaying(null), []);
  const handleSelect = useCallback(() => play(NYX_TOUCH_CLIP), [play]);
  const resetCamera = () => { setPlaying(null); setView(view + 1); };

  const current = playing ? findClip(playing.clipId) : undefined;
  const status = !ready ? "Cargando a NYX…" : current ? `NYX: ${current.label}` : "NYX está en reposo";

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#E5E7EB]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-6">
        <div><Link href="/" className="text-sm text-cyan-300">← NYX</Link><h1 className="mt-2 text-3xl font-semibold">Casa Nodo</h1><p className="mt-1 text-sm text-slate-300">Prototipo espacial · Fase 3</p></div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-violet-300/40 px-4 py-3" aria-pressed={warm} onClick={() => setWarm(!warm)}>Lámpara {warm ? "encendida" : "apagada"}</button>
          <button className="rounded-xl border border-cyan-300/40 px-4 py-3" onClick={resetCamera}>Restablecer cámara</button>
        </div>
      </header>
      <div className="relative h-[70svh] min-h-96" role="region" aria-label="Escena 3D de Casa Nodo: NYX junto a un escritorio, una lámpara y una silla vacía">
        <SceneBoundary>
          <Scene key={view} warm={warm} request={playing?.request ?? null} onReady={handleReady} onClipEnd={handleClipEnd} onSelect={handleSelect} />
        </SceneBoundary>
        <p role="status" className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/15 bg-[#0F172A]/80 px-4 py-2 text-sm text-slate-200 backdrop-blur">
          {status}
        </p>
      </div>

      <section aria-labelledby="nyx-reacciones" className="mx-auto max-w-5xl px-6 pt-8">
        <h2 id="nyx-reacciones" className="text-xl font-semibold">Reacciones de NYX</h2>
        <p className="mt-1 text-sm text-slate-300">Elige una reacción o toca a NYX en la escena. Al terminar vuelve al reposo.</p>
        {NYX_CLIP_GROUPS.map((group) => (
          <div key={group.id} role="group" aria-labelledby={`nyx-grupo-${group.id}`} className="mt-5">
            <h3 id={`nyx-grupo-${group.id}`} className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">{group.label}</h3>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {NYX_CLIPS.filter((clip) => clip.group === group.id).map((clip) => {
                const active = playing?.clipId === clip.id;
                return (
                  <button
                    key={clip.id}
                    type="button"
                    disabled={!ready}
                    aria-pressed={active}
                    onClick={() => play(clip.id)}
                    className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      active ? "border-cyan-300 bg-cyan-300/15 text-cyan-100" : "border-white/20 text-slate-100 hover:border-violet-300/70 hover:bg-white/5"
                    }`}
                  >
                    {clip.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <p className="mx-auto max-w-5xl px-6 py-8 text-sm leading-relaxed text-slate-300">Arrastra para girar y usa la rueda o dos dedos para acercarte. La silla vacía es tu lugar en el laboratorio. NYX utiliza el rig v2 optimizado. Con movimiento reducido permanece en reposo y solo se mueve cuando eliges una reacción.</p>
    </main>
  );
}
