"use strict";

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "../cme_checklist.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao abrir banco SQLite:", err);
  }
});

db.configure("busyTimeout", 10000);

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Criar tabela users
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          role TEXT DEFAULT 'viewer',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Criar tabela institutions
      db.run(`
        CREATE TABLE IF NOT EXISTS institutions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          city TEXT,
          state TEXT,
          type TEXT,
          surgical_rooms INTEGER,
          autoclaves INTEGER,
          responsible_name TEXT,
          position TEXT,
          email TEXT,
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Criar tabela questions
      db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY,
          text TEXT NOT NULL,
          module TEXT,
          submodule TEXT,
          layer TEXT CHECK (layer IN ('C', 'P', 'I')),
          category TEXT,
          weight REAL NOT NULL,
          norma TEXT,
          criticality TEXT,
          is_active INTEGER DEFAULT 1,
          version INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Criar tabela assessments
      db.run(`
        CREATE TABLE IF NOT EXISTS assessments (
          id TEXT PRIMARY KEY,
          institution_id INTEGER REFERENCES institutions(id),
          created_by INTEGER REFERENCES users(id),
          status TEXT DEFAULT 'draft',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          score_global REAL,
          score_c REAL,
          score_p REAL,
          score_i REAL,
          progress REAL,
          answered INTEGER,
          total INTEGER,
          institution_data TEXT,
          questions_data TEXT NOT NULL,
          answers_data TEXT NOT NULL
        );
      `, (err) => {
        if (err) {
          console.error("Erro ao criar tabela assessments:", err);
          reject(err);
        } else {
          console.log("✓ Banco de dados inicializado com sucesso");
          resolve();
        }
      });
    });
  });
}

async function saveAssessment(assessmentData) {
  return new Promise((resolve, reject) => {
    const {
      id,
      institution,
      questions,
      answersById,
      stats,
      indices
    } = assessmentData;

    const query = `
      INSERT INTO assessments (
        id,
        status,
        score_global,
        score_c,
        score_p,
        score_i,
        progress,
        answered,
        total,
        institution_data,
        questions_data,
        answers_data,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        score_global = excluded.score_global,
        score_c = excluded.score_c,
        score_p = excluded.score_p,
        score_i = excluded.score_i,
        progress = excluded.progress,
        answered = excluded.answered,
        total = excluded.total,
        answers_data = excluded.answers_data,
        updated_at = excluded.updated_at;
    `;

    const now = new Date().toISOString();
    const values = [
      id,
      "draft",
      indices?.global || 0,
      indices?.C || 0,
      indices?.P || 0,
      indices?.I || 0,
      stats?.progress || 0,
      stats?.answered || 0,
      stats?.total || 0,
      JSON.stringify(institution),
      JSON.stringify(questions),
      JSON.stringify(answersById),
      now,
      now
    ];

    db.run(query, values, function (err) {
      if (err) {
        console.error("Erro ao salvar assessment:", err);
        reject(err);
      } else {
        resolve({
          id,
          created_at: now
        });
      }
    });
  });
}

async function getAllAssessments() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, created_at, updated_at, status, score_global, progress, answered, total
      FROM assessments
      ORDER BY created_at DESC
      LIMIT 100;
    `;

    db.all(query, (err, rows) => {
      if (err) {
        console.error("Erro ao buscar assessments:", err);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

async function getAssessmentById(id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, institution_data, questions_data, answers_data, status, created_at,
             updated_at, score_global, score_c, score_p, score_i, progress, answered, total
      FROM assessments
      WHERE id = ?;
    `;

    db.get(query, [id], (err, row) => {
      if (err) {
        console.error("Erro ao buscar assessment por ID:", err);
        reject(err);
      } else {
        if (row) {
          // Parse JSON data
          row.institution_data = JSON.parse(row.institution_data);
          row.questions_data = JSON.parse(row.questions_data);
          row.answers_data = JSON.parse(row.answers_data);
        }
        resolve(row || null);
      }
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  saveAssessment,
  getAllAssessments,
  getAssessmentById
};
