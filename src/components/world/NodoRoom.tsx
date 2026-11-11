"use client";

import { useEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace, type Group } from "three";

export type RoomMood = "midnight" | "aurora" | "focus";
type V3 = [number, number, number];

function Box({
  at,
  size,
  color = "#182338",
  metal = 0,
  glow = 0,
  rotation = [0, 0, 0],
}: {
  at: V3;
  size: V3;
  color?: string;
  metal?: number;
  glow?: number;
  rotation?: V3;
}) {
  return (
    <RoundedBox
      position={at}
      args={size}
      radius={Math.min(...size) * 0.22}
      smoothness={2}
      rotation={rotation}
      castShadow={!glow}
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={metal ? 0.36 : 0.72}
        metalness={metal}
        emissive={color}
        emissiveIntensity={glow}
      />
    </RoundedBox>
  );
}

/** Original deterministic canvas artwork: no downloaded textures or external requests. */
function useScreenTexture(kind: "sky" | "terminal") {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext("2d")!;
    if (kind === "sky") {
      const bg = ctx.createLinearGradient(0, 0, 0, 768);
      bg.addColorStop(0, "#060d26");
      bg.addColorStop(0.6, "#26346b");
      bg.addColorStop(1, "#805a8a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1024, 768);
      const halo = ctx.createRadialGradient(730, 190, 0, 730, 190, 240);
      halo.addColorStop(0, "#7e9ccf66");
      halo.addColorStop(1, "#7e9ccf00");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, 1024, 768);
      for (let i = 0; i < 110; i++) {
        ctx.fillStyle = i % 4 === 0 ? "#d7e8ff" : "#9caee377";
        ctx.fillRect(
          ((((Math.sin(i * 127.1 + 3) * 43758.5453) % 1) + 1) % 1) * 1024,
          ((((Math.sin(i * 269.5 + 7) * 43758.5453) % 1) + 1) % 1) * 490,
          i % 5 === 0 ? 2 : 1,
          i % 5 === 0 ? 2 : 1,
        );
      }
      const moon = ctx.createRadialGradient(712, 165, 2, 730, 180, 49);
      moon.addColorStop(0, "#e1e6ec");
      moon.addColorStop(1, "#8a9bb9");
      ctx.fillStyle = moon;
      ctx.beginPath();
      ctx.arc(730, 180, 46, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.fillStyle = "#7286a122";
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(
          696 + ((i * 17) % 70),
          145 + ((i * 23) % 75),
          3 + (i % 8),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.restore();
      for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < 17; i++) {
          const x = i * 73 - layer * 21,
            h = 90 + ((i * 71 + layer * 43) % 180) + layer * 35,
            y = 768 - h;
          ctx.fillStyle = ["#344369", "#202f50", "#101d35"][layer];
          ctx.fillRect(x, y, 61, h);
          ctx.fillStyle = layer === 2 ? "#617fb177" : "#9ca4dd55";
          for (let wx = 8; wx < 55; wx += 12)
            for (let wy = 12; wy < h; wy += 19)
              if ((wx + wy + i) % 5 !== 0) ctx.fillRect(x + wx, y + wy, 3, 6);
          if (i % 4 === 0) {
            ctx.fillStyle = "#6f85c7";
            ctx.fillRect(x + 9, y, 2, -20);
          }
        }
      }
    } else {
      ctx.fillStyle = "#0b1325";
      ctx.fillRect(0, 0, 1024, 768);
      ctx.fillStyle = "#26324c";
      ctx.fillRect(0, 0, 1024, 60);
      ctx.fillStyle = "#b8c6e8";
      ctx.font = "18px monospace";
      ctx.fillText("NYX / CREATIVE TERMINAL", 32, 38);
      ctx.fillStyle = "#62decc";
      ctx.font = "bold 62px sans-serif";
      ctx.fillText("Hello, possible.", 60, 164);
      ctx.font = "24px monospace";
      [
        "const tomorrow = {",
        '  imagination: "unlimited",',
        '  companion: "NYX",',
        '  status: "building"',
        "};",
        "",
        "// Un lugar para tus ideas.",
      ].forEach((line, i) => {
        ctx.fillStyle = i === 6 ? "#7e8daa" : i % 2 ? "#c3aff5" : "#65d4e5";
        ctx.fillText(line, 60, 250 + i * 48);
      });
      ctx.fillStyle = "#7c3aed";
      ctx.fillRect(60, 660, 900, 3);
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Window() {
  const map = useScreenTexture("sky");
  return (
    <group position={[0.1, 2.75, -2.93]}>
      <Box
        at={[0, 0, -0.07]}
        size={[7.2, 4.35, 0.14]}
        color="#6d699c"
        metal={0.6}
      />
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[6.95, 4.1]} />
        <meshBasicMaterial map={map} />
      </mesh>
      {[-3.5, 0, 3.5].map((x) => (
        <Box
          key={x}
          at={[x, 0, 0.07]}
          size={[0.075, 4.2, 0.16]}
          color="#1c273b"
          metal={0.7}
        />
      ))}
      <Box
        at={[0, -2.08, 0.12]}
        size={[7.3, 0.14, 0.36]}
        color="#273144"
        metal={0.6}
      />
      <Box
        at={[0, 2.13, 0.06]}
        size={[7.1, 0.025, 0.1]}
        color="#a9abff"
        glow={2}
      />
      <Box
        at={[0, -2.05, 0.3]}
        size={[6.8, 0.02, 0.025]}
        color="#6366f1"
        glow={2}
      />
    </group>
  );
}

function Plant({ at, scale = 1 }: { at: V3; scale?: number }) {
  return (
    <group position={at} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.42, 24]} />
        <meshStandardMaterial color="#a99286" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.018, 0.025, 0.9, 8]} />
        <meshStandardMaterial color="#345845" />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => {
        const a = i * 2.4,
          y = 0.48 + i * 0.105;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.16, y, Math.sin(a) * 0.16]}
            rotation={[Math.sin(a) * 0.6, a, -0.5]}
            scale={[0.13, 0.32, 0.035]}
            castShadow
          >
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial
              color={i % 2 ? "#477c68" : "#2b6359"}
              roughness={0.65}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Desk({ warm }: { warm: boolean }) {
  const map = useScreenTexture("terminal");
  return (
    <group position={[0.5, 0, -0.65]}>
      <Box
        at={[0, 1.12, 0]}
        size={[3.8, 0.15, 1.45]}
        color="#66536a"
        metal={0.25}
      />
      <Box at={[0, 1.18, 0]} size={[3.7, 0.025, 1.35]} color="#57465b" />
      {[-1.5, 1.5].map((x) => (
        <group key={x}>
          <Box
            at={[x, 0.55, 0]}
            size={[0.12, 1.1, 1.1]}
            color="#1b2539"
            metal={0.7}
          />
          <Box
            at={[x, 0.06, 0.02]}
            size={[0.4, 0.1, 1.4]}
            color="#242d43"
            metal={0.7}
          />
        </group>
      ))}
      <Box
        at={[0, 1.11, 0.73]}
        size={[3.4, 0.025, 0.02]}
        color="#7c3aed"
        glow={2}
      />
      <Box
        at={[0.15, 1.7, -0.38]}
        size={[1.95, 1.12, 0.09]}
        color="#263149"
        metal={0.6}
      />
      <mesh position={[0.15, 1.7, -0.328]}>
        <planeGeometry args={[1.85, 1.02]} />
        <meshBasicMaterial map={map} />
      </mesh>
      <Box at={[0.15, 1.3, -0.4]} size={[0.09, 0.25, 0.1]} metal={0.6} />
      <Box at={[0.15, 1.23, -0.3]} size={[0.6, 0.04, 0.3]} metal={0.6} />
      <Box at={[0.15, 1.218, 0.3]} size={[1.5, 0.02, 0.58]} color="#24243b" />
      <Box at={[0.03, 1.25, 0.26]} size={[0.95, 0.04, 0.32]} color="#161c31" />
      {Array.from({ length: 10 }, (_, i) => (
        <Box
          key={i}
          at={[-0.36 + i * 0.085, 1.28, 0.26]}
          size={[0.053, 0.01, 0.23]}
          color={i % 3 === 0 ? "#a78bfa" : "#667591"}
          glow={0.12}
        />
      ))}
      <mesh position={[0.7, 1.26, 0.3]} scale={[0.09, 0.04, 0.14]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#a59ab3" />
      </mesh>
      {/* Ceramic mug: hollow opening and curved handle. */}
      <group position={[1.42, 1.22, 0.27]}>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.27, 24, 1, true]} />
          <meshStandardMaterial color="#c3b6cc" side={2} />
        </mesh>
        <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.105, 24]} />
          <meshStandardMaterial color="#251e28" />
        </mesh>
        <mesh position={[0.12, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.075, 0.02, 8, 20]} />
          <meshStandardMaterial color="#c3b6cc" />
        </mesh>
      </group>
      <group position={[-1.45, 1.22, -0.28]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.19, 0.23, 0.045, 24]} />
          <meshStandardMaterial
            color="#b7a0b8"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <Box
          at={[0, 0.4, 0]}
          size={[0.025, 0.8, 0.025]}
          color="#b7a0b8"
          metal={0.6}
        />
        <mesh position={[0.1, 0.79, 0]} rotation={[0, 0, 0.2]} castShadow>
          <coneGeometry args={[0.27, 0.24, 32, 1, true]} />
          <meshStandardMaterial color="#8d789c" metalness={0.4} side={2} />
        </mesh>
        <mesh position={[0.1, 0.69, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 24]} />
          <meshBasicMaterial color={warm ? "#ffe1ad" : "#6b5f6e"} />
        </mesh>
        {warm && (
          <pointLight
            position={[0.1, 0.62, 0.1]}
            color="#ffbd80"
            intensity={9}
            distance={4}
            decay={2}
          />
        )}
      </group>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0.3, 0, 1.0]} rotation={[0, -0.6, 0]}>
      <Box at={[0, 0.65, 0]} size={[0.85, 0.17, 0.85]} color="#554566" />
      <Box
        at={[0, 1.13, 0.35]}
        size={[0.83, 0.9, 0.16]}
        color="#655174"
        rotation={[-0.12, 0, 0]}
      />
      <Box
        at={[0, 1.13, 0.25]}
        size={[0.64, 0.7, 0.045]}
        color="#71617e"
        rotation={[-0.12, 0, 0]}
      />
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.055, 0.065, 0.6, 16]} />
        <meshStandardMaterial color="#7f8798" metalness={0.8} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <Box
            at={[0.22, 0.08, 0]}
            size={[0.55, 0.05, 0.07]}
            color="#525c72"
            metal={0.7}
          />
          <mesh position={[0.47, 0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.07, 12]} />
            <meshStandardMaterial color="#20283a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function IdeaCore({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !reducedMotion)
      ref.current.rotation.y += Math.min(delta, 0.05) * 0.3;
  });
  return (
    <group position={[3.45, 1.65, -0.4]}>
      <Box
        at={[0, -0.9, 0]}
        size={[0.8, 1.5, 0.8]}
        color="#273249"
        metal={0.4}
      />
      <Box
        at={[0, -0.12, 0]}
        size={[0.75, 0.035, 0.75]}
        color="#7c3aed"
        glow={2}
      />
      <group ref={ref}>
        <mesh rotation={[0.4, 0.2, 0.5]}>
          <octahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color="#72dee7"
            emissive="#06b6d4"
            emissiveIntensity={0.7}
            metalness={0.6}
            roughness={0.25}
            wireframe
          />
        </mesh>
        <mesh rotation={[1.2, 0, 0.4]}>
          <torusGeometry args={[0.47, 0.009, 8, 64]} />
          <meshBasicMaterial color="#ba9af4" />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial
            color="#b9a2ff"
            emissive="#7c3aed"
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>
    </group>
  );
}

