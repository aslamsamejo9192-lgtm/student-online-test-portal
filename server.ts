import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { extractTextFromPdf, parseMcqsFromText } from "./server/mcqParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isValidGeminiKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  // Filter out internal sandbox token placeholders that start with AQ.
  if (trimmed.startsWith("AQ.") || trimmed.length < 25) return false;
  return true;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit to support PDF and image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Route: Check Gemini & Smart Engine status
  app.get("/api/agent/config", (_req, res) => {
    const key = process.env.GEMINI_API_KEY || "";
    const isReady = isValidGeminiKey(key);
    res.json({
      hasGeminiKey: isReady,
      keyPreview: isReady ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : "Not Configured",
      smartEngineReady: true
    });
  });

  // API Route: Save custom Gemini API key to .env
  app.post("/api/agent/save-key", (req, res) => {
    try {
      const { apiKey } = req.body || {};
      if (!apiKey || typeof apiKey !== "string") {
        return res.status(400).json({ error: "Please provide a valid API key string." });
      }
      const trimmed = apiKey.trim();
      if (trimmed.length < 20) {
        return res.status(400).json({ error: "The provided API key appears too short or invalid." });
      }

      process.env.GEMINI_API_KEY = trimmed;

      let envContent = "";
      if (fs.existsSync(".env")) {
        envContent = fs.readFileSync(".env", "utf8");
      }
      if (envContent.includes("GEMINI_API_KEY=")) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${trimmed}`);
      } else {
        envContent += `\nGEMINI_API_KEY=${trimmed}\n`;
      }
      fs.writeFileSync(".env", envContent.trim() + "\n", "utf8");

      res.json({
        success: true,
        message: "Gemini API Key saved and activated successfully!",
        keyPreview: `${trimmed.substring(0, 6)}...${trimmed.substring(trimmed.length - 4)}`
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to save key." });
    }
  });

  // API Route: Admin AI Agent to convert PDF or Text into an Online MCQ Test
  app.post("/api/agent/convert-test", async (req, res) => {
    try {
      const {
        text,
        fileBase64,
        fileMimeType,
        fileName,
        customTitle,
        customSubject,
        duration,
        passingPercentage
      } = req.body || {};

      if (!text && !fileBase64) {
        return res.status(400).json({
          error: "Please provide either a PDF/Document file or paste text/questions to convert."
        });
      }

      // Step 1: Extract text if PDF was uploaded
      let extractedPdfText = "";
      if (fileBase64 && (fileMimeType?.includes("pdf") || fileName?.toLowerCase().endsWith(".pdf"))) {
        try {
          extractedPdfText = await extractTextFromPdf(fileBase64);
        } catch (pdfErr: any) {
          console.warn("PDF extraction note:", pdfErr?.message);
        }
      }

      const combinedText = [text || "", extractedPdfText].filter(Boolean).join("\n\n").trim();

      // Step 2: If a valid Gemini API key is configured, attempt Gemini conversion
      const apiKey = process.env.GEMINI_API_KEY;
      if (isValidGeminiKey(apiKey)) {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKey!,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build"
              }
            }
          });

          const systemInstruction = `You are an expert Examination Authoring & Document Extraction AI Agent for an online test portal.
Your job is to take the provided PDF document, image, or text and convert it into a complete, ready-to-publish online Multiple Choice Question (MCQ) test.

Rules:
1. If the input already contains MCQs (questions with options A, B, C, D), extract EVERY SINGLE question accurately without any wording mistakes, preserving all scientific/mathematical formulas, numbers, and terminology.
2. If an answer key is provided in the document/text, use it to set the exact correctAnswer ("A", "B", "C", or "D"). If no answer key is provided, solve each question accurately and set the correct option ("A", "B", "C", or "D") along with a clear explanation.
3. If the input is study notes, a chapter, or a paragraph rather than pre-written MCQs, generate comprehensive, high-quality exam MCQs covering all key concepts from the material.
4. Every question MUST have exactly 4 options (A, B, C, D) with non-empty text, a valid correctAnswer ("A", "B", "C", or "D"), a subject/section label, and a helpful explanation.
5. If there is a reading comprehension passage for certain questions, include it in the "passage" field of those questions.`;

          const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

          if (fileBase64 && fileMimeType && !extractedPdfText) {
            parts.push({
              inlineData: {
                mimeType: fileMimeType,
                data: fileBase64
              }
            });
          }

          let promptText = "Convert the provided content into a complete online MCQ test.";
          if (fileName) {
            promptText += `\nSource File Name: ${fileName}`;
          }
          if (customTitle) {
            promptText += `\nPreferred Test Title: ${customTitle}`;
          }
          if (customSubject) {
            promptText += `\nPreferred Subject: ${customSubject}`;
          }
          if (combinedText) {
            promptText += `\n\nProvided Text / Content:\n${combinedText}`;
          }

          parts.push({ text: promptText });

          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: { parts },
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Title of the online test."
                  },
                  subject: {
                    type: Type.STRING,
                    description: "Main subject or category of the test (e.g., MDCAT, Biology, Chemistry, Physics, English, General)."
                  },
                  description: {
                    type: Type.STRING,
                    description: "Brief description of the online test and what topics it covers."
                  },
                  recommendedDuration: {
                    type: Type.INTEGER,
                    description: "Recommended duration in minutes based on question count."
                  },
                  questions: {
                    type: Type.ARRAY,
                    description: "List of extracted or generated MCQ questions.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        section: {
                          type: Type.STRING,
                          description: "Subject section name, e.g., BIOLOGY, CHEMISTRY, PHYSICS, ENGLISH."
                        },
                        passage: {
                          type: Type.STRING,
                          description: "Optional reading passage if the question refers to a paragraph. Leave empty string if none."
                        },
                        question: {
                          type: Type.STRING,
                          description: "The complete question stem with exact wording."
                        },
                        optionA: {
                          type: Type.STRING,
                          description: "Text for Option A"
                        },
                        optionB: {
                          type: Type.STRING,
                          description: "Text for Option B"
                        },
                        optionC: {
                          type: Type.STRING,
                          description: "Text for Option C"
                        },
                        optionD: {
                          type: Type.STRING,
                          description: "Text for Option D"
                        },
                        correctAnswer: {
                          type: Type.STRING,
                          description: "Correct option letter: must be 'A', 'B', 'C', or 'D'."
                        },
                        explanation: {
                          type: Type.STRING,
                          description: "Clear explanation for why the correct answer is right."
                        }
                      },
                      required: [
                        "question",
                        "optionA",
                        "optionB",
                        "optionC",
                        "optionD",
                        "correctAnswer",
                        "explanation"
                      ]
                    }
                  }
                },
                required: ["title", "subject", "description", "questions"]
              }
            }
          });

          const rawText = response.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];

            if (rawQuestions.length > 0) {
              const normalizedQuestions = rawQuestions.map((q: any, idx: number) => {
                const cleanAns = String(q.correctAnswer || "A").trim().toUpperCase();
                const validAnswer = ["A", "B", "C", "D"].includes(cleanAns) ? cleanAns : "A";

                return {
                  id: `q-${Date.now()}-${idx + 1}`,
                  section: q.section ? String(q.section).trim().toUpperCase() : (customSubject || parsed.subject || "GENERAL").toUpperCase(),
                  passage: q.passage ? String(q.passage).trim() : "",
                  question: String(q.question || `Question ${idx + 1}`).trim(),
                  options: {
                    A: String(q.optionA || "Option A").trim(),
                    B: String(q.optionB || "Option B").trim(),
                    C: String(q.optionC || "Option C").trim(),
                    D: String(q.optionD || "Option D").trim()
                  },
                  correctAnswer: validAnswer,
                  explanation: String(q.explanation || "").trim()
                };
              });

              return res.json({
                success: true,
                test: {
                  title: (customTitle && customTitle.trim()) || parsed.title || "Online Assessment Test",
                  subject: (customSubject && customSubject.trim()) || parsed.subject || "General Assessment",
                  description:
                    parsed.description ||
                    `Online test containing ${normalizedQuestions.length} MCQs converted and published by Admin AI Agent.`,
                  duration: Number(duration) || Number(parsed.recommendedDuration) || Math.max(15, normalizedQuestions.length),
                  passingPercentage: Number(passingPercentage) || 60,
                  isPaid: false,
                  price: 0,
                  questions: normalizedQuestions,
                  source: "gemini_ai"
                }
              });
            }
          }
        } catch (geminiErr: any) {
          console.warn("Gemini conversion failed, falling back to Smart Parser Engine:", geminiErr?.message || geminiErr);
        }
      }

      // Step 3: High-Precision Smart MCQ Parser Engine
      if (!combinedText) {
        return res.status(400).json({
          error: "Could not read text from the provided file. Please paste questions directly into the text box."
        });
      }

      const smartResult = parseMcqsFromText(combinedText, {
        customTitle,
        customSubject,
        duration: duration ? Number(duration) : undefined,
        passingPercentage: passingPercentage ? Number(passingPercentage) : undefined
      });

      if (!smartResult.questions || smartResult.questions.length === 0) {
        return res.status(422).json({
          error: "Could not detect any questions with options (A, B, C, D) in the provided text. Please verify formatting."
        });
      }

      return res.json({
        success: true,
        test: smartResult,
        source: "smart_parser",
        message: `Successfully extracted ${smartResult.questions.length} MCQs via Smart Parser Engine!`
      });
    } catch (err: any) {
      console.error("AI Test Agent Error:", err);
      return res.status(500).json({
        error: err?.message || "Failed to convert content into an online test."
      });
    }
  });

  // Vite middleware in development, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
