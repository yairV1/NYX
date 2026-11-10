"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { NyxModel, type ClipRequest } from "@/components/casa-nodo/NyxModel";

type Props = {
  /** false pausa el render (hero fuera de pantalla). */
  active: boolean;
  request: ClipRequest | null;
  onReady: () => void;
  onClipEnd: () => void;
  onSelect: () => void;
};

/** Ángulo base: el mismo tres cuartos del render de respaldo. */
const BASE_YAW = 0.28;

function CameraAim() {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => {
    camera.lookAt(0, 1.6, 0);
  }, [camera]);
  return null;
}

/** NYX gira suavemente hacia el cursor. Sin controles de órbita: el scroll es de la página. */
function Turntable({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    const pointer = Math.max(-1, Math.min(1, state.pointer.x));
    const target = BASE_YAW + pointer * 0.55;
    group.rotation.y += (target - group.rotation.y) * Math.min(1, delta * 3);
  });
  return <group ref={ref} rotation={[0, BASE_YAW, 0]}>{children}</group>;
}

export default function HeroNyxCanvas({ active, request, onReady, onClipEnd, onSelect }: Props) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 1.95, 9.4], fov: 26 }}
      style={{ touchAction: "pan-y" }}
    >
      <CameraAim />
      <ambientLight intensity={0.7} color="#c7d2fe" />
      <directionalLight position={[-3, 5, 6]} intensity={2.4} color="#fff7ef" />
      <pointLight position={[3.5, 3, -3]} intensity={90} color="#7C3AED" distance={12} />
      <pointLight position={[-4, 2.4, -2.5]} intensity={70} color="#06B6D4" distance={12} />
      <Turntable>
        <Suspense fallback={null}>
          <NyxModel reducedMotion={false} request={request} onReady={onReady} onClipEnd={onClipEnd} onSelect={onSelect} />
        </Suspense>
      </Turntable>
    </Canvas>
  );
}
