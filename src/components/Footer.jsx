import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Shield, Heart, ExternalLink, CheckCircle } from "lucide-react";
import { isFirebaseConfigured } from "../firebase";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                STUDY<span className="text-blue-600">HUB</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering students and institutions with high-fidelity online test assessments, instant score evaluations, and real-time performance analytics.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Vercel SPA 404 Guard Active
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home Overview
                </Link>
              </li>
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

          {/* Administration & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Staff & Educators
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/admin/login" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-indigo-500" />
                  Admin Login
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-600 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/tests" className="hover:text-indigo-600 transition-colors">
                  Test Management
                </Link>
              </li>
              <li>
                <Link to="/admin/results" className="hover:text-indigo-600 transition-colors">
                  Student Gradebook
                </Link>
              </li>
            </ul>
          </div>

          {/* Deployment & Environment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              System Architecture
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Database Engine:</span>
                <span className="font-semibold text-slate-800">
                  {isFirebaseConfigured ? "Cloud Firestore" : "Local Storage (Demo)"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Authentication:</span>
                <span className="font-semibold text-slate-800">
                  {isFirebaseConfigured ? "Firebase Auth" : "Local Auth Engine"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Hosting Target:</span>
                <span className="font-semibold text-slate-800">GitHub → Vercel</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>SPA Rewrites:</span>
                <span className="font-semibold text-emerald-600">Configured (vercel.json)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Study Hub Test Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with modern React, Vite & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
