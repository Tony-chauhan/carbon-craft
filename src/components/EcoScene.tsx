import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sparkles, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useCarbonStore } from '../store/useCarbonStore';

function Island({ scoreLevel }: { scoreLevel: 'low' | 'medium' | 'high' }) {
  const groupRef = useRef<THREE.Group>(null);
  const [materials] = useState(() => ({
    base: new THREE.MeshStandardMaterial({ color: '#10b981', roughness: 0.8 }),
    leaves: new THREE.MeshStandardMaterial({ color: '#059669', roughness: 0.9 })
  }));

  const targetColors = useMemo(() => {
    return { base: new THREE.Color('#000000'), leaves: new THREE.Color('#000000') };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y += 0.002;
    }
    // Smoothly interpolate colors
    materials.base.color.lerp(targetColors.base, delta * 2);
    materials.leaves.color.lerp(targetColors.leaves, delta * 2);
  });

  return (
    <group ref={groupRef}>
      {/* Island Base */}
      <mesh receiveShadow position={[0, -1, 0]} material={materials.base}>
        <cylinderGeometry args={[3.5, 2.5, 2, 8]} />
      </mesh>
      
      {/* Trees / Structures */}
      <mesh castShadow position={[-1, 0.5, -1]} material={materials.leaves}>
        <coneGeometry args={[0.5, 2, 5]} />
      </mesh>
      <mesh castShadow position={[1.5, 0.2, -0.5]} material={materials.leaves}>
        <coneGeometry args={[0.6, 1.8, 6]} />
      </mesh>
      
      {/* Windmill for low/medium */}
      {(scoreLevel === 'low' || scoreLevel === 'medium') && (
        <group position={[-1.5, 1, 1.5]}>
          <mesh castShadow position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.05, 0.1, 2]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <WindmillBlades speed={scoreLevel === 'low' ? 0.04 : 0.015} />
        </group>
      )}

      {/* Factory for high */}
      {scoreLevel === 'high' && (
        <group position={[-1.5, 0.5, 1.5]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 1, 1.2]} />
            <meshStandardMaterial color="#292524" />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 1]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function WindmillBlades({ speed }: { speed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.z += speed;
  });
  return (
    <group ref={ref} position={[0, 0.5, 0.1]}>
      <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.08, 0.8, 0.02]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      <mesh position={[0, -0.4, 0]}><boxGeometry args={[0.08, 0.8, 0.02]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI/2]}><boxGeometry args={[0.08, 0.8, 0.02]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI/2]}><boxGeometry args={[0.08, 0.8, 0.02]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
    </group>
  );
}

function SceneLighting() {
  const targetBg = useMemo(() => {
    return new THREE.Color('#1c1c1e'); // Dark grayish
  }, []);

  useFrame((state, delta) => {
    (state.scene.background as THREE.Color)?.lerp(targetBg, delta * 1.5);
    if (state.scene.fog) {
      (state.scene.fog as THREE.Fog).color.lerp(targetBg, delta * 1.5);
    }
  });

  return (
    <>
      <color attach="background" args={['#1c1c1e']} />
      <fog attach="fog" args={['#1c1c1e', 5, 20]} />
      <ambientLight intensity={1.5} />
      <directionalLight 
        castShadow 
        position={[5, 10, 5]} 
        intensity={2.0}
        color={'#ffffff'}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 2, -5]} intensity={1.0} color="#32d74b" />
    </>
  );
}

export function EcoScene() {
  const { score, simulationScore, isSimulationMode } = useCarbonStore();
  const activeScore = isSimulationMode ? simulationScore : score;
  
  const scoreLevel = useMemo(() => {
    if (!activeScore) return 'medium';
    if (activeScore.total < 4000) return 'low';
    if (activeScore.total < 8000) return 'medium';
    return 'high';
  }, [activeScore]);

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [6, 5, 10], fov: 40 }} gl={{ antialias: false }}>
        <SceneLighting />
        
        <Island scoreLevel={scoreLevel} />
        
        {scoreLevel === 'low' && <Sparkles count={150} scale={12} size={3} speed={0.4} color="#32d74b" opacity={0.6} />}
        {scoreLevel === 'high' && <Cloud position={[-1.5, 3, 1.5]} opacity={0.6} color="#44403c" speed={0.2} />}
        
        <Environment preset="city" />

        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={15}
          maxPolarAngle={Math.PI / 2 + 0.1}
          autoRotate={false}
        />

        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
