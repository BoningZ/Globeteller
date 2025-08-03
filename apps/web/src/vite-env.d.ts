/// <reference types="vite/client" />

// 添加 OrbitControls 类型声明
declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher } from 'three';
  
  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement);
    enableDamping: boolean;
    dampingFactor: number;
    screenSpacePanning: boolean;
    minDistance: number;
    maxDistance: number;
    enableZoom: boolean;
    enablePan: boolean;
    enableRotate: boolean;
    target: THREE.Vector3;
    update(): void;
  }
}
