"use client";

import { useEffect, useRef, useState } from "react";
import { nyxAssets } from "@/content/nyx-assets";

const themes = {
  nodo: {
    name: "Casa Nodo",
    base: "#0c1224",
    accent: "#b9a2ff",
    secondary: "#403065",
  },
  aurora: {
    name: "Aurora",
    base: "#071e25",
    accent: "#80dfc8",
    secondary: "#24515f",
  },
  umbral: {
    name: "Umbral",
    base: "#1b1021",
    accent: "#f0b69d",
    secondary: "#63334d",
  },
};
type Theme = keyof typeof themes;
type Draft = {
  title: string;
  subtitle: string;
  theme: Theme;
  format: "landscape" | "square";
};
const initial: Draft = {
  title: "Lo que imaginas\nempieza aquí.",
  subtitle: "Una idea. Un compañero. Infinitas posibilidades.",
  theme: "nodo",
  format: "landscape",
};
const STORAGE = "nyx.studio.canvas.v1";

function validDraft(value: unknown): value is Draft {
  if (!value || typeof value !== "object") return false;
  const d = value as Partial<Draft>;
  return (
    typeof d.title === "string" &&
    d.title.length <= 70 &&
    typeof d.subtitle === "string" &&
    d.subtitle.length <= 100 &&
    (d.theme === "nodo" || d.theme === "aurora" || d.theme === "umbral") &&
    (d.format === "landscape" || d.format === "square")
  );
}

function lines(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
): string[] {
  const result: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(" ")) {
      // Character wrapping also handles a long, unbroken word.
      for (const char of (line ? " " : "") + word) {
        if (ctx.measureText(line + char).width > width && line) {
          result.push(line.trim());
          line = "";
        }
        line += char;
      }
    }
    result.push(line.trim());
  }
  return result;
}

