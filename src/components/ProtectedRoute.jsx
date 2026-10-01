import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Loader2, ArrowLeft } from "lucide-react";

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
    if (requireAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, but route requires Admin and user is NOT admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Restricted Access</h2>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          You are signed in as a student (<strong>{user?.email}</strong>). Administrative controls, student records, and test authoring tools are strictly restricted to authorized portal administrators.
        </p>
        <div className="flex items-center justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Student Portal</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
