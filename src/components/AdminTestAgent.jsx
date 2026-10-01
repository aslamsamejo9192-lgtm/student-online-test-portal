import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createTest } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Rocket,
  Eye,
  Trash2,
  X,
  BookOpen,
  Clock,
  ArrowRight
} from "lucide-react";

export default function AdminTestAgent({ onTestPublished }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Strict security guard: ONLY Aslam Samejo (aslamsamejo9192@gmail.com) can see or use this Agent
  const isAuthorizedAdmin = Boolean(
    isAdmin &&
    user &&
    (user.email || "").toLowerCase() === "aslamsamejo9192@gmail.com"
  );

  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // { name, mimeType, base64, size }
  const [customTitle, setCustomTitle] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [passingPercentage, setPassingPercentage] = useState(60);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [previewTest, setPreviewTest] = useState(null);
  const [publishedTest, setPublishedTest] = useState(null);

  if (!isAuthorizedAdmin) {
    return null;
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    setError("");
    setPublishedTest(null);

    const maxSizeMB = 20;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB. Please upload a smaller PDF or paste the text directly.`);
      return;
    }

    // If plain text file, read directly into textarea
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setInputText(String(ev.target?.result || ""));
        setSelectedFile({
          name: file.name,
          mimeType: "text/plain",
          base64: "",
          size: (file.size / 1024).toFixed(1) + " KB"
        });
      };
      reader.readAsText(file);
      return;
    }

    // For PDF or Image files, read as Base64 for Gemini multimodal extraction
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = String(ev.target?.result || "");
      const base64Part = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
      setSelectedFile({
        name: file.name,
        mimeType: file.type || "application/pdf",
        base64: base64Part,
        size: (file.size / 1024).toFixed(1) + " KB"
      });
    };
    reader.onerror = () => {
      setError("Could not read the selected file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRunAgent = async (autoPublish = true) => {
    setError("");
    setPublishedTest(null);

    if (!inputText.trim() && (!selectedFile || !selectedFile.base64)) {
      setError("Baraye meharbani PDF file upload karein ya text/MCQs paste karein.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage(
        selectedFile?.base64
          ? `AI Agent "${selectedFile.name}" ko read kar ke MCQs extract kar raha hai...`
          : "AI Agent aapke text ko online MCQ test mein convert kar raha hai..."
      );

      const response = await fetch("/api/agent/convert-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: inputText,
          fileBase64: selectedFile?.base64 || "",
          fileMimeType: selectedFile?.mimeType || "",
          fileName: selectedFile?.name || "",
          customTitle: customTitle.trim(),
          customSubject: customSubject.trim(),
          duration: duration ? Number(duration) : undefined,
          passingPercentage: Number(passingPercentage) || 60
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.test) {
        throw new Error(data.error || "Test convert karne mein masla aaya. Dobara koshish karein.");
      }

      const generatedTest = data.test;

      if (autoPublish) {
        setStatusMessage("Test ko portal par LIVE publish kiya ja raha hai...");
        const savedTest = await createTest(generatedTest);
        setPublishedTest(savedTest);
        setPreviewTest(null);
        setInputText("");
        handleClearFile();
        setCustomTitle("");
        setCustomSubject("");
        if (typeof onTestPublished === "function") {
          onTestPublished(savedTest);
        }
      } else {
        setPreviewTest(generatedTest);
      }
    } catch (err) {
      console.error("Agent conversion error:", err);
      setError(err.message || "AI Agent conversion failed.");
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const handlePublishPreviewedTest = async () => {
    if (!previewTest) return;
    try {
      setLoading(true);
      setStatusMessage("Test ko portal par LIVE publish kiya ja raha hai...");
      const savedTest = await createTest(previewTest);
      setPublishedTest(savedTest);
      setPreviewTest(null);
      setInputText("");
      handleClearFile();
      setCustomTitle("");
      setCustomSubject("");
      if (typeof onTestPublished === "function") {
        onTestPublished(savedTest);
      }
    } catch (err) {
      setError(err.message || "Failed to publish test.");
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-500/20">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1.5">
              <span>Admin Exclusive AI Agent</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              AI PDF &amp; Text to Live Test Agent
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/80 mt-0.5">
              Koi bhi PDF file, image, ya MCQs text dein — yeh Agent khud usay online test mein convert kar ke foran LIVE kar dega.
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mt-5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-3 text-xs sm:text-sm text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Published Confirmation Banner */}
      {publishedTest && (
        <div className="mt-5 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-300 text-sm sm:text-base">
                Test Successfully Converted &amp; LIVE!
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                <strong>{publishedTest.title}</strong> ({publishedTest.questions?.length || 0} MCQs) ab students ke liye Available Tests mein live ho chuka hai.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/test/${publishedTest.id}`)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Live Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="mt-6 space-y-5">
        {/* Optional Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200 mb-1.5">
              Test Title (Optional - Auto)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. MDCAT Biology Grand Test"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200 mb-1.5">
              Subject (Optional - Auto)
            </label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="e.g. Biology, Chemistry, Full MDCAT"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200 mb-1.5">
              Time Duration (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="300"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Auto based on MCQs"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* File Upload + Text Paste Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* PDF / File Upload Box */}
          <div className="lg:col-span-1 flex flex-col">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200 mb-1.5">
              1. Upload PDF / Question Paper
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 min-h-[180px] rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                selectedFile
                  ? "border-emerald-400/60 bg-emerald-500/10"
                  : "border-indigo-400/40 bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-emerald-200 break-all px-2">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{selectedFile.size}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearFile();
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove File</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-white">
                    Click to Upload PDF or Image
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-[200px]">
                    Supports .PDF, .PNG, .JPG, or .TXT question papers &amp; notes
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Paste Text / MCQs Box */}
          <div className="lg:col-span-2 flex flex-col">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200 mb-1.5">
              2. Or Paste Text / MCQs / Topic Instructions
            </label>
            <textarea
              rows={7}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Yahan MCQs paste karein ya koi bhi paragraph / topic likhein...\nExample:\n1. Which organelle is known as the powerhouse of the cell?\nA) Ribosome  B) Mitochondria  C) Golgi body  D) Nucleus\nAnswer: B`}
              className="w-full flex-1 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleRunAgent(false)}
            className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Convert &amp; Preview Questions</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleRunAgent(true)}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{statusMessage || "Converting & Publishing..."}</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Convert &amp; Make Test LIVE Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Drawer (if Admin chose Preview first) */}
      {previewTest && (
        <div className="mt-8 pt-6 border-t border-indigo-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/90 p-4 rounded-2xl border border-indigo-500/30">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                Ready to Go Live
              </span>
              <h3 className="text-lg font-extrabold text-white">{previewTest.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  {previewTest.subject}
                </span>
                <span>•</span>
                <span>{previewTest.questions.length} MCQs Extracted</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {previewTest.duration} mins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewTest(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handlePublishPreviewedTest}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Publish &amp; Make LIVE ({previewTest.questions.length} MCQs)</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
            {previewTest.questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300">
                    Q{idx + 1}. [{q.section}]
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                    Correct: Option {q.correctAnswer}
                  </span>
                </div>
                <p className="text-white font-semibold text-sm">{q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {["A", "B", "C", "D"].map((optKey) => (
                    <div
                      key={optKey}
                      className={`p-2 rounded-lg border ${
                        q.correctAnswer === optKey
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold"
                          : "bg-slate-900/50 border-slate-700 text-slate-300"
                      }`}
                    >
                      <span className="font-bold mr-1.5">{optKey})</span>
                      {q.options?.[optKey]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
