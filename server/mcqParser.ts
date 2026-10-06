import { PDFParse } from "pdf-parse";

export interface ParsedQuestion {
  id: string;
  section: string;
  passage?: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface ParsedTest {
  title: string;
  subject: string;
  description: string;
  duration: number;
  passingPercentage: number;
  isPaid: boolean;
  price: number;
  questions: ParsedQuestion[];
  source: "smart_parser" | "gemini_ai";
}

/**
 * Extracts plain text from a Base64 encoded PDF
 */
export async function extractTextFromPdf(base64Data: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Data, "base64");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result?.text || "";
  } catch (err: any) {
    console.error("PDF Parsing error:", err);
    throw new Error(
      "Could not extract text from this PDF. Please ensure it contains readable text, or paste the text directly."
    );
  }
}

/**
 * Detects the most likely subject from text keywords
 */
export function detectSubject(text: string, title?: string): string {
  const combined = `${title || ""} ${text}`.toLowerCase();

  if (/\b(chem|chemistry|chemical)\b/i.test(combined)) return "Chemistry";
  if (/\b(phy|physics|physical)\b/i.test(combined)) return "Physics";
  if (/\b(bio|biology|biological)\b/i.test(combined)) return "Biology";
  if (/\b(eng|english|grammar|vocab)\b/i.test(combined)) return "English";

  const bioKeywords = [
    /\bcell\b/, /\bdna\b/, /\brna\b/, /\benzyme\b/, /\bvirus\b/, /\bbacteria\b/, /\bprotein\b/,
    /\bphotosynthesis\b/, /\brespiration\b/, /\bmitosis\b/, /\bmeiosis\b/, /\bgenetics\b/,
    /\bcirculation\b/, /\bheart\b/, /\bblood\b/, /\bimmunity\b/, /\bevolution\b/, /\bdigestion\b/,
    /\bkidney\b/, /\bnephron\b/, /\bzoology\b/, /\bbotany\b/
  ];

  const chemKeywords = [
    /\batom\b/, /\bmolecule\b/, /\bbond\b/, /\bacid\b/, /\bbase\b/, /\bph\b/, /\breaction\b/,
    /\bequilibrium\b/, /\bthermodynamics\b/, /\borganic\b/, /\balkane\b/, /\balkene\b/, /\bbenzene\b/,
    /\balcohol\b/, /\bphenol\b/, /\bether\b/, /\baldehyde\b/, /\bketone\b/, /\bmolar\b/, /\bstoichiometry\b/,
    /\bperiodic\b/, /\bhalogen\b/, /\bcation\b/, /\banion\b/
  ];

  const phyKeywords = [
    /\bvelocity\b/, /\bacceleration\b/, /\bforce\b/, /\bnewton\b/, /\bjoule\b/, /\benergy\b/, /\bwork\b/,
    /\bmomentum\b/, /\bgravity\b/, /\bfriction\b/, /\bcurrent\b/, /\bvoltage\b/, /\bresistance\b/,
    /\bmagnetic\b/, /\belectric\b/, /\bwave\b/, /\bfrequency\b/, /\bphoton\b/, /\bquantum\b/,
    /\bvector\b/, /\bscalar\b/, /\bkinematics\b/, /\boptics\b/
  ];

  const engKeywords = [
    /\bsynonym\b/, /\bantonym\b/, /\bpreposition\b/, /\btense\b/, /\bpassive\b/, /\bactive\b/,
    /\bclause\b/, /\bsentence\b/, /\bvocabulary\b/, /\bidiom\b/, /\bcomprehension\b/, /\bgrammatical\b/,
    /\badjective\b/, /\badverb\b/, /\bpronoun\b/
  ];

  const scores = {
    Chemistry: chemKeywords.filter((r) => r.test(combined)).length,
    Physics: phyKeywords.filter((r) => r.test(combined)).length,
    Biology: bioKeywords.filter((r) => r.test(combined)).length,
    English: engKeywords.filter((r) => r.test(combined)).length
  };

  const highest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (highest && highest[1] > 0) {
    return highest[0];
  }
  return "General Assessment";
}

/**
 * Extracts questions, options, and answers from text using multi-pattern regex
 */
