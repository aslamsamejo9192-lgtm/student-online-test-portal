import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getResultById, getTestById } from "../firebase";
import confetti from "canvas-confetti";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  LayoutDashboard,
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck,
  ChevronRight,
  Share2
} from "lucide-react";

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResultData() {
      if (!id) return;
      try {
        setLoading(true);
        const resData = await getResultById(id);
        if (!resData) {
          setError("Test result record not found.");
          return;
        }
        setResult(resData);

        // Load associated test questions for full question-by-question review
        if (resData.testId) {
          const testData = await getTestById(resData.testId);
          setTest(testData);
        }

        // Fire celebration confetti if student passed
        if (resData.status === "PASS") {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore if canvas confetti not supported
          }
        }
      } catch (err) {
        console.error("Failed to load result:", err);
        setError("Error fetching score details.");
      } finally {
        setLoading(false);
      }
    }
    loadResultData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500">Calculating score & review breakdown...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-1">Result Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">{error || "Could not locate this submission."}</p>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const isPass = result.status === "PASS";
  const wrongAnswersCount = result.totalQuestions - result.score;
  const questions = test?.questions || [];

  const formatMinutesSeconds = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} seconds`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Result Hero Header */}
      <div
        className={`rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden ${
          isPass
            ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 shadow-emerald-500/10"
            : "bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 shadow-rose-500/10"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
              {isPass ? <Sparkles className="w-3.5 h-3.5 text-amber-200" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>Examination Status: {result.status}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {isPass ? "Congratulations! You Passed." : "Test Completed. Keep Practicing!"}
            </h1>

            <p className="text-white/80 text-sm max-w-xl">
              Student: <strong>{result.studentName}</strong> • Test: <strong>{result.testName}</strong>
            </p>
          </div>

          {/* Big Score Box */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 text-center min-w-[160px] border border-white/20">
            <span className="text-xs uppercase tracking-wider font-semibold text-white/80 block">
              Final Score
            </span>
            <span className="text-4xl sm:text-5xl font-black">{result.percentage}%</span>
            <span className="text-xs font-medium text-white/90 block mt-1">
              {result.score} of {result.totalQuestions} Correct
            </span>
          </div>
        </div>
      </div>

      {/* Stats Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Total Questions
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{result.totalQuestions}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
          </span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{result.score}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-rose-600 font-semibold uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Incorrect
          </span>
          <p className="text-2xl font-bold text-rose-600 mt-1">{wrongAnswersCount}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Time Taken
          </span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 truncate">
            {formatMinutesSeconds(result.timeTaken)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to={`/test/${result.testId}`}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Test</span>
          </Link>

          <Link
            to="/tests"
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Browse More Tests</span>
          </Link>
        </div>

        <Link
          to="/dashboard"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Student Dashboard</span>
        </Link>
      </div>

      {/* Comprehensive Question Review Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Question-by-Question Review</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare your selected answers with the verified solutions.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {questions.length} Questions Evaluated
          </span>
        </div>

        {questions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            Original test question details are not available for this legacy record.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const studentChoice = result.answers?.[q.id];
              const isCorrect =
                studentChoice &&
                studentChoice.toUpperCase() === q.correctAnswer?.toUpperCase();

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl bg-white border transition-all ${
                    isCorrect
                      ? "border-emerald-200/90 shadow-xs"
                      : "border-rose-200/90 shadow-xs"
                  }`}
                >
                  {/* Top tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500">Question {idx + 1}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isCorrect
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Question text */}
                  <h3 className="font-bold text-slate-900 text-base mb-4 leading-relaxed">
                    {q.question}
                  </h3>

                  {/* Options review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    {["A", "B", "C", "D"].map((optKey) => {
                      const optText = q.options?.[optKey];
                      if (!optText) return null;

                      const isThisCorrect = q.correctAnswer?.toUpperCase() === optKey;
                      const isThisStudent = studentChoice?.toUpperCase() === optKey;

                      let style = "bg-slate-50 border-slate-200 text-slate-700";
                      if (isThisCorrect) {
                        style = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-1 ring-emerald-400";
                      } else if (isThisStudent && !isCorrect) {
                        style = "bg-rose-50 border-rose-300 text-rose-900 font-semibold";
                      }

                      return (
                        <div
                          key={optKey}
                          className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${style}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 ${
                              isThisCorrect
                                ? "bg-emerald-600 text-white"
                                : isThisStudent
                                ? "bg-rose-600 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {optKey}
                          </span>
                          <span className="flex-1">{optText}</span>
                          {isThisCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-700">
                              (Correct)
                            </span>
                          )}
                          {isThisStudent && !isThisCorrect && (
                            <span className="text-[10px] uppercase font-bold text-rose-700">
                              (Your Pick)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation feedback if available */}
                  {q.explanation && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <strong className="text-slate-800">Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
