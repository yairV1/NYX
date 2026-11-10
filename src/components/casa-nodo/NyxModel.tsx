"use client";

import { useEffect, useMemo } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { LoopOnce, Mesh, type AnimationAction } from "three";
import { DRACO_DECODER_PATH, IDLE_CLIP, NYX_MODEL_URL } from "@/lib/nyx/clips";

/** `id` distingue dos peticiones seguidas del mismo clip. */
export type ClipRequest = { source: string; id: number };

type Props = {
  reducedMotion: boolean;
  request: ClipRequest | null;
  onReady: () => void;
  onClipEnd: () => void;
  onSelect: () => void;
};

const FADE_IN = 0.25;
const FADE_BACK = 0.45;

/** Plays a clip a single time and holds its last pose until it is faded out. */
function playOnce(action: AnimationAction) {
  action.reset();
  action.setLoop(LoopOnce, 1);
  action.clampWhenFinished = true;
  action.fadeIn(FADE_IN).play();
}

/** NYX a tamaño y posición nativos; cada escena lo coloca con un <group>. */
export function NyxModel({ reducedMotion, request, onReady, onClipEnd, onSelect }: Props) {
  const { scene, animations } = useGLTF(NYX_MODEL_URL, DRACO_DECODER_PATH);
  const character = useMemo(() => {
    const copy = clone(scene);
    copy.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    return copy;
  }, [scene]);
  const { actions, mixer } = useAnimations(animations, character);

  // The component only mounts once the GLB has been decoded (Suspense).
  useEffect(() => { onReady(); }, [onReady]);

  // Resting loop. With reduced motion NYX stays still unless the visitor asks for a clip.
  useEffect(() => {
    const idle = actions[IDLE_CLIP];
    if (!idle || reducedMotion) return;
    idle.reset().fadeIn(.3).play();
    return () => { idle.stop(); };
  }, [actions, reducedMotion]);

  // One-shot clip requested by the visitor, cross-faded over the resting loop.
  useEffect(() => {
    if (!request) return;
    const action = actions[request.source];
    if (!action) { onClipEnd(); return; }
    const idle = reducedMotion ? null : actions[IDLE_CLIP];
    let timer: ReturnType<typeof setTimeout> | undefined;
    playOnce(action);
    idle?.fadeOut(FADE_IN);
    const finished = (event: { action: AnimationAction }) => {
      if (event.action !== action) return;
      action.fadeOut(FADE_BACK);
      idle?.reset().fadeIn(FADE_BACK).play();
      timer = setTimeout(onClipEnd, FADE_BACK * 1000 + 50);
    };
    mixer.addEventListener("finished", finished);
    return () => {
      mixer.removeEventListener("finished", finished);
      clearTimeout(timer);
      action.fadeOut(.2);
    };
  }, [request, actions, mixer, reducedMotion, onClipEnd]);

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };
  const hover = (active: boolean) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = active ? "pointer" : "";
  };

  return (
    <primitive
      object={character}
      onClick={select}
      onPointerOver={hover(true)}
      onPointerOut={hover(false)}
    />
  );
}