/** Same authored room in the landing and explorer; native rig/export is untouched. */
export function NodoRoom({
  warm,
  mood,
  reducedMotion,
}: {
  warm: boolean;
  mood: RoomMood;
  reducedMotion: boolean;
}) {
  return (
    <group>
      <Box
        at={[0, -0.13, 0.2]}
        size={[10, 0.25, 7]}
        color="#111a2a"
        metal={0.25}
      />
      <Box at={[0, 2.5, -3.12]} size={[10, 5.2, 0.25]} color="#111a2d" />
      <Window />
      {/* Vertical architectural ribs; no left wall blocking the visitor's view. */}
      {[-4.3, -4.05, 4.05, 4.3].map((x) => (
        <Box
          key={x}
          at={[x, 2.5, -2.95]}
          size={[0.07, 5, 0.09]}
          color="#34334c"
          metal={0.4}
        />
      ))}
      <Box
        at={[0, 4.9, -2.8]}
        size={[9, 0.035, 0.04]}
        color={mood === "aurora" ? "#6cddd0" : "#b79cff"}
        glow={2}
      />
      <Box
        at={[0, 0.08, -2.82]}
        size={[9, 0.025, 0.04]}
        color="#6366f1"
        glow={2}
      />
      {/* A quiet textile island grounds the character and furniture. */}
      <Box at={[0.55, 0.012, 0.65]} size={[5.7, 0.022, 3.8]} color="#323047" />
      {[-2.13, 3.23].map((x) => (
        <Box
          key={x}
          at={[x, 0.026, 0.65]}
          size={[0.018, 0.003, 3.5]}
          color="#655576"
        />
      ))}
      <Desk warm={warm} />
      <Chair />
      <Plant at={[-3.2, 0, -1.8]} scale={1.8} />
      <Plant at={[2.15, 1.2, -1.15]} scale={0.55} />
      <IdeaCore reducedMotion={reducedMotion} />
      <group position={[-3.55, 1.9, -2.4]}>
        <Box
          at={[0, 0, 0]}
          size={[1.4, 0.09, 0.55]}
          color="#5c4b62"
          metal={0.2}
        />
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            at={[-0.4 + i * 0.17, 0.23, 0]}
            size={[0.11, 0.4 + (i % 2) * 0.1, 0.25]}
            color={["#7976a8", "#385e75", "#b39e9b", "#8f68bd"][i]}
          />
        ))}
        <Box
          at={[0, -0.06, 0.2]}
          size={[1.2, 0.015, 0.02]}
          color="#c19fe9"
          glow={1.8}
        />
      </group>
    </group>
  );
}
