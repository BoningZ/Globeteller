import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// 内联类型定义
interface ParsedTrip {
  title: string;
  language?: string;
  segments: Array<{
    coordinates: [number, number][];
    time: string;
    transport?: 'train' | 'plane' | 'car' | 'walk';
    photo?: string;
    note?: string;
  }>;
  totalDuration: number;
  startTime: Date;
  endTime: Date;
}

interface SphereGlobeProps {
  trip: ParsedTrip | null;
  currentTime: number;
}

export function SphereGlobe({ trip, currentTime }: SphereGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const lineRef = useRef<THREE.Line | null>(null);

  // 初始化 Three.js 场景
  useEffect(() => {
    if (!mountRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 创建 OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controlsRef.current = controls;

    // 创建地球几何体
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // 创建地球材质（使用本地 JPG 纹理）
    const textureLoader = new THREE.TextureLoader();
    
    // 使用本地 JPG 地球纹理，带错误处理
    // 如果本地文件不存在，会自动使用在线版本作为备用
    const earthTexture = textureLoader.load(
      '/textures/earth-texture.jpg',
      undefined, // onLoad
      undefined, // onProgress
      () => {
        // onError - 纹理加载失败时使用在线版本
        console.log('本地纹理加载失败，使用在线版本');
        textureLoader.load(
          'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg',
          (texture) => {
            material.map = texture;
            material.needsUpdate = true;
          },
          undefined,
          () => {
            // 如果在线版本也失败，使用纯色
            console.log('在线纹理也失败，使用纯色');
            material.map = null;
            material.color.setHex(0x4A90E2);
          }
        );
      }
    );
    
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      transparent: true,
      opacity: 0.9,
    });

    // 创建地球网格
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    earthRef.current = earth;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // 添加方向光（模拟太阳光）
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // 添加星空背景
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 渲染循环
    const animate = () => {
      requestAnimationFrame(animate);

      // 更新 OrbitControls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // 缓慢旋转地球
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.005;
      }

      // 旋转星空
      stars.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // 清理函数
    return () => {
      const currentMount = mountRef.current;
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 更新轨迹线和设置初始视角
  useEffect(() => {
    if (!sceneRef.current || !trip || trip.segments.length === 0) return;

    // 移除旧的轨迹线
    if (lineRef.current) {
      sceneRef.current.remove(lineRef.current);
    }

    // 创建新的弧形轨迹线
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xff6b6b, 
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });

    const curvePoints: THREE.Vector3[] = [];

    trip.segments.forEach((segment) => {
      const coordinates = segment.coordinates;
      
      for (let i = 0; i < coordinates.length - 1; i++) {
        const currentCoord = coordinates[i];
        const nextCoord = coordinates[i + 1];
        
        const [currentLon, currentLat] = currentCoord;
        const [nextLon, nextLat] = nextCoord;
        
        // 计算当前点和下一点的 3D 坐标
        const currentPhi = (90 - currentLat) * (Math.PI / 180);
        const currentTheta = (currentLon + 180) * (Math.PI / 180);
        const nextPhi = (90 - nextLat) * (Math.PI / 180);
        const nextTheta = (nextLon + 180) * (Math.PI / 180);
        
        const currentX = -(1.0 * Math.sin(currentPhi) * Math.cos(currentTheta));
        const currentZ = (1.0 * Math.sin(currentPhi) * Math.sin(currentTheta));
        const currentY = (1.0 * Math.cos(currentPhi));
        
        const nextX = -(1.0 * Math.sin(nextPhi) * Math.cos(nextTheta));
        const nextZ = (1.0 * Math.sin(nextPhi) * Math.sin(nextTheta));
        const nextY = (1.0 * Math.cos(nextPhi));
        
        const startPoint = new THREE.Vector3(currentX, currentY, currentZ);
        const endPoint = new THREE.Vector3(nextX, nextY, nextZ);
        
        // 计算两点之间的距离，决定弧形段数
        const distance = startPoint.distanceTo(endPoint);
        const segments = Math.max(15, Math.floor(distance * 30));
        
        // 创建弧形路径
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          
          // 使用球面插值创建弧形
          const startVector = startPoint.clone().normalize();
          const endVector = endPoint.clone().normalize();
          
          // 计算球面插值
          const dot = startVector.dot(endVector);
          const theta = Math.acos(Math.max(-1, Math.min(1, dot)));
          
          if (theta > 0.0001) {
            const sinTheta = Math.sin(theta);
            const w1 = Math.sin((1 - t) * theta) / sinTheta;
            const w2 = Math.sin(t * theta) / sinTheta;
            
            // 增加弧度：让路径稍微向外凸出
            const arcHeight = 0.05; // 弧度高度，更自然
            const arcT = Math.sin(t * Math.PI); // 使用正弦函数创建弧形
            
            const interpolated = new THREE.Vector3()
              .addScaledVector(startVector, w1)
              .addScaledVector(endVector, w2)
              .normalize()
              .multiplyScalar(1.0 + arcHeight * arcT); // 动态调整半径创建弧形
            
            curvePoints.push(interpolated);
          } else {
            curvePoints.push(startPoint.clone().lerp(endPoint, t));
          }
        }
      }
    });

    lineGeometry.setFromPoints(curvePoints);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    sceneRef.current.add(line);
    lineRef.current = line;

    // 设置初始视角，让球心在屏幕中心，相机朝向出发点
    if (trip.segments.length > 0 && trip.segments[0].coordinates.length > 0) {
      const startCoord = trip.segments[0].coordinates[0];
      const [startLon, startLat] = startCoord;
      
      // 计算出发点的 3D 坐标
      const phi = (90 - startLat) * (Math.PI / 180);
      const theta = (startLon + 180) * (Math.PI / 180);
      
      const startX = -(1.1 * Math.sin(phi) * Math.cos(theta));
      const startZ = (1.1 * Math.sin(phi) * Math.sin(theta));
      const startY = (1.1 * Math.cos(phi));
      
      // 设置相机位置，让球心在屏幕中心，相机朝向出发点
      if (cameraRef.current && controlsRef.current) {
        // 计算从球心到出发点的方向向量
        const direction = new THREE.Vector3(startX, startY, startZ).normalize();
        
        // 设置相机位置在球心前方，朝向出发点
        cameraRef.current.position.copy(direction.multiplyScalar(3));
        
        // 让相机看向球心
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  }, [trip]);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {trip && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '14px',
          zIndex: '10'
        }}>
          <div>📍 {trip.title}</div>
          <div>⏱️ {new Date(currentTime).toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
} 