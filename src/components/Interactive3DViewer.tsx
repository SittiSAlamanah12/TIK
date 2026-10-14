import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Server,
  Shield,
  Box,
  Volume2
} from 'lucide-react';
import { sound } from '../utils/sound';

export interface PartInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string;
  color: string;
}

interface Interactive3DViewerProps {
  modelType: 'hardware' | 'network' | 'cyber';
  grade: '10' | '11' | '12';
  onSelectPart?: (part: PartInfo | null) => void;
  selectedPartId?: string | null;
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({
  modelType,
  grade,
  onSelectPart,
  selectedPartId,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explodeFactor, setExplodeFactor] = useState<number>(30); // 0% to 100%
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
  const [activePart, setActivePart] = useState<PartInfo | null>(null);
  const [hoveredPartName, setHoveredPartName] = useState<string | null>(null);

  // References for Three.js render loop & scene objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const partsGroupRef = useRef<Map<string, { group: THREE.Group; basePos: THREE.Vector3; explodeDir: THREE.Vector3; materials: THREE.Material[] }>>(new Map());

  // Parts dictionary per model
  const partsCatalog: Record<string, PartInfo[]> = useMemo(() => ({
    hardware: [
      {
        id: 'pcb',
        name: 'Motherboard PCB & Power VRM',
        category: 'Mainboard Subsystem',
        description: 'Papan sirkuit cetak multi-layer dengan jalur tembaga (traces) konduktif untuk mentransfer sinyal data biner antar komponen dengan latensi nanodetik.',
        specs: 'ATX Form Factor · 12+2 Phase Digital VRM · High-Density Glass Fabric',
        color: '#06b6d4',
      },
      {
        id: 'cpu',
        name: 'Prosesor Sentral (CPU) & Socket LGA',
        category: 'Processing Unit',
        description: 'Otak komputasi sistem berarsitektur hybrid multi-core dengan jutaan transistor yang menjalankan instruksi aritmatika dan logika program.',
        specs: 'Socket LGA 1700 · 16 Cores / 24 Threads · Clock Turbo 5.4 GHz',
        color: '#38bdf8',
      },
      {
        id: 'cooler',
        name: 'Heatsink Pendingin & Heatpipe Tembaga',
        category: 'Thermal Solution',
        description: 'Sirip aluminium berlapis dengan 6 heatpipe tembaga sinter untuk membuang panas termal dari IHS prosesor secara efisien.',
        specs: 'TDP Dissipation 220W · Direct Contact Copper Base · PWM Fan Sync',
        color: '#f59e0b',
      },
      {
        id: 'ram',
        name: 'Dual-Channel DDR5 RAM Modules (2x32GB)',
        category: 'Volatile Memory',
        description: 'Memori kerja utama super cepat dengan On-Die ECC terintegrasi dan modul manajemen daya PMIC mandiri.',
        specs: 'DDR5-6000 MT/s · CL30 Latency · 64GB Dual Kit · ARGB Heatsink',
        color: '#ec4899',
      },
      {
        id: 'gpu',
        name: 'Kartu Grafis PCIe 5.0 x16 (GPU)',
        category: 'Graphics / Acceleration',
        description: 'Akselerator pemrosesan paralel masif untuk rendering 3D, kalkulasi grafis komputer, dan akselerasi kecerdasan buatan.',
        specs: 'PCIe 5.0 128 GB/s Bandwidth · 16GB GDDR6X · Dual Fan Armor',
        color: '#8b5cf6',
      },
      {
        id: 'ssd',
        name: 'M.2 NVMe SSD Gen 4x4 (2TB)',
        category: 'High-Speed Storage',
        description: 'Media penyimpanan solid state berkecepatan tinggi tanpa komponen bergerak mekanik, langsung terhubung ke bus PCIe prosesor.',
        specs: 'Sequential Read 7400 MB/s · Write 6800 MB/s · 3D TLC NAND',
        color: '#10b981',
      },
    ],
    network: [
      {
        id: 'rack',
        name: 'Rangka Server Rack 42U Data Center',
        category: 'Network Enclosure',
        description: 'Struktur penopang perangkat keras enterprise dengan sistem pembumian anti-statis dan manajemen aliran sirkulasi udara dingin.',
        specs: 'Standard 19-inch EIA-310 · Heavy-Duty Steel · Smart Cable Channels',
        color: '#06b6d4',
      },
      {
        id: 'server',
        name: 'Blade Server 2U Dual Xeon Enterprise',
        category: 'Core Compute Node',
        description: 'Komputer server multi-prosesor untuk menjalankan layanan web sekolah, cloud database, dan Active Directory autentikasi siswa.',
        specs: 'Dual Intel Xeon Scalable · 256GB ECC RAM · Hot-Swap U.2 NVMe',
        color: '#38bdf8',
      },
      {
        id: 'router',
        name: 'Enterprise Multi-WAN Gateway Router',
        category: 'Layer 3 OSI Gateway',
        description: 'Pengatur rute paket data antara jaringan LAN internal sekolah dengan ISP Internet global menggunakan protokol BGP/OSPF.',
        specs: 'Throughput 10 Gbps · 4x SFP+ Fiber WAN · Hardware NAT Engine',
        color: '#f59e0b',
      },
      {
        id: 'firewall',
        name: 'Next-Gen Hardware Firewall (NGFW)',
        category: 'Perimeter Defense',
        description: 'Inspektur paket data mendalam (DPI) untuk mencegah serangan siber, penyusupan jaringan (IPS), dan pemfilteran konten berbahaya.',
        specs: 'Deep Packet Inspection 8.5 Gbps · Zero-Day Threat Sandboxing',
        color: '#f43f5e',
      },
      {
        id: 'switch',
        name: '48-Port Gigabit PoE+ Managed Switch',
        category: 'Layer 2 OSI Distribution',
        description: 'Mendistribusikan frame data berdasarkan MAC Address ke setiap komputer PC di laboratorium TIK dengan daya PoE terintegrasi.',
        specs: '48x 1GbE RJ45 PoE+ · 4x 10GbE Uplink · VLAN 802.1Q Support',
        color: '#10b981',
      },
      {
        id: 'cables',
        name: 'Patch Panel & Kabel Fiber Optic Patch',
        category: 'Physical Layer Cabling',
        description: 'Kabel transmisi pulsa cahaya berkecepatan tinggi tanpa interferensi elektromagnetik untuk backbone jaringan sekolah.',
        specs: 'Single-Mode LC-LC Duplex · Cat6A 10GbE Shielded Twisted Pair',
        color: '#a855f7',
      },
    ],
    cyber: [
      {
        id: 'vault',
        name: 'Encrypted Database Core Vault',
        category: 'Data Persistence',
        description: 'Pusat penyimpanan basis data yang dilindungi enkripsi AES-256 tingkat militer di tingkat penyimpanan (Encryption at Rest).',
        specs: 'AES-256-GCM · Multi-Region Active Replication · SHA-512 Hash Check',
        color: '#06b6d4',
      },
      {
        id: 'shield',
        name: 'Hexagonal Hologram Firewall Shield',
        category: 'Active Perimeter',
        description: 'Lapisan filter perimeter siber yang memblokir serangan Distributed Denial of Service (DDoS) dan injeksi SQL secara real-time.',
        specs: 'WAF Rule Sets · Real-time Rate Limiting · TLS 1.3 Strict Handshake',
        color: '#ec4899',
      },
      {
        id: 'mesh',
        name: 'Distributed Cloud Mesh Nodes',
        category: 'Cloud Architecture',
        description: 'Jaringan komputasi terdistribusi yang membagi beban kerja komputasi secara redundan tanpa single point of failure.',
        specs: 'Kubernetes Cluster · Microservices Architecture · 99.999% SLA',
        color: '#8b5cf6',
      },
      {
        id: 'keys',
        name: 'Cryptographic Key Shards (HSM)',
        category: 'Key Management',
        description: 'Pecahan kunci asimetris RSA/ECC yang disimpan di Hardware Security Module untuk memverifikasi tanda tangan digital berkas tugas.',
        specs: 'FIPS 140-3 Level 4 · Curve25519 Elliptic Curve · Zero-Knowledge Proofs',
        color: '#10b981',
      },
    ],
  }), []);

  const currentParts = partsCatalog[modelType] || partsCatalog.hardware;

  // Sync active part from props if provided
  useEffect(() => {
    if (selectedPartId) {
      const found = currentParts.find((p) => p.id === selectedPartId);
      if (found) {
        setActivePart(found);
      }
    }
  }, [selectedPartId, currentParts]);

  // Main Three.js Scene Setup & Life-cycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#05070e');

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(12, 10, 15);
    cameraRef.current = camera;

    // 3. Renderer with PBR settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.2);
    keyLight.position.set(10, 15, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 1.8);
    fillLight.position.set(-12, 8, -8);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 3, 25);
    rimLight.position.set(0, -6, 0);
    scene.add(rimLight);

