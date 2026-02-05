import { Suspense, useEffect, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Environment, Center } from "@react-three/drei";
import * as THREE from "three";

// ==================== Types ====================

export interface GLBModelProps {
  /** URL ของไฟล์ 3D model (.glb/.gltf) */
  url: string;
  /** สีที่ต้องการเปลี่ยน (default: "red") */
  color?: string;
  /** รายชื่อ mesh ที่ต้องการเปลี่ยนสี (lowercase) */
  targetMeshes?: string[];
  /** เปลี่ยนสีทุก mesh หรือไม่ */
  changeAllMeshes?: boolean;
  /** ขนาด scale ของโมเดล (default: 2) */
  modelScale?: number;
  /** แสดง log ชื่อ mesh ใน console */
  debug?: boolean;
}

export interface LightingProps {
  /** ความสว่างของ ambient light (default: 0.6) */
  ambientIntensity?: number;
  /** ความสว่างของ directional light (default: 1.2) */
  directionalIntensity?: number;
  /** ตำแหน่งของ directional light */
  directionalPosition?: [number, number, number];
}

export interface CameraProps {
  /** ตำแหน่งเริ่มต้นของกล้อง */
  position?: [number, number, number];
  /** Field of view (default: 45) */
  fov?: number;
}

export interface OrbitControlsProps {
  /** เปิด damping หรือไม่ (default: true) */
  enableDamping?: boolean;
  /** ค่า damping factor (default: 0.08) */
  dampingFactor?: number;
  /** ความเร็วในการหมุน (default: 0.8) */
  rotateSpeed?: number;
  /** ระยะใกล้สุดที่ zoom ได้ (default: 1) */
  minDistance?: number;
  /** ระยะไกลสุดที่ zoom ได้ (default: 100) */
  maxDistance?: number;
  /** เปิด/ปิด zoom (default: true) */
  enableZoom?: boolean;
  /** เปิด/ปิด pan (default: true) */
  enablePan?: boolean;
  /** Auto rotate หรือไม่ (default: false) */
  autoRotate?: boolean;
  /** ความเร็ว auto rotate */
  autoRotateSpeed?: number;
}

export interface ModelViewerProps {
  // Container
  /** ความกว้างของ container */
  width?: number | string;
  /** ความสูงของ container */
  height?: number | string;
  /** border radius */
  borderRadius?: number | string;
  /** className สำหรับ container */
  className?: string;
  /** style เพิ่มเติมสำหรับ container */
  style?: CSSProperties;

  // Model
  /** URL ของไฟล์ 3D model */
  modelUrl: string;
  /** สีของโมเดล */
  modelColor?: string;
  /** รายชื่อ mesh ที่ต้องการเปลี่ยนสี */
  targetMeshes?: string[];
  /** เปลี่ยนสีทุก mesh */
  changeAllMeshes?: boolean;
  /** ขนาด scale ของโมเดล */
  modelScale?: number;

  // Scene
  /** Environment preset */
  environmentPreset?: "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse";
  /** พื้นหลังของ Canvas */
  backgroundColor?: string;

  // Lighting
  lighting?: LightingProps;

  // Camera
  camera?: CameraProps;

  // Controls
  controls?: OrbitControlsProps;

  // Custom
  /** Custom loader component */
  loader?: ReactNode;
  /** เปิด shadows หรือไม่ */
  shadows?: boolean;
  /** Debug mode - แสดง mesh names ใน console */
  debug?: boolean;

  // Callbacks
  /** callback เมื่อโมเดลโหลดเสร็จ */
  onLoad?: () => void;
  /** callback เมื่อเกิด error */
  onError?: (error: Error) => void;
}

// ==================== Sub Components ====================

function GLBModel({
  url,
  color = "red",
  targetMeshes = [],
  changeAllMeshes = false,
  modelScale = 2,
  debug = false,
}: GLBModelProps) {
  const { scene } = useGLTF(url);

  const lowerTargets = useMemo(
    () => targetMeshes.map((t) => t.toLowerCase()),
    [targetMeshes]
  );

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxSize = Math.max(size.x, size.y, size.z);
    const scale = modelScale / maxSize;

    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));

    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;

      const mesh = obj as THREE.Mesh;

      if (debug) {
        console.log("Mesh name:", mesh.name);
      }

      const name = (mesh.name || "").toLowerCase();
      const match = lowerTargets.some((t) => name.includes(t));
      if (!match && !changeAllMeshes) return;

      // Clone material เพื่อป้องกัน material ถูกแชร์
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();

      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      mats.forEach((m) => {
        if (m && "color" in m && m.type === "MeshStandardMaterial") {
          (m as THREE.MeshStandardMaterial).color.set(color);
          m.needsUpdate = true;
        }
      });

      obj.castShadow = true;
      obj.receiveShadow = true;
    });
  }, [scene, color, lowerTargets, changeAllMeshes, modelScale, debug]);

  return <primitive object={scene} />;
}

function DefaultLoader() {
  return (
    <Html center>
      <div
        style={{
          padding: 10,
          borderRadius: 8,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
        }}
      >
        Loading 3D...
      </div>
    </Html>
  );
}

// ==================== Main Component ====================

export default function ModelViewer({
  // Container
  width = 500,
  height = 600,
  borderRadius = 16,
  className = "shadow-sm",
  style,

  // Model
  modelUrl,
  modelColor,
  targetMeshes = [],
  changeAllMeshes = false,
  modelScale = 2,

  // Scene
  environmentPreset = "city",
  backgroundColor,

  // Lighting
  lighting = {},

  // Camera
  camera = {},

  // Controls
  controls = {},

  // Custom
  loader,
  shadows = true,
  debug = false,
}: ModelViewerProps) {
  // Destructure with defaults
  const {
    ambientIntensity = 0.6,
    directionalIntensity = 1.2,
    directionalPosition = [5, 8, 5] as [number, number, number],
  } = lighting;

  const { position: cameraPosition = [0, 1.2, 3] as [number, number, number], fov = 45 } = camera;

  const {
    enableDamping = true,
    dampingFactor = 0.08,
    rotateSpeed = 0.8,
    minDistance = 1,
    maxDistance = 100,
    enableZoom = true,
    enablePan = true,
    autoRotate = false,
    autoRotateSpeed = 2,
  } = controls;

  const containerStyle: CSSProperties = {
    width,
    height,
    borderRadius,
    overflow: "hidden",
    ...style,
  };

  return (
    <div style={containerStyle} className={className}>
      <Canvas
        shadows={shadows}
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        style={{ background: backgroundColor }}
      >
        {/* Lighting */}
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={directionalPosition}
          intensity={directionalIntensity}
          castShadow={shadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Scene */}
        <Suspense fallback={loader || <DefaultLoader />}>
          <Environment preset={environmentPreset} />
          <Center>
            <GLBModel
              url={modelUrl}
              color={modelColor}
              targetMeshes={targetMeshes}
              changeAllMeshes={changeAllMeshes}
              modelScale={modelScale}
              debug={debug}
            />
          </Center>
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableDamping={enableDamping}
          dampingFactor={dampingFactor}
          rotateSpeed={rotateSpeed}
          minDistance={minDistance}
          maxDistance={maxDistance}
          enableZoom={enableZoom}
          enablePan={enablePan}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
        />
      </Canvas>
    </div>
  );
}

// Export sub-components for advanced usage
export { GLBModel, DefaultLoader };
