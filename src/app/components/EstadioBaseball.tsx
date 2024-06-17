"use client";
import React, { Component } from "react";
import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  Object3D,
  Object3DEventMap,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

class EstadioBaseball extends Component {
  private camera: PerspectiveCamera | undefined;
  private scene: Scene | undefined;
  private renderer: WebGLRenderer | undefined;
  private controls: OrbitControls | undefined;
  private containerRef: React.RefObject<HTMLDivElement> | undefined;

  constructor(props: {}) {
    super(props);
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.init();
  }

  componentDidMount() {
    this.init();
    window.addEventListener("resize", this.onWindowResize);
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    this.controls?.dispose();
  }

  init() {
    if (typeof window === "undefined") {
      return;
    }

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(50, aspect, 1, 1000);
    this.camera.position.z = -200;
    this.camera.position.y = 200;

    this.scene = new Scene();
    this.scene.background = new Color("#191919");

    const light = new AmbientLight(0xffffff, 1);
    this.scene.add(light);

    const loader = new GLTFLoader();
    loader.load(
      "./stadium.gltf",
      (gltf: { scene: Object3D<Object3DEventMap> }) => {
        this.scene?.add(gltf.scene);
      },
      undefined,
      (error: any) => {
        console.error("An error happened", error);
      }
    );

    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    if (this.containerRef?.current) {
      this.containerRef.current.appendChild(this.renderer.domElement);
    }
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer?.render(this.scene!, this.camera!);
  }

  onWindowResize() {
    this.camera!.aspect = window.innerWidth / window.innerHeight;
    this.camera?.updateProjectionMatrix();

    this.renderer?.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    return <div ref={this.containerRef} />;
  }
}

export default EstadioBaseball;
