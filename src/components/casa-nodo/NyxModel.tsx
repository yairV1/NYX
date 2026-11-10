"use client";

import { useEffect, useMemo } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Mesh } from "three";

export function NyxModel({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene, animations } = useGLTF("/assets/nyx/models/nyx-v2-refined.glb", "/draco/");
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
  const { actions } = useAnimations(animations, character);
  useEffect(() => {
    const idle = actions.Idle_Secondary;
    if (!idle || reducedMotion) return;
    idle.reset().fadeIn(.3).play();
    return () => { idle.stop(); };
  }, [actions, reducedMotion]);
  return <primitive object={character} position={[-1.65, .02, .4]} rotation={[0, .2, 0]} scale={.42} />;
}
