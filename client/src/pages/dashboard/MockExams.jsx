import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Award,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  X,
  FileCheck,
} from 'lucide-react';
import { mockExamsList } from '../../data/mockExamsData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';

export default function MockExams() {
  const { user, recordExamAttempt } = useAuth();
  const { lang } = useLanguage();

  const [activeExam, setActiveExam] = useState(null); // Exam object when running
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIdx]: selectedOptionIdx }
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (activeExam && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeExam, isSubmitted, timeLeft]);

  const startExam = (exam) => {
    // If exam has no questions (e.g. placeholder 2 or 3), fallback to exam-1 questions
    const questionsToUse =
      exam.questions && exam.questions.length > 0
        ? exam.questions
        : mockExamsList[0].questions;

    setActiveExam({ ...exam, questions: questionsToUse });
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeft(20 * 60);
    setIsSubmitted(false);
    setExamResult(null);
  };

  const handleSelectOption = (optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;
    const questions = activeExam.questions;
    let score = 0;

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });

    const passed = score >= activeExam.passingScore;
    const result = {
      score,
      total: questions.length,
      passed,
      percentage: Math.round((score / questions.length) * 100),
    };

    setExamResult(result);
    setIsSubmitted(true);

    recordExamAttempt({
      examId: activeExam.id,
      score,
      total: questions.length,
      passed,
    });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const examAttempts = user?.progress?.examAttempts || [];

  return (
    <div className="space-y-10 animate-fadeIn">
      <SEO
        title="Timed Mock Exams · Urugendo Student Portal"
        description="Simulate the official Rwanda National Police 20-question provisional driving license test."
        canonical="/mock-exams"
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Rwanda National Police (RNP) Format</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
            {lang === 'rw' ? 'Ibizamini by’Igerageza bifite Igihe' : 'Timed Provisional Mock Exams'}
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            {lang === 'rw'
              ? 'Ibibazo 20, iminota 20. Ugomba kubona byibura 16/20 (80%) kugira ngo utsinde.'
              : '20 randomized questions, 20-minute countdown. Score 16/20 (80%) or higher to pass.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-ink-100/70 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 text-xs text-right">
          <span className="text-ink-500 block">Passing Mark:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            16 / 20 (80%) Required
          </span>
        </div>
      </div>

      {/* Mock Exam Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {mockExamsList.map((exam) => (
          <div
            key={exam.id}
            className="p-6 sm:p-7 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-col justify-between hover:border-brand-500/60 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-ink-200/60 dark:bg-ink-800 text-xs font-semibold">
                  Exam 0{exam.number}
                </span>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {lang === 'rw' ? exam.difficultyRw : exam.difficulty}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl mb-2">
                {lang === 'rw' ? exam.titleRw : exam.title}
              </h3>

              <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed mb-6">
                {lang === 'rw' ? exam.descriptionRw : exam.description}
              </p>

              <div className="space-y-2 py-4 border-y border-ink-200/60 dark:border-ink-800/60 text-xs text-ink-600 dark:text-ink-300 mb-6">
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-bold">20 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Limit:</span>
                  <span className="font-bold">20 Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Pass Standard:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    16 / 20 Points
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => startExam(exam)}
              className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm btn-primary flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{lang === 'rw' ? 'Tangira Ikizamini' : 'Start Simulation'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Past Exam Attempts History */}
      <div className="p-6 sm:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm">
        <h3 className="font-display font-bold text-xl mb-4">
          {lang === 'rw' ? 'Amateka y’Ibizamini Wakoze' : 'Recent Mock Exam Attempts'}
        </h3>

        {examAttempts.length === 0 ? (
          <div className="text-center py-10 text-ink-500 text-xs">
            You haven't completed any mock exams yet. Start Simulation 01 above to test your knowledge!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-200 dark:border-ink-800 text-ink-400 uppercase tracking-wider">
                  <th className="pb-3">Exam</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-900">
                {examAttempts.map((att, i) => (
                  <tr key={i}>
                    <td className="py-3 font-semibold text-ink-900 dark:text-ink-100">
                      Simulation Exam
                    </td>
                    <td className="py-3 text-ink-500">
                      {new Date(att.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-mono font-bold">
                      {att.score} / {att.total} ({att.percentage}%)
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          att.passed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {att.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULLSCREEN EXAM SIMULATOR MODAL */}
      {activeExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Top Bar: Title, Timer, Close */}
            <div className="p-5 sm:p-6 border-b border-ink-200 dark:border-ink-800 flex items-center justify-between bg-ink-100/60 dark:bg-ink-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  RNP
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg">
                    {activeExam.title}
                  </h3>
                  <span className="text-xs text-ink-500">
                    Question {currentQuestionIdx + 1} of {activeExam.questions.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Countdown Timer */}
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-bold text-sm sm:text-base border ${
                    timeLeft < 300
                      ? 'bg-red-100 dark:bg-red-950 text-red-600 border-red-300 dark:border-red-800 animate-pulse'
                      : 'bg-ink-50 dark:bg-ink-950 border-ink-300 dark:border-ink-700 text-ink-900 dark:text-ink-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{formatTimer(timeLeft)}</span>
                </div>

                <button
                  onClick={() => setActiveExam(null)}
                  className="p-2 rounded-xl btn-ghost text-ink-500 hover:text-ink-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* If exam is submitted: Show Results Card */}
              {isSubmitted && examResult ? (
                <div className="text-center py-6 space-y-6">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl ${
                      examResult.passed
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500'
                        : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border-2 border-red-500'
                    }`}
                  >
                    {examResult.passed ? (
                      <CheckCircle2 className="w-10 h-10" />
                    ) : (
                      <XCircle className="w-10 h-10" />
                    )}
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        examResult.passed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {examResult.passed ? 'EXAMINATION PASSED' : 'NEEDS MORE PRACTICE'}
                    </span>

                    <h2 className="font-display font-bold text-3xl mt-3 mb-1">
                      {examResult.score} / {examResult.total} ({examResult.percentage}%)
                    </h2>

                    <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 max-w-md mx-auto">
                      {examResult.passed
                        ? 'Congratulations! You achieved the required 80% passing mark set by the Rwanda National Police.'
                        : 'You scored below 16/20. Review the questions below with legal explanations, then retake the exam.'}
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => startExam(activeExam)}
                      className="px-5 py-2.5 rounded-xl font-semibold text-xs btn-ghost border border-ink-300 dark:border-ink-700 inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Exam</span>
                    </button>
                    <button
                      onClick={() => setActiveExam(null)}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs btn-primary shadow-sm"
                    >
                      Close & Return to Portal
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Question Navigator Bar (1 to 20) */}
              <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-ink-100/60 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800">
                {activeExam.questions.map((_, qIdx) => {
                  const isCurrent = qIdx === currentQuestionIdx;
                  const isAnswered = selectedAnswers[qIdx] !== undefined;

                  return (
                    <button
                      key={qIdx}
                      onClick={() => setCurrentQuestionIdx(qIdx)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-brand-600 text-white shadow-md scale-105'
                          : isAnswered
                          ? 'bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300 border border-brand-300 dark:border-brand-700'
                          : 'bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Display */}
              {(() => {
                const currentQ = activeExam.questions[currentQuestionIdx];
                const selectedOpt = selectedAnswers[currentQuestionIdx];

                return (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/30">
                      <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block mb-2">
                        Question {currentQuestionIdx + 1} of {activeExam.questions.length}
                      </span>
                      <h4 className="font-display font-bold text-lg sm:text-xl leading-snug">
                        {lang === 'rw' ? currentQ.questionRw : currentQ.question}
                      </h4>
                    </div>

                    {/* Radio Options */}
                    <div className="space-y-3">
                      {currentQ.options.map((opt, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        const isCorrect = currentQ.correctIndex === optIdx;

                        let optionStyle =
                          'border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-900 hover:border-brand-400';

                        if (isSubmitted) {
                          if (isCorrect) {
                            optionStyle =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-semibold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle =
                              'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200';
                          }
                        } else if (isSelected) {
                          optionStyle =
                            'border-brand-600 bg-brand-50/80 dark:bg-brand-950/50 font-semibold text-brand-950 dark:text-brand-100 shadow-sm';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            disabled={isSubmitted}
                            className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${optionStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full border border-ink-300 dark:border-ink-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isSubmitted && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            )}
                            {isSubmitted && isSelected && !isCorrect && (
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* If submitted, show legal explanation */}
                    {isSubmitted && (
                      <div className="p-4 rounded-2xl bg-ink-100/80 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 text-xs">
                        <span className="font-bold text-brand-600 block mb-1">
                          Legal Article Rationale:
                        </span>
                        <p className="text-ink-600 dark:text-ink-300 leading-relaxed">
                          {lang === 'rw' ? currentQ.explanationRw : currentQ.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Bottom Controls */}
            <div className="p-4 sm:p-6 border-t border-ink-200 dark:border-ink-800 flex items-center justify-between bg-ink-100/60 dark:bg-ink-900/60">
              <button
                onClick={() =>
                  setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIdx === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold btn-ghost border border-ink-300 dark:border-ink-700 disabled:opacity-40 inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIdx < activeExam.questions.length - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentQuestionIdx((prev) =>
                        Math.min(activeExam.questions.length - 1, prev + 1)
                      )
                    }
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold btn-primary inline-flex items-center gap-1 shadow-sm"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : null}

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-1.5 shadow-md"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Submit & Grade Exam</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

