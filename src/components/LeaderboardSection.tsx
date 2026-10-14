import React, { useState } from 'react';
import { GradeLevel, LeaderboardEntry } from '../types';
import { INITIAL_LEADERBOARD } from '../data/mockData';
import { Trophy, Flame, Award, Medal, CheckCircle2, ShieldCheck, Cpu, Code2, Network } from 'lucide-react';

interface LeaderboardSectionProps {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  currentUserXp: number;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  selectedGrade,
  onSelectGrade,
  currentUserXp,
}) => {
  const [filterMode, setFilterMode] = useState<GradeLevel | 'all'>(selectedGrade);

  // Update current user XP in leaderboard
  const enrichedLeaderboard = INITIAL_LEADERBOARD.map((item) => {
    if (item.id === 'usr_student_01') {
      return { ...item, xp: Math.max(item.xp, currentUserXp) };
    }
    return item;
  }).sort((a, b) => b.xp - a.xp).map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  const filteredEntries = filterMode === 'all'
    ? enrichedLeaderboard
    : enrichedLeaderboard.filter((entry) => entry.grade === filterMode);

  const top3 = filteredEntries.slice(0, 3);

  const studentBadges = [
    {
      title: 'Master Subnetting',
      desc: 'Berhasil menguji topologi LAN & subnet mask di simulator ICMP.',
      icon: <Network className="w-5 h-5 text-cyan-400" />,
      color: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
    },
    {
      title: 'Hardware Architect',
      desc: 'Mengeksplorasi seluruh komponen motherboard pada model 3D.',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-950/40 border-purple-500/30 text-purple-300'
    },
    {
      title: 'Code Wizard',
      desc: 'Menuntaskan pemecahan algoritma pemrograman dan logika.',
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
    },
    {
      title: 'Cyber Guardian',
      desc: 'Memahami prinsip kriptografi asimetris dan keamanan cloud.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-950/40 border-amber-500/30 text-amber-300'
    }
  ];

  return (
    <section className="py-12 bg-[#05070e] cyber-grid border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              <span>PAPAN PERINGKAT JUARA // LEADERBOARD LEAGUE</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">XP & Lencana Gamifikasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Papan Peringkat Juara TIK SMA
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Kumpulkan poin XP dari kuis, praktikum lab, dan keaktifan diskusi.
              Pertahankan konsistensi belajar harian untuk menjadi yang terdepan!
            </p>
          </div>

          {/* Segmented Filter Control - Neatly Arranged Buttons */}
          <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Semua Kelas
            </button>
            {(['10', '11', '12'] as GradeLevel[]).map((grade) => (
              <button
                key={grade}
                onClick={() => setFilterMode(grade)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterMode === grade
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Kelas {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Podium Top 3 Visual Display */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto pt-6 items-end">
            {/* Rank 2 (Silver) */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700/80 p-4 sm:p-5 text-center shadow-lg space-y-2 order-1">
              <div className="relative inline-block">
                <img
                  src={top3[1].avatar}
                  alt={top3[1].name}
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-full mx-auto object-cover ring-4 ring-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.3)]"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-600 text-[10px] font-bold font-mono">
                  #2 Perak
                </span>
              </div>
              <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                {top3[1].name}
              </h4>
              <div className="text-[11px] text-slate-400 font-mono">Kelas {top3[1].grade}</div>
              <div className="text-sm sm:text-base font-black text-cyan-400 font-mono tabular-nums">
                {top3[1].xp} XP
              </div>
            </div>

            {/* Rank 1 (Gold - Center & Elevated) */}
            <div className="bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-400/80 p-5 sm:p-6 text-center shadow-[0_0_30px_rgba(245,158,11,0.3)] space-y-2 order-2 -translate-y-3">
              <div className="relative inline-block">
                <img
                  src={top3[0].avatar}
                  alt={top3[0].name}
                  className="w-18 h-18 sm:w-22 sm:h-22 rounded-full mx-auto object-cover ring-4 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black font-mono shadow-[0_0_10px_rgba(245,158,11,0.8)]">
                  #1 JUARA UTAMA
                </span>
              </div>
              <h4 className="font-extrabold text-white text-xs sm:text-base truncate pt-1">
                {top3[0].name}
              </h4>
              <div className="text-xs text-amber-400 font-mono font-medium">Kelas {top3[0].grade}</div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono tabular-nums">
                {top3[0].xp} XP
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-amber-800/40 p-4 sm:p-5 text-center shadow-lg space-y-2 order-3">
              <div className="relative inline-block">
                <img
                  src={top3[2].avatar}
                  alt={top3[2].name}
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-full mx-auto object-cover ring-4 ring-amber-700/60 shadow-[0_0_15px_rgba(180,83,9,0.3)]"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-700/40 text-[10px] font-bold font-mono">
                  #3 Perunggu
                </span>
              </div>
              <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                {top3[2].name}
              </h4>
              <div className="text-[11px] text-slate-400 font-mono">Kelas {top3[2].grade}</div>
              <div className="text-sm sm:text-base font-black text-cyan-400 font-mono tabular-nums">
                {top3[2].xp} XP
              </div>
            </div>
          </div>
        )}

        {/* Tabular Leaderboard List */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-cyan-500/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-cyan-400/90 uppercase font-mono font-bold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-16">Peringkat</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Jenjang</th>
                  <th className="py-3.5 px-4">Streak Belajar</th>
                  <th className="py-3.5 px-4">Kuis Selesai</th>
                  <th className="py-3.5 px-4 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-normal text-slate-300">
                {filteredEntries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      entry.id === 'usr_student_01' ? 'bg-cyan-950/30 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 tabular-nums">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div className="truncate">
                          <span className="font-semibold text-white block truncate">
                            {entry.name}
                          </span>
                          {entry.id === 'usr_student_01' && (
                            <span className="text-[10px] text-cyan-400 font-bold font-mono">
                              (Profil Belajar Kamu)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">Kelas {entry.grade} SMA</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-amber-400 font-mono font-semibold tabular-nums">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        {entry.streakDays} hari
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 tabular-nums">
                      {entry.quizzesCompleted} kuis
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-300 tabular-nums">
                      {entry.xp} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Achievement Badges Showcase */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono">
              LENCANA PENCAPAIAN SISWA:
            </h3>
            <span className="text-xs text-slate-400">Buka lencana dengan eksplorasi fitur</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {studentBadges.map((badge, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${badge.color} space-y-2 shadow-lg backdrop-blur-md transition-all hover:scale-102`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-inner border border-slate-800">
                  {badge.icon}
                </div>
                <h4 className="text-xs font-bold text-white">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
