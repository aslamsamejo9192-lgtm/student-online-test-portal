import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTests, isTestUnlocked } from "../firebase";
import PaymentModal from "../components/PaymentModal";
import SubjectBoxes from "../components/SubjectBoxes";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Award,
  PlusCircle,
  Lock,
  CreditCard,
  CheckCircle2,
  Smartphone
} from "lucide-react";

export default function AvailableTests() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [activePaymentTest, setActivePaymentTest] = useState(null);

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const data = await getTests();
        setTests(data || []);
      } catch (err) {
        console.error("Failed to load tests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, []);

  // Compute subjects list
  const subjects = ["ALL", ...new Set(tests.map((t) => t.subject).filter(Boolean))];

  // Helper for colourful subject badge styles
  const getSubjectColorStyle = (subject = "") => {
    const s = subject.toLowerCase();
    if (s.includes("bio") || s.includes("medic")) return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    if (s.includes("chem")) return "bg-cyan-50 text-cyan-700 border-cyan-200/80";
    if (s.includes("phys")) return "bg-sky-50 text-sky-700 border-sky-200/80";
    if (s.includes("math")) return "bg-amber-50 text-amber-700 border-amber-200/80";
    if (s.includes("cs") || s.includes("prog") || s.includes("code")) return "bg-purple-50 text-purple-700 border-purple-200/80";
    if (s.includes("eng")) return "bg-rose-50 text-rose-700 border-rose-200/80";
    return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
  };

  // Filter tests
  const filteredTests = tests.filter((t) => {
    const matchesSubject = selectedSubject === "ALL" || t.subject === selectedSubject;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.subject && t.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 text-xs font-bold mb-2 border border-indigo-200/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Assessment Catalog &amp; Live Exams</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Available <span className="text-indigo-600">Online Tests</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Choose an exam from our curated subjects. All tests feature real-time countdown
              timers, automated grading, and instant performance feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span><strong className="text-indigo-600">{filteredTests.length}</strong> active assessments</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - BEST LOOKS BOX */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/30 mb-8 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests by title, subject or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 bg-slate-50/70 focus:bg-white transition-all"
          />
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === sub
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Subject Category Cards (Biology, Chemistry, Physics, English) & Class 11/12 Preparation */}
      <SubjectBoxes embedded />

      {/* Tests Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-500">Loading available tests...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="py-16 px-6 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/30 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full aspect-square bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">No Tests Available Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
            There are currently no examinations published. Tests added by instructors will appear here automatically.
          </p>
          {isAdmin ? (
            <Link
              to="/admin/tests/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Test</span>
            </Link>
          ) : (
            <p className="text-xs font-semibold text-indigo-600">
              Please check back soon for upcoming tests!
            </p>
          )}
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="py-16 px-6 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full aspect-square bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No matching tests found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try adjusting your search query or switching subject categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSubject("ALL");
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const unlocked = isTestUnlocked(test, user);
            const subjectColorClass = getSubjectColorStyle(test.subject);

            return (
              <div
                key={test.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-md shadow-slate-100 hover:border-indigo-400 card-hover-lift transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top colourful accent gradient bar */}
                <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500"></div>

                <div className="p-6">
                  {/* Subject & Duration tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${subjectColorClass}`}>
                      {test.subject || "General"}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {test.duration} Minutes
                    </span>
                  </div>

                  {/* Paid / Free badge */}
                  {test.isPaid ? (
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-300 shadow-2xs">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Rs. {test.price || 10} PKR</span>
                      </span>

                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Smartphone className="w-3 h-3 text-emerald-600" />
                        EasyPaisa &amp; JazzCash
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-xl text-[11px] font-bold bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>100% Free Practice Exam</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Free for all students</span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {test.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {test.description || "Practice assessment designed to evaluate core knowledge and accuracy under timed conditions."}
                  </p>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 text-xs text-slate-600 mb-4 bg-slate-50/70 rounded-2xl px-3.5">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{test.questions?.length || 0} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end font-semibold">
                      <Award className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Pass: {test.passingPercentage}%</span>
                    </div>
                  </div>

                  {test.isPaid && !unlocked ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActivePaymentTest(test)}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Rs. {test.price || 10}</span>
                      </button>

                      <Link
                        to={`/test/${test.id}`}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={`/test/${test.id}`}
                      className="w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      {test.isPaid && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                      <span>{test.isPaid ? "Attempt Unlocked Test" : "Start Test Attempt"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Global Payment Modal */}
      <PaymentModal
        test={activePaymentTest}
        isOpen={Boolean(activePaymentTest)}
        onClose={() => setActivePaymentTest(null)}
        onSuccess={() => {
          const targetId = activePaymentTest?.id;
          setActivePaymentTest(null);
          if (targetId) navigate(`/test/${targetId}`);
        }}
      />
    </div>
  );
}
