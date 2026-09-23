import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <span className="text-4xl font-black text-slate-900 block mb-1">404</span>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          The requested examination page or assessment route could not be found. Use the buttons
          below to return safely.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            to="/"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/tests"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Tests</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
