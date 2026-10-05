import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Clock,
  ChevronRight,
  FileQuestion,
  GraduationCap,
  Search,
  Trophy,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getTests } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function SubjectBoxes({ embedded = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterSearch, setChapterSearch] = useState("");
  const [allTests, setAllTests] = useState([]);

  // Attempt flow stages: 'card' (1st image) | 'form' (2nd image) | 'quiz' (questions)
  const [attemptStage, setAttemptStage] = useState("card");

  // Student registration details for quiz attempt
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    phone: "",
    email: "",
    district: ""
  });

  useEffect(() => {
    async function loadTests() {
      try {
        const tests = await getTests();
        setAllTests(tests || []);
      } catch (err) {
        console.error("Failed to load tests in SubjectBoxes:", err);
      }
    }
    loadTests();
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setStudentInfo((prev) => ({
        ...prev,
        name: prev.name || user.name || user.displayName || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  const subjects = [
    {
      id: "biology",
      name: "Biology",
      mcqs: "1,200+ MCQs",
      theme: "emerald",
      bgClass: "from-[#062c22] via-[#042019] to-[#031510]",
      borderClass: "border-[#0d4a3b]/70 hover:border-emerald-400/80",
      glowClass: "shadow-emerald-950/40 hover:shadow-emerald-500/20",
      btnBg: "bg-[#053b2f] hover:bg-[#074b3b] text-emerald-400 group-hover:scale-110",
      accentText: "text-emerald-400",
      chapters: [
        { id: "bio-01", number: "01", title: "Bioenergetics" },
        { id: "bio-02", number: "02", title: "Biological Molecules" },
        { id: "bio-03", number: "03", title: "Biotechnology" },
        { id: "bio-04", number: "04", title: "CHEMICAL COORDINATION" },
        { id: "bio-05", number: "05", title: "Circulation" },
        { id: "bio-06", number: "06", title: "Digestion" },
        { id: "bio-07", number: "07", title: "Evolution" },
        { id: "bio-08", number: "08", title: "Homeostasis & Excretion" },
        { id: "bio-09", number: "09", title: "Immunity" },
        { id: "bio-10", number: "10", title: "Inheritance" },
        { id: "bio-11", number: "11", title: "NERVOUS COORDINATION" },
        { id: "bio-12", number: "12", title: "Other/Mixed" },
        { id: "bio-13", number: "13", title: "Reproduction" },
        { id: "bio-14", number: "14", title: "Respiration" },
        { id: "bio-15", number: "15", title: "Support & Movement" },
        { id: "bio-16", number: "16", title: "The Cell" },
        { id: "bio-17", number: "17", title: "The Enzyme" },
        { id: "bio-18", number: "18", title: "The Virus" }
      ]
    },
    {
      id: "chemistry",
      name: "Chemistry",
      mcqs: "900+ MCQs",
      theme: "blue",
      bgClass: "from-[#0c2647] via-[#081b33] to-[#051121]",
      borderClass: "border-[#144275]/70 hover:border-blue-400/80",
      glowClass: "shadow-blue-950/40 hover:shadow-blue-500/20",
      btnBg: "bg-[#0d3159] hover:bg-[#113d6e] text-blue-400 group-hover:scale-110",
      accentText: "text-blue-400",
      chapters: [
        { id: "chem-01", number: "01", title: "Alcohol, Phenol and Ether" },
        { id: "chem-02", number: "02", title: "Aldehydes and Ketones" },
        { id: "chem-03", number: "03", title: "Alkyl Halide and Amine" },
        { id: "chem-04", number: "04", title: "Atomic Structure" },
        { id: "chem-05", number: "05", title: "Carboxylic Acid" },
        { id: "chem-06", number: "06", title: "Chemical Bonding" },
        { id: "chem-07", number: "07", title: "Chemical Equilibrium" },
        { id: "chem-08", number: "08", title: "D and f block" },
        { id: "chem-09", number: "09", title: "Electrochemistry" },
        { id: "chem-10", number: "10", title: "Fundamentals of Chemistry" },
        { id: "chem-11", number: "11", title: "Gases" },
        { id: "chem-12", number: "12", title: "Hydrocarbons" },
        { id: "chem-13", number: "13", title: "Industrial Chemistry" },
        { id: "chem-14", number: "14", title: "Introduction To Organic Chemistry" },
        { id: "chem-15", number: "15", title: "Liquids" },
        { id: "chem-16", number: "16", title: "Macromolecules" },
        { id: "chem-17", number: "17", title: "Nomenclature" },
        { id: "chem-18", number: "18", title: "Other/Mixed" },
        { id: "chem-19", number: "19", title: "Reaction Kinetics" },
        { id: "chem-20", number: "20", title: "S and p block" },
        { id: "chem-21", number: "21", title: "Solids" },
        { id: "chem-22", number: "22", title: "Thermochemistry" }
      ]
    },
    {
      id: "physics",
      name: "Physics",
      mcqs: "850+ MCQs",
      theme: "indigo",
      bgClass: "from-[#171b45] via-[#101332] to-[#0a0c20]",
      borderClass: "border-[#232a6b]/70 hover:border-indigo-400/80",
      glowClass: "shadow-indigo-950/40 hover:shadow-indigo-500/20",
      btnBg: "bg-[#1d235c] hover:bg-[#252c73] text-indigo-400 group-hover:scale-110",
      accentText: "text-indigo-400",
      chapters: [
        { id: "phy-01", number: "01", title: "AC & Electronics" },
        { id: "phy-02", number: "02", title: "Atomic Spectra" },
        { id: "phy-03", number: "03", title: "Current Electricity" },
        { id: "phy-04", number: "04", title: "Dawn Of Modern Physics" },
        { id: "phy-05", number: "05", title: "Dynamics" },
        { id: "phy-06", number: "06", title: "Electromagnetic Induction" },
        { id: "phy-07", number: "07", title: "Electromagnetism" },
        { id: "phy-08", number: "08", title: "Electronics" },
        { id: "phy-09", number: "09", title: "Electrostatics" },
        { id: "phy-10", number: "10", title: "Fluid Dynamics" },
        { id: "phy-11", number: "11", title: "Kinematics" },
        { id: "phy-12", number: "12", title: "Nuclear Physics" },
        { id: "phy-13", number: "13", title: "Other/Mixed" },
        { id: "phy-14", number: "14", title: "Projectile Motion + Rotational and Circular Motion" },
        { id: "phy-15", number: "15", title: "Thermodynamics" },
        { id: "phy-16", number: "16", title: "Vectors and Equilibrium" },
        { id: "phy-17", number: "17", title: "Waves And Oscillations" },
        { id: "phy-18", number: "18", title: "Work Power and Energy" }
      ]
    },
    {
      id: "english",
      name: "English",
      mcqs: "500+ MCQs",
      theme: "amber",
      bgClass: "from-[#332412] via-[#241a0d] to-[#161008]",
      borderClass: "border-[#593f1f]/70 hover:border-amber-400/80",
      glowClass: "shadow-amber-950/40 hover:shadow-amber-500/20",
      btnBg: "bg-[#402d17] hover:bg-[#523a1c] text-amber-400 group-hover:scale-110",
      accentText: "text-amber-400",
      chapters: [
        { id: "eng-01", number: "01", title: "Vocabulary & Synonyms / Antonyms" },
        { id: "eng-02", number: "02", title: "Tenses & Verb Forms" },
        { id: "eng-03", number: "03", title: "Sentence Completion" },
        { id: "eng-04", number: "04", title: "Prepositions & Phrasal Verbs" },
        { id: "eng-05", number: "05", title: "Active & Passive Voice" },
        { id: "eng-06", number: "06", title: "Direct & Indirect Speech" },
        { id: "eng-07", number: "07", title: "Subject-Verb Agreement" },
        { id: "eng-08", number: "08", title: "Articles & Conjunctions" },
        { id: "eng-09", number: "09", title: "Conditional Sentences" },
        { id: "eng-10", number: "10", title: "Idioms & Phrases" },
        { id: "eng-11", number: "11", title: "Error Detection & Spotting" },
        { id: "eng-12", number: "12", title: "Reading Comprehension" }
      ]
    }
  ];

  const currentSubjectObj = subjects.find((s) => s.id === selectedSubject);

  // Filter real uploaded tests matching current subject
  const subjectTests = currentSubjectObj
    ? allTests.filter(
        (t) =>
          (t.subject || "").toLowerCase() === currentSubjectObj.name.toLowerCase() ||
          (t.subject || "").toLowerCase() === currentSubjectObj.id.toLowerCase()
      )
    : [];

  // Filter chapters by search
  const visibleChapters = currentSubjectObj
    ? currentSubjectObj.chapters.filter((ch) =>
        ch.title.toLowerCase().includes(chapterSearch.toLowerCase())
      )
    : [];

  // Matching uploaded test for selected chapter if any
  const matchingTest =
    selectedChapter && currentSubjectObj
      ? subjectTests.find(
          (t) =>
            (t.chapter && t.chapter.toLowerCase() === selectedChapter.title.toLowerCase()) ||
            (t.title && t.title.toLowerCase().includes(selectedChapter.title.toLowerCase()))
        ) || subjectTests[0]
      : null;

  const handleOpenSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    setSelectedChapter(null);
    setChapterSearch("");
    setAttemptStage("card");
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setChapterSearch("");
    setAttemptStage("card");
  };

  const handleSelectChapter = (ch) => {
    setSelectedChapter(ch);
    setAttemptStage("card");
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setAttemptStage("card");
  };

  const handleAttemptQuizClick = () => {
    setAttemptStage("form");
  };

  const handleContinueToQuiz = (e) => {
    e.preventDefault();
    if (!studentInfo.name.trim()) return;

    // If an uploaded test is found with questions, start test directly!
    if (matchingTest && matchingTest.questions && matchingTest.questions.length > 0) {
      navigate(`/test/${matchingTest.id}`);
      return;
    }

    // Otherwise show quiz structure awaiting questions (as per user note)
    setAttemptStage("quiz");
  };

  return (
    <section
      className={`${
        embedded
          ? "py-8 sm:py-10 rounded-3xl my-6 border border-slate-800/90 shadow-2xl px-2 sm:px-4"
          : "py-14 sm:py-20 border-y border-slate-800/80"
      } bg-[#070b14] text-white relative overflow-hidden`}
    >
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================
            VIEW 1: Main 4 Subject Boxes (Biology, Chemistry, Physics, English)
           ======================================================== */}
        {!selectedSubject && (
          <div>
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 text-indigo-400 text-xs font-bold border border-slate-700/80 mb-3 shadow-sm">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Curriculum &amp; Exam Preparation Portal</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Select Your Subject
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-400">
                Choose a subject below to view all chapters and start practice tests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-fade-in">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleOpenSubject(sub.id)}
                  className={`group relative rounded-[28px] p-7 sm:p-8 bg-gradient-to-br ${sub.bgClass} border ${sub.borderClass} shadow-xl ${sub.glowClass} cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between min-h-[190px] sm:min-h-[210px] overflow-hidden`}
                >
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-white transition-colors mb-1.5">
                      {sub.name}
                    </h3>
                    <p className={`text-sm sm:text-base font-medium ${sub.accentText}`}>
                      {sub.mcqs}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-full aspect-square flex items-center justify-center shrink-0 shadow-lg ${sub.btnBg} transition-transform duration-300`}
                    >
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                    </div>

                    <span className="text-xs text-slate-400 group-hover:text-white font-medium flex items-center gap-1 transition-colors">
                      <span>Open Subject</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: Subject Selected -> Shows CHAPTERS LIST
            (Matching the user's uploaded chapters list image)
           ======================================================== */}
        {selectedSubject && currentSubjectObj && !selectedChapter && (
          <div className="animate-fade-in">
            {/* Top Navigation Bar with Back & Subject Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <button
                type="button"
                onClick={handleBackToSubjects}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all hover:text-white cursor-pointer self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Subjects</span>
              </button>

              {/* Quick Subject Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleOpenSubject(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sub.id === selectedSubject
                        ? "bg-white text-slate-900 shadow-md font-black"
                        : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapters Header & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Chapters
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Select a unit to start your practice session.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px] sm:min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={chapterSearch}
                  onChange={(e) => setChapterSearch(e.target.value)}
                  placeholder="Search chapters..."
                  className="w-full bg-[#0b101d] text-xs sm:text-sm text-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            {/* Chapters List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              {visibleChapters.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                  No chapters found matching "{chapterSearch}".
                </div>
              ) : (
                visibleChapters.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => handleSelectChapter(ch)}
                    className="group bg-[#0b101d] hover:bg-[#11192e] border border-slate-800/90 hover:border-blue-500/50 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-[#141d34] text-blue-400 text-xs font-bold flex items-center justify-center border border-blue-900/50 shrink-0">
                        {ch.number}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-white group-hover:text-blue-200 transition-colors truncate">
                        {ch.title}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 3: Chapter Selected -> 3-STEP QUIZ FLOW
            1. First Image Box (Attempt Quiz Card)
            2. Second Image Box (Start Quiz Registration Form)
            3. Questions View (Ready for questions upload)
           ======================================================== */}
        {selectedSubject && currentSubjectObj && selectedChapter && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <button
                type="button"
                onClick={handleBackToChapters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Chapters</span>
              </button>

              <button
                type="button"
                onClick={handleBackToSubjects}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                All Subjects
              </button>
            </div>

            {/* ----------------------------------------------------
                STEP 1: FIRST IMAGE CARD (1791209887613.jpg)
                Subject Badge, Chapter Badge, Year Badge, Title,
                70 MIN, 50 MARKS, SINDH, Attempt Quiz Button
               ---------------------------------------------------- */}
            {attemptStage === "card" && (
              <div className="bg-[#0b101d] border border-slate-800/90 rounded-[28px] p-6 sm:p-8 shadow-2xl animate-fade-in">
                {/* Top Badges Row */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Subject badge */}
                    <span className="px-3 py-1 rounded-full bg-[#131d35] text-blue-400 font-bold text-xs">
                      {currentSubjectObj.name}
                    </span>
                    {/* Chapter badge */}
                    <span className="px-3 py-1 rounded-full bg-[#26180a] text-amber-500 font-bold text-xs uppercase tracking-wider">
                      {selectedChapter.title}
                    </span>
                  </div>

                  {/* Year badge */}
                  <span className="px-2.5 py-1 rounded-lg bg-[#121929] text-slate-400 font-semibold text-xs border border-slate-800/80">
                    2025
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-6 tracking-tight">
                  {selectedChapter.title} Test 2025
                </h3>

                {/* Meta Chips Row */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-7 flex-wrap">
                  {/* Time chip */}
                  <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121929] text-blue-300 text-xs font-semibold border border-blue-950/60">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>70 MIN</span>
                  </div>

                  {/* Marks chip */}
                  <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121929] text-blue-300 text-xs font-semibold border border-blue-950/60">
                    <Trophy className="w-3.5 h-3.5 text-blue-400" />
                    <span>50 MARKS</span>
                  </div>

                  {/* Board chip */}
                  <div className="px-3.5 py-2 rounded-xl bg-[#121929] text-slate-300 text-xs font-semibold border border-slate-800">
                    <span>SINDH</span>
                  </div>
                </div>

                {/* Attempt Quiz Button */}
                <button
                  type="button"
                  onClick={handleAttemptQuizClick}
                  className="w-full py-4 px-6 rounded-2xl bg-[#5d7bf7] hover:bg-[#4d6ee8] text-white font-bold text-base flex items-center justify-between shadow-lg shadow-indigo-600/30 transition-all cursor-pointer group"
                >
                  <span className="font-bold">Attempt Quiz</span>
                  <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>
            )}

            {/* ----------------------------------------------------
                STEP 2: SECOND IMAGE FORM (1791209912081.jpg)
                BookOpen Header "Start: {Chapter} 2024",
                Form Card "Start Quiz", Full Name, Phone, Email, District,
                "Continue to Quiz" Button
               ---------------------------------------------------- */}
            {attemptStage === "form" && (
              <div className="animate-fade-in">
                {/* Header (Matching 2nd image top left) */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Start: {selectedChapter.title} 2025
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Ready to begin?
                    </p>
                  </div>
                </div>

                {/* Start Quiz Form Card */}
                <div className="bg-[#0b101d] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <h4 className="text-xl font-bold text-white">Start Quiz</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-6">
                    Fill in your basic information to begin.
                  </p>

                  <form onSubmit={handleContinueToQuiz} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ali Ahmad"
                        value={studentInfo.name}
                        onChange={(e) =>
                          setStudentInfo({ ...studentInfo, name: e.target.value })
                        }
                        className="w-full bg-[#070b14] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 03001234567"
                        value={studentInfo.phone}
                        onChange={(e) =>
                          setStudentInfo({ ...studentInfo, phone: e.target.value })
                        }
                        className="w-full bg-[#070b14] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ali@example.com"
                        value={studentInfo.email}
                        onChange={(e) =>
                          setStudentInfo({ ...studentInfo, email: e.target.value })
                        }
                        className="w-full bg-[#070b14] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        District
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lahore, Multan, Karachi"
                        value={studentInfo.district}
                        onChange={(e) =>
                          setStudentInfo({ ...studentInfo, district: e.target.value })
                        }
                        className="w-full bg-[#070b14] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#5d7bf7] hover:bg-[#4d6ee8] text-white font-bold text-sm shadow-md transition-all cursor-pointer mt-3"
                    >
                      Continue to Quiz
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                STEP 3: QUESTIONS SCREEN STRUCTURE
                (Awaiting question upload by instructor, as requested)
               ---------------------------------------------------- */}
            {attemptStage === "quiz" && (
              <div className="bg-[#0b101d] border border-slate-800/90 rounded-[28px] p-6 sm:p-8 shadow-2xl animate-fade-in">
                {/* Quiz Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-6">
                  <div>
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                      {currentSubjectObj.name} • {selectedChapter.title}
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                      Question 1 of 50
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>70:00</span>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
                      Student: {studentInfo.name || "Candidate"}
                    </span>
                  </div>
                </div>

                {/* Question Structure Placeholder (no mock questions as requested) */}
                <div className="p-8 rounded-2xl bg-[#070b14] border border-slate-800/90 text-center my-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
                    <FileQuestion className="w-7 h-7" />
                  </div>

                  <h5 className="text-xl font-bold text-white mb-2">
                    Questions Ready for Upload
                  </h5>

                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
                    Is chapter ke questions abhi upload nahi kiye gaye hain. Jab aap Admin Panel se test ya questions upload karenge, to wo is structure mein live open honge.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAttemptStage("card")}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5d7bf7] hover:bg-[#4d6ee8] text-white transition-all cursor-pointer"
                    >
                      Back to Quiz Info
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToChapters}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                    >
                      Choose Another Chapter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
