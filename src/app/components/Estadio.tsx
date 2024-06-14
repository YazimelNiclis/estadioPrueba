"use client";
import React, { useRef, useEffect, EventHandler } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const Estadio: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    //camara
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 50, 100);

    //renderizado
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Control de órbita para mover la cámara
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Crear el campo de fútbol
    const fieldGeometry = new THREE.PlaneGeometry(120, 80);
    const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0x4caf50 });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    scene.add(field);

    // Líneas del campo
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lines = [];

    // Líneas exteriores
    lines.push(new THREE.Vector3(-55, 1, -35));
    lines.push(new THREE.Vector3(55, 1, -35));
    lines.push(new THREE.Vector3(55, 1, 35));
    lines.push(new THREE.Vector3(-55, 1, 35));
    lines.push(new THREE.Vector3(-55, 1, -35));

    // Crear y añadir las líneas al campo
    const fieldLineGeometry = new THREE.BufferGeometry().setFromPoints(lines);

    const fieldLine = new THREE.Line(fieldLineGeometry, lineMaterial);
    scene.add(fieldLine);

    // Línea media
    const lines2 = [];
    lines2.push(new THREE.Vector3(0, 1, -35));
    lines2.push(new THREE.Vector3(0, 1, 35));
    const fieldLineGeometry2 = new THREE.BufferGeometry().setFromPoints(lines2);
    const fieldLine2 = new THREE.Line(fieldLineGeometry2, lineMaterial);
    scene.add(fieldLine2);

    // Círculo central
    const centerCircleGeometry = new THREE.CircleGeometry(10, 32);
    const edges = new THREE.EdgesGeometry(centerCircleGeometry);
    const centerCircleEdges = new THREE.LineSegments(edges, lineMaterial);
    centerCircleEdges.rotation.x = Math.PI / 2;
    centerCircleEdges.translateZ(-1);
    scene.add(centerCircleEdges);

    // Crear las gradas
    const geometry = new THREE.RingGeometry(150, 80, 15, 40);
    geometry.rotateX(80.1);

    const material = new THREE.MeshBasicMaterial({
      color: 0xa9a9a9,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Raycaster y vector para detectar clics
    // Raycaster permite detectar 'rayos' que atraviesan la escena de THREE
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Función para manejar clics
    const onEstadioClick = (event: MouseEvent) => {
      // Adaptar coordenadas del mouse
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Usar el raycaster para encontrar objetos interceptados
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(field);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const clickedPoint = intersect.point;

        // Determinar la mitad del campo que fue clicada
        if (clickedPoint.x < 0) {
          zoomToPosition(new THREE.Vector3(-30, 30, 0));
        } else {
          zoomToPosition(new THREE.Vector3(30, 30, 0));
        }
      }
    };

    // Función para hacer zoom a una posición específica
    const zoomToPosition = (targetPosition: any) => {
      const startPosition = camera.position.clone();
      const startLookAt = controls.target.clone();
      const targetLookAt = new THREE.Vector3(0, 0, 0);

      let progress = 0;
      const duration = 1000; // Duración en ms

      function animateZoom() {
        progress += 16 / duration; // Incremento de progreso basado en un cuadro de 16ms (aproximadamente 60fps)

        if (progress >= 1) {
          progress = 1;
        }

        camera.position.lerpVectors(startPosition, targetPosition, progress);
        controls.target.lerpVectors(startLookAt, targetLookAt, progress);
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        }
      }

      requestAnimationFrame(animateZoom);
    };

    //carga todo y renderiza
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("click", onEstadioClick);
    window.addEventListener("resize", zoomToPosition);

    return () => {
      window.removeEventListener("click", onEstadioClick);
      window.removeEventListener("resize", zoomToPosition);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default Estadio;
