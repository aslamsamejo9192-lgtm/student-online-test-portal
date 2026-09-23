import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTestById, updateTest } from "../firebase";
import {
  PlusCircle,
  Trash2,
  Save,
  ArrowLeft,
  AlertCircle,
  Clock,
  Award,
  BookOpen,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function EditTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(65);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function loadTest() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getTestById(id);
        if (!data) {
          setError("Test not found.");
          return;
        }
        setTitle(data.title || "");
        setSubject(data.subject || "");
        setDescription(data.description || "");
        setDuration(data.duration || 15);
        setPassingPercentage(data.passingPercentage || 65);
        setQuestions(
          (data.questions || []).map((q, idx) => ({
            id: q.id || `q-${idx + 1}`,
            question: q.question || "",
            options: {
              A: q.options?.A || "",
              B: q.options?.B || "",
              C: q.options?.C || "",
              D: q.options?.D || ""
            },
            correctAnswer: q.correctAnswer || "A",
            explanation: q.explanation || ""
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Error fetching test details.");
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [id]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: "q-" + Date.now(),
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "A",
        explanation: ""
      }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) {
      alert("A test must contain at least one question.");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleOptionChange = (qIndex, optKey, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = {
        ...copy[qIndex],
        options: {
          ...copy[qIndex].options,
          [optKey]: value
        }
      };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !subject.trim()) {
      setError("Please fill in test title and subject.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Question #${i + 1} cannot have empty text.`);
        return;
      }
      if (
        !q.options.A.trim() ||
        !q.options.B.trim() ||
        !q.options.C.trim() ||
        !q.options.D.trim()
      ) {
        setError(`Question #${i + 1} must have all four options (A, B, C, D) completed.`);
        return;
      }
    }

    try {
      setSaving(true);
      const updatedPayload = {
        title: title.trim(),
        subject: subject.trim(),
        description: description.trim(),
        duration: Number(duration),
        passingPercentage: Number(passingPercentage),
        questions: questions.map((q, idx) => ({
          id: q.id || `q-${idx + 1}`,
          question: q.question.trim(),
          options: {
            A: q.options.A.trim(),
            B: q.options.B.trim(),
            C: q.options.C.trim(),
            D: q.options.D.trim()
          },
          correctAnswer: q.correctAnswer,
          explanation: q.explanation?.trim() || ""
        }))
      };

      await updateTest(id, updatedPayload);
      navigate("/admin/tests", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update test.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading test data for editing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/admin/tests"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Edit Test: {title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Modify question contents, options, duration, and passing criteria
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Test Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            General Test Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Test Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Duration (minutes) *
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                Passing Percentage (%) *
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Questions ({questions.length})
              </h2>
              <p className="text-xs text-slate-500">Edit or expand test questions.</p>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={q.id || qIdx}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  Question #{qIdx + 1}
                </span>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Question</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Question Text *
                </label>
                <textarea
                  rows={2}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIdx, "question", e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {["A", "B", "C", "D"].map((opt) => (
                  <div key={opt}>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center justify-between">
                      <span>Option {opt} *</span>
                      {q.correctAnswer === opt && (
                        <span className="text-emerald-600 font-semibold text-[10px]">
                          ✓ Correct Key
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                        {opt}:
                      </span>
                      <input
                        type="text"
                        value={q.options[opt]}
                        onChange={(e) => handleOptionChange(qIdx, opt, e.target.value)}
                        required
                        className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correct Answer Key *
                  </label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIdx, "correctAnswer", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Explanation / Solution Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={q.explanation || ""}
                    onChange={(e) => handleQuestionChange(qIdx, "explanation", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link
            to="/admin/tests"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Updates</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
