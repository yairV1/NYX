"use client";

import { useCallback, useRef, useState } from "react";
import type { ClipRequest } from "./clips";
import { findClip, type NyxClip } from "./clips";

type Playing = { clip: NyxClip; request: ClipRequest };

/** Estado de «qué reacción está reproduciendo NYX», compartido por las escenas. */
export function useNyxReactions() {
  const sequence = useRef(0);
  const [playing, setPlaying] = useState<Playing | null>(null);

  const play = useCallback((clipId: string) => {
    const clip = findClip(clipId);
    if (!clip) return;
    setPlaying({
      clip,
      request: { source: clip.source, id: ++sequence.current },
    });
  }, []);
  const stop = useCallback(() => setPlaying(null), []);

  return { playing, play, stop };
}