    // 6. Ground Cyberpunk Grid Contact Plate
    const gridHelper = new THREE.GridHelper(30, 30, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -3.5;
    scene.add(gridHelper);

    // Soft Radial Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
      grad.addColorStop(0.5, 'rgba(2, 6, 23, 0.7)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.48;
    scene.add(shadowMesh);

    // 7. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 35;
    controls.minDistance = 4;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // allow full 360 degree horizontal and pleasant vertical
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 8. Build Procedural 3D Model with Explodable Groups
    partsGroupRef.current.clear();
    const rootModelGroup = new THREE.Group();
    rootModelGroup.name = 'rootModelGroup';
    scene.add(rootModelGroup);

    // Helper to register parts
    const registerPart = (id: string, group: THREE.Group, basePos: THREE.Vector3, explodeDir: THREE.Vector3) => {
      group.position.copy(basePos);
      rootModelGroup.add(group);
      
      const materials: THREE.Material[] = [];
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData = { partId: id };
          if (Array.isArray(mesh.material)) {
            materials.push(...mesh.material);
          } else if (mesh.material) {
            materials.push(mesh.material);
          }
        }
      });

      partsGroupRef.current.set(id, { group, basePos, explodeDir, materials });
    };

    // -------------------------------------------------------------
    // Procedural Generation: Hardware (Grade 10)
    // -------------------------------------------------------------
    if (modelType === 'hardware') {
      // 1. PCB Base
      const pcbGroup = new THREE.Group();
      const pcbMat = new THREE.MeshPhysicalMaterial({
        color: 0x09141f,
        roughness: 0.35,
        metalness: 0.4,
        clearcoat: 0.4,
      });
      const pcbMesh = new THREE.Mesh(new THREE.BoxGeometry(9, 0.4, 9), pcbMat);
      pcbGroup.add(pcbMesh);

      // Gold traces and VRM chokes on PCB
      const vrmMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
      for (let i = 0; i < 6; i++) {
        const choke = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), vrmMat);
        choke.position.set(-2.8, 0.4, -2.5 + i * 0.9);
        pcbGroup.add(choke);
      }
      registerPart('pcb', pcbGroup, new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, -1, 0));

      // 2. CPU Socket & Processor
      const cpuGroup = new THREE.Group();
      const socketMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
      const socketBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 3.2), socketMat);
      cpuGroup.add(socketBase);

      const cpuIhsMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.15,
        clearcoat: 1.0,
      });
      const cpuIhs = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.25, 2.6), cpuIhsMat);
      cpuIhs.position.y = 0.26;
      cpuGroup.add(cpuIhs);
      registerPart('cpu', cpuGroup, new THREE.Vector3(-0.6, -0.9, -0.6), new THREE.Vector3(0, 0.8, 0));

      // 3. CPU Heatsink & Heatpipes
      const coolerGroup = new THREE.Group();
      const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
      const finMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 });
      // 4 Copper Heatpipes
      for (let i = -1; i <= 1; i += 0.7) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.8, 16), copperMat);
        pipe.position.set(i, 1.2, 0);
        coolerGroup.add(pipe);
      }
      // Aluminum Cooling Fin Block
      for (let f = 0; f < 8; f++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 2.6), finMat);
        fin.position.y = 0.5 + f * 0.25;
        coolerGroup.add(fin);
      }
      // ARGB Fan Accent
      const fanAccent = new THREE.Mesh(
        new THREE.TorusGeometry(1.0, 0.08, 16, 32),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      fanAccent.rotation.x = Math.PI / 2;
      fanAccent.position.y = 2.4;
      coolerGroup.add(fanAccent);
      registerPart('cooler', coolerGroup, new THREE.Vector3(-0.6, 0.8, -0.6), new THREE.Vector3(0, 2.5, 0));

      // 4. DDR5 RAM Modules
      const ramGroup = new THREE.Group();
      const ramStickMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 });
      const rgbBarMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
      for (let r = 0; r < 2; r++) {
        const ramMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 3.4), ramStickMat);
        ramMesh.position.set(r * 0.7, 0.7, 0);
        ramGroup.add(ramMesh);

        const rgbTop = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.15, 3.4), rgbBarMat);
        rgbTop.position.set(r * 0.7, 1.45, 0);
        ramGroup.add(rgbTop);
      }
      registerPart('ram', ramGroup, new THREE.Vector3(2.4, -1.0, -0.6), new THREE.Vector3(1.5, 1.2, 0));

      // 5. PCIe GPU
      const gpuGroup = new THREE.Group();
      const gpuBodyMat = new THREE.MeshPhysicalMaterial({ color: 0x1e1b4b, metalness: 0.8, roughness: 0.2 });
      const gpuBody = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.8, 0.8), gpuBodyMat);
      gpuGroup.add(gpuBody);
      // Twin Fans
      for (let fn = -1.6; fn <= 1.6; fn += 3.2) {
        const fanRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.65, 0.06, 16, 32),
          new THREE.MeshBasicMaterial({ color: 0x8b5cf6 })
        );
        fanRing.position.set(fn, 0, 0.42);
        gpuGroup.add(fanRing);
      }
      registerPart('gpu', gpuGroup, new THREE.Vector3(0, -0.7, 2.8), new THREE.Vector3(0, 0.5, 2.2));

      // 6. M.2 NVMe SSD
      const ssdGroup = new THREE.Group();
      const ssdPcbMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.4 });
      const ssdShieldMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.9, roughness: 0.1 });
      const ssdPcb = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 0.9), ssdPcbMat);
      ssdGroup.add(ssdPcb);
      const ssdShield = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 0.85), ssdShieldMat);
      ssdShield.position.y = 0.12;
      ssdGroup.add(ssdShield);
      registerPart('ssd', ssdGroup, new THREE.Vector3(1.0, -1.1, 1.4), new THREE.Vector3(1.2, 0.3, 1.2));
    }

    // -------------------------------------------------------------
    // Procedural Generation: Network Infrastructure (Grade 11)
    // -------------------------------------------------------------
    else if (modelType === 'network') {
      // 1. Server Rack Outer Frame
      const rackGroup = new THREE.Group();
      const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
      // 4 Pillars
      for (let x = -3.2; x <= 3.2; x += 6.4) {
        for (let z = -2.2; z <= 2.2; z += 4.4) {
          const col = new THREE.Mesh(new THREE.BoxGeometry(0.3, 9, 0.3), rackMat);
          col.position.set(x, 0, z);
          rackGroup.add(col);
        }
      }
      // Top and bottom plates
      const plateGeo = new THREE.BoxGeometry(6.7, 0.3, 4.7);
      const topPlate = new THREE.Mesh(plateGeo, rackMat);
      topPlate.position.y = 4.4;
      const btmPlate = new THREE.Mesh(plateGeo, rackMat);
      btmPlate.position.y = -4.4;
      rackGroup.add(topPlate, btmPlate);
      registerPart('rack', rackGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -2.5));

      // 2. Blade Server 2U
      const srvGroup = new THREE.Group();
      const srvMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 });
      const srvBox = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.6, 4.0), srvMat);
      srvGroup.add(srvBox);
      // Drive Bays
      const bayMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5 });
      for (let b = 0; b < 6; b++) {
        const bay = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.1), bayMat);
        bay.position.set(-2.2 + b * 0.85, 0, 2.05);
        srvGroup.add(bay);
      }
      registerPart('server', srvGroup, new THREE.Vector3(0, -2.2, 0), new THREE.Vector3(0, -1.8, 1.5));

      // 3. Router Multi-WAN Gateway
      const rtrGroup = new THREE.Group();
      const rtrMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
      const rtrBox = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.9, 3.8), rtrMat);
      rtrGroup.add(rtrBox);
      // SFP+ Ports
      const sfpMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      for (let p = 0; p < 4; p++) {
        const port = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.1), sfpMat);
        port.position.set(1.0 + p * 0.7, 0, 1.95);
        rtrGroup.add(port);
      }
      registerPart('router', rtrGroup, new THREE.Vector3(0, -0.6, 0), new THREE.Vector3(0, -0.3, 2.0));

      // 4. Hardware Firewall (NGFW)
      const fwGroup = new THREE.Group();
      const fwMat = new THREE.MeshStandardMaterial({ color: 0x450a0a, metalness: 0.7, roughness: 0.3 });
      const fwBox = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.9, 3.8), fwMat);
      fwGroup.add(fwBox);
      const shieldGlow = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.1), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
      shieldGlow.position.set(-1.8, 0, 1.95);
      fwGroup.add(shieldGlow);
      registerPart('firewall', fwGroup, new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(0, 0.8, 2.4));

      // 5. 48-Port Switch
      const swGroup = new THREE.Group();
      const swMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, metalness: 0.8, roughness: 0.2 });
      const swBox = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.9, 3.8), swMat);
      swGroup.add(swBox);
      // Dual Row Ports
      const portRow = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      for (let pr = 0; pr < 12; pr++) {
        const rj45 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), portRow);
        rj45.position.set(-2.2 + pr * 0.4, 0.15, 1.95);
        swGroup.add(rj45);
      }
      registerPart('switch', swGroup, new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(0, 1.8, 2.6));

      // 6. Cable Harness
      const cableGroup = new THREE.Group();
      const fiberMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.2 });
      for (let c = 0; c < 5; c++) {
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(-2 + c * 0.8, 2.2, 2.1),
          new THREE.Vector3(-2.5 + c * 0.8, 0, 3.5),
          new THREE.Vector3(-2 + c * 0.8, -1.5, 3.0),
          new THREE.Vector3(-1.8 + c * 0.8, -2.2, 2.1)
        );
        const tube = new THREE.TubeGeometry(curve, 24, 0.08, 8, false);
        cableGroup.add(new THREE.Mesh(tube, fiberMat));
      }
      registerPart('cables', cableGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.5, 0, 2.0));
    }

    // -------------------------------------------------------------
    // Procedural Generation: Cybersecurity & Cloud (Grade 12)
    // -------------------------------------------------------------
    else {
      // 1. Encrypted Database Vault Cylinder
      const vaultGroup = new THREE.Group();
      const vaultMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        metalness: 0.85,
        roughness: 0.2,
        clearcoat: 0.6,
      });
      const vaultCylinder = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 3.6, 32), vaultMat);
      vaultGroup.add(vaultCylinder);
      // Ring Segment Lights
      for (let ring = -1; ring <= 1; ring += 1) {
        const torus = new THREE.Mesh(
          new THREE.TorusGeometry(2.45, 0.08, 16, 32),
          new THREE.MeshBasicMaterial({ color: 0x00f0ff })
        );
        torus.rotation.x = Math.PI / 2;
        torus.position.y = ring * 1.0;
        vaultGroup.add(torus);
      }
      registerPart('vault', vaultGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1.8, 0));

      // 2. Hexagonal Firewall Hologram Shield
      const shieldGroup = new THREE.Group();
      const shieldMat = new THREE.MeshPhysicalMaterial({
        color: 0xf43f5e,
        transmission: 0.8,
        opacity: 0.85,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
      });
      const hexShape = new THREE.CylinderGeometry(4.2, 4.2, 0.2, 6);
      const shieldMesh = new THREE.Mesh(hexShape, shieldMat);
      shieldMesh.rotation.x = Math.PI / 2;
      shieldGroup.add(shieldMesh);
      registerPart('shield', shieldGroup, new THREE.Vector3(0, 0, 2.8), new THREE.Vector3(0, 0, 3.0));

      // 3. Distributed Cloud Mesh Nodes
      const meshGroup = new THREE.Group();
      const nodeMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.9, roughness: 0.1 });
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
      for (let a = 0; a < 4; a++) {
        const angle = (a * Math.PI) / 2;
        const nx = Math.cos(angle) * 4.2;
        const nz = Math.sin(angle) * 4.2;
        const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.7), nodeMat);
        node.position.set(nx, 1.2, nz);
        meshGroup.add(node);

        // Interconnecting Laser Beams
        const nextAngle = ((a + 1) * Math.PI) / 2;
        const nnx = Math.cos(nextAngle) * 4.2;
        const nnz = Math.sin(nextAngle) * 4.2;
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(nx, 1.2, nz),
          new THREE.Vector3(nnx, 1.2, nnz),
        ]);
        const laser = new THREE.Line(lineGeo, beamMat);
        meshGroup.add(laser);
      }
      registerPart('mesh', meshGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2.2, 0));

      // 4. Floating Cryptographic Key Shards
      const keysGroup = new THREE.Group();
      const keyMat = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        metalness: 0.95,
        roughness: 0.1,
        clearcoat: 1.0,
      });
      for (let k = 0; k < 6; k++) {
        const kAngle = (k * Math.PI) / 3;
        const kx = Math.cos(kAngle) * 2.8;
        const kz = Math.sin(kAngle) * 2.8;
        const shard = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 4), keyMat);
        shard.position.set(kx, 2.4, kz);
        shard.rotation.z = Math.PI / 4;
        keysGroup.add(shard);
      }
      registerPart('keys', keysGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3.2, 0));
    }

    // 9. Raycasting for Click-To-Inspect & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(rootModelGroup.children, true);

      if (intersects.length > 0) {
        let clickedPartId: string | null = null;
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && curr !== rootModelGroup) {
          if (curr.userData?.partId) {
            clickedPartId = curr.userData.partId;
            break;
          }
          curr = curr.parent;
        }

        if (clickedPartId) {
          const selected = currentParts.find((p) => p.id === clickedPartId);
          if (selected) {
            sound.playChime();
            setActivePart(selected);
            if (onSelectPart) onSelectPart(selected);
          }
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(rootModelGroup.children, true);

      if (intersects.length > 0) {
        let partId: string | null = null;
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && curr !== rootModelGroup) {
          if (curr.userData?.partId) {
            partId = curr.userData.partId;
            break;
          }
          curr = curr.parent;
        }
        if (partId) {
          const part = currentParts.find((p) => p.id === partId);
          setHoveredPartName(part ? part.name : null);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredPartName(null);
      container.style.cursor = 'grab';
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handlePointerDown);
    domElement.addEventListener('mousemove', handlePointerMove);

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Auto-rotation if enabled
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotate;
        controlsRef.current.autoRotateSpeed = 1.2;
        controlsRef.current.update();
      }

      // Smooth Exploded View Layer Separation Damping
      const factor = explodeFactor / 100;
      partsGroupRef.current.forEach((partData, partId) => {
        const targetPos = partData.basePos.clone().addScaledVector(partData.explodeDir, factor * 2.2);
        partData.group.position.lerp(targetPos, delta * 6);

        // If a specific part is isolated, dim or highlight
        const isIsolated = activePart !== null;
        const isThisSelected = activePart?.id === partId;

        partData.materials.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.wireframe = isWireframe;
            if (isIsolated) {
              if (isThisSelected) {
                mat.transparent = false;
                mat.opacity = 1.0;
                mat.emissive = new THREE.Color(0x00f0ff);
                mat.emissiveIntensity = 0.25;
              } else {
                mat.transparent = true;
                mat.opacity = 0.25;
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
              }
            } else {
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.emissive = new THREE.Color(0x000000);
              mat.emissiveIntensity = 0;
            }
          }
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 460;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('click', handlePointerDown);
      domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.dispose();
      scene.clear();
    };
  }, [modelType, isAutoRotate, isWireframe, explodeFactor, activePart, currentParts, onSelectPart]);

  // Camera preset handler
  const setCameraPreset = (angle: 'iso' | 'top' | 'front' | 'side') => {
    if (!cameraRef.current || !controlsRef.current) return;
    sound.playClick();
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    switch (angle) {
      case 'iso':
        cam.position.set(12, 10, 15);
        break;
      case 'top':
        cam.position.set(0, 20, 0.1);
        break;
      case 'front':
        cam.position.set(0, 2, 18);
        break;
      case 'side':
        cam.position.set(18, 2, 0);
        break;
    }
    ctrl.target.set(0, 0, 0);
    ctrl.update();
  };

  const handleSelectPartFilter = (part: PartInfo | null) => {
    sound.playClick();
    setActivePart(part);
    if (onSelectPart) onSelectPart(part);
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] rounded-3xl overflow-hidden bg-[#05070e] border-2 border-cyan-500/40 shadow-[0_0_35px_rgba(0,240,255,0.2)] group select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Spec Badge & 360 Indicator */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>3D 360° Interaktif</span>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 text-xs font-mono">
          Model TIK Kelas {grade}
        </div>

        {hoveredPartName && (
          <div className="px-3 py-1.5 rounded-full bg-cyan-950/90 backdrop-blur-md border border-cyan-400 text-cyan-200 text-xs font-bold animate-pulse">
            Sorot: {hoveredPartName} (Klik untuk bedah)
          </div>
        )}
      </div>

      {/* Top Right Camera Angle Presets - Neatly Arranged Buttons */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl">
        <span className="text-[10px] font-mono text-slate-400 px-2 font-bold hidden sm:inline">KAMERA:</span>
        {(['iso', 'top', 'front', 'side'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setCameraPreset(view)}
            className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer capitalize"
          >
            {view}
          </button>
        ))}
      </div>

      {/* Center 3D Viewport is 100% unobstructed */}

      {/* Collapsible Ergonomic Bottom Dock (Three.js skill directive) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-3xl z-30 transition-all duration-300">
        {/* Collapse / Expand Toggle Tab */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsHudCollapsed(!isHudCollapsed)}
            className="px-4 py-1 rounded-t-xl bg-slate-950/95 border-t border-x border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer"
          >
            {isHudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Buka Panel Kontrol 3D</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Sembunyikan Panel</span>
              </>
            )}
          </button>
        </div>

        {/* Main Dock Container */}
        {!isHudCollapsed && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_30px_rgba(0,0,0,0.9)] space-y-3">
            {/* Top Row: Explode / Pilah Slider & Toggles */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Explode / Pilah Layer Slider */}
              <div className="w-full sm:w-72 flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 shrink-0">
                  <Sliders className="w-4 h-4" />
                  <span>Pilah Lapisan:</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explodeFactor}
                  onChange={(e) => setExplodeFactor(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-xs font-mono font-bold text-white tabular-nums w-10 text-right">
                  {explodeFactor}%
                </span>
              </div>

              {/* Action Buttons: Auto-Rotate, Wireframe, Reset */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isAutoRotate
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Putar Otomatis 360 Derajat"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
                  <span>Putar 360°</span>
                </button>

                <button
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isWireframe
                      ? 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-400/60 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Tampilan Wireframe Hologram"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Wireframe</span>
                </button>

                <button
                  onClick={() => {
                    setExplodeFactor(0);
                    handleSelectPartFilter(null);
                    setCameraPreset('iso');
                  }}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Rapatkan Kembali Semua Komponen"
                >
                  Reset Model
                </button>
              </div>
            </div>

            {/* Bottom Row: Quick Component Isolation Pills ("Pilah Satu Komponen") */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold text-cyan-300">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  Pilah Satu Komponen Spesifik:
                </span>
                <span>Klik untuk fokus & bedah</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 max-h-20 overflow-y-auto">
                <button
                  onClick={() => handleSelectPartFilter(null)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono font-bold transition-all cursor-pointer border ${
                    activePart === null
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Semua Komponen
                </button>

                {currentParts.map((part) => {
                  const isSelected = activePart?.id === part.id;
                  return (
                    <button
                      key={part.id}
                      onClick={() => handleSelectPartFilter(isSelected ? null : part)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-950 text-cyan-300 font-bold border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                          : 'bg-slate-900/70 text-slate-300 border-slate-800/80 hover:text-cyan-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: part.color }} />
                      <span>{part.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
