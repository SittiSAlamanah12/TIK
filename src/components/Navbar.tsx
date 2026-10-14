import React from 'react';
import { Logo } from './Logo';
import { Bell, GraduationCap, ShieldCheck, Zap, Activity, Terminal } from 'lucide-react';
import { UserRole, NotificationItem } from '../types';
import { sound } from '../utils/sound';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  unreadCount: number;
  userXp?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  userRole,
  onToggleRole,
  onOpenNotifications,
  unreadCount,
  userXp = 1420,
}) => {
  const navLinks = [
    { id: 'materi', label: 'Materi & 3D Lab' },
    { id: 'simulator', label: 'Simulasi Jaringan' },
    { id: 'kuis', label: 'Kuis Interaktif' },
    { id: 'tugas', label: 'Manajemen Tugas' },
    { id: 'komunitas', label: 'Forum & Chat' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#05070e]/95 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Top Cyberpunk Telemetry Ticker Animation */}
      <div className="bg-[#03050a] border-b border-cyan-500/15 px-4 py-1 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>CYBER_LAB_TIK // ONLINE</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 hidden sm:inline">
            KURIKULUM TIK KELAS 10 · 11 · 12 SMA
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-bold hidden md:inline">
            LATENSI: 12ms (STABIL)
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-fuchsia-400 font-semibold hidden lg:inline">
            ENKRIPSI: AES-256
          </span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold">
            v2.6 CYBER
          </span>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 relative">
        {/* Animated Cyber Hologram Scanline */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 via-fuchsia-400 to-transparent animate-cyber-beam opacity-90" />
        </div>

        {/* Zone 1: Logo Wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('hero');
          }}
          className="cursor-pointer focus:outline-none text-left shrink-0 transition-transform hover:scale-102 active:scale-98"
          aria-label="Kembali ke Beranda"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: Neatly Arranged Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-mono font-bold">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  sound.playClick();
                  onNavigate(link.id);
                }}
                className={`whitespace-nowrap shrink-0 transition-all cursor-pointer px-3 py-1.5 rounded-lg border ${
                  isActive
                    ? 'bg-cyan-950/70 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/80 hover:border-slate-800'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Neatly Ordered Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* User XP Badge */}
          {userRole === 'siswa' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span className="tabular-nums">{userXp} XP</span>
            </div>
          )}

          {/* Notification Alert Bell */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNotifications();
            }}
            className="relative p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer shadow-sm active:scale-95"
            title="Pusat Notifikasi Tugas & Belajar"
            aria-label="Buka notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-slate-950 bg-cyan-400 rounded-full tabular-nums shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Mode Switcher with Cyber Styling */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleRole();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border shadow-sm active:scale-95 ${
              userRole === 'guru'
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/50 hover:bg-amber-900/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-cyan-950/60 text-cyan-300 border-cyan-400/50 hover:bg-cyan-900/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
            }`}
            title="Klik untuk beralih mode Guru atau Siswa"
          >
            {userRole === 'guru' ? (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="whitespace-nowrap font-mono">Mode Guru (Bu Sitty)</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span className="whitespace-nowrap font-mono">Mode Siswa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav subbar with dark cyberpunk scroll */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-[#05070e] gap-2 text-xs font-medium">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              sound.playClick();
              onNavigate(link.id);
            }}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
              activeSection === link.id
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
