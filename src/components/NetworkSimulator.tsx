import React, { useState, useEffect, useRef } from 'react';
import {
  NetworkDevice,
  NetworkCable,
  PingResultLog,
  DeviceType
} from '../types';
import { LAB_PRESETS } from '../data/mockData';
import { sound } from '../utils/sound';
import {
  Monitor,
  Laptop,
  Network,
  Server,
  Terminal,
  Send,
  Plus,
  Trash2,
  Settings2,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Play
} from 'lucide-react';

export const NetworkSimulator: React.FC = () => {
  // Simulator State
  const [activePreset, setActivePreset] = useState<string>('preset_star');
  const [devices, setDevices] = useState<NetworkDevice[]>(LAB_PRESETS[0].devices);
  const [cables, setCables] = useState<NetworkCable[]>(LAB_PRESETS[0].cables);
  
  // Selection & Configuration
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  // Ping Testing Controls
  const [sourceNodeId, setSourceNodeId] = useState<string>('dev_pc1');
  const [targetNodeId, setTargetNodeId] = useState<string>('dev_srv');
  const [isSimulatingPing, setIsSimulatingPing] = useState<boolean>(false);
  const [pingPacketPosition, setPingPacketPosition] = useState<{ x: number; y: number } | null>(null);
  
  // Terminal logs
  const [terminalLogs, setTerminalLogs] = useState<PingResultLog[]>([
    {
      timestamp: '10:00:01',
      text: 'Simulator Jaringan TIK siap. Pilih perangkat sumber & tujuan lalu klik "Kirim Paket Ping".',
      type: 'info'
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Load a preset
  const handleLoadPreset = (presetId: string) => {
    const preset = LAB_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setActivePreset(presetId);
      setDevices(JSON.parse(JSON.stringify(preset.devices)));
      setCables(JSON.parse(JSON.stringify(preset.cables)));
      setSelectedDeviceId(null);
      setConnectingFromId(null);
      setSourceNodeId(preset.devices[0]?.id || '');
      setTargetNodeId(preset.devices[preset.devices.length - 1]?.id || '');
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          text: `Memuat skenario: ${preset.name}`,
          type: 'info'
        }
      ]);
    }
  };

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  // Helper to check same subnet for IPv4 class C / 24 default
  const isSameSubnet = (ip1: string, ip2: string, mask: string) => {
    if (mask === '255.255.255.0') {
      const seg1 = ip1.split('.').slice(0, 3).join('.');
      const seg2 = ip2.split('.').slice(0, 3).join('.');
      return seg1 === seg2;
    }
    return true;
  };

  // Run ICMP Ping Simulation
  const handleRunPing = () => {
    if (isSimulatingPing) return;
    const src = devices.find((d) => d.id === sourceNodeId);
    const dst = devices.find((d) => d.id === targetNodeId);

    if (!src || !dst) {
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          text: 'Peringatan: Tentukan node asal dan node tujuan pengujian.',
          type: 'error'
        }
      ]);
      return;
    }

    if (src.id === dst.id) {
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          text: `Ping loopback 127.0.0.1 (${src.name}) berhasil. Tidak ada paket transmisi kabel fisik.`,
          type: 'info'
        }
      ]);
      return;
    }

    setIsSimulatingPing(true);
    sound.playPingBeep(true);

    const now = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [
      ...prev,
      {
        timestamp: now,
        text: `PING ${dst.name} [${dst.ip}] dari ${src.name} [${src.ip}] dengan 32 bytes data ICMP:`,
        type: 'info'
      }
    ]);

    // Check cable connectivity
    // Build adjacency graph
    const adj: Record<string, string[]> = {};
    devices.forEach((d) => { adj[d.id] = []; });
    cables.forEach((c) => {
      if (adj[c.fromId] && adj[c.toId]) {
        adj[c.fromId].push(c.toId);
        adj[c.toId].push(c.fromId);
      }
    });

    // BFS search
    const queue: string[] = [src.id];
    const visited = new Set<string>([src.id]);
    let connected = false;
    const parentMap: Record<string, string> = {};

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === dst.id) {
        connected = true;
        break;
      }
      for (const neighbor of adj[curr] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parentMap[neighbor] = curr;
          queue.push(neighbor);
        }
      }
    }

    // Check subnet and gateway routing logic
    const sameSubnet = isSameSubnet(src.ip, dst.ip, src.subnetMask);
    const hasRouterInPath = visited.has(dst.id) && Array.from(visited).some((id) => {
      const dev = devices.find((d) => d.id === id);
      return dev?.type === 'router';
    });

    // Animate packet movement along path
    let currentX = src.x;
    let currentY = src.y;
    setPingPacketPosition({ x: currentX, y: currentY });

    setTimeout(() => {
      // Midpoint animation
      setPingPacketPosition({
        x: (src.x + dst.x) / 2,
        y: (src.y + dst.y) / 2
      });
    }, 400);

    setTimeout(() => {
      setPingPacketPosition({ x: dst.x, y: dst.y });
    }, 800);

    setTimeout(() => {
      setPingPacketPosition(null);
      setIsSimulatingPing(false);

      if (!connected) {
        sound.playPingBeep(false);
        setTerminalLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            text: `RTO (Request Timed Out) - Tidak ada jalur kabel fisik yang menghubungkan ${src.name} ke ${dst.name}.`,
            type: 'error'
          },
          {
            timestamp: new Date().toLocaleTimeString(),
            text: 'Statistik Ping: Dikirim = 4, Diterima = 0, Hilang = 4 (100% loss).',
            type: 'error'
          }
        ]);
        return;
      }

      if (!sameSubnet && !hasRouterInPath) {
        sound.playPingBeep(false);
        setTerminalLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            text: `Destination Host Unreachable: Subnet ${src.ip} dan ${dst.ip} berbeda tanpa Router Gateway Layer 3!`,
            type: 'error'
          },
          {
            timestamp: new Date().toLocaleTimeString(),
            text: 'Solusi: Pasang Router Gateway atau ubah Subnet Mask & IP ke segmen jaringan yang sama.',
            type: 'info'
          }
        ]);
        return;
      }

      // Successful Ping!
      sound.playSuccessChime();
      const latency1 = (Math.random() * 2 + 1.2).toFixed(2);
      const latency2 = (Math.random() * 1.5 + 0.8).toFixed(2);
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          text: `Balasan dari ${dst.ip}: bytes=32 waktu=${latency1}ms TTL=64 (ICMP Echo Reply)`,
          type: 'success'
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          text: `Balasan dari ${dst.ip}: bytes=32 waktu=${latency2}ms TTL=64 (ICMP Echo Reply)`,
          type: 'success'
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          text: `Statistik Ping untuk ${dst.ip}: Paket: Terkirim = 2, Diterima = 2, Hilang = 0 (0% packet loss). Koneksi LAN Sempurna.`,
          type: 'success'
        }
      ]);
    }, 1200);
  };

  // Add new device to canvas
  const handleAddDevice = (type: DeviceType) => {
    const nextIdx = devices.length + 1;
    const names: Record<DeviceType, string> = {
      pc: `PC-0${nextIdx}`,
      laptop: `Laptop-0${nextIdx}`,
      switch: `Switch-0${nextIdx}`,
      router: `Router-0${nextIdx}`,
      server: `Server-0${nextIdx}`
    };

    const newDev: NetworkDevice = {
      id: `dev_${Date.now()}`,
      type,
      name: names[type],
      x: 200 + Math.floor(Math.random() * 300),
      y: 100 + Math.floor(Math.random() * 200),
      ip: `192.168.1.${10 + nextIdx}`,
      subnetMask: '255.255.255.0',
      gateway: '192.168.1.1',
      mac: `00:1A:${Math.floor(Math.random() * 90 + 10)}:${Math.floor(Math.random() * 90 + 10)}:FF:${nextIdx}`,
      status: 'online'
    };

    setDevices((prev) => [...prev, newDev]);
    setSelectedDeviceId(newDev.id);
  };

  // Connect cable between 2 nodes
  const handleDeviceClick = (deviceId: string) => {
    if (connectingFromId) {
      if (connectingFromId !== deviceId) {
        // Check if cable already exists
        const exists = cables.some(
          (c) =>
            (c.fromId === connectingFromId && c.toId === deviceId) ||
            (c.fromId === deviceId && c.toId === connectingFromId)
        );
        if (!exists) {
          const newCable: NetworkCable = {
            id: `cab_${Date.now()}`,
            fromId: connectingFromId,
            toId: deviceId,
            status: 'connected'
          };
          setCables((prev) => [...prev, newCable]);
          sound.playNotificationChime();
        }
      }
      setConnectingFromId(null);
    } else {
      setSelectedDeviceId(deviceId);
    }
  };

  // Delete selected device
  const handleDeleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setCables((prev) => prev.filter((c) => c.fromId !== id && c.toId !== id));
    if (selectedDeviceId === id) setSelectedDeviceId(null);
    if (sourceNodeId === id) setSourceNodeId(devices[0]?.id || '');
    if (targetNodeId === id) setTargetNodeId(devices[1]?.id || '');
  };

  // Update selected device properties
  const handleUpdateDevice = (key: keyof NetworkDevice, value: string) => {
    if (!selectedDeviceId) return;
    setDevices((prev) =>
      prev.map((d) => (d.id === selectedDeviceId ? { ...d, [key]: value } : d))
    );
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'pc':
        return <Monitor className="w-5 h-5" />;
      case 'laptop':
        return <Laptop className="w-5 h-5" />;
      case 'switch':
        return <Network className="w-5 h-5" />;
      case 'router':
        return <Radio className="w-5 h-5" />;
      case 'server':
        return <Server className="w-5 h-5" />;
    }
  };

  return (
    <section id="simulator" className="py-12 bg-[#05070e] cyber-grid border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              <span>LABORATORIUM VIRTUAL SISWA // ICMP SIMULATOR</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Packet Tracer Web Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Simulasi Jaringan Komputer & Konfigurasi ICMP
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Praktikkan langsung teori pengalamatan IPv4, subnet mask, topologi star, switch,
              dan routing antar jaringan dengan uji kirim paket data secara visual.
            </p>
          </div>

          {/* Preset Lab Buttons neatly arranged */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-mono text-cyan-400/80 whitespace-nowrap">
              SKENARIO LAB:
            </span>
            <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              {LAB_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleLoadPreset(p.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                    activePreset === p.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {p.name.split(':')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toolbar: Add Devices & Cable Wiring neatly aligned */}
        <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 pr-1">
              <Plus className="w-3.5 h-3.5" />
              TAMBAH NODE:
            </span>
            <button
              onClick={() => handleAddDevice('pc')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-950/80 hover:bg-cyan-950/50 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Monitor className="w-3.5 h-3.5 text-cyan-400" /> PC
            </button>
            <button
              onClick={() => handleAddDevice('laptop')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-950/80 hover:bg-cyan-950/50 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Laptop
            </button>
            <button
              onClick={() => handleAddDevice('switch')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-950/80 hover:bg-cyan-950/50 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Network className="w-3.5 h-3.5 text-cyan-400" /> Switch
            </button>
            <button
              onClick={() => handleAddDevice('router')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-950/80 hover:bg-cyan-950/50 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" /> Router
            </button>
            <button
              onClick={() => handleAddDevice('server')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-950/80 hover:bg-cyan-950/50 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" /> Server
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (selectedDeviceId) {
                  setConnectingFromId(selectedDeviceId);
                } else {
                  setConnectingFromId(devices[0]?.id || null);
                }
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border shadow-xs ${
                connectingFromId
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
                  : 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/60'
              }`}
            >
              <span>{connectingFromId ? 'Klik Node Tujuan' : 'Sambungkan Kabel LAN'}</span>
            </button>

            <button
              onClick={() => handleLoadPreset(activePreset)}
              className="p-2 text-slate-400 hover:text-cyan-300 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-colors cursor-pointer"
              title="Reset ke pengaturan awal skenario"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Simulator Workspace (Split Canvas & Inspector) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Network Visual Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative min-h-[440px] flex flex-col">
            {/* Canvas Header Bar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                <span className="font-mono text-slate-300">Canvas Topologi Jaringan Aktif</span>
                <span className="text-slate-600">({devices.length} Node, {cables.length} Kabel)</span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Klik node untuk konfigurasi IP atau geser posisi
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative flex-1 w-full h-[380px] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] select-none overflow-hidden">
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                {/* Render Cables */}
                {cables.map((cable) => {
                  const d1 = devices.find((d) => d.id === cable.fromId);
                  const d2 = devices.find((d) => d.id === cable.toId);
                  if (!d1 || !d2) return null;

                  return (
                    <g key={cable.id}>
                      <line
                        x1={d1.x + 32}
                        y1={d1.y + 32}
                        x2={d2.x + 32}
                        y2={d2.y + 32}
                        stroke="#0ea5e9"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={isSimulatingPing ? '6,6' : 'none'}
                        className={isSimulatingPing ? 'animate-pulse' : ''}
                      />
                      {/* Port connection dots */}
                      <circle cx={d1.x + 32} cy={d1.y + 32} r="4" fill="#38bdf8" />
                      <circle cx={d2.x + 32} cy={d2.y + 32} r="4" fill="#38bdf8" />
                    </g>
                  );
                })}

                {/* Animated Ping Packet Indicator */}
                {pingPacketPosition && (
                  <circle
                    cx={pingPacketPosition.x + 32}
                    cy={pingPacketPosition.y + 32}
                    r="8"
                    fill="#38bdf8"
                    className="animate-ping"
                  />
                )}
              </svg>

              {/* Render Network Nodes / Devices */}
              {devices.map((device) => {
                const isSelected = selectedDeviceId === device.id;
                const isConnectingSource = connectingFromId === device.id;

                return (
                  <div
                    key={device.id}
                    onClick={() => handleDeviceClick(device.id)}
                    style={{
                      transform: `translate(${device.x}px, ${device.y}px)`,
                      touchAction: 'none'
                    }}
                    className={`absolute top-0 left-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-600 text-white ring-4 ring-cyan-400/40 shadow-lg scale-105 z-20'
                        : isConnectingSource
                        ? 'bg-amber-500 text-white ring-4 ring-amber-400/40 z-20'
                        : 'bg-slate-800/90 text-cyan-300 hover:bg-slate-700 border border-slate-700 shadow-md z-10'
                    }`}
                  >
                    {getDeviceIcon(device.type)}
                    <span className="text-[10px] font-mono mt-1 font-semibold truncate max-w-[56px] text-center px-1">
                      {device.name}
                    </span>

                    {/* Floating IP Badge underneath */}
                    <div className="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded-md bg-slate-950/80 text-[9px] font-mono text-cyan-300 border border-slate-800 pointer-events-none">
                      {device.ip}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Ping Controller inside Canvas Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Uji Ping ICMP:</span>
                <select
                  value={sourceNodeId}
                  onChange={(e) => setSourceNodeId(e.target.value)}
                  className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1 text-xs cursor-pointer"
                >
                  {devices.map((d) => (
                    <option key={`src_${d.id}`} value={d.id}>
                      Dari: {d.name} ({d.ip})
                    </option>
                  ))}
                </select>

                <span className="text-slate-500">→</span>

                <select
                  value={targetNodeId}
                  onChange={(e) => setTargetNodeId(e.target.value)}
                  className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1 text-xs cursor-pointer"
                >
                  {devices.map((d) => (
                    <option key={`dst_${d.id}`} value={d.id}>
                      Ke: {d.name} ({d.ip})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRunPing}
                disabled={isSimulatingPing}
                className="px-5 py-2 font-mono font-bold text-xs cyber-button-primary disabled:opacity-50"
              >
                {isSimulatingPing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                    <span>MENTRANSMISI PAKET...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-slate-950" />
                    <span>KIRIM PAKET PING (ICMP)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Device Config Inspector & Terminal Log (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Inspector Panel */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/20 p-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    Konfigurasi Perangkat
                  </h3>
                </div>
                {selectedDevice && (
                  <button
                    onClick={() => handleDeleteDevice(selectedDevice.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
                    title="Hapus perangkat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {selectedDevice ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">
                      Nama Perangkat
                    </label>
                    <input
                      type="text"
                      value={selectedDevice.name}
                      onChange={(e) => handleUpdateDevice('name', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">
                      IPv4 Address
                    </label>
                    <input
                      type="text"
                      value={selectedDevice.ip}
                      onChange={(e) => handleUpdateDevice('ip', e.target.value)}
                      className="w-full px-3 py-1.5 font-mono bg-slate-950/80 border border-slate-700 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 font-bold"
                      placeholder="192.168.1.10"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">
                      Subnet Mask
                    </label>
                    <input
                      type="text"
                      value={selectedDevice.subnetMask}
                      onChange={(e) => handleUpdateDevice('subnetMask', e.target.value)}
                      className="w-full px-3 py-1.5 font-mono bg-slate-950/80 border border-slate-700 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400"
                      placeholder="255.255.255.0"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">
                      Default Gateway
                    </label>
                    <input
                      type="text"
                      value={selectedDevice.gateway}
                      onChange={(e) => handleUpdateDevice('gateway', e.target.value)}
                      className="w-full px-3 py-1.5 font-mono bg-slate-950/80 border border-slate-700 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400"
                      placeholder="192.168.1.1"
                    />
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800">
                    <span>MAC Address:</span>
                    <span className="font-mono text-cyan-400/90">{selectedDevice.mac}</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                  <Info className="w-6 h-6 mx-auto text-cyan-500/60" />
                  <p>Pilih salah satu ikon perangkat pada canvas untuk melihat atau mengedit alamat IP.</p>
                </div>
              )}
            </div>

            {/* Terminal Console Output */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-sm text-slate-300 font-mono text-xs flex flex-col h-[200px]">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Terminal Output ICMP</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1">
                {terminalLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed text-[11px] ${
                      log.type === 'success'
                        ? 'text-emerald-400'
                        : log.type === 'error'
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="text-slate-600 mr-1.5">[{log.timestamp}]</span>
                    {log.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
