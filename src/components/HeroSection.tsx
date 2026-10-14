import React, { useState, useEffect } from 'react';
import { GradeLevel } from '../types';
import { Logo } from './Logo';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Network,
  Sparkles,
  BookOpen,
  Trophy,
  ArrowRight,
  Layers,
  Flame,
  CheckCircle,
  Zap,
  RotateCcw,
  Radio,
  Share2,
  Scan,
  Compass
} from 'lucide-react';
import { sound } from '../utils/sound';

interface HeroSectionProps {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onNavigate: (section: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedGrade,
  onSelectGrade,
  onNavigate,
}) => {
  const [missionDone, setMissionDone] = useState<boolean>(false);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [isReceivingPulse, setIsReceivingPulse] = useState<boolean>(false);

  // 3D Tilt motion values for the Lab Image card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleToggleMission = () => {
    if (!missionDone) {
      sound.playSuccessChime();
    } else {
      sound.playClick();
    }
    setMissionDone(!missionDone);
  };

  // Trigger high-speed energy pulse motion from Logo to Lab Image
  const triggerLogoToLabPulse = () => {
    sound.playClick();
    sound.playPingBeep(true);
    setPulseCount((prev) => prev + 1);

    // After photon travel time (~600ms), trigger impact animation on lab image
    setTimeout(() => {
      setIsReceivingPulse(true);
      sound.playChime();
      setTimeout(() => setIsReceivingPulse(false), 900);
    }, 600);
  };

  // Periodic subtle background pulse every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount((prev) => prev + 1);
      setTimeout(() => {
        setIsReceivingPulse(true);
        setTimeout(() => setIsReceivingPulse(false), 700);
      }, 650);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#05070e] cyber-grid border-b border-cyan-500/20 py-12 lg:py-16">
      {/* Ambient Dark Cyberpunk Glow Spheres & Animated Grid Float */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/10 w-[450px] h-[450px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyberpunk Hologram Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

      {/* Main Grid Container (div:nth-of-type(4)) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Cyber Connecting Conduit (SVG Motion from Logo to Lab Image on desktop) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-20">
          <svg className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cyberConduitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.9" />
              </linearGradient>
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Circuit Laser Path connecting left logo beacon to right lab card */}
            <path
              d="M 280 48 Q 550 -10, 740 180"
              fill="none"
              stroke="url(#cyberConduitGrad)"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="opacity-40"
            />

            {/* Continuous Traveling Data Packets along the beam */}
            <motion.circle
              r="4"
              fill="#00f0ff"
              filter="url(#laserGlow)"
              animate={{
                offsetDistance: ['0%', '100%'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                offsetPath: 'path("M 280 48 Q 550 -10, 740 180")',
              }}
            />

            <motion.circle
              r="3.5"
              fill="#ec4899"
              filter="url(#laserGlow)"
              animate={{
                offsetDistance: ['0%', '100%'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.8,
                delay: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                offsetPath: 'path("M 280 48 Q 550 -10, 740 180")',
              }}
            />

            {/* High-speed interactive energy pulse packet triggered by user */}
            <motion.circle
              key={`pulse_${pulseCount}`}
              r="7"
              fill="#ffffff"
              filter="url(#laserGlow)"
              initial={{ offsetDistance: '0%', opacity: 1, scale: 1 }}
              animate={{
                offsetDistance: '100%',
                opacity: [0, 1, 1, 0],
                scale: [1, 1.8, 1],
              }}
              transition={{
                duration: 0.65,
                ease: 'easeOut',
              }}
              style={{
                offsetPath: 'path("M 280 48 Q 550 -10, 740 180")',
              }}
            />
          </svg>
        </div>

        {/* Row 1: Left & Right Columns (div:nth-of-type(1)) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Neatly Arranged Cyber Controls (div:nth-of-type(1)) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Interactive Logo Transmitter Pod with Motion Feedback */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                onClick={triggerLogoToLabPulse}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-3 p-2 pr-4 rounded-2xl bg-slate-950/90 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:border-cyan-300 transition-all cursor-pointer"
                title="Klik untuk memancarkan pulsa energi dari logo ke gambar lab 3D"
              >
                {/* Logo with pulsing cyber beacon ring */}
                <div className="relative">
                  <Logo size="sm" showText={false} />
                  <motion.div
                    className="absolute -inset-1 rounded-xl border border-cyan-400/80 pointer-events-none"
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                    <span>belajarBarengSitty</span>
                    <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>PANCARKAN PULSA KE LAB →</span>
                  </div>
                </div>

                {/* Cyber badge indicator */}
                <div className="hidden sm:flex items-center px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 ml-1">
                  SYNC ACTIVE
                </div>
              </motion.button>

              {/* Status Tags */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 text-amber-300 border border-amber-500/30 font-mono text-[11px] shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  7 Hari Belajar Berturut
                </span>
              </div>
            </div>

            {/* Header Animation: Cyberpunk Glow & Gradient */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Kuasai Dunia Digital & Jaringan Komputer Bersama{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
                belajarBarengSitty
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Platform pembelajaran TIK kelas 10, 11, dan 12 SMA dengan visualisasi 3D yang bisa diputar 360° dan dibedah lapis demi lapis, simulator transmisi paket ICMP real-time, kuis gamifikasi, dan manajemen tugas interaktif bersama Ibu Siti Salamanah.
            </p>

            {/* Daily Mission / Quest Box - Cyberpunk HUD Card */}
            <div
              onClick={handleToggleMission}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 cyber-corner ${
                missionDone
                  ? 'bg-emerald-950/60 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-emerald-200'
                  : 'bg-slate-950/90 border-cyan-500/30 hover:border-cyan-400/70 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    missionDone
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'bg-cyan-500/10 border border-cyan-400/40 text-cyan-400'
                  }`}
                >
                  {missionDone ? (
                    <CheckCircle className="w-5 h-5 font-bold" />
                  ) : (
                    <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/30" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="font-mono">MISI_HARIAN: BEDAH MODEL 3D</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-mono border border-cyan-500/40">
                      +150 XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {missionDone
                      ? 'Misi selesai! Kamu berhasil membedah arsitektur hardware & topologi jaringan.'
                      : 'Gunakan slider pemilah 3D pada materi untuk melihat bagian dalam komponen komputer.'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold shrink-0 hidden sm:block ${missionDone ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {missionDone ? 'Selesai ✓' : 'Klaim Misi →'}
              </span>
            </div>

            {/* Neatly Aligned Grade Segmented Filter */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-mono font-bold text-cyan-400/90 block">
                PILIH JENJANG KELAS TIK:
              </label>
              <div className="inline-flex p-1 bg-slate-950/90 rounded-xl border border-slate-800 shadow-inner">
                {(['10', '11', '12'] as GradeLevel[]).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => {
                      sound.playClick();
                      onSelectGrade(grade);
                    }}
                    className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      selectedGrade === grade
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    Kelas {grade} SMA
                  </button>
                ))}
              </div>
            </div>

            {/* Neatly Aligned Action Buttons Cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('materi');
                }}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold cyber-button-primary"
              >
                <RotateCcw className="w-4 h-4 text-slate-950" />
                <span>Eksplorasi Model 3D (360°)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('simulator');
                }}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold cyber-button-secondary"
              >
                <Network className="w-4 h-4 text-cyan-400" />
                <span>Simulasi Jaringan LAN</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('kuis');
                }}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-800 hover:border-slate-700 active:scale-98"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-mono">Kuis (+XP)</span>
              </button>
            </div>

            {/* Quick Metrics in Dark Cyberpunk Monospace */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-800/80 text-slate-400">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono tabular-nums">
                  360° Rotasi
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Bedah Komponen 3D</div>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">
                  Real-time
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Notifikasi Tugas Masuk</div>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="text-xl sm:text-2xl font-black text-fuchsia-400 font-mono tabular-nums">
                  Simulator
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Paket ICMP & Routing</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity 3D Concept Showcase with Motion Frame (div:nth-of-type(2)) */}
          <div
            className="lg:col-span-5 relative perspective-[1000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient Pulse Shockwave behind Lab Card */}
            {isReceivingPulse && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0.9 }}
                animate={{ scale: 1.15, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0 rounded-3xl bg-cyan-400/30 blur-2xl pointer-events-none z-0"
              />
            )}

            {/* Interactive Lab Frame Container (div:nth-of-type(1)) */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: [-6, 6, -6],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 bg-slate-950 shadow-[0_0_40px_rgba(0,240,255,0.25)] group cyber-corner z-10 ${
                isReceivingPulse
                  ? 'border-cyan-300 ring-4 ring-cyan-400/60 shadow-[0_0_60px_rgba(0,240,255,0.6)]'
                  : 'border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_50px_rgba(0,240,255,0.35)]'
              }`}
            >
              {/* Selected Element: Lab 3D Concept Image (img:nth-of-type(1)) */}
              <motion.img
                src="/src/assets/images/tik_hero_concept_1791939790274.jpg"
                alt="Visualisasi 3D Konsep Pembelajaran TIK SMA"
                className="w-full h-auto object-cover aspect-16/10 transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                animate={
                  isReceivingPulse
                    ? {
                        filter: [
                          'brightness(1) contrast(1)',
                          'brightness(1.3) contrast(1.15) saturate(1.2)',
                          'brightness(1) contrast(1)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.8 }}
              />

              {/* Holographic Laser Scanline sweeping down the image */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#00f0ff] pointer-events-none"
                animate={{
                  top: ['-10%', '110%'],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Energy Impact Flash Ripple when pulse from Logo arrives */}
              {isReceivingPulse && (
                <motion.div
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-cyan-400/25 pointer-events-none"
                />
              )}

              {/* Vignette Shadow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Floating Cyber Badge Connected to Logo Link */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <span className={`w-2 h-2 rounded-full ${isReceivingPulse ? 'bg-fuchsia-400 scale-125' : 'bg-cyan-400'} shadow-[0_0_6px_#00f0ff] transition-all`} />
                <span className="tabular-nums">
                  {isReceivingPulse ? 'PAKET DITERIMA ✓' : 'Laboratorium 3D Online'}
                </span>
              </div>

              {/* Top Left Logo Reception Node */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                <Scan className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 font-bold">NODE_01</span>
                <span>// RX READY</span>
              </div>

              {/* Overlay Bottom Description with Quick Action */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="font-mono">LABORATORIUM TIK TERPADU</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onNavigate('materi');
                    }}
                    className="text-[11px] font-mono font-bold text-cyan-300 hover:text-white bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/40 cursor-pointer"
                  >
                    Buka 3D 360° →
                  </button>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">
                  Eksplorasi hardware motherboard, topologi jaringan enterprise, dan enkripsi cloud secara interaktif 3D.
                </p>
              </div>
            </motion.div>

            {/* Quick interactive trigger beneath the lab image */}
            <div className="mt-3 flex items-center justify-between px-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Compass className="w-3.5 h-3.5" />
                <span>Gerakkan kursor untuk efek tilt 3D</span>
              </span>
              <button
                onClick={triggerLogoToLabPulse}
                className="hover:text-cyan-300 text-slate-400 cursor-pointer underline flex items-center gap-1"
              >
                <span>Uji pulsa Logo → Lab</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
