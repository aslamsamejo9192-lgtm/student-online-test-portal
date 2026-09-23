import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllResults } from "../firebase";
import {
  FileCheck,
  Search,
  Filter,
  Download,
  Calendar,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Users
} from "lucide-react";

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadAllResults() {
      try {
        setLoading(true);
        const data = await getAllResults();
        setResults(data || []);
      } catch (err) {
        console.error("Error loading all results:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllResults();
  }, []);

  // Filtered results
  const filtered = results.filter((res) => {
    const q = search.toLowerCase();
    const matchesSearch =
      res.studentName?.toLowerCase().includes(q) ||
      res.studentEmail?.toLowerCase().includes(q) ||
      res.testName?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "ALL" || res.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("No results to export.");
      return;
    }

    const headers = [
      "Student Name",
      "Email",
      "Test Name",
      "Score",
      "Total Questions",
      "Percentage",
      "Status",
      "Time Taken (sec)",
      "Date"
    ];

    const rows = filtered.map((r) => [
      `"${r.studentName || "Student"}"`,
      `"${r.studentEmail || ""}"`,
      `"${r.testName || ""}"`,
      r.score,
      r.totalQuestions,
      `${r.percentage}%`,
      r.status,
      r.timeTaken || 0,
      `"${new Date(r.createdAt).toISOString()}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `studyhub_student_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCount = results.length;
  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = totalCount - passCount;
  const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Examination Results
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Global gradebook with scores, pass/fail indicators, and full test attempt archives
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Submissions</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600 uppercase">Passed</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{passCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-600 uppercase">Failed</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">{failCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-indigo-600 uppercase">Pass Rate</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{passRate}%</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or test title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          {["ALL", "PASS", "FAIL"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading student grades...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No student results match your search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Test Name</th>
                  <th className="px-5 py-4">Score</th>
                  <th className="px-5 py-4">Percentage</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {res.studentName || "Student"}
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono">
                      {res.studentEmail || "—"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800 truncate max-w-[200px]">
                      {res.testName}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {res.score} / {res.totalQuestions}
                    </td>
                    <td className="px-5 py-4 font-extrabold text-slate-900">
                      {res.percentage}%
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          res.status === "PASS"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {res.status === "PASS" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        <span>{res.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {new Date(res.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/result/${res.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3" />
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
  );
}
