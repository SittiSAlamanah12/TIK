import React, { useState, useEffect } from 'react';
import { GradeLevel, QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/mockData';
import { sound } from '../utils/sound';
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Target
} from 'lucide-react';

interface QuizSectionProps {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onAddXp: (amount: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  selectedGrade,
  onSelectGrade,
  onAddXp,
}) => {
  const questions: QuizQuestion[] = QUIZ_QUESTIONS.filter(
    (q) => q.grade === selectedGrade
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [streakCount, setStreakCount] = useState<number>(0);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0 && !isFinished) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinishQuiz();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, isFinished]);

  const currentQ = questions[currentIndex] || questions[0];
  const hasAnsweredCurrent = selectedAnswers[currentIndex] !== undefined;
  const isCurrentCorrect = selectedAnswers[currentIndex] === currentQ.correctIndex;

  const handleSelectOption = (optIndex: number) => {
    if (hasAnsweredCurrent) return; // already locked

    const isCorrect = optIndex === currentQ.correctIndex;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
    setShowExplanation(true);

    if (isCorrect) {
      setStreakCount((prev) => prev + 1);
      sound.playSuccessChime();
    } else {
      setStreakCount(0);
      sound.playPingBeep(false);
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setIsFinished(true);
    setIsTimerRunning(false);

    // Calculate score & award XP
    let totalScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        totalScore += q.points;
      }
    });

    if (totalScore > 0) {
      onAddXp(totalScore);
      sound.playSuccessChime();
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsFinished(false);
    setTimeLeft(300);
    setStreakCount(0);
    setIsTimerRunning(true);
  };

  // Score calculation
  const correctCount = questions.filter(
    (q, idx) => selectedAnswers[idx] === q.correctIndex
  ).length;
  const totalScoreEarned = questions.reduce(
    (acc, q, idx) => acc + (selectedAnswers[idx] === q.correctIndex ? q.points : 0),
    0
  );
  const maxPossibleScore = questions.reduce((acc, q) => acc + q.points, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <section id="kuis" className="py-12 bg-[#05070e] cyber-grid border-b border-cyan-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              <span>TANTANGAN EVALUASI TIK // QUIZ ENGINE</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">XP Reward System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Kuis Cepat & Asah Logika Kelas {selectedGrade}
            </h2>
          </div>

          {/* Grade Selector - Neatly Arranged Buttons */}
          <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            {(['10', '11', '12'] as GradeLevel[]).map((grade) => (
              <button
                key={grade}
                onClick={() => {
                  onSelectGrade(grade);
                  handleRestartQuiz();
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Kelas {grade}
              </button>
            ))}
          </div>
        </div>

        {!isFinished ? (
          <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-cyan-500/20 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Cyberpunk Progress & Streak Bar */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-mono">
                    Soal {currentIndex + 1}/{questions.length}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-cyan-400 font-mono">{currentQ.topic}</span>
                  {streakCount > 1 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] animate-pulse">
                      <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {streakCount}x Kombo Akurat!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono text-slate-300 text-xs">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="tabular-nums font-bold">{formatTime(timeLeft)}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/40" />
                    +{currentQ.points} XP
                  </span>
                </div>
              </div>

              {/* Smooth Animated Neon Progress Bar */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 h-full transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4 pt-1">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentQ.question}
              </h3>

              {/* Neatly Aligned Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;
                  const answered = hasAnsweredCurrent;

                  let buttonStyle = 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 text-slate-200';

                  if (answered) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-950/70 border-emerald-400 text-emerald-200 font-semibold ring-2 ring-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'bg-rose-950/70 border-rose-400 text-rose-200 font-semibold shadow-[0_0_15px_rgba(244,63,94,0.3)]';
                    } else {
                      buttonStyle = 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={answered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer active:scale-99 ${buttonStyle}`}
                    >
                      <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 text-cyan-300 shadow-inner font-mono">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 pt-0.5 leading-relaxed">{opt}</span>
                      {answered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {answered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Motivational Banner & Conceptual Explanation */}
            {hasAnsweredCurrent && (
              <div
                className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
                  isCurrentCorrect
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  {isCurrentCorrect ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Keren! Pemahaman Logikamu Tepat Sekali ✨</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 text-amber-400" />
                      <span>Tetap Semangat! Simak Pembahasan Konsep Berikut 💡</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Footer Navigation - Neatly Arranged */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex gap-2">
                {questions.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      selectedAnswers[idx] !== undefined
                        ? selectedAnswers[idx] === questions[idx].correctIndex
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] scale-110'
                          : 'bg-rose-400'
                        : idx === currentIndex
                        ? 'bg-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {hasAnsweredCurrent && (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:from-cyan-300 hover:to-sky-300 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-98"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Kuis'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Results View */
          <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-cyan-500/30 p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Kuis Selesai! Kerja Sangat Hebat!
              </h3>
              <p className="text-xs text-slate-400">
                Hasil evaluasi pemahaman TIK kamu di jenjang Kelas {selectedGrade}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto py-2">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div className="text-2xl font-black text-white font-mono tabular-nums">
                  {totalScoreEarned}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Skor (dari {maxPossibleScore})</div>
              </div>
              <div className="p-4 bg-emerald-950/50 rounded-2xl border border-emerald-500/40">
                <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                  {correctCount}/{questions.length}
                </div>
                <div className="text-[11px] text-emerald-300 mt-0.5">Jawaban Benar</div>
              </div>
              <div className="p-4 bg-cyan-950/50 rounded-2xl border border-cyan-500/40">
                <div className="text-2xl font-black text-cyan-400 font-mono tabular-nums">
                  +{totalScoreEarned}
                </div>
                <div className="text-[11px] text-cyan-300 mt-0.5">XP Didapatkan</div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={handleRestartQuiz}
                className="px-5 py-2.5 text-xs font-bold text-cyan-300 bg-slate-950 border border-cyan-500/40 hover:border-cyan-400 hover:bg-slate-900 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis untuk Skor Sempurna</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
