import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTestById, saveResult } from "../firebase";
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert
} from "lucide-react";

export default function TestAttemptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Test state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: "A" | "B" | "C" | "D" }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);

  const timerRef = useRef(null);

  // Load test
  useEffect(() => {
    async function loadTest() {
      if (!id) return;
      try {
        setLoading(true);
        const testData = await getTestById(id);
        if (!testData) {
          setError("Requested test could not be found.");
          return;
        }
        if (!testData.questions || testData.questions.length === 0) {
          setError("This test does not contain any questions yet.");
          return;
        }

        setTest(testData);
        const durationSec = (testData.duration || 10) * 60;
        setTimeLeft(durationSec);
        setTotalSeconds(durationSec);
      } catch (err) {
        console.error("Error loading test:", err);
        setError("An error occurred while loading test questions.");
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (loading || !test || submitting) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, test, submitting]);

  // Auto-submit when timer expires
  const handleTimeExpire = () => {
    setAutoSubmitTriggered(true);
    executeSubmission(true);
  };

  // Select Option
  const handleOptionSelect = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  // Submit test and calculate score
  const executeSubmission = async (isAuto = false) => {
    if (submitting || !test) return;

    try {
      setSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const questions = test.questions || [];
      const totalQuestions = questions.length;
      let score = 0;

      questions.forEach((q) => {
        const studentAns = answers[q.id];
        if (studentAns && studentAns.toUpperCase() === q.correctAnswer.toUpperCase()) {
          score += 1;
        }
      });

      const percentage = Math.round((score / totalQuestions) * 100);
      const passingPercent = test.passingPercentage || 60;
      const status = percentage >= passingPercent ? "PASS" : "FAIL";
      const timeTaken = Math.max(1, totalSeconds - timeLeft);

      const resultPayload = {
        userId: user?.uid || "guest-" + Date.now(),
        studentName: user?.name || "Student",
        studentEmail: user?.email || "",
        testId: test.id,
        testName: test.title,
        subject: test.subject,
        score,
        totalQuestions,
        percentage,
        status,
        passingPercentage: passingPercent,
        answers,
        timeTaken,
        autoSubmitted: isAuto,
        createdAt: new Date().toISOString()
      };

      const saved = await saveResult(resultPayload);
      navigate(`/result/${saved.id}`, { replace: true });
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit test: " + err.message);
      setSubmitting(false);
    }
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Check authentication
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Student Authentication Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            Please log in with your student account to attempt this test and record your grade.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/login"
              state={{ from: { pathname: `/test/${id}` } }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Sign In to Proceed
            </Link>
            <Link
              to="/tests"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Preparing test questions and environment...</p>
      </div>
    );
  }

  // Error state
  if (error || !test) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-1">Cannot Load Test</h3>
        <p className="text-xs text-slate-500 mb-6">{error || "Test not found."}</p>
        <Link
          to="/tests"
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Back to Available Tests
        </Link>
      </div>
    );
  }

  const questions = test.questions || [];
  const currentQ = questions[currentIndex] || {};
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const isTimeCritical = timeLeft <= 60; // under 1 minute

  return (
    <div className="min-h-screen bg-slate-50/80 pb-16">
      {/* Sticky Header with Title and Countdown Timer */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider shrink-0">
                {test.subject}
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {test.title}
              </h1>
            </div>

            {/* Timer countdown badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold border transition-all ${
                  isTimeCritical
                    ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                <Clock
                  className={`w-4 h-4 ${isTimeCritical ? "text-rose-600" : "text-blue-600"}`}
                />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={() => setShowConfirmModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question View (Left 3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              {/* Question metadata */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <span className="text-xs font-medium text-slate-400">
                  {answers[currentQ.id] ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Answered
                    </span>
                  ) : (
                    "Not answered yet"
                  )}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-8">
                {currentQ.question}
              </h2>

              {/* Four Options */}
              <div className="space-y-3.5">
                {["A", "B", "C", "D"].map((optKey) => {
                  const optText = currentQ.options?.[optKey];
                  if (!optText) return null;
                  const isSelected = answers[currentQ.id] === optKey;

                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => handleOptionSelect(currentQ.id, optKey)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-800"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {optKey}
                      </div>
                      <span className="text-sm sm:text-base font-medium flex-1">
                        {optText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {isLastQuestion ? (
                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(true)}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Submit Test</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (Right Column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Question Navigator</h3>
              <p className="text-xs text-slate-500 mb-4">
                Click any number to jump directly to that question.
              </p>

              {/* Progress info */}
              <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Answered:</span>
                  <span>
                    {answeredCount} / {questions.length}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all"
                    style={{
                      width: `${(answeredCount / questions.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Grid of question buttons */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((q, idx) => {
                  const isAnswered = Boolean(answers[q.id]);
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? "ring-2 ring-blue-600 ring-offset-2 bg-blue-600 text-white"
                          : isAnswered
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200"></span>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-blue-600"></span>
                  <span>Current Question</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="w-full mt-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Ready to submit your test?
            </h3>

            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> out of{" "}
              <strong>{questions.length}</strong> questions.
              {answeredCount < questions.length && (
                <span className="block mt-2 text-amber-600 font-semibold">
                  ⚠️ Note: {questions.length - answeredCount} unanswered questions will be marked
                  as incorrect.
                </span>
              )}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Return to Test
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  executeSubmission(false);
                }}
                disabled={submitting}
                className="py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Yes, Submit Now</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-submit warning overlay if time expires */}
      {autoSubmitTriggered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 text-white">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold">Time Expired!</h2>
            <p className="text-sm text-slate-300">
              Your test is being automatically evaluated and recorded...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
