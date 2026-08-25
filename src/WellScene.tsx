import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import type { Group } from 'three'

function Pumpjack() {
  const machine = useRef<Group>(null)
  const beam = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!machine.current || !beam.current) return
    machine.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.08 - 0.28
    beam.current.rotation.z = Math.sin(clock.elapsedTime * 0.72) * 0.075 - 0.06
  })
  const graphite = '#253029', green = '#63ad2f'
  return <group ref={machine} position={[0, -1.25, 0]} scale={1.15}>
    <mesh position={[0, -0.12, 0]} receiveShadow><cylinderGeometry args={[2.15, 2.15, 0.04, 48]} /><meshStandardMaterial color="#dfe7dc" roughness={0.9} /></mesh>
    <group position={[0.2, 0.15, 0]}>
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, -0.16]} castShadow><boxGeometry args={[0.18, 2.35, 0.2]} /><meshStandardMaterial color={graphite} metalness={0.55} roughness={0.35} /></mesh>
      <mesh position={[0.65, 1.1, 0]} rotation={[0, 0, 0.16]} castShadow><boxGeometry args={[0.18, 2.35, 0.2]} /><meshStandardMaterial color={graphite} metalness={0.55} roughness={0.35} /></mesh>
      <mesh position={[0.33, 2.1, 0]} castShadow><boxGeometry args={[0.95, 0.17, 0.26]} /><meshStandardMaterial color={green} metalness={0.25} /></mesh>
      <group ref={beam} position={[0.3, 2.25, 0]}>
        <mesh position={[-0.55, 0, 0]} castShadow><boxGeometry args={[3.1, 0.2, 0.26]} /><meshStandardMaterial color={graphite} metalness={0.55} roughness={0.3} /></mesh>
        <mesh position={[-2.1, -0.18, 0]} castShadow><boxGeometry args={[0.38, 0.74, 0.34]} /><meshStandardMaterial color={green} metalness={0.35} /></mesh>
        <mesh position={[-2.1, -1.35, 0]} castShadow><cylinderGeometry args={[0.025, 0.025, 2.1, 12]} /><meshStandardMaterial color={green} emissive={green} emissiveIntensity={0.25} /></mesh>
      </group>
      <mesh position={[1.2, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.56, 0.56, 0.3, 28]} /><meshStandardMaterial color="#7f8d83" metalness={0.7} roughness={0.28} /></mesh>
      <mesh position={[1.2, 0.48, -0.18]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.04, 24]} /><meshStandardMaterial color={green} /></mesh>
    </group>
    <mesh position={[-1.9, 0.17, 0]} castShadow><cylinderGeometry args={[0.14, 0.22, 0.65, 18]} /><meshStandardMaterial color={graphite} metalness={0.65} /></mesh>
    <mesh position={[-1.9, 0.52, 0]} castShadow><torusGeometry args={[0.26, 0.055, 10, 28]} /><meshStandardMaterial color={green} metalness={0.3} /></mesh>
  </group>
}

export default function WellScene() {
  return <Canvas camera={{ position: [5.2, 3.6, 6.2], fov: 38 }} shadows dpr={[1, 1.35]}>
    <color attach="background" args={['#eef3eb']} /><fog attach="fog" args={['#eef3eb', 8, 14]} />
    <ambientLight intensity={1.8} /><directionalLight position={[3, 7, 5]} intensity={3.5} castShadow /><pointLight position={[-4, 2, -2]} color="#7fca4f" intensity={4} />
    <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.12}><Pumpjack /></Float>
    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2.1} />
  </Canvas>
}
