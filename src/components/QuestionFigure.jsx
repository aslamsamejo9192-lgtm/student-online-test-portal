import React from "react";

export default function QuestionFigure({ figureType }) {
  if (!figureType) return null;

  switch (figureType) {
    case "chemical-ozonolysis":
      return (
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-2">
            Chemical Reaction Scheme
          </span>
          <svg
            viewBox="0 0 520 120"
            className="w-full max-w-lg h-auto text-slate-800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Alkene */}
            <text x="20" y="45" fontSize="15" fontWeight="bold" fill="#0f172a">R</text>
            <line x1="38" y1="42" x2="60" y2="60" stroke="#0f172a" strokeWidth="2.5" />
            <text x="20" y="90" fontSize="15" fontWeight="bold" fill="#0f172a">H</text>
            <line x1="38" y1="80" x2="60" y2="62" stroke="#0f172a" strokeWidth="2.5" />

            <text x="65" y="65" fontSize="18" fontWeight="bold" fill="#2563eb">C</text>
            <line x1="82" y1="58" x2="115" y2="58" stroke="#2563eb" strokeWidth="2.5" />
            <line x1="82" y1="64" x2="115" y2="64" stroke="#2563eb" strokeWidth="2.5" />
            <text x="120" y="65" fontSize="18" fontWeight="bold" fill="#2563eb">C</text>

            <line x1="135" y1="60" x2="155" y2="42" stroke="#0f172a" strokeWidth="2.5" />
            <text x="160" y="45" fontSize="15" fontWeight="bold" fill="#0f172a">R</text>
            <line x1="135" y1="62" x2="155" y2="80" stroke="#0f172a" strokeWidth="2.5" />
            <text x="160" y="90" fontSize="15" fontWeight="bold" fill="#0f172a">H</text>

            {/* + O3 */}
            <text x="195" y="65" fontSize="16" fontWeight="bold" fill="#0f172a">+</text>
            <text x="215" y="65" fontSize="16" fontWeight="bold" fill="#4338ca">O₃</text>

            {/* Arrow 1 */}
            <line x1="245" y1="60" x2="285" y2="60" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
            <polygon points="285,56 295,60 285,64" fill="#475569" />

            {/* Intermediate A */}
            <rect x="305" y="38" width="45" height="42" rx="8" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1.5" />
            <text x="320" y="64" fontSize="16" fontWeight="bold" fill="#3730a3">A</text>
            <text x="300" y="96" fontSize="10" fill="#64748b">(Ozonide)</text>

            {/* Arrow 2 with Zn / H2O */}
            <line x1="365" y1="60" x2="415" y2="60" stroke="#475569" strokeWidth="2" />
            <polygon points="415,56 425,60 415,64" fill="#475569" />
            <text x="375" y="48" fontSize="12" fontWeight="bold" fill="#059669">Zn</text>
            <line x1="375" y1="52" x2="405" y2="52" stroke="#059669" strokeWidth="1" />
            <text x="370" y="78" fontSize="11" fontWeight="bold" fill="#059669">H₂O</text>

            {/* Final product label */}
            <text x="435" y="64" fontSize="14" fontWeight="bold" fill="#b45309">Final Product?</text>
          </svg>
        </div>
      );

    case "skull-suture-diagram":
      return (
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-2">
            Anatomical Figure: Human Cranium Suture
          </span>
          <svg
            viewBox="0 0 400 240"
            className="w-full max-w-sm h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Skull outline */}
            <path
              d="M100 170 C90 140 85 90 150 50 C220 15 310 40 320 100 C325 140 300 170 280 180 C270 210 230 220 190 220 C140 220 110 200 100 170 Z"
              fill="#f8fafc"
              stroke="#334155"
              strokeWidth="3"
            />
            {/* Eye orbit */}
            <ellipse cx="140" cy="130" rx="20" ry="24" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
            {/* Nasal cavity */}
            <polygon points="120,155 130,175 115,175" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            {/* Teeth / Jaw area */}
            <path d="M120 195 Q140 195 160 195" stroke="#475569" strokeWidth="2.5" />
            <line x1="130" y1="190" x2="130" y2="200" stroke="#64748b" strokeWidth="2" />
            <line x1="140" y1="190" x2="140" y2="200" stroke="#64748b" strokeWidth="2" />
            <line x1="150" y1="190" x2="150" y2="200" stroke="#64748b" strokeWidth="2" />

            {/* Cranial Sutures (Wavy / Serrated Joint Lines) */}
            <path
              d="M200 45 L203 60 L198 75 L205 90 L200 105 L208 120 L202 135 L210 150"
              stroke="#dc2626"
              strokeWidth="2.5"
              strokeDasharray="2 1"
            />
            <path
              d="M200 75 Q240 70 270 90 L280 95"
              stroke="#dc2626"
              strokeWidth="2.5"
              strokeDasharray="2 1"
            />

            {/* Pointer Arrow to Suture */}
            <line x1="270" y1="35" x2="215" y2="70" stroke="#2563eb" strokeWidth="2.5" />
            <polygon points="215,70 225,63 227,72" fill="#2563eb" />
            <circle cx="285" cy="30" r="16" fill="#2563eb" />
            <text x="280" y="36" fontSize="18" fontWeight="bold" fill="#ffffff">?</text>

            <text x="20" y="230" fontSize="12" fontWeight="bold" fill="#475569">
              Question: Identify the joint type indicated by (?)
            </text>
          </svg>
        </div>
      );

    case "pv-cyclic-absorption":
      return (
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="block text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-3 text-center">
            P-V Indicator Diagrams for Cyclic Processes
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* (I) Clockwise Ellipse */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-700 block mb-2">(I) Clockwise Loop</span>
              <svg viewBox="0 0 160 130" className="w-full max-w-[140px] mx-auto">
                {/* Axes */}
                <line x1="25" y1="15" x2="25" y2="105" stroke="#64748b" strokeWidth="2" />
                <line x1="25" y1="105" x2="145" y2="105" stroke="#64748b" strokeWidth="2" />
                <text x="12" y="25" fontSize="12" fontWeight="bold" fill="#475569">P</text>
                <text x="140" y="122" fontSize="12" fontWeight="bold" fill="#475569">V</text>
                {/* Ellipse */}
                <ellipse cx="85" cy="60" rx="42" ry="26" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.5" />
                {/* Clockwise arrows */}
                <polygon points="90,32 100,34 92,38" fill="#2563eb" />
                <polygon points="80,88 70,86 78,82" fill="#2563eb" />
              </svg>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Clockwise (W &gt; 0)</span>
            </div>

            {/* (II) Counter-Clockwise Circle */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-700 block mb-2">(II) Counter-Clockwise</span>
              <svg viewBox="0 0 160 130" className="w-full max-w-[140px] mx-auto">
                <line x1="25" y1="15" x2="25" y2="105" stroke="#64748b" strokeWidth="2" />
                <line x1="25" y1="105" x2="145" y2="105" stroke="#64748b" strokeWidth="2" />
                <text x="12" y="25" fontSize="12" fontWeight="bold" fill="#475569">P</text>
                <text x="140" y="122" fontSize="12" fontWeight="bold" fill="#475569">V</text>
                <circle cx="85" cy="60" r="30" fill="#fef2f2" stroke="#dc2626" strokeWidth="2.5" />
                <polygon points="80,30 70,32 78,36" fill="#dc2626" />
                <polygon points="90,90 100,88 92,84" fill="#dc2626" />
              </svg>
              <span className="text-[11px] text-rose-600 font-semibold block mt-1">Counter-Clockwise (W &lt; 0)</span>
            </div>

            {/* (III) Clockwise Rectangle */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-700 block mb-2">(III) Clockwise Loop</span>
              <svg viewBox="0 0 160 130" className="w-full max-w-[140px] mx-auto">
                <line x1="25" y1="15" x2="25" y2="105" stroke="#64748b" strokeWidth="2" />
                <line x1="25" y1="105" x2="145" y2="105" stroke="#64748b" strokeWidth="2" />
                <text x="12" y="25" fontSize="12" fontWeight="bold" fill="#475569">P</text>
                <text x="140" y="122" fontSize="12" fontWeight="bold" fill="#475569">V</text>
                <rect x="50" y="35" width="70" height="50" rx="3" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.5" />
                <polygon points="90,32 100,35 90,38" fill="#2563eb" />
                <polygon points="123,65 120,75 117,65" fill="#2563eb" />
                <polygon points="80,88 70,85 80,82" fill="#2563eb" />
              </svg>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Clockwise (W &gt; 0)</span>
            </div>
          </div>
        </div>
      );

    case "pt-pv-cycle-transformation":
      return (
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="block text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-2 text-center">
            P-T Cyclic Process Diagram
          </span>
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 180 140" className="w-44 h-auto bg-white p-2 rounded-xl border border-slate-200">
              <line x1="25" y1="15" x2="25" y2="115" stroke="#475569" strokeWidth="2" />
              <line x1="25" y1="115" x2="160" y2="115" stroke="#475569" strokeWidth="2" />
              <text x="10" y="25" fontSize="12" fontWeight="bold" fill="#334155">P</text>
              <text x="155" y="130" fontSize="12" fontWeight="bold" fill="#334155">T</text>

              {/* Cycle A -> B -> C -> A */}
              {/* Isobaric A -> B */}
              <line x1="50" y1="45" x2="115" y2="45" stroke="#2563eb" strokeWidth="2.5" />
              <polygon points="85,42 95,45 85,48" fill="#2563eb" />

              {/* B -> C */}
              <line x1="115" y1="45" x2="90" y2="95" stroke="#2563eb" strokeWidth="2.5" />
              <polygon points="106,65 99,74 102,64" fill="#2563eb" />

              {/* C -> A */}
              <line x1="90" y1="95" x2="50" y2="45" stroke="#2563eb" strokeWidth="2.5" />
              <polygon points="73,73 66,66 74,68" fill="#2563eb" />

              <text x="40" y="42" fontSize="12" fontWeight="bold" fill="#0f172a">A</text>
              <text x="120" y="42" fontSize="12" fontWeight="bold" fill="#0f172a">B</text>
              <text x="92" y="105" fontSize="12" fontWeight="bold" fill="#0f172a">C</text>
            </svg>
          </div>
        </div>
      );

    case "pv-path-state-function":
      return (
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-2">
            P-V Diagram: State A to State B via Path I & Path II
          </span>
          <svg viewBox="0 0 240 160" className="w-full max-w-xs h-auto bg-white p-2 rounded-xl border border-slate-200">
            <line x1="30" y1="15" x2="30" y2="135" stroke="#475569" strokeWidth="2" />
            <line x1="30" y1="135" x2="220" y2="135" stroke="#475569" strokeWidth="2" />
            <text x="15" y="25" fontSize="12" fontWeight="bold" fill="#334155">P</text>
            <text x="215" y="150" fontSize="12" fontWeight="bold" fill="#334155">V</text>

            {/* Path I (Upper curve) */}
            <path d="M55 105 Q120 40 185 80" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            <text x="115" y="55" fontSize="12" fontWeight="bold" fill="#2563eb">Path I</text>

            {/* Path II (Lower curve) */}
            <path d="M55 105 Q120 120 185 80" fill="none" stroke="#dc2626" strokeWidth="2.5" />
            <text x="115" y="125" fontSize="12" fontWeight="bold" fill="#dc2626">Path II</text>

            {/* State Points */}
            <circle cx="55" cy="105" r="4" fill="#0f172a" />
            <text x="45" y="120" fontSize="13" fontWeight="bold" fill="#0f172a">A</text>

            <circle cx="185" cy="80" r="4" fill="#0f172a" />
            <text x="195" y="85" fontSize="13" fontWeight="bold" fill="#0f172a">B</text>
          </svg>
        </div>
      );

    case "pv-cycle-jmlk":
      return (
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-2">
            P-V Cycle J → M → L → K → J
          </span>
          <svg viewBox="0 0 280 180" className="w-full max-w-sm h-auto bg-white p-2 rounded-xl border border-slate-200">
            {/* Axes */}
            <line x1="45" y1="20" x2="45" y2="145" stroke="#475569" strokeWidth="2" />
            <line x1="45" y1="145" x2="255" y2="145" stroke="#475569" strokeWidth="2" />
            <text x="15" y="30" fontSize="11" fontWeight="bold" fill="#334155">P(atm)</text>
            <text x="240" y="165" fontSize="11" fontWeight="bold" fill="#334155">V(m³)</text>

            {/* P-axis ticks: 10, 20, 30 */}
            <text x="25" y="118" fontSize="10" fill="#64748b">10</text>
            <line x1="42" y1="115" x2="48" y2="115" stroke="#64748b" strokeWidth="1.5" />

            <text x="25" y="80" fontSize="10" fill="#64748b">20</text>
            <line x1="42" y1="77" x2="48" y2="77" stroke="#64748b" strokeWidth="1.5" />

            <text x="25" y="42" fontSize="10" fill="#64748b">30</text>
            <line x1="42" y1="39" x2="48" y2="39" stroke="#64748b" strokeWidth="1.5" />

            {/* V-axis ticks: 10, 20 */}
            <text x="100" y="160" fontSize="10" fill="#64748b">10</text>
            <line x1="105" y1="142" x2="105" y2="148" stroke="#64748b" strokeWidth="1.5" />

            <text x="195" y="160" fontSize="10" fill="#64748b">20</text>
            <line x1="200" y1="142" x2="200" y2="148" stroke="#64748b" strokeWidth="1.5" />

            {/* Cycle points:
                J = (10, 30) -> (105, 39)
                M = (20, 20) -> (200, 77)
                L = (20, 10) -> (200, 115)
                K = (10, 10) -> (105, 115)
            */}
            {/* J -> M */}
            <line x1="105" y1="39" x2="200" y2="77" stroke="#2563eb" strokeWidth="2.5" />
            <polygon points="155,57 165,61 158,65" fill="#2563eb" />

            {/* M -> L */}
            <line x1="200" y1="77" x2="200" y2="115" stroke="#2563eb" strokeWidth="2.5" />
            <polygon points="197,95 200,103 203,95" fill="#2563eb" />

            {/* L -> K (Compression at constant P=10, Work is done ON the system) */}
            <line x1="200" y1="115" x2="105" y2="115" stroke="#dc2626" strokeWidth="3" />
            <polygon points="150,112 140,115 150,118" fill="#dc2626" />

            {/* K -> J */}
            <line x1="105" y1="115" x2="105" y2="39" stroke="#2563eb" strokeWidth="2.5" />
            <polygon points="102,75 105,65 108,75" fill="#2563eb" />

            {/* Point Labels */}
            <circle cx="105" cy="39" r="3.5" fill="#0f172a" />
            <text x="95" y="34" fontSize="12" fontWeight="bold" fill="#0f172a">J</text>

            <circle cx="200" cy="77" r="3.5" fill="#0f172a" />
            <text x="208" y="77" fontSize="12" fontWeight="bold" fill="#0f172a">M</text>

            <circle cx="200" cy="115" r="3.5" fill="#0f172a" />
            <text x="208" y="118" fontSize="12" fontWeight="bold" fill="#0f172a">L</text>

            <circle cx="105" cy="115" r="3.5" fill="#0f172a" />
            <text x="93" y="125" fontSize="12" fontWeight="bold" fill="#0f172a">K</text>
          </svg>
        </div>
      );

    default:
      return null;
  }
}
