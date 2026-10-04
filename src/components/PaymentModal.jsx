import React, { useState } from "react";
import {
  X,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Lock,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { savePayment } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function PaymentModal({ test, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState("easypaisa"); // "easypaisa" | "jazzcash"
  const [senderPhone, setSenderPhone] = useState(user?.phone || "");
  const [senderName, setSenderName] = useState(user?.name || "");
  const [transactionId, setTransactionId] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successPaid, setSuccessPaid] = useState(false);

  if (!isOpen || !test) return null;

  const paymentAccount = {
    easypaisa: {
      name: "EasyPaisa",
      title: "Aslam Samejo / Medico Engineer",
      number: "03700113837",
      color: "emerald",
      badge: "EasyPaisa Mobile Account",
      instructions: "Open EasyPaisa App or dial *786# -> Send Money -> Mobile Account -> 03700113837 -> Amount: Rs. 10. Copy the 3737 Trx ID."
    },
    jazzcash: {
      name: "JazzCash",
      title: "Aslam Samejo / Medico Engineer",
      number: "03700113837",
      color: "amber",
      badge: "JazzCash Mobile Account",
      instructions: "Open JazzCash App or dial *786# -> Send Money -> To Mobile Account -> 03700113837 -> Amount: Rs. 10. Copy the 8558 TID."
    }
  }[selectedMethod];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanTid = transactionId.trim().toUpperCase();
    if (!cleanTid || cleanTid.length < 5) {
      setError("Please enter a valid Transaction ID (TID / Trx ID) from your SMS receipt.");
      return;
    }

    if (!senderPhone.trim() || senderPhone.trim().length < 10) {
      setError("Please provide the sender mobile number used for payment.");
      return;
    }

    try {
      setSubmitting(true);
      const paymentRecord = {
        studentId: user?.uid || "guest",
        studentName: senderName.trim() || user?.name || "Student",
        studentEmail: user?.email || "",
        studentPhone: senderPhone.trim(),
        studentRollNo: user?.rollNo || "",
        testId: test.id,
        testTitle: test.title,
        amount: test.price || 10,
        currency: "PKR",
        method: selectedMethod === "easypaisa" ? "EasyPaisa" : "JazzCash",
        transactionId: cleanTid,
        status: "Verified",
        createdAt: new Date().toISOString()
      };

      await savePayment(paymentRecord);
      setSuccessPaid(true);

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to verify transaction. Please check details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Secure Paid Assessment</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Unlock Examination Access
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            {test.title}
          </p>

          {/* Price Tag Badge */}
          <div className="mt-4 flex items-baseline gap-2 bg-white/10 px-4 py-2.5 rounded-2xl w-fit border border-white/20">
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Test Fee:</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">Rs. {test.price || 10}</span>
            <span className="text-xs text-slate-300">PKR Only</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {successPaid ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Payment Verified Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Test <strong>{test.title}</strong> has been unlocked for your student account. Starting exam now...
              </p>
              <div className="pt-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Selector Tabs */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* EasyPaisa Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("easypaisa")}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      selectedMethod === "easypaisa"
                        ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="font-extrabold text-sm text-slate-900">EasyPaisa</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Instant Mobile Pay</span>
                    </div>
                    {selectedMethod === "easypaisa" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </button>

                  {/* JazzCash Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("jazzcash")}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      selectedMethod === "jazzcash"
                        ? "border-amber-600 bg-amber-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="font-extrabold text-sm text-slate-900">JazzCash</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Fast Mobile Transfer</span>
                    </div>
                    {selectedMethod === "jazzcash" && (
                      <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Account Details Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Official Receiver Account
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                    {paymentAccount.name}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Account Number</span>
                    <span className="font-mono text-base font-bold text-slate-900">{paymentAccount.number}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentAccount.number, "number")}
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                  >
                    {copiedKey === "number" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Account Title</span>
                    <span className="text-xs font-bold text-slate-800">{paymentAccount.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentAccount.title, "title")}
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                  >
                    {copiedKey === "title" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  💡 {paymentAccount.instructions}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Enter Payment Verification Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Sender Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="e.g. 03001234567"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Sender Name *
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Ali Khan"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-indigo-900 mb-1 flex items-center justify-between">
                    <span>Transaction ID (TID / Trx ID) *</span>
                    <span className="text-[10px] text-slate-400 font-normal">From 3737 or 8558 SMS</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 2389104928"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/20 text-xs font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Payment...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Payment &amp; Start Test (Rs. 10)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Direct Support */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  Instant Automatic Unlock
                </span>
                <a
                  href="https://wa.me/923700113837?text=Assalam%20o%20Alaikum%2C%20I%20have%20sent%20Rs%2010%20test%20fee"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-600 font-semibold hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Support
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
