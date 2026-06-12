"use strict";

const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");
const { computeAssessment } = require("../../shared/scoring");
const { initializeDatabase, saveAssessment, getAllAssessments, getAssessmentById } = require("./db");

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function normalizeAnswersById(rawAnswersById) {
  const normalized = {};

  if (!rawAnswersById || typeof rawAnswersById !== "object") {
    return normalized;
  }

  for (const key of Object.keys(rawAnswersById)) {
    const value = rawAnswersById[key]?.value;
    normalized[String(key)] = {
      value: ["sim", "parcial", "nao"].includes(value) ? value : null,
      updatedAt: rawAnswersById[key]?.updatedAt || null
    };
  }

  return normalized;
}

function validateQuestion(question) {
  if (!question || typeof question !== "object") return false;
  if (!Number.isFinite(Number(question.id))) return false;
  if (typeof question.module !== "string" || !question.module.trim()) return false;
  if (typeof question.layer !== "string" || !["C", "P", "I"].includes(question.layer)) return false;
  if (typeof question.norma !== "string" || !question.norma.trim()) return false;

  const numericWeight = Number(question.weight);
  if (!Number.isFinite(numericWeight) || numericWeight <= 0) return false;

  return true;
}

app.get("/api/v1/health", (_req, res) => {
  res.json({
    ok: true,
    service: "cme-checklist-backend",
    phase: "fase-1",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/v1/calculate", (req, res) => {
  const questions = Array.isArray(req.body?.questions) ? req.body.questions : null;
  const answersById = normalizeAnswersById(req.body?.answersById);

  if (!questions || questions.length === 0) {
    return res.status(400).json({ error: "questions obrigatorio e deve ser um array nao vazio" });
  }

  const invalidQuestion = questions.find((question) => !validateQuestion(question));
  if (invalidQuestion) {
    return res.status(400).json({ error: "questions contem itens invalidos" });
  }

  const result = computeAssessment(questions, answersById);

  return res.json({ result });
});

app.post("/api/v1/assessments", async (req, res) => {
  const institution = req.body?.institution || null;
  const questions = Array.isArray(req.body?.questions) ? req.body.questions : null;
  const answersById = normalizeAnswersById(req.body?.answersById);

  if (!questions || questions.length === 0) {
    return res.status(400).json({ error: "questions obrigatorio e deve ser um array nao vazio" });
  }

  const invalidQuestion = questions.find((question) => !validateQuestion(question));
  if (invalidQuestion) {
    return res.status(400).json({ error: "questions contem itens invalidos" });
  }

  const id = randomUUID();
  const calculated = computeAssessment(questions, answersById);

  try {
    const saved = await saveAssessment({
      id,
      institution,
      questions,
      answersById,
      stats: calculated.stats,
      indices: calculated.indices
    });

    return res.status(201).json({
      id,
      createdAt: saved.created_at,
      calculated
    });
  } catch (err) {
    console.error("Erro ao salvar assessment:", err);
    return res.status(500).json({ error: "Erro ao salvar assessment" });
  }
});

app.get("/api/v1/assessments/:id", async (req, res) => {
  try {
    const item = await getAssessmentById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "assessment nao encontrada" });
    }

    // Recalcular índices para garantir consistência
    const calculated = computeAssessment(item.questions_data, item.answers_data);

    return res.json({
      id: item.id,
      createdAt: item.created_at,
      institution: item.institution_data,
      questions: item.questions_data,
      answersById: item.answers_data,
      calculated
    });
  } catch (err) {
    console.error("Erro ao buscar assessment:", err);
    return res.status(500).json({ error: "Erro ao buscar assessment" });
  }
});

app.get("/api/v1/assessments", async (_req, res) => {
  try {
    const allItems = await getAllAssessments();
    const list = allItems.map((item) => ({
      id: item.id,
      createdAt: item.created_at,
      status: item.status,
      scoreGlobal: item.score_global,
      progress: item.progress,
      answered: item.answered,
      total: item.total
    }));

    return res.json({ items: list });
  } catch (err) {
    console.error("Erro ao listar assessments:", err);
    return res.status(500).json({ error: "Erro ao listar assessments" });
  }
});

app.listen(port, async () => {
  try {
    await initializeDatabase();
    console.log(`API online em http://localhost:${port}`);
  } catch (err) {
    console.error("Falha ao inicializar banco de dados:", err);
    process.exit(1);
  }
});
