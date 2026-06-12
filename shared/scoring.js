"use strict";

function answerToPoints(answer) {
  if (answer === "sim") return 100;
  if (answer === "parcial") return 50;
  if (answer === "nao") return 0;
  return null;
}

function normaMultiplier(question) {
  return question && question.norma === "RDC15/2012" ? 2 : 1;
}

function questionFinalWeight(question) {
  const base = typeof question.weight === "number" && !Number.isNaN(question.weight)
    ? question.weight
    : Number(question.weight) || 1;

  return base * normaMultiplier(question);
}

function computeStats(questions, answersById) {
  const total = questions.length;
  let answered = 0;
  let weightedSum = 0;
  let weightedMax = 0;

  for (const question of questions) {
    const answer = answersById[String(question.id)]?.value;
    const points = answerToPoints(answer);
    if (points === null) continue;

    answered += 1;
    const finalWeight = questionFinalWeight(question);
    weightedSum += points * finalWeight;
    weightedMax += 100 * finalWeight;
  }

  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;
  const score = weightedMax > 0 ? Math.round((weightedSum / weightedMax) * 100) : 0;

  return { total, answered, progress, score };
}

function computeLayerIndices(questions, answersById) {
  const accumulator = {
    C: { sum: 0, max: 0 },
    P: { sum: 0, max: 0 },
    I: { sum: 0, max: 0 }
  };

  for (const question of questions) {
    const answer = answersById[String(question.id)]?.value;
    const points = answerToPoints(answer);
    if (points === null) continue;
    if (!accumulator[question.layer]) continue;

    const finalWeight = questionFinalWeight(question);
    accumulator[question.layer].sum += points * finalWeight;
    accumulator[question.layer].max += 100 * finalWeight;
  }

  const C = accumulator.C.max ? Math.round((accumulator.C.sum / accumulator.C.max) * 100) : 0;
  const P = accumulator.P.max ? Math.round((accumulator.P.sum / accumulator.P.max) * 100) : 0;
  const I = accumulator.I.max ? Math.round((accumulator.I.sum / accumulator.I.max) * 100) : 0;
  const Global = Math.round(C * 0.5 + P * 0.3 + I * 0.2);

  return { C, P, I, Global };
}

function computeModuleScore(moduleName, questions, answersById) {
  const moduleQuestions = questions.filter((question) => question.module === moduleName);

  let answered = 0;
  let sum = 0;
  let max = 0;

  for (const question of moduleQuestions) {
    const answer = answersById[String(question.id)]?.value;
    const points = answerToPoints(answer);
    if (points === null) continue;

    answered += 1;
    const finalWeight = questionFinalWeight(question);
    sum += points * finalWeight;
    max += 100 * finalWeight;
  }

  const pct = max ? Math.round((sum / max) * 100) : 0;

  return { total: moduleQuestions.length, answered, pct };
}

function computePriorityMatrix(questions, answersById) {
  const matrix = { P1: [], P2: [], P3: [] };

  for (const question of questions) {
    const answer = answersById[String(question.id)]?.value;

    if (answer === "nao") matrix.P1.push(question.id);
    else if (answer === "parcial") matrix.P2.push(question.id);
    else if (answer === "sim") matrix.P3.push(question.id);
  }

  return matrix;
}

function computeAssessment(questions, answersById) {
  const stats = computeStats(questions, answersById);
  const indices = computeLayerIndices(questions, answersById);
  const priority = computePriorityMatrix(questions, answersById);

  const moduleNames = [...new Set(questions.map((question) => question.module))];
  const modules = moduleNames.map((moduleName) => ({
    module: moduleName,
    ...computeModuleScore(moduleName, questions, answersById)
  }));

  return {
    stats,
    indices,
    priority,
    modules
  };
}

module.exports = {
  answerToPoints,
  normaMultiplier,
  questionFinalWeight,
  computeStats,
  computeLayerIndices,
  computeModuleScore,
  computePriorityMatrix,
  computeAssessment
};
