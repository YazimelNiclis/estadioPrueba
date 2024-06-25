"use client";
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { OrbitControls, Plane, Edges, Line, Svg } from "@react-three/drei";
import * as THREE from "three";
import { Raycaster, Vector3 } from "three";

/**
 * @deprecated (to be deleted)
 */
//Deprecated component.

// Extender OrbitControls para que esté disponible en React Three Fiber
extend({ OrbitControls });

const Field: React.FC = () => {
  return (
    <>
      <Plane args={[500, 350]} rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <meshBasicMaterial attach="material" color={0x4caf50} />
      </Plane>
      <Line
        points={[
          [-230, 1, -150],
          [230, 1, -150],
          [230, 1, 150],
          [-230, 1, 150],
          [-230, 1, -150],
        ]}
        color="white"
      />
      <Line
        points={[
          [0, 1, -150],
          [0, 1, 150],
        ]}
        color="white"
      />
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0]}>
        <circleGeometry args={[50, 32]} />

        <Edges>
          <lineBasicMaterial attach="material" color="white" />
        </Edges>
        <Svg src="./olla.svg" position={[-514.5, 440, 0]} />
      </mesh>
    </>
  );
};

const Stands: React.FC = () => {
  return (
    <mesh rotation-x={80.1}>
      <ringGeometry args={[150, 80, 15, 40]} />
      <meshBasicMaterial
        attach="material"
        color={0xa9a9a9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Estadio: React.FC = () => {
  const { camera, gl, scene } = useThree();
  const controls = useRef<any>();
  const raycaster = useRef<Raycaster>(new Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useFrame(() => {
    controls.current.update();
  });

  return (
    <>
      <OrbitControls ref={controls} args={[camera, gl.domElement]} />
      <Field />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Canvas
      frameloop="demand"
      style={{ height: "100vh" }}
      camera={{ position: [0, 50, 100], fov: 75, far: 10000 }}
    >
      <Estadio />
    </Canvas>
  );
};

export default App;
