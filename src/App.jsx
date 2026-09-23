import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DemoNoticeBanner from "./components/DemoNoticeBanner";
import ProtectedRoute from "./components/ProtectedRoute";

// Student & Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AvailableTests from "./pages/AvailableTests";
import TestAttemptPage from "./pages/TestAttemptPage";
import ResultPage from "./pages/ResultPage";
import StudentProfile from "./pages/StudentProfile";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTests from "./pages/ManageTests";
import AddTest from "./pages/AddTest";
import EditTest from "./pages/EditTest";
import StudentResults from "./pages/StudentResults";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
          <DemoNoticeBanner />
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tests" element={<AvailableTests />} />

              {/* Test Attempt & Results */}
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
