import React, { useState } from 'react';
import {
  GradeLevel,
  UserRole,
  Assignment,
  Submission,
  NotificationItem
} from '../types';
import { sound } from '../utils/sound';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AssignmentManagerProps {
  userRole: UserRole;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  assignments: Assignment[];
  submissions: Submission[];
  onAddSubmission: (submission: Submission) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  onTriggerNotification: (item: NotificationItem) => void;
  onAddNewAssignment: (assignment: Assignment) => void;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({
  userRole,
  selectedGrade,
  onSelectGrade,
  assignments,
  submissions,
  onAddSubmission,
  onGradeSubmission,
  onTriggerNotification,
  onAddNewAssignment,
}) => {
  // Student Submission State
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignments.find((a) => a.grade === selectedGrade)?.id || assignments[0]?.id || ''
  );
  const [submissionUrl, setSubmissionUrl] = useState<string>('');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccessToast, setSubmissionSuccessToast] = useState<string | null>(null);

  // Teacher Grading Modal State
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Teacher Add Assignment State
  const [isAddingNewTask, setIsAddingNewTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskTopic, setNewTaskTopic] = useState<string>('');
  const [newTaskDeadline, setNewTaskDeadline] = useState<string>('2026-10-30 23:59');
  const [newTaskInstructions, setNewTaskInstructions] = useState<string>('');

  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];
  const filteredAssignments = assignments.filter((a) => a.grade === selectedGrade);
  const filteredSubmissions = submissions.filter((s) => s.studentGrade === selectedGrade);

  // Handle Student Submit
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;

    setIsSubmitting(true);
    sound.playNotificationChime();

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      assignmentId: selectedAssignmentId,
      studentId: 'usr_student_01',
      studentName: 'Ahmad Rizky Pratama',
      studentGrade: selectedGrade,
      submittedAt: new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      fileOrUrl: submissionUrl,
      notes: submissionNotes || 'Pengumpulan tugas praktikum TIK selesai.',
      status: 'pending',
    };

    onAddSubmission(newSub);

    // Trigger Automatic Real-time Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Pengumpulan Tugas Baru Masuk',
      message: `Ahmad Rizky Pratama (Kelas ${selectedGrade}) baru saja mengumpulkan tugas "${currentAssignment?.title}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      type: 'submission',
      read: false,
      meta: {
        assignmentId: selectedAssignmentId,
        studentName: 'Ahmad Rizky Pratama',
      },
    };
    onTriggerNotification(notif);

    setSubmissionSuccessToast(`Tugas berhasil dikumpulkan! Notifikasi otomatis telah dikirim ke Ibu Guru Siti.`);
    setTimeout(() => {
      setSubmissionSuccessToast(null);
      setIsSubmitting(false);
      setSubmissionUrl('');
      setSubmissionNotes('');
    }, 2500);
  };

  // Handle Teacher Grade Submit
  const handleSaveGrade = () => {
    if (!gradingSubmission) return;
    onGradeSubmission(gradingSubmission.id, gradeInput, feedbackInput);
    sound.playSuccessChime();

    // Trigger grade notification to student
    const notif: NotificationItem = {
      id: `notif_grade_${Date.now()}`,
      title: 'Nilai Tugas Telah Diterbitkan',
      message: `Ibu Siti Salamanah telah menilai tugas milik ${gradingSubmission.studentName} dengan nilai ${gradeInput}/100.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      type: 'grade',
      read: false,
      meta: {
        studentName: gradingSubmission.studentName,
        score: gradeInput,
      },
    };
    onTriggerNotification(notif);

    setGradingSubmission(null);
  };

  // Handle Teacher create new task
  const handleSaveNewAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newAsg: Assignment = {
      id: `asg_${selectedGrade}_${Date.now()}`,
      grade: selectedGrade,
      title: newTaskTitle,
      topic: newTaskTopic || 'Praktikum TIK',
      deadline: newTaskDeadline,
      totalPoints: 100,
      instructions: newTaskInstructions || 'Selesaikan praktikum dan kumpulkan laporan hasil.',
      rubric: [
        { criteria: 'Kebenaran konfigurasi & logika', maxScore: 50 },
        { criteria: 'Kelengkapan dokumentasi hasil', maxScore: 50 },
      ],
    };

    onAddNewAssignment(newAsg);
    setSelectedAssignmentId(newAsg.id);
    setIsAddingNewTask(false);
    setNewTaskTitle('');
    setNewTaskTopic('');
    setNewTaskInstructions('');
    sound.playNotificationChime();
  };

  // Quick simulation trigger for testing
  const handleTriggerSimulatedSubmission = () => {
    const studentNames = ['Daffa Al-Ghifari', 'Syifa Nurhaliza', 'Rangga Wijaya', 'Clara Anindya'];
    const randomName = studentNames[Math.floor(Math.random() * studentNames.length)];

    const simSub: Submission = {
      id: `sub_sim_${Date.now()}`,
      assignmentId: selectedAssignmentId,
      studentId: `usr_sim_${Date.now()}`,
      studentName: randomName,
      studentGrade: selectedGrade,
      submittedAt: new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      fileOrUrl: 'https://drive.google.com/file/d/simulasi-tugas-lab.pdf',
      notes: 'Tugas telah diselesaikan sesuai petunjuk lab simulasi.',
      status: 'pending',
    };

    onAddSubmission(simSub);
    sound.playNotificationChime();

    onTriggerNotification({
      id: `notif_${Date.now()}`,
      title: 'Pengumpulan Tugas Baru Masuk',
      message: `${randomName} (Kelas ${selectedGrade}) baru saja mengumpulkan tugas "${currentAssignment?.title}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      type: 'submission',
      read: false,
    });
  };

  return (
    <section id="tugas" className="py-12 bg-[#05070e] cyber-grid border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Toast Alert */}
        {submissionSuccessToast && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{submissionSuccessToast}</span>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              <span>SISTEM MANAJEMEN PEMBELAJARAN // LMS MONITOR</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">
                {userRole === 'guru' ? 'Panel Monitoring Guru Real-time' : 'Pengumpulan Tugas Siswa'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manajemen Tugas & Progres Belajar Real-Time
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              {userRole === 'guru'
                ? 'Pantau antrean pengumpulan tugas siswa secara langsung, berikan penilaian terukur, dan notifikasi instan terkirim otomatis.'
                : 'Kumpulkan tugas praktikum laboratorium TIK, tautan kode repository, dan pantau umpan balik nilai dari Ibu Guru Siti.'}
            </p>
          </div>

          {/* Grade filter & Action Buttons - Neatly Arranged */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              {(['10', '11', '12'] as GradeLevel[]).map((grade) => (
                <button
                  key={grade}
                  onClick={() => onSelectGrade(grade)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedGrade === grade
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Kelas {grade}
                </button>
              ))}
            </div>

            {userRole === 'guru' && (
              <button
                onClick={() => setIsAddingNewTask(!isAddingNewTask)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.3)] active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Tugas Baru</span>
              </button>
            )}

            {/* Quick Test Button */}
            <button
              onClick={handleTriggerSimulatedSubmission}
              className="px-3.5 py-1.5 text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Kirim pengumpulan dummy untuk menguji lonceng notifikasi & antrean real-time"
            >
              + Uji Notifikasi Masuk
            </button>
          </div>
        </div>

        {/* Real-time Teacher Progress Monitoring Dashboard */}
        {userRole === 'guru' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">TOTAL BERKAS MASUK</span>
              <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
                {filteredSubmissions.length} Berkas
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
              <span className="text-xs text-amber-300 font-mono">PERLU DINILAI SEGERA</span>
              <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">
                {filteredSubmissions.filter((s) => s.status === 'pending').length} Siswa
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-xs text-emerald-300 font-mono">SELESAI DINILAI</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
                {filteredSubmissions.filter((s) => s.status === 'graded').length} Siswa
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
              <span className="text-xs text-cyan-300 font-mono">RATA-RATA KELAS</span>
              <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums mt-1">
                {filteredSubmissions.filter((s) => s.score !== undefined).length > 0
                  ? Math.round(
                      filteredSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) /
                        (filteredSubmissions.filter((s) => s.score !== undefined).length || 1)
                    )
                  : 95}
                /100
              </div>
            </div>
          </div>
        )}

        {/* Modal / Form Create New Assignment */}
        {isAddingNewTask && userRole === 'guru' && (
          <form
            onSubmit={handleSaveNewAssignment}
            className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4 shadow-xl"
          >
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Buat Tugas Baru untuk Kelas {selectedGrade}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Judul Tugas</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Misal: Desain Jaringan LAN Kantor"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Topik / Bab</label>
                <input
                  type="text"
                  required
                  value={newTaskTopic}
                  onChange={(e) => setNewTaskTopic(e.target.value)}
                  placeholder="Misal: Jaringan Komputer & Internet"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="text-xs">
              <label className="text-slate-400 block mb-1 font-medium">Instruksi Praktikum</label>
              <textarea
                rows={3}
                value={newTaskInstructions}
                onChange={(e) => setNewTaskInstructions(e.target.value)}
                placeholder="Langkah pengerjaan dan kriteria penilaian..."
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsAddingNewTask(false)}
                className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                Terbitkan Tugas
              </button>
            </div>
          </form>
        )}

        {/* Main Content Area: Assignment Details & Submissions List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Active Assignment Instruction Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
              <label className="text-xs text-cyan-400 font-mono font-semibold block mb-1.5">
                PILIH TUGAS AKTIF:
              </label>
              <select
                value={selectedAssignmentId}
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl font-medium text-white cursor-pointer focus:outline-none focus:border-cyan-400"
              >
                {filteredAssignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            {currentAssignment && (
              <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-cyan-500/20 p-5 sm:p-6 shadow-xl space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400">{currentAssignment.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono text-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Tenggat: {currentAssignment.deadline}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {currentAssignment.title}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-bold text-white block">Petunjuk Pengerjaan:</span>
                  <p className="whitespace-pre-line leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                    {currentAssignment.instructions}
                  </p>
                </div>

                {/* Rubrik Penilaian */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    RUBRIK PENILAIAN ({currentAssignment.totalPoints} POIN):
                  </span>
                  <div className="space-y-1.5">
                    {currentAssignment.rubric.map((r, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/80 border border-slate-800"
                      >
                        <span className="text-slate-300">{r.criteria}</span>
                        <span className="font-mono font-bold text-cyan-400 tabular-nums">
                          {r.maxScore} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Submission Form (if role is siswa) */}
                {userRole === 'siswa' && (
                  <form onSubmit={handleStudentSubmit} className="pt-4 border-t border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>Form Pengumpulan Tugas Anda</span>
                    </h4>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Tautan Berkas Tugas (Google Drive / GitHub / PDF link):
                      </label>
                      <input
                        type="url"
                        required
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/..."
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Catatan Pengerjaan / Penjelasan Ringkas:
                      </label>
                      <textarea
                        rows={2}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Jelaskan ringkasan konfigurasi yang telah diuji..."
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-98"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-950" />
                      <span>{isSubmitting ? 'Mengirim & Memicu Notifikasi...' : 'Kirim Pengumpulan Tugas'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Incoming Submissions List & Real-time Queue (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Daftar Pengumpulan Siswa (Kelas {selectedGrade})</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-mono tabular-nums">
                  {filteredSubmissions.length}
                </span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Real-time Sync</span>
              </span>
            </div>

            <div className="space-y-3">
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-3xl border border-slate-800 text-xs">
                  Belum ada siswa yang mengumpulkan tugas untuk jenjang ini.
                </div>
              ) : (
                filteredSubmissions.map((sub) => {
                  const asg = assignments.find((a) => a.id === sub.assignmentId);
                  return (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-md space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-xs">
                              {sub.studentName}
                            </span>
                            <span className="text-[11px] text-slate-600">·</span>
                            <span className="text-[11px] text-slate-400">
                              Kelas {sub.studentGrade} SMA
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-cyan-300">
                            {asg?.title || 'Tugas TIK'}
                          </p>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Dikirim: {sub.submittedAt}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {sub.status === 'graded' ? (
                            <span className="px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold tabular-nums shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                              Nilai: {sub.score}/100
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[11px] font-semibold">
                              Menunggu Penilaian
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Notes & File Link */}
                      <div className="p-3 rounded-xl bg-slate-950/80 text-xs text-slate-300 flex items-center justify-between border border-slate-800/80">
                        <span className="truncate pr-2 italic">"{sub.notes}"</span>
                        <a
                          href={sub.fileOrUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 shrink-0 flex items-center gap-1 font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka Berkas</span>
                        </a>
                      </div>

                      {/* Feedback from teacher if graded */}
                      {sub.feedback && (
                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                          <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-300">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            Umpan Balik Guru (Ibu Siti):
                          </span>
                          <p className="text-slate-300">{sub.feedback}</p>
                        </div>
                      )}

                      {/* Teacher Grading Action */}
                      {userRole === 'guru' && sub.status === 'pending' && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => {
                              setGradingSubmission(sub);
                              setGradeInput(95);
                              setFeedbackInput('Analisis dan konfigurasi sangat tepat!');
                            }}
                            className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.3)] active:scale-95"
                          >
                            <Award className="w-3.5 h-3.5 text-slate-950" />
                            <span>Beri Nilai & Feedback</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Grading Popup for Teacher */}
        {gradingSubmission && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-cyan-500/30">
              <h3 className="font-bold text-white text-base">
                Form Penilaian Guru (Ibu Siti)
              </h3>
              <p className="text-xs text-slate-400">
                Siswa: <span className="font-semibold text-cyan-300">{gradingSubmission.studentName}</span> (Kelas {gradingSubmission.studentGrade})
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nilai Angka (0 - 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-3 py-2 font-mono text-base font-bold bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Umpan Balik & Catatan Guru:
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Beri apresiasi atau petunjuk perbaikan..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95"
                >
                  Simpan & Terbitkan Notifikasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
