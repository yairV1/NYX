"use client";

import { Suspense, useLayoutEffect, useSyncExternalStore } from "react";
import { NyxModel } from "./NyxModel";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";

type Vec3 = [number, number, number];

function Block({ position, size, color, metalness = 0 }: { position: Vec3; size: Vec3; color: string; metalness?: number }) {
  return (
    <RoundedBox args={size} radius={Math.min(...size) * .18} smoothness={3} position={position} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={metalness ? .35 : .7} metalness={metalness} />
    </RoundedBox>
  );
}

function Room({ warm }: { warm: boolean }) {
  return (
    <group>
      <Block position={[0, -.09, 0]} size={[6, .18, 5]} color="#141d31" />
      <Block position={[0, 1.6, -2.4]} size={[6, 3.2, .12]} color="#111a30" />
      <Block position={[-2.95, 1.6, 0]} size={[.12, 3.2, 4.8]} color="#18213b" />
      {/* Recessed window and original geometric skyline. */}
      <Block position={[.6, 1.9, -2.3]} size={[3.6, 2, .1]} color="#060d24" />
      {[-.8, -.2, .4, 1, 1.6].map((x, i) => (
        <Block key={x} position={[x, 1.35 + i % 2 * .15, -2.22]} size={[.28, .6 + i % 2 * .3, .08]} color={i % 2 ? "#30235d" : "#174555"} />
      ))}
      <mesh position={[1.65, 2.45, -2.18]}>
        <sphereGeometry args={[.2, 24, 16]} />
        <meshStandardMaterial color="#c5d8ff" emissive="#818cf8" emissiveIntensity={.6} />
      </mesh>
      {/* Desk, approximately 75 cm high. */}
      <Block position={[0, .75, -.45]} size={[2.6, .1, 1.15]} color="#352c35" />
      {[-1.12, 1.12].flatMap(x => [-.85, -.06].map(z => (
        <Block key={x + ":" + z} position={[x, .35, z]} size={[.09, .7, .09]} color="#252c43" metalness={.65} />
      )))}
      <Block position={[.35, 1.12, -.85]} size={[1.05, .61, .06]} color="#242b49" metalness={.4} />
      <mesh position={[.35, 1.12, -.811]}>
        <planeGeometry args={[.95, .51]} />
        <meshStandardMaterial color="#141432" emissive="#6366F1" emissiveIntensity={.4} />
      </mesh>
      <Block position={[.35, .86, -.85]} size={[.08, .17, .08]} color="#242b49" />
      <Block position={[.35, .81, -.34]} size={[.7, .035, .24]} color="#20263f" />
      {Array.from({length: 8}, (_,i) => (
        <Block key={i} position={[.06 + i * .08, .833, -.34]} size={[.05, .01, .16]} color="#6c6387" />
      ))}
      {/* Warm task lamp anchored to the desk. */}
      <mesh position={[-.87, .82, -.7]} castShadow>
        <cylinderGeometry args={[.15, .17, .035, 32]} /><meshStandardMaterial color="#61516e" metalness={.6} roughness={.3} />
      </mesh>
      <Block position={[-.87, 1.07, -.7]} size={[.035, .5, .035]} color="#9d87b1" metalness={.7} />
      <group position={[-.87, 1.38, -.7]}>
        <mesh castShadow><cylinderGeometry args={[.1, .23, .19, 32,1,true]} /><meshStandardMaterial color="#47305f" metalness={.4} roughness={.4} side={2} /></mesh>
        <mesh position={[0, -.07, 0]}><sphereGeometry args={[.06,16,12]} /><meshStandardMaterial color="#ffdb9c" emissive="#ffbc68" emissiveIntensity={warm ? 3 : 0} /></mesh>
        {warm && <pointLight position={[0,-.14,0]} color="#ffd29a" intensity={12} distance={3.5} decay={2} castShadow shadow-mapSize={[512,512]} />}
      </group>
      {/* Empty visitor chair, open toward the desk. */}
      <group position={[.65, 0, .85]} rotation={[0,-.2,0]}>
        <Block position={[0,.44,0]} size={[.64,.13,.6]} color="#3b2c68" />
        <Block position={[0,.83,.27]} size={[.66,.7,.12]} color="#493374" />
        {[-.24,.24].flatMap(x => [-.22,.22].map(z => <Block key={x+":"+z} position={[x,.2,z]} size={[.045,.4,.045]} color="#727083" metalness={.65} />))}
      </group>
      <Block position={[-1.6,.48,-1.7]} size={[1,.07,.32]} color="#3b3147" />
      {[0,1,2].map(i => <Block key={i} position={[-1.9+i*.16,.65,-1.7]} size={[.12,.3,.22]} color={["#7C3AED","#6366F1","#06B6D4"][i]} />)}
      <mesh position={[0,.09,-2.25]} rotation={[Math.PI/2,0,0]}>
        <planeGeometry args={[5.6,.025]} /><meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

const CAMERA_HOME: Vec3 = [4, 3.2, 5];
const CAMERA_TARGET: Vec3 = [0, .85, -.3];

/** Pulls the camera back on portrait viewports so NYX stays inside the first frame. */
function ResponsiveFraming() {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const portrait = useThree((state) => state.size.width < state.size.height);
  useLayoutEffect(() => {
    const factor = portrait ? 1.55 : 1;
    camera.position.set(
      CAMERA_TARGET[0] + (CAMERA_HOME[0] - CAMERA_TARGET[0]) * factor,
      CAMERA_TARGET[1] + (CAMERA_HOME[1] - CAMERA_TARGET[1]) * factor,
      CAMERA_TARGET[2] + (CAMERA_HOME[2] - CAMERA_TARGET[2]) * factor,
    );
    invalidate();
  }, [camera, invalidate, portrait]);
  return null;
}

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export default function CasaNodoScene({ warm }: { warm: boolean }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true);
  return (
    <Canvas shadows dpr={[1, 1.5]} frameloop={reducedMotion ? "demand" : "always"} camera={{ position: CAMERA_HOME, fov: 42 }} gl={{ antialias: true }} fallback={<p className="p-8">La escena necesita un navegador con WebGL.</p>}>
      <color attach="background" args={["#0F172A"]} />
      <ambientLight intensity={.5} color="#b8b4ef" />
      <directionalLight position={[3,5,3]} intensity={2} color="#bdceff" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-normalBias={.03} />
      <pointLight position={[-2,2,-1]} intensity={14} color="#7C3AED" distance={6} />
      <pointLight position={[2,2,-1.5]} intensity={9} color="#06B6D4" distance={5} />
      <Room warm={warm} />
      <Suspense fallback={null}><NyxModel reducedMotion={reducedMotion} /></Suspense>
      <ResponsiveFraming />
      <OrbitControls target={CAMERA_TARGET} minDistance={3} maxDistance={12} maxPolarAngle={Math.PI/2.05} enablePan={false} />
    </Canvas>
  );
}
