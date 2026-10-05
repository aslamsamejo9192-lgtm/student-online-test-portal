import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTests, getUserResults } from "../firebase";
import SubjectBoxes from "../components/SubjectBoxes";
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  FileText,
  Calendar,
  ChevronRight
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        setLoading(true);
        const [testsData, resultsData] = await Promise.all([
          getTests(),
          getUserResults(user.uid)
        ]);
        setTests(testsData || []);
        setResults(resultsData || []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  // Compute metrics
  const testsAttemptedCount = results.length;
  const availableTestsCount = tests.length;

  const averageScore =
    testsAttemptedCount > 0
      ? Math.round(
          results.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / testsAttemptedCount
        )
      : 0;

  const bestScore =
    testsAttemptedCount > 0
      ? Math.max(...results.map((r) => r.percentage || 0))
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/15 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Student Learning Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {user?.name || "Student"}!
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Track your test performance, review past assessments, and sharpen your skills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/tests"
              className="px-6 py-3 rounded-2xl font-bold bg-white text-indigo-900 hover:bg-blue-50 transition-all shadow-lg text-sm flex items-center gap-2 hover:scale-105"
            >
              <span>Explore Tests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Cards: Available Tests, Tests Attempted, Average Score, Best Score - BEST LOOKS COLORFUL BOXES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {/* Card 1: Available Tests */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-100 hover:border-blue-400 card-hover-lift transition-all relative overflow-hidden group">
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Available Tests
            </span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {availableTestsCount}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Ready to attempt</p>
        </div>

        {/* Card 2: Tests Attempted */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-100 hover:border-emerald-400 card-hover-lift transition-all relative overflow-hidden group">
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Tests Attempted
            </span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {testsAttemptedCount}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Total submissions</p>
        </div>

        {/* Card 3: Average Score */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-100 hover:border-indigo-400 card-hover-lift transition-all relative overflow-hidden group">
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Average Score
            </span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {averageScore}%
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Across all attempts</p>
        </div>

        {/* Card 4: Best Score */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-100 hover:border-amber-400 card-hover-lift transition-all relative overflow-hidden group">
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-400"></div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Best Score
            </span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {bestScore}%
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Personal record</p>
        </div>
      </div>

      {/* 4 Subject Category Cards (Biology, Chemistry, Physics, English) & Class 11/12 Preparation */}
      <SubjectBoxes embedded />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Test Attempts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Recent Test Attempts
            </h2>
            {results.length > 0 && (
              <span className="text-xs text-slate-500">{results.length} attempts recorded</span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading your performance records...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No tests taken yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                You haven't attempted any tests yet. Choose a test from the available list to begin.
              </p>
              <Link
                to="/tests"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <span>Take Your First Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {results.slice(0, 5).map((res) => (
                <div
                  key={res.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{res.testName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                          res.status === "PASS"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(res.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span>•</span>
                      <span>
                        Score: <strong>{res.score}</strong> / {res.totalQuestions}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{res.percentage}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      to={`/result/${res.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"
                    >
                      <span>Review Answers</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Available Tests Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Available Tests
            </h2>
            <Link
              to="/tests"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              See all ({tests.length})
            </Link>
          </div>

          <div className="space-y-3">
            {tests.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200">
                <BookOpen className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No Tests Available Yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Instructors haven't published any exams yet. Check back soon!
                </p>
              </div>
            ) : (
              tests.slice(0, 4).map((test) => (
                <div
                  key={test.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                      {test.subject}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {test.duration}m
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{test.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">{test.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      {test.questions?.length || 0} questions
                    </span>
                    <Link
                      to={`/test/${test.id}`}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Start Test
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
