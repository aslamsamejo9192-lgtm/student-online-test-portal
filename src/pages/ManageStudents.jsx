import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStudents, getAllResults, deleteStudent } from "../firebase";
import {
  Users,
  Search,
  Download,
  Calendar,
  Phone,
  Mail,
  Hash,
  BookOpen,
  Award,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  GraduationCap
} from "lucide-react";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, resultsData] = await Promise.all([
        getAllStudents(),
        getAllResults()
      ]);
      setStudents(studentsData || []);
      setResults(resultsData || []);
    } catch (err) {
      console.error("Error loading students list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute test metrics per student
  const studentMap = {};
  results.forEach((r) => {
    const key = r.userId || r.studentEmail;
    if (!studentMap[key]) {
      studentMap[key] = [];
    }
    studentMap[key].push(r);
  });

  const studentsWithStats = students.map((s) => {
    const studentAttempts = studentMap[s.uid] || studentMap[s.id] || studentMap[s.email] || [];
    const avgScore =
      studentAttempts.length > 0
        ? Math.round(
            studentAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
              studentAttempts.length
          )
        : null;

    return {
      ...s,
      attemptsCount: studentAttempts.length,
      averageScore: avgScore,
      attempts: studentAttempts
    };
  });

  // Filter students by search
  const filteredStudents = studentsWithStats.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.rollNo?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q)
    );
  });

  // Delete student
  const handleDeleteStudent = async (studentId) => {
    try {
      setActionLoading(true);
      await deleteStudent(studentId);
      setDeleteConfirm(null);
      setSuccessMessage("Student record removed successfully.");
      setTimeout(() => setSuccessMessage(""), 4000);
      loadData();
    } catch (err) {
      alert("Failed to delete student: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      alert("No student records to export.");
      return;
    }

    const headers = [
      "Student ID",
      "Full Name",
      "Email Address",
      "Roll Number",
      "Phone",
      "Department",
      "Registration Date",
      "Tests Attempted",
      "Average Score (%)",
      "Status"
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.id || s.uid || ""}"`,
      `"${s.name || ""}"`,
      `"${s.email || ""}"`,
      `"${s.rollNo || "N/A"}"`,
      `"${s.phone || "N/A"}"`,
      `"${s.department || "N/A"}"`,
      `"${s.createdAt ? new Date(s.createdAt).toLocaleString() : "N/A"}"`,
      s.attemptsCount,
      s.averageScore !== null ? `${s.averageScore}%` : "No attempts",
      `"${s.status || "Active"}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `studyhub-registered-students-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span>Registered Students Roster</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {students.length} Enrolled
            </span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time database of all students who registered to take examinations on Study Hub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredStudents.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster CSV</span>
          </button>
          <Link
            to="/admin"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Students
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{students.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Registered learner accounts</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active Accounts
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {students.filter((s) => (s.status || "Active") === "Active").length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified status</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active Test Takers
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {studentsWithStats.filter((s) => s.attemptsCount > 0).length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Students with submissions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Exam Submissions
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{results.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Graded test attempts</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, roll number, or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading registered student records...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No student registrations found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {search
                ? "No registered students match your search query."
                : "When students register at the entrance portal, their records will automatically display here for administration."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Student Info</th>
                  <th className="px-5 py-3.5">Roll No / ID</th>
                  <th className="px-5 py-3.5">Contact / Department</th>
                  <th className="px-5 py-3.5">Registered On</th>
                  <th className="px-5 py-3.5">Tests Taken</th>
                  <th className="px-5 py-3.5">Avg Score</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id || student.uid} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {student.rollNo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold text-[11px]">
                          <Hash className="w-3 h-3" />
                          {student.rollNo}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Not provided</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {student.phone ? (
                          <div className="text-slate-700 flex items-center gap-1 font-medium">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{student.phone}</span>
                          </div>
                        ) : null}
                        {student.department ? (
                          <div className="text-[11px] text-slate-500">
                            Dept: <span className="font-semibold text-slate-700">{student.department}</span>
                          </div>
                        ) : null}
                        {!student.phone && !student.department && (
                          <span className="text-slate-400 italic">General Student</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {student.createdAt
                            ? new Date(student.createdAt).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })
                            : "Recent"}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {student.createdAt
                          ? new Date(student.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : ""}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-700">
                        <BookOpen className="w-3 h-3 text-slate-500" />
                        {student.attemptsCount} attempts
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {student.averageScore !== null ? (
                        <span
                          className={`font-bold text-xs ${
                            student.averageScore >= 60 ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {student.averageScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Pending</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(student)}
                          title="Remove student record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedStudent.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Roll / Student ID</span>
                  <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                    {selectedStudent.rollNo || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Contact Phone</span>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">
                    {selectedStudent.phone || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Department / Class</span>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">
                    {selectedStudent.department || "General"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Registration Date</span>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">
                    {selectedStudent.createdAt
                      ? new Date(selectedStudent.createdAt).toLocaleString()
                      : "Recent"}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Student Test Submissions ({selectedStudent.attempts.length})</span>
                  {selectedStudent.averageScore !== null && (
                    <span className="text-indigo-600 font-bold">
                      Average: {selectedStudent.averageScore}%
                    </span>
                  )}
                </h4>

                {selectedStudent.attempts.length === 0 ? (
                  <p className="text-slate-400 italic py-3 text-center bg-slate-50 rounded-xl">
                    No tests taken yet by this student.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedStudent.attempts.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-xl border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{att.testName}</div>
                          <div className="text-[10px] text-slate-400">
                            {att.createdAt ? new Date(att.createdAt).toLocaleDateString() : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              att.status === "PASS"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {att.percentage}% ({att.status})
                          </span>
                          <Link
                            to={`/result/${att.id}`}
                            className="text-indigo-600 hover:text-indigo-800 p-1"
                            title="View Score Report"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">Delete Student Record?</h3>
            <p className="text-xs text-slate-500 mb-5">
              Are you sure you want to remove <span className="font-bold text-slate-800">{deleteConfirm.name}</span> ({deleteConfirm.email}) from the administration database?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStudent(deleteConfirm.id || deleteConfirm.uid)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
