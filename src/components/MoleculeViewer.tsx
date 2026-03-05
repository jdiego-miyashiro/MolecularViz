import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MoleculeData, ELEMENT_COLORS, ELEMENT_RADII } from '../constants';

interface MoleculeViewerProps {
  data: MoleculeData;
}

function AtomMesh({ atom }: { atom: MoleculeData['atoms'][0] }) {
  const color = ELEMENT_COLORS[atom.element] || ELEMENT_COLORS.DEFAULT;
  // Scale radius down slightly for visual clarity
  const radius = (ELEMENT_RADII[atom.element] || ELEMENT_RADII.DEFAULT) * 0.4; 

  return (
    <mesh position={[atom.x, atom.y, atom.z]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

function BondMesh({ bond }: { bond: MoleculeData['bonds'][0] }) {
  const start = new THREE.Vector3(bond.source.x, bond.source.y, bond.source.z);
  const end = new THREE.Vector3(bond.target.x, bond.target.y, bond.target.z);
  
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  
  // Midpoint
  const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  // Orientation
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.1, 0.1, length, 16]} />
      <meshStandardMaterial color="#D1D5DB" roughness={0.5} />
    </mesh>
  );
}

export default function MoleculeViewer({ data }: MoleculeViewerProps) {
  return (
    <div className="w-full h-full bg-stone-900 rounded-xl overflow-hidden shadow-2xl border border-stone-700 relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white">
        <div className="text-xs font-mono text-stone-400 uppercase tracking-widest mb-1">Molecule Stats</div>
        <div className="flex gap-4">
          <div>
            <span className="text-xl font-bold font-sans">{data.atoms.length}</span>
            <span className="text-xs text-stone-400 ml-1">ATOMS</span>
          </div>
          <div>
            <span className="text-xl font-bold font-sans">{data.bonds.length}</span>
            <span className="text-xs text-stone-400 ml-1">BONDS</span>
          </div>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} shadows dpr={[1, 2]}>
        <Stage environment="city" intensity={0.6} adjustCamera>
          <group>
            {data.atoms.map((atom) => (
              <AtomMesh key={`atom-${atom.id}`} atom={atom} />
            ))}
            {data.bonds.map((bond, i) => (
              <BondMesh key={`bond-${i}`} bond={bond} />
            ))}
          </group>
        </Stage>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
