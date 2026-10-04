import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  CheckCircle
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
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
