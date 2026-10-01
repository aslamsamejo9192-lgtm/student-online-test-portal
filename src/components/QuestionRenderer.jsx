import React from "react";
import QuestionFigure from "./QuestionFigure";
import { BookOpen } from "lucide-react";

export default function QuestionRenderer({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  isReview = false,
  correctAnswer = null
}) {
  if (!question) return null;

  return (
    <div className="space-y-4">
      {/* Passage box if question belongs to a reading passage (e.g. Q1 & Q2) */}
      {question.passage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 leading-relaxed text-xs sm:text-sm shadow-xs">
          <div className="flex items-center gap-2 font-bold text-indigo-900 uppercase tracking-wider text-[11px] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Reading Comprehension Passage (Questions 01–02)</span>
          </div>
          <p className="italic text-slate-700">
            "{question.passage}"
          </p>
        </div>
      )}

      {/* Render SVG Scientific Diagram / Figure if present */}
      {question.figureType && (
        <QuestionFigure figureType={question.figureType} />
      )}

      {/* Render Table if question has a tabular match or structure (e.g. Q60) */}
      {question.table && (
        <div className="overflow-x-auto my-3">
          <table className="min-w-full text-xs border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                {question.table.headers.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {question.table.rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Question Text */}
      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-line">
        {question.question}
      </h2>

      {/* Options List */}
      <div className="space-y-3 pt-2">
        {["A", "B", "C", "D"].map((optKey) => {
          const optText = question.options?.[optKey];
          if (!optText) return null;

          const isSelected = selectedAnswer === optKey;
          const isCorrect = isReview && (correctAnswer || question.correctAnswer) === optKey;
          const isWrongStudentPick = isReview && isSelected && !isCorrect;

          let btnClass = "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-800";
          let badgeClass = "bg-slate-100 text-slate-600";

          if (isReview) {
            if (isCorrect) {
              btnClass = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-medium";
              badgeClass = "bg-emerald-600 text-white";
            } else if (isWrongStudentPick) {
              btnClass = "border-rose-400 bg-rose-50 text-rose-950 font-medium";
              badgeClass = "bg-rose-600 text-white";
            }
          } else if (isSelected) {
            btnClass = "border-blue-600 bg-blue-50/80 text-blue-950 shadow-xs ring-1 ring-blue-600 font-medium";
            badgeClass = "bg-blue-600 text-white";
          }

          return (
            <button
              key={optKey}
              type="button"
              disabled={isReview}
              onClick={() => onSelectOption && onSelectOption(question.id, optKey)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start sm:items-center gap-3.5 ${btnClass} ${
                isReview ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${badgeClass}`}
              >
                {optKey}
              </div>
              <span className="text-xs sm:text-sm font-medium flex-1 pt-0.5 sm:pt-0 leading-snug">
                {optText}
              </span>

              {isReview && isCorrect && (
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  Correct Answer
                </span>
              )}
              {isReview && isWrongStudentPick && (
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-rose-100 text-rose-800 shrink-0">
                  Your Answer
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
