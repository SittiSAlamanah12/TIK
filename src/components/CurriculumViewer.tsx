import React, { useState } from 'react';
import { GradeLevel, VideoLesson, Concept3D } from '../types';
import { VIDEO_LESSONS, CONCEPTS_3D } from '../data/mockData';
import { Interactive3DViewer, PartInfo } from './Interactive3DViewer';
import {
  Video,
  Play,
  Layers,
  Sparkles,
  Info,
  Clock,
  BookOpen,
  CheckCircle,
  ChevronRight,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Cpu
} from 'lucide-react';
import { sound } from '../utils/sound';

interface CurriculumViewerProps {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onNavigateToQuiz: () => void;
}

export const CurriculumViewer: React.FC<CurriculumViewerProps> = ({
  selectedGrade,
  onSelectGrade,
  onNavigateToQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'concept3d' | 'video'>('concept3d');
  const [display3DMode, setDisplay3DMode] = useState<'interactive3d' | 'schematic2d'>('interactive3d');
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(
    VIDEO_LESSONS.find((v) => v.grade === selectedGrade) || VIDEO_LESSONS[0]
  );
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [selected3DPart, setSelected3DPart] = useState<PartInfo | null>(null);

  // Filter video & concepts by grade
  const filteredVideos = VIDEO_LESSONS.filter((v) => v.grade === selectedGrade);
  const currentConcept: Concept3D =
    CONCEPTS_3D.find((c) => c.grade === selectedGrade) || CONCEPTS_3D[0];

  const activeHotspot = currentConcept.hotspots.find((h) => h.id === activeHotspotId);

  // Determine model type for 3D viewer
  const modelType: 'hardware' | 'network' | 'cyber' =
    selectedGrade === '10' ? 'hardware' : selectedGrade === '11' ? 'network' : 'cyber';

  return (
    <section id="materi" className="py-12 bg-[#05070e] cyber-grid border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              <span>KURIKULUM TIK BERBASIS 3D INTERAKTIF</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Putar 360° & Bedah Komponen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Materi Pelajaran TIK & Model 3D Interaktif
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Pahami arsitektur komputasi secara nyata: putar objek 360 derajat, pilah setiap lapisan komponen dengan slider disassembler, dan pelajari spesifikasi teknisnya.
            </p>
          </div>

          {/* Grade Selector & Feature Tabs - Neatly Arranged Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Grade Level Buttons */}
            <div className="inline-flex p-1 bg-slate-950/90 rounded-xl border border-slate-800 shadow-inner">
              {(['10', '11', '12'] as GradeLevel[]).map((grade) => (
                <button
                  key={grade}
                  onClick={() => {
                    sound.playClick();
                    onSelectGrade(grade);
                    setSelected3DPart(null);
                    const matchedVid = VIDEO_LESSONS.find((v) => v.grade === grade);
                    if (matchedVid) setSelectedVideo(matchedVid);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    selectedGrade === grade
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Kelas {grade}
                </button>
              ))}
            </div>

            {/* Content Mode Buttons */}
            <div className="inline-flex p-1 bg-slate-950/90 rounded-xl border border-slate-800 shadow-inner">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('concept3d');
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'concept3d'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eksplorasi 3D</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('video');
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Pelajaran</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: 3D High-Fidelity Concept Inspector with 360° Rotation and Disassembly */}
        {activeTab === 'concept3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: 3D Canvas / Schematic View */}
            <div className="lg:col-span-8 space-y-3">
              {/* Mode Switcher: 3D WebGL vs Schematic 2D */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1 bg-slate-950/90 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setDisplay3DMode('interactive3d')}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        display3DMode === 'interactive3d'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                      <span>Model 3D 360° (Pilah-Pilah)</span>
                    </button>
                    <button
                      onClick={() => setDisplay3DMode('schematic2d')}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        display3DMode === 'schematic2d'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Diagram Skematik Pin</span>
                    </button>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  Drag kursor untuk putar 360° · Scroll untuk zoom
                </span>
              </div>

              {/* View 1: Real Interactive 3D WebGL (360° rotation + Exploded Disassembly) */}
              {display3DMode === 'interactive3d' ? (
                <Interactive3DViewer
                  modelType={modelType}
                  grade={selectedGrade}
                  onSelectPart={(part) => setSelected3DPart(part)}
                />
              ) : (
                /* View 2: High Resolution 2D Render with Hotspot Pins (Retains image selector) */
                <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.2)] group">
                  <img
                    src={currentConcept.image}
                    alt={currentConcept.title}
                    className="w-full h-auto object-cover aspect-4/3"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hotspot Pins over the 3D Image */}
                  {currentConcept.hotspots.map((hs, index) => {
                    const isActive = activeHotspotId === hs.id;
                    return (
                      <div
                        key={hs.id}
                        style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                      >
                        <button
                          onClick={() => {
                            sound.playClick();
                            setActiveHotspotId(isActive ? null : hs.id);
                          }}
                          className={`group/pin relative flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer ${
                            isActive
                              ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/50 scale-110 shadow-[0_0_16px_rgba(0,240,255,0.8)]'
                              : 'bg-slate-950/90 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 border border-cyan-400/80 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                          }`}
                          aria-label={hs.label}
                        >
                          <span className="text-xs font-black tabular-nums">{index + 1}</span>

                          {/* Tooltip on hover */}
                          <div className="absolute left-1/2 -top-9 -translate-x-1/2 hidden group-hover/pin:flex items-center px-2 py-1 rounded-md bg-slate-950 text-cyan-300 text-[10px] font-mono whitespace-nowrap border border-cyan-500/40 pointer-events-none z-30 shadow-lg">
                            {hs.label}
                          </div>
                        </button>
                      </div>
                    );
                  })}

                  {/* Overlay Footer Note */}
                  <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <span>Klik nomor pin pada diagram untuk membaca arsitektur teknis</span>
                    <span className="text-cyan-400 font-mono text-[11px] font-bold">
                      Diagram Skematik TIK Kelas {selectedGrade}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Technical Explanation & Inspector Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#080d1a] backdrop-blur-md rounded-2xl border border-cyan-500/25 p-5 space-y-4 shadow-xl cyber-corner">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {currentConcept.subtitle}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
                      KURIKULUM SMA
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {currentConcept.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {currentConcept.description}
                  </p>
                </div>

                {/* Live Part / Hotspot Inspector Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 shadow-inner space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>
                      {selected3DPart
                        ? `Bedah Komponen: ${selected3DPart.name}`
                        : activeHotspot
                        ? `Detail Pin: ${activeHotspot.label}`
                        : 'Pilih Bagian untuk Penjelasan Detail'}
                    </span>
                  </div>

                  {selected3DPart ? (
                    <div className="space-y-2 text-xs">
                      <div className="text-[11px] font-mono text-fuchsia-400">
                        Kategori: {selected3DPart.category}
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {selected3DPart.description}
                      </p>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                        <span className="font-bold text-white">Spesifikasi: </span>
                        {selected3DPart.specs}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeHotspot
                        ? activeHotspot.details
                        : 'Klik langsung bagian model 3D di samping atau gunakan tombol komponen di bawah untuk membedah arsitektur teknis.'}
                    </p>
                  )}
                </div>

                {/* Neatly Arranged Component Quick Selectors */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                    <span>DAFTAR KOMPONEN ARSITEKTUR:</span>
                    <span className="text-[10px] text-cyan-400 font-normal">Pilah Komponen</span>
                  </h4>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {currentConcept.hotspots.map((hs, idx) => {
                      const isActive = activeHotspotId === hs.id;
                      return (
                        <button
                          key={hs.id}
                          onClick={() => {
                            sound.playClick();
                            setActiveHotspotId(hs.id);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border ${
                            isActive
                              ? 'bg-cyan-950/70 text-cyan-300 font-bold border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                              : 'bg-slate-950/60 hover:bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="w-5 h-5 rounded-md bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-[10px] font-mono border border-slate-800">
                              {idx + 1}
                            </span>
                            <span className="truncate">{hs.label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Neatly Styled Primary Quiz Action Button */}
                <button
                  onClick={onNavigateToQuiz}
                  className="w-full py-2.5 px-4 cyber-button-primary text-xs font-bold"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Uji Pemahaman Materi Ini di Kuis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Video Lessons */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Video Player Embed */}
            <div className="lg:col-span-8 space-y-4">
              <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 border-2 border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-bold text-cyan-400">{selectedVideo.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedVideo.duration}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Pengampu: {selectedVideo.instructor}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedVideo.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedVideo.description}
                </p>
              </div>

              {/* Video Key Learning Points */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Poin Inti Pembelajaran:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 pl-5 list-disc">
                  {selectedVideo.keyPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Playlist Videos for Selected Grade */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                PLAYLIST KELAS {selectedGrade}:
              </h4>
              <div className="space-y-2.5">
                {filteredVideos.map((vid) => {
                  const isSelected = selectedVideo.id === vid.id;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedVideo(vid);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-24 h-16 rounded-xl bg-slate-950 overflow-hidden relative shrink-0 border border-slate-800">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-full h-full object-cover opacity-70"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-white line-clamp-2">
                          {vid.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                          <span>{vid.duration}</span>
                          <span>·</span>
                          <span className="text-cyan-400 font-semibold">{vid.grade} SMA</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
