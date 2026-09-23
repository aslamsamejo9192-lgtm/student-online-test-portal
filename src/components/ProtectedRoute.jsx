import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Loader2 } from "lucide-react";

/**
 * ProtectedRoute Component
 * @param {boolean} requireAdmin - If true, requires user.role === 'admin'
 * @param {React.ReactNode} children
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  // Not logged in at all
  if (!isAuthenticated) {
    // If attempting to access admin route, redirect to admin login
    if (requireAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, but route requires Admin and user is NOT admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Administrator Access Required</h2>
        <p className="text-slate-600 mb-6 text-sm">
          You are currently signed in as a student (<strong>{user?.email}</strong>). This administration
          section is restricted to certified instructors and portal administrators.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/dashboard"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Go to Student Dashboard
          </a>
          <a
            href="/admin/login"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Sign in as Admin
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