export function StudioCanvas() {
  const [draft, setDraft] = useState<Draft>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [rendered, setRendered] = useState<string | null>(null);
  const draftKey = JSON.stringify(draft);
  const [notice, setNotice] = useState("Tu primera pieza empieza aquí.");
  const canvas = useRef<HTMLCanvasElement>(null);
  const update = (patch: Partial<Draft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE);
        if (raw) {
          const saved: unknown = JSON.parse(raw);
          if (validDraft(saved)) setDraft(saved);
        }
      } catch {
        /* Storage can be unavailable in private browsing. The editor still works. */
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(draft));
    } catch {
      /* Saving is optional. */
    }
  }, [draft, hydrated]);

  useEffect(() => {
    let cancelled = false;
    const image = new window.Image();
    image.onload = async () => {
      await document.fonts.ready;
      if (cancelled || !canvas.current) return;
      const node = canvas.current;
      const w = 1600,
        h = draft.format === "square" ? 1600 : 1000;
      node.width = w;
      node.height = h;
      const ctx = node.getContext("2d");
      if (!ctx) return;
      const theme = themes[draft.theme];
      ctx.fillStyle = theme.base;
      ctx.fillRect(0, 0, w, h);
      const light = ctx.createRadialGradient(
        1180,
        h * 0.45,
        0,
        1180,
        h * 0.45,
        850,
      );
      light.addColorStop(0, theme.secondary);
      light.addColorStop(1, theme.base);
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = theme.accent + "24";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(
          1150,
          h * 0.49,
          210 + i * 58,
          300 + i * 62,
          -0.25,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
      ctx.strokeStyle = theme.accent + "44";
      ctx.strokeRect(40, 40, w - 80, h - 80);
      ctx.fillStyle = theme.accent;
      ctx.font = "500 20px sans-serif";
      ctx.fillText("NYX  /  CREATIVE UNIVERSE", 88, 115);
      const font = draft.format === "square" ? 94 : 86;
      ctx.font = `600 ${font}px sans-serif`;
      const titleLines = lines(
        ctx,
        draft.title || "Tu próxima idea.",
        740,
      ).slice(0, 6);
      const startY =
        draft.format === "square"
          ? h * 0.36
          : Math.max(280, h * 0.44 - (titleLines.length - 2) * 35);
      ctx.fillStyle = "#edf0f8";
      titleLines.forEach((line, i) => {
        ctx.fillStyle = i === titleLines.length - 1 ? theme.accent : "#edf0f8";
        ctx.fillText(line, 88, startY + i * (font * 1.14));
      });
      ctx.font = "400 25px sans-serif";
      ctx.fillStyle = "#b8c1d4";
      lines(ctx, draft.subtitle, 610)
        .slice(0, 3)
        .forEach((line, i) =>
          ctx.fillText(
            line,
            92,
            startY + titleLines.length * font * 1.14 + 35 + i * 37,
          ),
        );
      const ih = draft.format === "square" ? 1050 : 850,
        iw = (ih * image.width) / image.height;
      ctx.drawImage(image, 1090 - iw / 2, h - 80 - ih, iw, ih);
      ctx.fillStyle = theme.accent;
      ctx.fillRect(90, h - 125, 42, 3);
      ctx.font = "400 18px sans-serif";
      ctx.fillStyle = "#a1aec5";
      ctx.fillText("TU COMPAÑERO EN EL CÓDIGO Y EN LA VIDA.", 90, h - 78);
      setRendered(draftKey);
    };
    image.onerror = () => {
      if (!cancelled)
        setNotice(
          "No se pudo cargar a NYX. Recarga la página para volver a intentarlo.",
        );
    };
    image.src = nyxAssets.posterIdle;
    return () => {
      cancelled = true;
    };
  }, [draft, draftKey]);

  const download = () => {
    if (rendered !== draftKey) return;
    canvas.current?.toBlob((blob) => {
      if (!blob) {
        setNotice("No pudimos exportar la imagen. Inténtalo otra vez.");
        return;
      }
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = `nyx-studio-${draft.theme}-${draft.format}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("Pieza exportada en PNG. La idea ya es tuya.");
    }, "image/png");
  };

  return (
    <div className="studio-workbench">
      <div className="studio-toolbar">
        <div className="studio-traffic" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <span>
          NYX STUDIO <small>/ PRIMER LIENZO</small>
        </span>
        <span className="studio-local">
          <i className="live-dot" /> Editor local
        </span>
      </div>
      <div className="studio-layout">
        <div className="studio-artboard">
          <div className={`studio-canvas-wrap ${draft.format}`}>
            <canvas
              ref={canvas}
              width={1600}
              height={1000}
              role="img"
              aria-label={`Tu diseño: ${draft.title}. ${draft.subtitle}. Tema ${themes[draft.theme].name}.`}
            />
          </div>
          <p>Tu idea, en su primera forma.</p>
        </div>
        <form className="studio-inspector" onSubmit={(e) => e.preventDefault()}>
          <p className="eyebrow">HAZLO TUYO</p>
          <label htmlFor="studio-title">
            Tu mensaje
            <textarea
              id="studio-title"
              disabled={!hydrated}
              maxLength={70}
              rows={3}
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </label>
          <label htmlFor="studio-subtitle">
            Una línea más
            <input
              id="studio-subtitle"
              disabled={!hydrated}
              maxLength={100}
              value={draft.subtitle}
              onChange={(e) => update({ subtitle: e.target.value })}
            />
          </label>
          <fieldset>
            <legend>Atmósfera</legend>
            <div className="studio-swatches">
              {(Object.keys(themes) as Theme[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  disabled={!hydrated}
                  aria-pressed={draft.theme === id}
                  onClick={() => update({ theme: id })}
                >
                  <i style={{ background: themes[id].accent }} />
                  {themes[id].name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Formato</legend>
            <div className="studio-formats">
              <button
                type="button"
                aria-pressed={draft.format === "landscape"}
                onClick={() => update({ format: "landscape" })}
              >
                Horizontal
              </button>
              <button
                type="button"
                aria-pressed={draft.format === "square"}
                onClick={() => update({ format: "square" })}
              >
                Cuadrado
              </button>
            </div>
          </fieldset>
          <button
            className="studio-export"
            type="button"
            disabled={!hydrated || rendered !== draftKey}
            onClick={download}
          >
            Descargar PNG <span aria-hidden>↗</span>
          </button>
          <button
            className="studio-reset"
            disabled={!hydrated}
            type="button"
            onClick={() => {
              setDraft(initial);
              setNotice("Lienzo restaurado.");
            }}
          >
            Restablecer lienzo
          </button>
          <p role="status" className="studio-notice">
            {notice}
          </p>
        </form>
      </div>
      <p className="studio-disclaimer">
        Experimento de Studio: composición y exportación local. No utiliza IA ni
        envía tus textos a un servidor. El borrador se conserva en este
        navegador si el almacenamiento está disponible.
      </p>
    </div>
  );
}
