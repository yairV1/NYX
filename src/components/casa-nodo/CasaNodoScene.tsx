"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useCompactViewport } from "@/lib/nyx/useSceneActivity";
import { NyxModel } from "./NyxModel";
import { NodoRoom, type RoomMood } from "@/components/world/NodoRoom";
import type { ClipRequest } from "@/lib/nyx/clips";

export type RoomView = "welcome" | "desk" | "room";
type Props = {
  warm: boolean;
  mood: RoomMood;
  view?: RoomView;
  reset?: number;
  hero?: boolean;
  active: boolean;
  reducedMotion: boolean;
  paused?: boolean;
  request: ClipRequest | null;
  onReady: () => void;
  onClipEnd: () => void;
  onSelect: () => void;
  onError: () => void;
};

const views: Record<
  RoomView,
  { eye: [number, number, number]; target: [number, number, number] }
> = {
  welcome: { eye: [6.4, 3.15, 8.4], target: [1, 1.7, 0] },
  desk: { eye: [3.5, 2.7, 4.5], target: [0.5, 1.5, -0.4] },
  room: { eye: [7.8, 5, 10], target: [0, 1.6, -0.3] },
};

function CameraRig({
  view,
  reset,
  hero,
  reducedMotion,
  onError,
}: {
  view: RoomView;
  reset: number;
  hero: boolean;
  reducedMotion: boolean;
  onError: () => void;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const moving = useRef(true);
  const desired = useRef(new Vector3());
  const target = useRef(new Vector3());
  const { camera, size, gl, invalidate } = useThree();
  useEffect(() => {
    const preset = views[view];
    target.current.set(...preset.target);
    desired.current.set(...preset.eye);
    if (hero) {
      desired.current.set(5.6, 2.9, 8.4);
      target.current.set(0.8, 1.8, 0);
    }
    if (size.width / size.height < 1)
      desired.current
        .sub(target.current)
        .multiplyScalar(hero ? 1.05 : 1.32)
        .add(target.current);
    moving.current = true;
    if (reducedMotion) {
      camera.position.copy(desired.current);
      controls.current?.target.copy(target.current);
      camera.lookAt(target.current);
      moving.current = false;
    }
    invalidate();
  }, [
    view,
    reset,
    hero,
    size.width,
    size.height,
    reducedMotion,
    camera,
    invalidate,
  ]);
  useEffect(() => {
    const element = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    element.addEventListener("webglcontextlost", lost);
    return () => element.removeEventListener("webglcontextlost", lost);
  }, [gl, onError]);
  useFrame((state, delta) => {
    if (!moving.current) return;
    const alpha = 1 - Math.exp(-Math.min(delta, 0.05) * 5);
    camera.position.lerp(desired.current, alpha);
    if (controls.current) controls.current.target.lerp(target.current, alpha);
    else camera.lookAt(target.current);
    if (camera.position.distanceTo(desired.current) < 0.008)
      moving.current = false;
    state.invalidate();
  });
  return hero ? null : (
    <OrbitControls
      ref={controls}
      target={views.welcome.target}
      minDistance={3}
      maxDistance={15}
      maxPolarAngle={Math.PI * 0.47}
      minPolarAngle={0.35}
      enablePan={false}
      enableDamping={!reducedMotion}
      onStart={() => {
        moving.current = false;
      }}
    />
  );
}

export default function CasaNodoScene({
  warm,
  mood,
  view = "welcome",
  reset = 0,
  hero = false,
  active,
  reducedMotion,
  paused = false,
  request,
  onReady,
  onClipEnd,
  onSelect,
  onError,
}: Props) {
  const compact = useCompactViewport();
  const quiet = reducedMotion || paused;
  return (
    <Canvas
      shadows={!compact}
      dpr={compact ? 1 : [1, 1.5]}
      frameloop={!active ? "never" : quiet && !request ? "demand" : "always"}
      camera={{
        position: views.welcome.eye,
        fov: hero ? 39 : 43,
        near: 0.1,
        far: 70,
      }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: hero ? "pan-y" : "none" }}
      fallback={
        <p className="scene-unavailable">
          La vista 3D necesita WebGL. Puedes seguir explorando la página.
        </p>
      }
    >
      <fog attach="fog" args={["#080e1c", 15, 38]} />
      <ambientLight intensity={0.65} color="#c0c9ef" />
      <hemisphereLight args={["#b8cbf0", "#31304a", 1.1]} />
      <directionalLight
        position={[1, 6, 5]}
        intensity={2.1}
        color="#ffdfc7"
        castShadow={!compact}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-normalBias={0.035}
      />
      <pointLight
        position={[-3, 3.5, 1]}
        intensity={mood === "focus" ? 8 : 24}
        color={mood === "aurora" ? "#73e5d0" : "#9681ff"}
        distance={10}
      />
      <pointLight
        position={[3.5, 2.5, -1.5]}
        intensity={mood === "focus" ? 8 : 28}
        color="#6cc6f0"
        distance={9}
      />
      <pointLight
        position={[2, 2.8, 4]}
        intensity={9}
        color="#ffd9c4"
        distance={8}
      />
      <NodoRoom warm={warm} mood={mood} reducedMotion={quiet} />
      <Suspense fallback={null}>
        <group
          position={[2.25, 0.035, 1.25]}
          rotation={[0, 0.25, 0]}
          scale={0.7}
        >
          <NyxModel
            reducedMotion={quiet}
            request={request}
            onReady={onReady}
            onClipEnd={onClipEnd}
            onSelect={onSelect}
          />
        </group>
      </Suspense>
      <CameraRig
        view={view}
        reset={reset}
        hero={hero}
        reducedMotion={quiet}
        onError={onError}
      />
    </Canvas>
  );
}
