"use client";

import dynamic from "next/dynamic";
import { Component, useState, type ReactNode } from "react";
import Link from "next/link";

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

export function CasaNodoPreview() {
  const [warm, setWarm] = useState(true);
  const [view, setView] = useState(0);
  return (
    <main className="min-h-screen bg-[#0F172A] text-[#E5E7EB]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-6">
        <div><Link href="/" className="text-sm text-cyan-300">← NYX</Link><h1 className="mt-2 text-3xl font-semibold">Casa Nodo</h1><p className="mt-1 text-sm text-slate-300">Prototipo espacial · Fase 2</p></div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-violet-300/40 px-4 py-3" aria-pressed={warm} onClick={() => setWarm(!warm)}>Lámpara {warm ? "encendida" : "apagada"}</button>
          <button className="rounded-xl border border-cyan-300/40 px-4 py-3" onClick={() => setView(view + 1)}>Restablecer cámara</button>
        </div>
      </header>
      <div className="h-[70svh] min-h-96" role="region" aria-label="Escena 3D de un escritorio, una lámpara y una silla vacía">
        <SceneBoundary><Scene key={view} warm={warm} /></SceneBoundary>
      </div>
      <p className="mx-auto max-w-3xl px-6 py-5 text-sm leading-relaxed text-slate-300">Arrastra para girar y usa la rueda o dos dedos para acercarte. La silla vacía es tu lugar en el laboratorio. NYX utiliza el rig v2 optimizado y su animación idle. Con movimiento reducido, el personaje permanece en reposo.</p>
    </main>
  );
}
