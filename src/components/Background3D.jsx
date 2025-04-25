import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count = 2000 }) {
  const points = useRef();
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      // Create a spiral pattern
      const theta = THREE.MathUtils.randFloatSpread(360);
      const r = THREE.MathUtils.randFloat(5, 20);
      
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(20);
      positions[i * 3 + 2] = r * Math.sin(theta);

      // Gradient colors from olive green to darker shades
      const mixAmount = Math.random();
      color.setHSL(0.23, 0.6, 0.3 + mixAmount * 0.2);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * 0.05;
    points.current.rotation.z = time * 0.03;
    
    // Breathing effect
    points.current.scale.x = 1 + Math.sin(time * 0.3) * 0.1;
    points.current.scale.y = 1 + Math.sin(time * 0.3) * 0.1;
    points.current.scale.z = 1 + Math.sin(time * 0.3) * 0.1;
  });

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlePositions.positions.length / 3}
          array={particlePositions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlePositions.colors.length / 3}
          array={particlePositions.colors}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
}

function MovingLights() {
  const light1 = useRef();
  const light2 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    light1.current.position.x = Math.sin(time * 0.2) * 20;
    light1.current.position.z = Math.cos(time * 0.2) * 20;
    
    light2.current.position.x = Math.sin(time * 0.2 + Math.PI) * 20;
    light2.current.position.z = Math.cos(time * 0.2 + Math.PI) * 20;
  });

  return (
    <>
      <pointLight
        ref={light1}
        color="#90A959"
        intensity={2}
        distance={50}
        decay={2}
      />
      <pointLight
        ref={light2}
        color="#556B2F"
        intensity={2}
        distance={50}
        decay={2}
      />
    </>
  );
}

export default function Background3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        style={{ background: 'radial-gradient(circle at 50% 50%, #0A0A0A 0%, #000000 100%)' }}
      >
        <fog attach="fog" args={['#000000', 20, 50]} />
        <MovingLights />
        <ParticleField />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
} 