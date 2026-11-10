"use client";

import { useCallback, useState } from "react";
import type { ClipRequest } from "@/components/casa-nodo/NyxModel";
import { findClip, type NyxClip } from "./clips";

type Playing = { clip: NyxClip; request: ClipRequest };

/** Estado de «qué reacción está reproduciendo NYX», compartido por las escenas. */
export function useNyxReactions() {
  const [playing, setPlaying] = useState<Playing | null>(null);

  const play = useCallback((clipId: string) => {
    const clip = findClip(clipId);
    if (!clip) return;
    setPlaying((current) => ({
      clip,
      request: { source: clip.source, id: (current?.request.id ?? 0) + 1 },
    }));
  }, []);
  const stop = useCallback(() => setPlaying(null), []);

  return { playing, play, stop };
}
