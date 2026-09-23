import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Key, Check, Info, X, ExternalLink } from "lucide-react";

export default function DemoNoticeBanner() {
  const { isFirebaseConfigured, login } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [quickLoginMsg, setQuickLoginMsg] = useState("");

  if (isFirebaseConfigured || dismissed) {
    return null;
  }

  const handleQuickLogin = async (email, password) => {
    try {
      setQuickLoginMsg("Signing in...");
      await login(email, password);
      setQuickLoginMsg(`Signed in as ${email}!`);
      setTimeout(() => setQuickLoginMsg(""), 3000);
    } catch (err) {
      setQuickLoginMsg("Error: " + err.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-blue-500/20 text-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <p className="font-medium text-slate-200">
            <strong className="text-white font-semibold">Demo Simulation Active:</strong> Complete test
            taking, admin creation, and score tracking are fully functional offline. Add your Firebase
            credentials to <code className="bg-black/30 px-1 py-0.5 rounded text-blue-300">.env</code> to connect live Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleQuickLogin("admin@studyhub.com", "adminPassword123!")}
              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 font-semibold text-[11px] transition-colors"
            >
              1-Click Admin
            </button>
            <button
              onClick={() => handleQuickLogin("student@studyhub.com", "studentPassword123!")}
              className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 font-semibold text-[11px] transition-colors"
            >
              1-Click Student
            </button>
          </div>

          {quickLoginMsg && (
            <span className="text-[11px] font-medium text-emerald-400 animate-fade-in">
              {quickLoginMsg}
            </span>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
