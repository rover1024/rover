import * as THREE from 'three';
import { Suspense, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, applyProps, useFrame } from '@react-three/fiber';
import {
  AccumulativeShadows,
  Environment,
  Float,
  Lightformer,
  PerformanceMonitor,
  RandomizedLight,
  useGLTF,
} from '@react-three/drei';

interface CarSceneProps {
  isDark?: boolean;
}

function MiniModel({ ...props }: Record<string, unknown>) {
  const { scene, nodes, materials } = useGLTF('/mini.glb') as any;

  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = true;
        node.castShadow = true;
      }
    });

    if (materials.CAR_BODY_PAINT) {
      applyProps(materials.CAR_BODY_PAINT, {
        color: '#050816',
        roughness: 0.42,
        metalness: 0.82,
        envMapIntensity: 2.1,
      });
    }

    if (materials.MATT) {
      applyProps(materials.MATT, {
        color: '#0f172a',
        roughness: 0.52,
        metalness: 0.48,
        envMapIntensity: 1.6,
      });
    }

    if (materials.WINDOW_GLASS) {
      applyProps(materials.WINDOW_GLASS, {
        color: '#020617',
        roughness: 0,
        clearcoat: 0.12,
        opacity: 0.84,
        transparent: true,
      });
    }

    if (materials.LIGHT_GLASS) {
      applyProps(materials.LIGHT_GLASS, {
        color: '#e2e8f0',
        roughness: 0.02,
        clearcoat: 0.16,
      });
    }

    if (materials.LIGHTS_POD) {
      applyProps(materials.LIGHTS_POD, {
        roughness: 0,
        clearcoat: 0.12,
      });
    }

    if (materials.SHINY_METAL) {
      applyProps(materials.SHINY_METAL, {
        color: '#dbeafe',
        envMapIntensity: 4,
        roughness: 0.34,
        metalness: 1,
      });
    }

    if (materials.CALIPER) {
      applyProps(materials.CALIPER, {
        color: '#ef4444',
        envMapIntensity: 3.2,
        roughness: 0.45,
        metalness: 1,
      });
    }
  }, [materials, nodes]);

  return <primitive object={scene} {...props} />;
}

function CameraRig({ target = new THREE.Vector3() }) {
  return useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pointerX = state.pointer.x * 0.55;
    const pointerY = state.pointer.y * 0.28;

    state.camera.position.lerp(
      target.set(Math.sin(time / 2) * 1.2 + pointerX, pointerY, 12 + Math.cos(time / 5) / 2),
      0.05,
    );
    state.camera.lookAt(0, 0, 0);
  });
}

function Lightformers() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.z += delta * 10;
    if (groupRef.current.position.z > 20) {
      groupRef.current.position.z = -60;
    }
  });

  return (
    <>
      <Lightformer
        intensity={0.5}
        rotation-x={Math.PI / 2}
        position={[0, 5, -9]}
        scale={[10, 10, 1]}
      />

      <group rotation={[0, 0.5, 0]}>
        <group ref={groupRef}>
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, index) => (
            <Lightformer
              key={index}
              form="circle"
              intensity={2}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, 4, index * 4]}
              scale={[3, 1, 1]}
            />
          ))}
        </group>
      </group>

      <Lightformer
        intensity={4}
        rotation-y={Math.PI / 2}
        position={[-5, 1, -1]}
        scale={[20, 0.1, 1]}
      />
      <Lightformer
        rotation-y={Math.PI / 2}
        position={[-5, -1, -1]}
        scale={[20, 0.5, 1]}
      />
      <Lightformer
        rotation-y={-Math.PI / 2}
        position={[10, 1, 0]}
        scale={[20, 1, 1]}
      />
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer
          form="ring"
          color="#60a5fa"
          intensity={1}
          scale={10}
          position={[-15, 4, -18]}
          target={[0, 0, 0]}
        />
      </Float>
    </>
  );
}

export default function CarScene({ isDark = false }: CarSceneProps) {
  const [degraded, setDegraded] = useState(false);

  return (
    <Canvas shadows camera={{ position: [5, 0, 15], fov: 30 }} dpr={[1, 2]} gl={{ alpha: true }} style={{ background: 'transparent' }}>
      <Suspense fallback={null}>
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          castShadow
          intensity={2}
          shadow-bias={-0.0001}
        />
        <ambientLight intensity={0.5} />

        <MiniModel
          scale={2}
          position={[-0.14, -0.22, 1]}
          rotation={[0, -Math.PI / 4, 0]}
        />

        <AccumulativeShadows
          position={[0, -1.16, 0]}
          frames={degraded ? 18 : 50}
          alphaTest={0.9}
          scale={10}
          color={isDark ? '#020617' : '#0f172a'}
        >
          <RandomizedLight amount={8} radius={10} ambient={0.5} position={[1, 5, -1]} />
        </AccumulativeShadows>

        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <Environment frames={degraded ? 1 : Infinity} resolution={128} blur={1}>
          <Lightformers />
        </Environment>
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/mini.glb');
