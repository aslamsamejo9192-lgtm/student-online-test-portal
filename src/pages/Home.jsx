import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTests } from "../firebase";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  Award,
  BookOpen,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
  Zap,
  Target
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [featuredTests, setFeaturedTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const tests = await getTests();
        setFeaturedTests(tests.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured tests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-6 border border-blue-200 shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Gen Examination & Test Assessment System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Test Your Knowledge.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Improve Your Future.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Practice online tests, track your performance and prepare smarter with Study Hub.
            Real-time countdown timer, instant grading, and comprehensive question reviews.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <Link
              to="/tests"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-base"
            >
              <span>Start Testing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isAuthenticated ? (
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all hover:border-slate-400 flex items-center justify-center gap-2 text-base"
              >
                <span>Go to Dashboard</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all hover:border-slate-400 flex items-center justify-center gap-2 text-base"
              >
                <span>Student Login</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            )}
          </div>

          {/* Key Quick Indicators */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Grading</p>
                <p className="text-sm font-bold text-slate-800">Instant Results</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Timed</p>
                <p className="text-sm font-bold text-slate-800">Auto-Submit Clock</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Analytics</p>
                <p className="text-sm font-bold text-slate-800">Full Score Review</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Certification</p>
                <p className="text-sm font-bold text-slate-800">Pass/Fail Status</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attractive Educational Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">
              Designed For Academic Excellence
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Why Students & Educators Choose Study Hub
            </p>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A comprehensive test portal engineered to build examination confidence and sharpen critical thinking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Online Tests */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Online Tests</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Subject-specific multiple-choice assessments with single-question navigation and clear question counters.
              </p>
            </div>

            {/* Card 2: Instant Results */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Results</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zero waiting time. Automated percentage calculations, pass/fail status, and time spent generated in seconds.
              </p>
            </div>

            {/* Card 3: Performance Tracking */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Performance Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Student dashboard records average scores, best attempts, and question-by-question historical reviews.
              </p>
            </div>

            {/* Card 4: Easy Preparation */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Easy Preparation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Realistic exam conditions with automated timer warnings ensure students master pacing before actual exams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Available Tests Preview */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Practice Tests
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Featured Online Tests
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Browse our current curriculum or take a sample test right away.
              </p>
            </div>

            <Link
              to="/tests"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
            >
              <span>View all tests</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {test.subject}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {test.duration} mins
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                    {test.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {test.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-medium">
                    <span>{test.questions?.length || 0} Questions</span>
                    <span className="mx-1.5">•</span>
                    <span>Pass: {test.passingPercentage}%</span>
                  </div>

                  <Link
                    to={`/test/${test.id}`}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
                  >
                    Take Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Workflow</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How Study Hub Works in 4 Steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </span>
              <h4 className="font-bold text-slate-900 mb-1">Create an Account</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register as a student in under 30 seconds with email verification.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </span>
              <h4 className="font-bold text-slate-900 mb-1">Select a Test</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from medical, programming, and general science subjects.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </span>
              <h4 className="font-bold text-slate-900 mb-1">Answer & Submit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Navigate questions with live countdown timer and instant answer lock.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                4
              </span>
              <h4 className="font-bold text-slate-900 mb-1">Review Performance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                See detailed score percentage, pass/fail badge, and correct solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Ready to test your academic skills?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join Study Hub today. Take your first test and track your journey to subject mastery.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl font-bold text-blue-700 bg-white hover:bg-blue-50 shadow-md transition-colors"
            >
              Get Started for Free
            </Link>
            <Link
              to="/tests"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/40 transition-colors"
            >
              Browse All Tests
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
