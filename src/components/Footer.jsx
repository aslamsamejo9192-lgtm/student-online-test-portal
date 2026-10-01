import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Shield,
  CheckCircle,
  BookOpen,
  Users,
  FileCheck,
  PlusCircle,
  LayoutDashboard,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminTestAgent from "./AdminTestAgent";

export default function Footer() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [showAgentInFooter, setShowAgentInFooter] = useState(false);

  // Strictly verify that ONLY aslamsamejo9192@gmail.com with admin role can see the Admin Panel
  const canSeeAdminPanel = Boolean(
    isAdmin &&
    user &&
    (user.email || "").toLowerCase() === "aslamsamejo9192@gmail.com"
  );

  const isActive = (path) => location.pathname === path;

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* EXCLUSIVE ADMIN PANEL AT THE BOTTOM (NICHE) - ONLY VISIBLE TO ASLAM SAMEJO */}
      {canSeeAdminPanel && (
        <div className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold tracking-tight text-white">
                      Admin Panel
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      <Lock className="w-2.5 h-2.5" />
                      Only Visible to You
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Signed in as Super Admin: <span className="text-indigo-300 font-semibold">{user.email}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAgentInFooter(!showAgentInFooter)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI PDF / Text to Live Test Agent</span>
                {showAgentInFooter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showAgentInFooter && (
              <div className="mb-6">
                <AdminTestAgent />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <Link
                to="/admin"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  isActive("/admin")
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Admin Dashboard</span>
              </Link>

              <Link
                to="/admin/tests"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  isActive("/admin/tests")
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50"
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Manage Tests</span>
              </Link>

              <Link
                to="/admin/tests/add"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  isActive("/admin/tests/add")
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50"
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Create New Test</span>
              </Link>

              <Link
                to="/admin/students"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  isActive("/admin/students")
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50"
                }`}
              >
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Registered Students</span>
              </Link>

              <Link
                to="/admin/results"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  isActive("/admin/results")
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/50"
                }`}
              >
                <FileCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Student Results</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                STUDY<span className="text-blue-600">HUB</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering students with high-fidelity online test assessments, instant score evaluations, and real-time performance analytics.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/tests" className="hover:text-blue-600 transition-colors">
                  Available Online Tests
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-600 transition-colors">
                  Student Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Student Guidelines
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                  Account Registration Required
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                  Real-time Auto Submission
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                  Instant Result Generation
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Study Hub Test Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Online Examination System
          </p>
        </div>
      </div>
    </footer>
  );
}
