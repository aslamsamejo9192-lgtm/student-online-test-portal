import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function Login() {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both your email and password.");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMsg("");
    if (!resetEmail.trim()) {
      setResetMsg("Please enter your email address.");
      return;
    }

    try {
      setResetLoading(true);
      await resetPassword(resetEmail);
      setResetMsg("Password reset link sent! Check your inbox.");
    } catch (err) {
      setResetMsg(err.message || "Could not send reset link. Try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/60">
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex relative mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/30 ring-4 ring-white">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 text-xs font-bold mb-2 shadow-xs border border-indigo-200/60">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Welcome Back</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Sign In to <span className="text-indigo-600">Study Hub</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1.5 max-w-xs mx-auto">
            Access your practice tests, instant grades, and learning records.
          </p>
        </div>

        {/* BEST LOOKS CARD with colorful glowing gradient border */}
        <div className="p-[2px] rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-500 to-pink-500 shadow-2xl shadow-indigo-500/20">
          <div className="bg-white rounded-[22px] p-6 sm:p-8 shadow-sm">
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all placeholder:text-slate-400 bg-slate-50/70 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all placeholder:text-slate-400 bg-slate-50/70 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Forgot Password Button - placed BELOW the password box */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(!showForgot)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Study Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Forgot Password Drawer */}
            {showForgot && (
              <div className="mt-5 pt-5 border-t border-slate-100 animate-in fade-in">
                <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                  Reset Password
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Enter your registered email address to receive password reset instructions.
                </p>
                <form onSubmit={handlePasswordReset} className="space-y-2">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors"
                  >
                    {resetLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
                {resetMsg && (
                  <p className="mt-2 text-xs text-indigo-600 font-medium">{resetMsg}</p>
                )}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure encrypted student authentication</span>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600 font-medium">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

