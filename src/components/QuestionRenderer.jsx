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

          let btnClass = "border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-800 bg-white";
          let badgeClass = "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700";

          if (isReview) {
            if (isCorrect) {
              btnClass = "border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/30 font-semibold shadow-xs";
              badgeClass = "bg-emerald-600 text-white shadow-xs";
            } else if (isWrongStudentPick) {
              btnClass = "border-rose-400 bg-rose-50/80 text-rose-950 ring-2 ring-rose-400/30 font-semibold shadow-xs";
              badgeClass = "bg-rose-600 text-white shadow-xs";
            }
          } else if (isSelected) {
            btnClass = "border-indigo-600 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/70 text-indigo-950 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/30 font-semibold";
            badgeClass = "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs";
          }

          return (
            <button
              key={optKey}
              type="button"
              disabled={isReview}
              onClick={() => onSelectOption && onSelectOption(question.id, optKey)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start sm:items-center gap-3.5 group ${btnClass} ${
                isReview ? "cursor-default" : "cursor-pointer hover:scale-[1.005] active:scale-[0.995]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full aspect-square font-bold text-xs flex items-center justify-center shrink-0 transition-all ${badgeClass}`}
              >
                {optKey}
              </div>
              <span className="text-xs sm:text-sm font-medium flex-1 pt-0.5 sm:pt-0 leading-relaxed">
                {optText}
              </span>

              {isReview && isCorrect && (
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-800 shrink-0 border border-emerald-200 shadow-2xs">
                  Correct Answer
                </span>
              )}
              {isReview && isWrongStudentPick && (
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold bg-rose-100 text-rose-800 shrink-0 border border-rose-200 shadow-2xs">
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
