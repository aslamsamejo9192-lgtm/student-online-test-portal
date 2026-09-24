import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTests } from "../firebase";
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
  PlusCircle
} from "lucide-react";

export default function AvailableTests() {
  const { isAdmin } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assessment Catalog</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Available Online Tests
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Choose an exam from our curated subjects. All tests feature real-time countdown
              timers, automated grading, and instant performance feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>{filteredTests.length} tests ready</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-8 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests by title or keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSubject === sub
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-500">Loading available tests...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Tests Available Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            There are currently no examinations published. Tests added by instructors will appear here automatically.
          </p>
          {isAdmin ? (
            <Link
              to="/admin/tests/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Test</span>
            </Link>
          ) : (
            <p className="text-xs font-medium text-slate-400">
              Please check back shortly or check with your teacher.
            </p>
          )}
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
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
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex flex-col justify-between p-6 group"
            >
              <div>
                {/* Subject & Duration tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                    {test.subject || "General"}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {test.duration} Minutes
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {test.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                  {test.description || "Practice assessment designed to evaluate core knowledge and accuracy under timed conditions."}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs text-slate-500 mb-4 bg-slate-50/50 rounded-xl px-3">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                    <span>{test.questions?.length || 0} Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Pass: {test.passingPercentage}%</span>
                  </div>
                </div>

                <Link
                  to={`/test/${test.id}`}
                  className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600"
                >
                  <span>Start Test Attempt</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
