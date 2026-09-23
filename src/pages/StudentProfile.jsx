import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserResults } from "../firebase";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  FileCheck,
  ChevronRight,
  Save,
  Check,
  Loader2
} from "lucide-react";

export default function StudentProfile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    if (user?.name) setName(user.name);
    async function loadHistory() {
      if (!user) return;
      try {
        setLoadingResults(true);
        const data = await getUserResults(user.uid);
        setResults(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingResults(false);
      }
    }
    loadHistory();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      await updateProfile({ name: name.trim() });
      setSuccessMsg("Profile name successfully updated!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      alert("Error updating profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const attemptsCount = results.length;
  const passCount = results.filter((r) => r.status === "PASS").length;
  const passRate = attemptsCount > 0 ? Math.round((passCount / attemptsCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your student credentials and view your cumulative testing record
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Edit Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 className="text-xl font-bold text-slate-900">{user?.name || "Student"}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

            <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Shield className="w-3.5 h-3.5" />
              <span className="capitalize">{user?.role || "student"} Account</span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Attempts</span>
                <p className="text-lg font-bold text-slate-900">{attemptsCount}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Pass Rate</span>
                <p className="text-lg font-bold text-emerald-600">{passRate}%</p>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Edit Display Name
            </h3>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Email (Fixed)
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Columns: Full Assessment History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Complete Test History
            </h2>
            <span className="text-xs text-slate-500">{results.length} total assessments</span>
          </div>

          {loadingResults ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading history records...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">No test attempts on file</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Head over to our available tests catalog to take your first test.
              </p>
              <Link
                to="/tests"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
              >
                <span>Browse Tests</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.testName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "PASS"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>
                        Score: <strong>{item.score}</strong> / {item.totalQuestions}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-800">{item.percentage}%</span>
                    </div>
                  </div>

                  <Link
                    to={`/result/${item.id}`}
                    className="self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    <span>View Result</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
