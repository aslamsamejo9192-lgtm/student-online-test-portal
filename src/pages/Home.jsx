import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTests } from "../firebase";
import SubjectBoxes from "../components/SubjectBoxes";
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
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/90 via-indigo-50/40 to-white pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-indigo-800 text-xs font-bold mb-6 border border-indigo-200/80 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen Online Examination &amp; Live Assessment Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Test Your Knowledge.{" "}
            <span className="text-indigo-600">
              Sharpen Your Future.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Practice online tests, track your performance, and prepare smarter with Study Hub.
            Real-time countdown timer, instant grading, and comprehensive question reviews.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/tests"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-base"
            >
              <span>Explore Available Tests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isAuthenticated ? (
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all hover:border-indigo-400 flex items-center justify-center gap-2 text-base"
              >
                <span>Go to Dashboard</span>
                <ChevronRight className="w-4 h-4 text-indigo-600" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all hover:border-indigo-400 flex items-center justify-center gap-2 text-base"
              >
                <span>Create Free Account</span>
                <ChevronRight className="w-4 h-4 text-indigo-600" />
              </Link>
            )}
          </div>

          {/* Key Quick Indicators - 4 COLORFUL BOXES */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/90 border border-emerald-200/70 shadow-md shadow-emerald-500/5 hover:border-emerald-400 transition-all">
              <div className="w-11 h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Automated</p>
                <p className="text-sm font-extrabold text-slate-900">Instant Results</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/90 border border-amber-200/70 shadow-md shadow-amber-500/5 hover:border-amber-400 transition-all">
              <div className="w-11 h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Live Exam</p>
                <p className="text-sm font-extrabold text-slate-900">Countdown Clock</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/90 border border-sky-200/70 shadow-md shadow-sky-500/5 hover:border-sky-400 transition-all">
              <div className="w-11 h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-sky-500 to-blue-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Analytics</p>
                <p className="text-sm font-extrabold text-slate-900">Detailed Review</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/90 border border-purple-200/70 shadow-md shadow-purple-500/5 hover:border-purple-400 transition-all">
              <div className="w-11 h-11 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Evaluation</p>
                <p className="text-sm font-extrabold text-slate-900">Pass/Fail Status</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Subject Category Cards (Biology, Chemistry, Physics, English) & Class 11/12 Preparation */}
      <SubjectBoxes />

      {/* Attractive Educational Features Section - 4 COLORFUL FEATURE BOXES */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Designed For Academic Excellence
            </h2>
            <p className="mt-2 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Why Students &amp; Educators Choose <span className="text-indigo-600">Study Hub</span>
            </p>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A comprehensive test portal engineered to build examination confidence and sharpen critical thinking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Online Tests (Blue Theme) */}
            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 card-hover-lift transition-all group">
              <div className="w-13 h-13 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                Online Tests
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Subject-specific multiple-choice assessments with single-question navigation and clear question counters.
              </p>
            </div>

            {/* Card 2: Instant Results (Emerald Theme) */}
            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 card-hover-lift transition-all group">
              <div className="w-13 h-13 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Instant Results
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zero waiting time. Automated percentage calculations, pass/fail status, and time spent generated in seconds.
              </p>
            </div>

            {/* Card 3: Performance Tracking (Indigo/Violet Theme) */}
            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 card-hover-lift transition-all group">
              <div className="w-13 h-13 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Performance Tracking
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Student dashboard records average scores, best attempts, and question-by-question historical reviews.
              </p>
            </div>

            {/* Card 4: Easy Preparation (Amber Theme) */}
            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 card-hover-lift transition-all group">
              <div className="w-13 h-13 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                Easy Preparation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Realistic exam conditions with automated timer warnings ensure students master pacing before actual exams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Available Tests Preview */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Practice Tests
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Online Tests
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Browse our current curriculum or take a test right away.
              </p>
            </div>

            <Link
              to="/tests"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 group"
            >
              <span>View all tests</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredTests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto p-6 shadow-sm">
              <BookOpen className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No Tests Available Yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Tests created by admin will appear here automatically.</p>
              <Link to="/tests" className="text-xs font-bold text-indigo-600 hover:underline">Go to Tests Portal</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-md shadow-slate-100 hover:border-indigo-400 card-hover-lift transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                        {test.subject || "General"}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {test.duration} mins
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {test.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  <div className="px-6 pb-6 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500 font-semibold">
                        <span>{test.questions?.length || 0} Questions</span>
                        <span className="mx-1.5">•</span>
                        <span>Pass: {test.passingPercentage}%</span>
                      </div>

                      <Link
                        to={`/test/${test.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-sm transition-all"
                      >
                        Take Test
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works - 4 COLORFUL WORKFLOW BOXES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Workflow</h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              How Study Hub Works in 4 Steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-blue-100 bg-blue-50/40 relative card-hover-lift transition-all">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
                1
              </span>
              <h4 className="font-extrabold text-slate-900 mb-1 text-base">Create an Account</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register as a student in under 30 seconds with email verification.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-indigo-100 bg-indigo-50/40 relative card-hover-lift transition-all">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20">
                2
              </span>
              <h4 className="font-extrabold text-slate-900 mb-1 text-base">Select a Test</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from medical, programming, and general science subjects.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-pink-100 bg-pink-50/40 relative card-hover-lift transition-all">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md shadow-pink-500/20">
                3
              </span>
              <h4 className="font-extrabold text-slate-900 mb-1 text-base">Answer &amp; Submit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Navigate questions with live countdown timer and instant answer lock.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/40 relative card-hover-lift transition-all">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20">
                4
              </span>
              <h4 className="font-extrabold text-slate-900 mb-1 text-base">Review Performance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                See detailed score percentage, pass/fail badge, and correct solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-16 shadow-inner">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            Ready to test your academic skills?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join Study Hub today. Take your first test and track your journey to subject mastery.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl font-bold text-indigo-900 bg-white hover:bg-blue-50 shadow-xl transition-all hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link
              to="/tests"
              className="px-8 py-3.5 rounded-2xl font-bold text-white bg-white/20 hover:bg-white/30 border border-white/40 transition-all hover:scale-105"
            >
              Browse All Tests
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
