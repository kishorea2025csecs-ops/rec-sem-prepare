import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import modelAsset from "@/assets/model-3d.gltf.asset.json";

function Model() {
  const { scene } = useGLTF(modelAsset.url);
  return <primitive object={scene} />;
}

export function ModelViewer() {
  return (
    <div className="size-full">
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center bg-surface/30">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <Canvas dpr={[1, 2]} camera={{ fov: 45 }} style={{ touchAction: "none" }}>
          <color attach="background" args={["#0f172a"]} />
          <PresentationControls
            speed={1.5}
            global
            zoom={0.7}
            polar={[-0.1, Math.PI / 4]}
            rotation={[Math.PI / 8, Math.PI / 4, 0]}
          >
            <Stage environment="city" intensity={0.5} adjustCamera={true}>
              <Model />
            </Stage>
          </PresentationControls>
        </Canvas>
      </Suspense>
    </div>
  );
}
