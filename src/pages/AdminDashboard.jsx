import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTests, getAllResults, getAllStudents } from "../firebase";
import {
  Users,
  BookOpen,
  FileCheck,
  TrendingUp,
  PlusCircle,
  Settings,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  BarChart3
} from "lucide-react";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [testsData, resultsData, studentsData] = await Promise.all([
          getTests(),
          getAllResults(),
          getAllStudents()
        ]);
        setTests(testsData || []);
        setResults(resultsData || []);
        setStudents(studentsData || []);
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const totalStudents = students.length;
  const totalTests = tests.length;
  const totalAttempts = results.length;

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalAttempts
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Admin Top Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Study Hub Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Instructor Command Dashboard
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-xl">
              Create curriculum assessments, review student grade submissions, and manage tests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/tests/add"
              className="px-4 py-2.5 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-md text-xs flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Test</span>
            </Link>
            <Link
              to="/admin/tests"
              className="px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Manage Tests</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Cards: Total Students, Total Tests, Total Attempts, Average Score */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {/* Total Students */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalStudents}</div>
          <p className="text-xs text-slate-400 mt-1">Enrolled learners</p>
        </div>

        {/* Total Tests */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tests
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalTests}</div>
          <p className="text-xs text-slate-400 mt-1">Published exams</p>
        </div>

        {/* Total Attempts */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Attempts
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalAttempts}</div>
          <p className="text-xs text-slate-400 mt-1">Submissions graded</p>
        </div>

        {/* Average Score */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Score
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{averageScore}%</div>
          <p className="text-xs text-slate-400 mt-1">Portal-wide performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Submissions Table (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              Recent Student Submissions
            </h2>
            <Link
              to="/admin/results"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all results ({results.length})
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading grade records...</div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No students have submitted test attempts yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-5 py-3.5">Student</th>
                      <th className="px-5 py-3.5">Test</th>
                      <th className="px-5 py-3.5">Score</th>
                      <th className="px-5 py-3.5">Percentage</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.slice(0, 6).map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 font-bold text-slate-800">
                          {res.studentName || "Student"}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 truncate max-w-[160px]">
                          {res.testName}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">
                          {res.score} / {res.totalQuestions}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {res.percentage}%
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              res.status === "PASS"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            to={`/result/${res.id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tests Quick Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Active Tests
            </h2>
            <Link
              to="/admin/tests"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Manage all ({tests.length})
            </Link>
          </div>

          <div className="space-y-3">
            {tests.length === 0 ? (
              <div className="p-5 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">No active tests published yet.</p>
                <p className="text-[11px] text-slate-400">
                  Click below to create your first examination.
                </p>
              </div>
            ) : (
              tests.slice(0, 4).map((test) => (
                <div
                  key={test.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                      {test.subject}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{test.title}</h4>
                    <p className="text-xs text-slate-500">
                      {test.questions?.length || 0} questions • {test.duration}m
                    </p>
                  </div>

                  <Link
                    to={`/admin/tests/edit/${test.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))
            )}

            <Link
              to="/admin/tests/add"
              className="block p-4 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/70 text-indigo-700 text-center font-bold text-xs transition-colors"
            >
              + Create Another Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
