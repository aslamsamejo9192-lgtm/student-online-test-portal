import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Student & Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AvailableTests from "./pages/AvailableTests";
import TestAttemptPage from "./pages/TestAttemptPage";
import ResultPage from "./pages/ResultPage";
import StudentProfile from "./pages/StudentProfile";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTests from "./pages/ManageTests";
import AddTest from "./pages/AddTest";
import EditTest from "./pages/EditTest";
import StudentResults from "./pages/StudentResults";

/**
 * StartingGate ensures that when a student opens the portal at start (/),
 * registration is mandatory before accessing examinations.
 */
function StartingGate() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  // Mandatory student registration at starting
  return <Navigate to="/register" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Starting Route: Student must register first */}
              <Route path="/" element={<StartingGate />} />

              {/* Authentication Routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />

              {/* Available Tests - Protected: Registration required first */}
              <Route
                path="/tests"
                element={
                  <ProtectedRoute>
                    <AvailableTests />
                  </ProtectedRoute>
                }
              />

              {/* Test Attempt & Results - Protected */}
              <Route
                path="/test/:id"
                element={
                  <ProtectedRoute>
                    <TestAttemptPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/result/:id"
                element={
                  <ProtectedRoute>
                    <ResultPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />

              {/* Student Authenticated Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tests"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <ManageTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tests/add"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AddTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tests/edit/:id"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <EditTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/results"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <StudentResults />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
