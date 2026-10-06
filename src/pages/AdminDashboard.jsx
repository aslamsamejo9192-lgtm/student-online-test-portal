import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTests, getAllResults, getAllStudents, getPayments } from "../firebase";
import AdminTestAgent from "../components/AdminTestAgent";
import { useAuth } from "../context/AuthContext";
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
  BarChart3,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Lock,
  LayoutDashboard,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [showAgent, setShowAgent] = useState(false);
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [testsData, resultsData, studentsData, paymentsData] = await Promise.all([
          getTests(),
          getAllResults(),
          getAllStudents(),
          getPayments()
        ]);
        setTests(testsData || []);
        setResults(resultsData || []);
        setStudents(studentsData || []);
        setPayments(paymentsData || []);
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
  const totalRevenue = payments.reduce((acc, p) => acc + (Number(p.amount) || 10), 0);

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
              to="/admin/students"
              className="px-4 py-2.5 rounded-xl font-bold bg-white text-indigo-900 hover:bg-indigo-50 shadow-md text-xs flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Registered Students ({totalStudents})</span>
            </Link>
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

      {/* Admin Panel Box (Placed right under Instructor Command Dashboard box) */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-950/20 border border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full aspect-square bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Admin Panel
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <Lock className="w-2.5 h-2.5" />
                  Only Visible to You
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Signed in as Super Admin: <span className="text-indigo-300 font-semibold">{user?.email || "aslamsamejo9192@gmail.com"}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAgent(!showAgent)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI PDF / Text to Live Test Agent</span>
            {showAgent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showAgent && (
          <div className="mb-6 pt-4 border-t border-slate-800">
            <AdminTestAgent
              onTestPublished={(newTest) => {
                setTests((prev) => [newTest, ...prev]);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
          >
            <LayoutDashboard className="w-4 h-4 text-white shrink-0" />
            <span>Admin Dashboard</span>
          </Link>

          <Link
            to="/admin/tests"
            className="flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50 hover:text-white"
          >
            <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Manage Tests</span>
          </Link>

          <Link
            to="/admin/tests/add"
            className="flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50 hover:text-white"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Create New Test</span>
          </Link>

          <Link
            to="/admin/students"
            className="flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50 hover:text-white"
          >
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Registered Students</span>
          </Link>

          <Link
            to="/admin/results"
            className="flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50 hover:text-white"
          >
            <FileCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Student Results</span>
          </Link>
        </div>
      </div>

      {/* 4 Cards: Total Students, Total Tests, Total Attempts, Exam Fees Revenue - BEST LOOKS COLORFUL BOXES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Students */}
        <Link
          to="/admin/students"
          className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 card-hover-lift shadow-md shadow-slate-100 transition-all group cursor-pointer block relative overflow-hidden"
        >
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors leading-tight">
              Total Students
            </span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalStudents}</div>
          <p className="text-xs text-indigo-600 font-bold mt-1.5 flex items-center gap-1">
            <span>View Student Roster</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </Link>

        {/* Total Tests */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-100 hover:border-purple-400 card-hover-lift transition-all relative overflow-hidden group">
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Total Tests
            </span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalTests}</div>
          <p className="text-xs text-slate-400 font-medium mt-1.5">Published exams</p>
        </div>

        {/* Total Attempts */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-100 hover:border-teal-400 card-hover-lift transition-all relative overflow-hidden group">
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Total Attempts
            </span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-500/25 group-hover:scale-110 transition-transform">
              <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalAttempts}</div>
          <p className="text-xs text-slate-400 font-medium mt-1.5">Submissions graded</p>
        </div>

        {/* Collected Fees Revenue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-100 hover:border-amber-400 card-hover-lift transition-all relative overflow-hidden group">
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-emerald-500"></div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Exam Fees Revenue
            </span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">Rs. {totalRevenue} PKR</div>
          <p className="text-xs text-slate-400 font-medium mt-1.5">{payments.length} verified transactions</p>
        </div>
      </div>

      {/* EasyPaisa & JazzCash Live Payments Stream */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                EasyPaisa &amp; JazzCash Fee Collections (Rs. 10/Test)
              </h2>
              <p className="text-xs text-slate-500">
                Receiver: Medico Engineer (03700113837)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {payments.length} Payments Received
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          {payments.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No payment transactions recorded yet</p>
              <p className="text-xs text-slate-400 mt-0.5">
                When students verify EasyPaisa or JazzCash transactions for test attempts, they will show up here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Student / Sender</th>
                    <th className="px-5 py-3.5">Contact Phone</th>
                    <th className="px-5 py-3.5">Test Assessment</th>
                    <th className="px-5 py-3.5">Method</th>
                    <th className="px-5 py-3.5 font-mono">Trx ID (TID)</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.slice(0, 8).map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {pay.studentName || "Student"}
                        {pay.studentRollNo && (
                          <span className="block text-[10px] font-normal text-slate-400">
                            Roll: {pay.studentRollNo}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-700">
                        {pay.studentPhone || "N/A"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 truncate max-w-[180px]">
                        {pay.testTitle || "MDCAT Assessment"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pay.method === "EasyPaisa"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}>
                          {pay.method || "EasyPaisa"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                        {pay.transactionId || "N/A"}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-emerald-600">
                        Rs. {pay.amount || 10}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{pay.status || "Verified"}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Newly Registered Students Live Stream */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Incoming Student Registrations
              </h2>
              <p className="text-xs text-slate-500">
                Live stream of students who registered to take online examinations
              </p>
            </div>
          </div>
          <Link
            to="/admin/students"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Manage All Students ({students.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading student registrations...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No students have registered yet. As soon as a student registers, their profile appears here automatically for administration.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Student Name</th>
                    <th className="px-5 py-3.5">Email Address</th>
                    <th className="px-5 py-3.5">Roll No / ID</th>
                    <th className="px-5 py-3.5">Contact / Department</th>
                    <th className="px-5 py-3.5">Registered At</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 5).map((student) => (
                    <tr key={student.id || student.uid} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <span>{student.name}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{student.email}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-700">
                        {student.rollNo ? (
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                            {student.rollNo}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {student.phone || student.department ? (
                          <span>{student.phone || ""} {student.department ? `(${student.department})` : ""}</span>
                        ) : (
                          <span className="text-slate-400 italic">General</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {student.createdAt
                          ? new Date(student.createdAt).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "Recently"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {student.status || "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to="/admin/students"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          View Full Record
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
