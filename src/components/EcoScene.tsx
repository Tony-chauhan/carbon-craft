/**
 * @file EcoScene.tsx
 * @description Immersive Three.js 3D ecosystem built with React Three Fiber.
 * Visually reflects the user's carbon footprint state (low, medium, high) in real time.
 */

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sparkles, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useCarbonStore } from '../store/useCarbonStore';

interface IslandProps {
  scoreLevel: 'low' | 'medium' | 'high';
}

/**
 * Renders the 3D Island representing the environment.
 * Interpolates grass and leaf colors dynamically based on the current footprint level.
 */
function Island({ scoreLevel }: IslandProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Keep material references persistent across renders
  const [materials] = useState(() => ({
    base: new THREE.MeshStandardMaterial({ color: '#10b981', roughness: 0.8 }),
    leaves: new THREE.MeshStandardMaterial({ color: '#059669', roughness: 0.9 })
  }));

  // Define target colors corresponding to environmental states
  const targetColors = useMemo(() => {
    if (scoreLevel === 'low') {
      return { 
        base: new THREE.Color('#10b981'), // Vibrant Emerald Green (Healthy)
        leaves: new THREE.Color('#047857') // Rich Forest Green
      };
    }
    if (scoreLevel === 'medium') {
      return { 
        base: new THREE.Color('#84cc16'), // Transitional Lime Green (Mixed)
        leaves: new THREE.Color('#eab308') // Autumn Golden Yellow
      };
    }
    // High Footprint (Polluted / Stressed)
    return { 
      base: new THREE.Color('#78716c'), // Stressed Stone Gray
      leaves: new THREE.Color('#44403c') // Polluted Charcoal Gray
    };
  }, [scoreLevel]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y += 0.002;
    }
    // Smoothly interpolate material colors towards the active targets
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

/**
 * Renders windmill blades that rotate at a speed corresponding to the footprint score.
 */
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

interface SceneLightingProps {
  scoreLevel: 'low' | 'medium' | 'high';
}

/**
 * Manages reactive scene lighting and background/fog transitions.
 * Lerps background colors and light intensities for dynamic day/twilight/smog effects.
 */
function SceneLighting({ scoreLevel }: SceneLightingProps) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  // Background and fog target color
  const targetBg = useMemo(() => {
    if (scoreLevel === 'low') return new THREE.Color('#072418'); // Emerald black forest
    if (scoreLevel === 'medium') return new THREE.Color('#0f172a'); // Midnight twilight blue
    return new THREE.Color('#1c1917'); // Industrial dusty gray
  }, [scoreLevel]);

  // Lighting intensity targets
  const targetLight = useMemo(() => {
    if (scoreLevel === 'low') {
      return { color: new THREE.Color('#ffffff'), intensity: 2.2, ambient: 1.5 };
    }
    if (scoreLevel === 'medium') {
      return { color: new THREE.Color('#ffedd5'), intensity: 1.8, ambient: 1.2 }; // Warm twilight orange tint
    }
    return { color: new THREE.Color('#a8a29e'), intensity: 1.0, ambient: 0.8 }; // Faint polluted lighting
  }, [scoreLevel]);

  useFrame((state, delta) => {
    // Lerp background sky and fog color
    (state.scene.background as THREE.Color)?.lerp(targetBg, delta * 1.5);
    if (state.scene.fog) {
      (state.scene.fog as THREE.Fog).color.lerp(targetBg, delta * 1.5);
    }

    // Lerp directional and ambient lights
    if (lightRef.current) {
      lightRef.current.color.lerp(targetLight.color, delta * 2);
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetLight.intensity, delta * 2);
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, targetLight.ambient, delta * 2);
    }
  });

  return (
    <>
      <color attach="background" args={['#1c1c1e']} />
      <fog attach="fog" args={['#1c1c1e', 5, 20]} />
      <ambientLight ref={ambientRef} intensity={1.5} />
      <directionalLight 
        ref={lightRef}
        castShadow 
        position={[5, 10, 5]} 
        intensity={2.0}
        color={'#ffffff'}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight 
        position={[-5, 2, -5]} 
        intensity={1.0} 
        color={scoreLevel === 'low' ? '#10b981' : scoreLevel === 'medium' ? '#f59e0b' : '#ef4444'} 
      />
    </>
  );
}

/**
 * The main 3D EcoScene component.
 * Integrates Canvas, OrbitControls, environment shaders, post-processing Bloom, and animations.
 */
export function EcoScene() {
  const { score, simulationScore, isSimulationMode } = useCarbonStore();
  const activeScore = isSimulationMode ? simulationScore : score;
  
  const scoreLevel = useMemo(() => {
    if (!activeScore) return 'medium';
    if (activeScore.total < 4000) return 'low';
    if (activeScore.total < 8000) return 'medium';
    return 'high';
  }, [activeScore]);

  // Respect prefers-reduced-motion in JavaScript
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [6, 5, 10], fov: 40 }} gl={{ antialias: false }}>
        <SceneLighting scoreLevel={scoreLevel} />
        
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
          autoRotate={!prefersReducedMotion} // Only auto-rotate if reduced motion is not preferred
        />

        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