export function parseMcqsFromText(
  rawText: string,
  meta?: {
    customTitle?: string;
    customSubject?: string;
    duration?: number;
    passingPercentage?: number;
  }
): ParsedTest {
  const cleanText = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  // Look for end-of-document Answer Key (e.g. "Answer Key: 1. A, 2. B, 3. C")
  const answerKeyMap: Record<number, "A" | "B" | "C" | "D"> = {};
  const answerKeySectionMatch = cleanText.match(
    /(?:answer\s*keys?|key|answers?)\s*[:\-\n]([\s\S]+)$/i
  );

  if (answerKeySectionMatch) {
    const keyContent = answerKeySectionMatch[1];
    const keyRegex = /(?:Q\s*)?(\d+)[\.\s:\-\)]+([A-D])/gi;
    let match;
    while ((match = keyRegex.exec(keyContent)) !== null) {
      const qNum = parseInt(match[1], 10);
      const opt = match[2].toUpperCase() as "A" | "B" | "C" | "D";
      answerKeyMap[qNum] = opt;
    }
  }

  // Split content into question candidate blocks
  // Regex matches question numbers like: 1., Q1:, Q.1, Question 1, (1), 1)
  const questionNumberRegex = /(?:^|\n)(?:Q(?:uestion)?\.?\s*(\d+)[:\.\-\)]*|\((\d+)\)|(\d+)[\.\)\-\:])\s+/g;

  const indices: Array<{ index: number; qNum: number }> = [];
  let m;
  let fallbackNum = 1;

  while ((m = questionNumberRegex.exec(cleanText)) !== null) {
    const qNum = parseInt(m[1] || m[2] || m[3] || String(fallbackNum++), 10);
    indices.push({ index: m.index, qNum });
  }

  const rawBlocks: Array<{ block: string; qNum: number }> = [];

  if (indices.length > 0) {
    for (let i = 0; i < indices.length; i++) {
      const start = indices[i].index;
      const end = i + 1 < indices.length ? indices[i + 1].index : cleanText.length;
      rawBlocks.push({
        block: cleanText.substring(start, end).trim(),
        qNum: indices[i].qNum
      });
    }
  } else {
    // If no numbered questions found, split by double newlines or lines starting with letters
    const paragraphs = cleanText.split(/\n\s*\n/);
    paragraphs.forEach((p, idx) => {
      if (p.trim()) {
        rawBlocks.push({ block: p.trim(), qNum: idx + 1 });
      }
    });
  }

  const questions: ParsedQuestion[] = [];
  const subject = meta?.customSubject || detectSubject(cleanText, meta?.customTitle);

  rawBlocks.forEach((item, idx) => {
    const textBlock = item.block;
    const qNumber = item.qNum || idx + 1;

    // Separate Answer if embedded at bottom of block
    let correctAnswer: "A" | "B" | "C" | "D" = answerKeyMap[qNumber] || "A";
    let explanation = "";

    const ansMatch = textBlock.match(
      /(?:ans(?:wer)?|correct(?:\s*option)?|key)\s*[:\-\=]\s*\(?([A-D])\)?/i
    );
    if (ansMatch) {
      correctAnswer = ansMatch[1].toUpperCase() as "A" | "B" | "C" | "D";
    }

    const expMatch = textBlock.match(
      /(?:explanation|reason|solution)\s*[:\-\=]\s*([^\n]+(?:\n[^\n]+)*)/i
    );
    if (expMatch) {
      explanation = expMatch[1].trim();
    }

    // Clean block from answer and explanation lines to parse options accurately
    let cleanBlock = textBlock
      .replace(/(?:ans(?:wer)?|correct(?:\s*option)?|key)\s*[:\-\=]\s*\(?[A-D]\)?/gi, "")
      .replace(/(?:explanation|reason|solution)\s*[:\-\=][\s\S]*$/gi, "")
      .trim();

    // Parse options A, B, C, D
    // Handles multi-line or inline: A) ... B) ... C) ... D) ...
    const optARegex = /(?:^|\s|\n)(?:\(?A[\.\)\:]|\bA\))\s+([\s\S]*?)(?=(?:^|\s|\n)(?:\(?B[\.\)\:]|\bB\))\s+|$)/i;
    const optBRegex = /(?:^|\s|\n)(?:\(?B[\.\)\:]|\bB\))\s+([\s\S]*?)(?=(?:^|\s|\n)(?:\(?C[\.\)\:]|\bC\))\s+|$)/i;
    const optCRegex = /(?:^|\s|\n)(?:\(?C[\.\)\:]|\bC\))\s+([\s\S]*?)(?=(?:^|\s|\n)(?:\(?D[\.\)\:]|\bD\))\s+|$)/i;
    const optDRegex = /(?:^|\s|\n)(?:\(?D[\.\)\:]|\bD\))\s+([\s\S]*?)(?=(?:^|\s|\n)(?:\(?E[\.\)\:]|\bE\))\s+|$)/i;

    const matchA = cleanBlock.match(optARegex);
    const matchB = cleanBlock.match(optBRegex);
    const matchC = cleanBlock.match(optCRegex);
    const matchD = cleanBlock.match(optDRegex);

    let optA = matchA ? matchA[1].trim() : "";
    let optB = matchB ? matchB[1].trim() : "";
    let optC = matchC ? matchC[1].trim() : "";
    let optD = matchD ? matchD[1].trim() : "";

    // The question text is everything before Option A
    let questionText = "";
    if (matchA && matchA.index !== undefined) {
      questionText = cleanBlock.substring(0, matchA.index).trim();
    } else {
      questionText = cleanBlock.trim();
    }

    // Remove leading numbering like "1.", "Q1:", "(1)"
    questionText = questionText
      .replace(/^(?:Q(?:uestion)?\.?\s*\d+[:\.\-\)]*|\(\d+\)|\d+[\.\)\-\:])\s*/i, "")
      .trim();

    // If options were not captured (e.g. statement question), provide defaults
    if (!optA || !optB) {
      optA = "True / Option A";
      optB = "False / Option B";
      optC = "Option C";
      optD = "Option D";
    }
    if (!optC) optC = "None of the above";
    if (!optD) optD = "All of the above";

    if (questionText.length > 3) {
      questions.push({
        id: `q-parsed-${Date.now()}-${idx + 1}`,
        section: subject.toUpperCase(),
        question: questionText,
        options: {
          A: optA,
          B: optB,
          C: optC,
          D: optD
        },
        correctAnswer,
        explanation
      });
    }
  });

  const title =
    meta?.customTitle && meta.customTitle.trim()
      ? meta.customTitle.trim()
      : `${subject} Comprehensive Assessment`;

  const calculatedDuration =
    meta?.duration || Math.max(15, Math.ceil(questions.length * 1.2));

  return {
    title,
    subject,
    description: `Online assessment containing ${questions.length} questions converted by Admin AI Agent Smart Engine.`,
    duration: calculatedDuration,
    passingPercentage: meta?.passingPercentage || 60,
    isPaid: false,
    price: 0,
    questions,
    source: "smart_parser"
  };
}
