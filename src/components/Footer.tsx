import React from 'react';
import { Logo } from './Logo';
import { Network, Cpu, Shield, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#040711] text-slate-400 border-t border-cyan-500/20 mt-20 relative overflow-hidden">
      {/* Subtle bottom cyberpunk glow */}
      <div className="absolute bottom-0 left-1/3 w-96 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" className="text-white" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Portal Pembelajaran TIK & Informatika SMA Kelas 10, 11, dan 12 Kurikulum Merdeka.
              Mengintegrasikan simulasi jaringan interaktif, video pembelajaran, dan manajemen tugas real-time.
            </p>
          </div>

          {/* Materi SMA */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
              JENJANG PELAJARAN:
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('materi')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Kelas 10: Sistem Komputer & Berpikir Komputasional
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('materi')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Kelas 11: Jaringan Komputer, OSI Layer & Subnetting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('materi')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Kelas 12: Rekayasa Web, Cloud & Keamanan Siber
                </button>
              </li>
            </ul>
          </div>

          {/* Fitur Interaktif */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
              LABORATORIUM VIRTUAL:
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Simulator Jaringan Komputer ICMP</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('materi')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visualisasi 3D Komponen Hardware</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kuis')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kuis Interaktif & Papan Peringkat</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tugas')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Manajemen Tugas & Nilai Real-time</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Kontak Guru Pengampu */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
              GURU PENGAMPU TIK:
            </h4>
            <p className="text-xs text-white font-bold">
              Ibu Siti Salamanah, S.Kom., Gr.
            </p>
            <p className="text-xs text-slate-400">
              Guru TIK & Pembina Olimpiade Komputer (OSN Informatika).
            </p>
            <div className="pt-1 text-xs text-slate-500 font-mono">
              Lab Komputer SMA Negeri 1 · Lab Jaringan Lantai 2
            </div>
          </div>
        </div>

        {/* Bottom Bar with mandatory copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            © 2026 <span className="font-bold text-white">belajarBarengSitty</span>. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Kurikulum Merdeka Informatika SMA</span>
            <span>·</span>
            <span className="text-cyan-400 font-semibold">Cyberpunk Edition 2.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
