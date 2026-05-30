/* NS CheckList Situacional CME — MVP Offline
   Recursos:
   - impressão das perguntas
   - gerenciamento de perguntas (CRUD)
   - persistência local das perguntas customizadas
   - ordenação manual de perguntas no gerenciador
   - exportação do questions.js atualizado
   - controle de alterações não exportadas
*/

const STORAGE_KEYS = {
  institution: "cme_mvp_institution_v3",
  answers: "cme_mvp_answers_v3",
  ui: "cme_mvp_ui_v3",
  customQuestions: "cme_mvp_custom_questions_v2",
  questionsDirty: "cme_mvp_questions_dirty_v1"
};

function safeJSONParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ---------- Questions source ---------- */

const baseQuestions = cloneDeep(questions);
let activeQuestions = loadQuestions();

function loadQuestions() {
  const saved = safeJSONParse(localStorage.getItem(STORAGE_KEYS.customQuestions), null);
  if (Array.isArray(saved) && saved.length > 0) {
    return saved.map(normalizeQuestion);
  }
  return cloneDeep(baseQuestions).map(normalizeQuestion);
}

function persistQuestions() {
  localStorage.setItem(STORAGE_KEYS.customQuestions, JSON.stringify(activeQuestions));
}

function getQuestions() {
  return activeQuestions;
}

function getAllModules() {
  const seen = new Set();
  const list = [];
  for (const q of getQuestions()) {
    if (!seen.has(q.module)) {
      seen.add(q.module);
      list.push(q.module);
    }
  }
  return list;
}

function getAllCategories() {
  const seen = new Set();
  const list = [];
  for (const q of getQuestions()) {
    if (!seen.has(q.category)) {
      seen.add(q.category);
      list.push(q.category);
    }
  }
  return list.sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
}

function normalizeQuestion(q) {
  return {
    id: Number(q.id),
    text: String(q.text || "").trim(),
    module: String(q.module || "").trim(),
    submodule: String(q.submodule || q.module || "").trim(),
    layer: String(q.layer || "").trim(),
    category: String(q.category || "").trim(),
    weight: Number(q.weight) > 0 ? Number(q.weight) : 1,
    norma: q.norma === "RDC15/2012" ? "RDC15/2012" : "nãoRDC"
  };
}

function nextQuestionId() {
  const ids = getQuestions().map(q => Number(q.id) || 0);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function answerToPoints(a) {
  if (a === "sim") return 100;
  if (a === "parcial") return 50;
  if (a === "nao") return 0;
  return null;
}

function layerLabel(layer) {
  return ({ C: "Compliance", P: "Performance", I: "Inteligência" }[layer]) || layer;
}

function normaMultiplier(q) {
  return q.norma === "RDC15/2012" ? 2 : 1;
}

function questionFinalWeight(q) {
  const base = typeof q.weight === "number" && !Number.isNaN(q.weight) ? q.weight : 1;
  return base * normaMultiplier(q);
}

function computeStats(answersById) {
  const qs = getQuestions();
  const total = qs.length;
  let answered = 0;
  let weightedSum = 0;
  let weightedMax = 0;

  for (const q of qs) {
    const a = answersById[q.id]?.value;
    const pts = answerToPoints(a);
    if (pts === null) continue;
    answered += 1;

    const w = questionFinalWeight(q);
    weightedSum += pts * w;
    weightedMax += 100 * w;
  }

  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;
  const score = weightedMax > 0 ? Math.round((weightedSum / weightedMax) * 100) : 0;

  return { total, answered, progress, score };
}

function computeLayerIndices(answersById) {
  const acc = { C: { sum: 0, max: 0 }, P: { sum: 0, max: 0 }, I: { sum: 0, max: 0 } };

  for (const q of getQuestions()) {
    const a = answersById[q.id]?.value;
    const pts = answerToPoints(a);
    if (pts === null) continue;
    if (!acc[q.layer]) continue;

    const w = questionFinalWeight(q);
    acc[q.layer].sum += pts * w;
    acc[q.layer].max += 100 * w;
  }

  const C = acc.C.max ? Math.round((acc.C.sum / acc.C.max) * 100) : 0;
  const P = acc.P.max ? Math.round((acc.P.sum / acc.P.max) * 100) : 0;
  const I = acc.I.max ? Math.round((acc.I.sum / acc.I.max) * 100) : 0;
  const Global = Math.round(C * 0.5 + P * 0.3 + I * 0.2);

  return { C, P, I, Global };
}

function getModuleQuestions(moduleName) {
  return getQuestions().filter(q => q.module === moduleName);
}

function computeModuleScore(moduleName, answersById) {
  const qs = getModuleQuestions(moduleName);
  let answered = 0;
  let sum = 0;
  let max = 0;

  for (const q of qs) {
    const a = answersById[q.id]?.value;
    const pts = answerToPoints(a);
    if (pts === null) continue;

    answered++;
    const w = questionFinalWeight(q);
    sum += pts * w;
    max += 100 * w;
  }

  const pct = max ? Math.round((sum / max) * 100) : 0;
  return { total: qs.length, answered, pct };
}

function computePriorityMatrix(answersById) {
  const m = { P1: [], P2: [], P3: [] };
  for (const q of getQuestions()) {
    const a = answersById[q.id]?.value;
    if (a === "nao") m.P1.push(q);
    else if (a === "parcial") m.P2.push(q);
    else if (a === "sim") m.P3.push(q);
  }
  return m;
}

function sanitizeFileName(s) {
  return String(s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "Instituicao";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJsString(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n");
}

/* ---------- State ---------- */

const state = {
  institution: safeJSONParse(localStorage.getItem(STORAGE_KEYS.institution), null),
  answersById: safeJSONParse(localStorage.getItem(STORAGE_KEYS.answers), {}),
  ui: safeJSONParse(localStorage.getItem(STORAGE_KEYS.ui), {
    lastModule: null,
    managerFilters: { module: "", layer: "", category: "" }
  }),
  questionsDirty: localStorage.getItem(STORAGE_KEYS.questionsDirty) === "1"
};

if (!state.ui.managerFilters) {
  state.ui.managerFilters = { module: "", layer: "", category: "" };
}

function persist() {
  localStorage.setItem(STORAGE_KEYS.institution, JSON.stringify(state.institution));
  localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(state.answersById));
  localStorage.setItem(STORAGE_KEYS.ui, JSON.stringify(state.ui));
  localStorage.setItem(STORAGE_KEYS.questionsDirty, state.questionsDirty ? "1" : "0");
}

function markQuestionsDirty() {
  state.questionsDirty = true;
  persist();
  renderDirtyIndicators();
}

function clearQuestionsDirty() {
  state.questionsDirty = false;
  persist();
  renderDirtyIndicators();
}

function removeAnswersForDeletedQuestions() {
  const validIds = new Set(getQuestions().map(q => String(q.id)));
  for (const id of Object.keys(state.answersById)) {
    if (!validIds.has(String(id))) {
      delete state.answersById[id];
    }
  }
  persist();
}

/* ---------- UI refs ---------- */

const el = {
  screenSetup: document.getElementById("screenSetup"),
  screenApp: document.getElementById("screenApp"),

  formInstitution: document.getElementById("formInstitution"),
  btnSetupClear: document.getElementById("btnSetupClear"),

  institutionLine: document.getElementById("institutionLine"),
  btnEditInstitution1: document.getElementById("btnEditInstitution1"),
  btnEditInstitution2: document.getElementById("btnEditInstitution2"),
  btnGoDashboard: document.getElementById("btnGoDashboard"),

  modulesList: document.getElementById("modulesList"),

  kpiProgress: document.getElementById("kpiProgress"),
  kpiAnswered: document.getElementById("kpiAnswered"),
  kpiPoints: document.getElementById("kpiPoints"),
  kpiLastModule: document.getElementById("kpiLastModule"),

  rightTitle: document.getElementById("rightTitle"),
  rightSubtitle: document.getElementById("rightSubtitle"),
  btnBackToModules: document.getElementById("btnBackToModules"),

  viewEmpty: document.getElementById("viewEmpty"),
  viewModule: document.getElementById("viewModule"),
  viewDashboard: document.getElementById("viewDashboard"),

  moduleTitleLine: document.getElementById("moduleTitleLine"),
  moduleProgressLine: document.getElementById("moduleProgressLine"),
  moduleQuestionsList: document.getElementById("moduleQuestionsList"),
  btnScrollTop: document.getElementById("btnScrollTop"),
  btnClearModule: document.getElementById("btnClearModule"),
  btnToDashboard: document.getElementById("btnToDashboard"),

  kpiGlobal: document.getElementById("kpiGlobal"),
  kpiC: document.getElementById("kpiC"),
  kpiP: document.getElementById("kpiP"),
  kpiI: document.getElementById("kpiI"),
  priorityTableBody: document.getElementById("priorityTableBody"),
  modulesScoreBody: document.getElementById("modulesScoreBody"),
  btnExportTxt: document.getElementById("btnExportTxt"),
  btnResetAll: document.getElementById("btnResetAll"),
  btnExportQuestionsJs: document.getElementById("btnExportQuestionsJs"),

  dirtyBadgeDashboard: document.getElementById("dirtyBadgeDashboard"),
  dirtyBadgeManager: document.getElementById("dirtyBadgeManager"),

  btnPrintQuestions: document.getElementById("btnPrintQuestions"),
  btnManageQuestions: document.getElementById("btnManageQuestions"),

  questionsManagerModal: document.getElementById("questionsManagerModal"),
  btnCloseQuestionsManager: document.getElementById("btnCloseQuestionsManager"),
  manageFilterModule: document.getElementById("manageFilterModule"),
  manageFilterLayer: document.getElementById("manageFilterLayer"),
  manageFilterCategory: document.getElementById("manageFilterCategory"),
  btnRefreshQuestionsManager: document.getElementById("btnRefreshQuestionsManager"),
  btnNewQuestion: document.getElementById("btnNewQuestion"),
  questionsManagerSummary: document.getElementById("questionsManagerSummary"),
  questionsManagerList: document.getElementById("questionsManagerList"),

  questionForm: document.getElementById("questionForm"),
  questionEditId: document.getElementById("questionEditId"),
  questionModule: document.getElementById("questionModule"),
  questionSubmodule: document.getElementById("questionSubmodule"),
  questionLayer: document.getElementById("questionLayer"),
  questionCategory: document.getElementById("questionCategory"),
  questionWeight: document.getElementById("questionWeight"),
  questionNorma: document.getElementById("questionNorma"),
  questionText: document.getElementById("questionText"),
  btnSaveQuestion: document.getElementById("btnSaveQuestion"),
  btnCancelQuestionEdit: document.getElementById("btnCancelQuestionEdit")
};

function renderDirtyIndicators() {
  const hasDirty = !!state.questionsDirty;

  if (el.dirtyBadgeDashboard) {
    el.dirtyBadgeDashboard.classList.toggle("hidden", !hasDirty);
    el.dirtyBadgeDashboard.textContent = hasDirty ? "Alterações não exportadas" : "";
  }

  if (el.dirtyBadgeManager) {
    el.dirtyBadgeManager.classList.toggle("hidden", !hasDirty);
    el.dirtyBadgeManager.textContent = hasDirty ? "Há alterações não exportadas no questionário." : "";
  }
}

/* ---------- Screens ---------- */

function showSetup(prefill = true) {
  el.screenSetup.classList.remove("hidden");
  el.screenApp.classList.add("hidden");

  if (prefill && state.institution) {
    document.getElementById("institutionName").value = state.institution.name || "";
    document.getElementById("city").value = state.institution.city || "";
    document.getElementById("state").value = state.institution.state || "";
    document.getElementById("institutionType").value = state.institution.type || "";
    document.getElementById("surgicalRooms").value = state.institution.surgicalRooms || "";
    document.getElementById("autoclaves").value = state.institution.autoclaves || "";
    document.getElementById("responsibleName").value = state.institution.responsibleName || "";
    document.getElementById("position").value = state.institution.position || "";
    document.getElementById("email").value = state.institution.email || "";
    document.getElementById("phone").value = state.institution.phone || "";
  }
}

function showApp() {
  el.screenSetup.classList.add("hidden");
  el.screenApp.classList.remove("hidden");
  renderModules();
  renderLeftKPIs();
  renderDirtyIndicators();
  showEmptyRight();
}

function showEmptyRight() {
  el.viewEmpty.classList.remove("hidden");
  el.viewModule.classList.add("hidden");
  el.viewDashboard.classList.add("hidden");
  el.btnBackToModules.classList.add("hidden");
  el.btnEditInstitution2.classList.add("hidden");
  el.rightTitle.textContent = "Selecione um módulo";
  el.rightSubtitle.textContent = "—";
}

function showModuleView() {
  el.viewEmpty.classList.add("hidden");
  el.viewModule.classList.remove("hidden");
  el.viewDashboard.classList.add("hidden");
  el.btnBackToModules.classList.remove("hidden");
  el.btnEditInstitution2.classList.remove("hidden");
}

function showDashboardView() {
  el.viewEmpty.classList.add("hidden");
  el.viewModule.classList.add("hidden");
  el.viewDashboard.classList.remove("hidden");
  el.btnBackToModules.classList.remove("hidden");
  el.btnEditInstitution2.classList.remove("hidden");
}

function renderInstitutionLine() {
  if (!state.institution) return;
  el.institutionLine.textContent = `${state.institution.name} — ${state.institution.city}/${state.institution.state}`;
}

function renderLeftKPIs() {
  const st = computeStats(state.answersById);
  el.kpiProgress.textContent = `${st.progress}%`;
  el.kpiAnswered.textContent = `${st.answered}/${st.total}`;
  el.kpiPoints.textContent = `${st.score}%`;
  el.kpiLastModule.textContent = state.ui.lastModule || "—";
  renderInstitutionLine();
}

function moduleClassification(pct) {
  if (pct >= 85) return { text: "Conforme", cls: "badge-ok" };
  if (pct >= 60) return { text: "Alerta", cls: "badge-warn" };
  return { text: "Crítico", cls: "badge-bad" };
}

function renderModules() {
  const modules = getAllModules();
  el.modulesList.innerHTML = "";

  for (const m of modules) {
    const ms = computeModuleScore(m, state.answersById);
    const progress = ms.total ? Math.round((ms.answered / ms.total) * 100) : 0;
    const cls = moduleClassification(ms.pct);

    const card = document.createElement("div");
    card.className = "module-card";
    card.innerHTML = `
      <div style="min-width:0">
        <div class="module-title">${escapeHtml(m)}</div>
        <div class="module-meta">${ms.answered}/${ms.total} respondidas • Pontos: <b class="mono">${ms.pct}%</b></div>
        <div class="meter"><div style="width:${progress}%"></div></div>
      </div>
      <div style="text-align:right;flex:0 0 auto">
        <div class="badge ${cls.cls}">${cls.text}</div>
        <div class="module-meta mono" style="margin-top:6px">${progress}%</div>
      </div>
    `;
    card.addEventListener("click", () => openModule(m));
    el.modulesList.appendChild(card);
  }
}

function getAnswerValue(id) {
  return state.answersById[id]?.value || null;
}

function setAnswer(id, value) {
  state.answersById[id] = { value };
  persist();
}

function clearModuleAnswers(moduleName) {
  const qs = getModuleQuestions(moduleName);
  for (const q of qs) delete state.answersById[q.id];
  persist();
}

function renderQuestionItem(q, idx, total) {
  const wrap = document.createElement("div");
  wrap.className = "q-item";

  const current = getAnswerValue(q.id);

  const top = document.createElement("div");
  top.className = "q-item-top";

  const left = document.createElement("div");
  left.style.minWidth = "0";
  left.innerHTML = `
    <div class="q-item-title">${idx + 1}/${total}. ${escapeHtml(q.text)}</div>
    <div class="q-item-sub">
      <span class="pill">${escapeHtml(q.layer)} — ${escapeHtml(layerLabel(q.layer))}</span>
      <span class="pill">Categoria: ${escapeHtml(q.category)}</span>
      <span class="pill">${escapeHtml(q.submodule || q.module)}</span>
      <span class="pill ${q.norma === "RDC15/2012" ? "pill-rdc" : "pill-nrdc"}">${escapeHtml(q.norma || "nãoRDC")}</span>
    </div>
  `;

  const answers = document.createElement("div");
  answers.className = "answers";

  const bSim = document.createElement("button");
  bSim.type = "button";
  bSim.className = "ans" + (current === "sim" ? " sel-sim" : "");
  bSim.textContent = "Sim";

  const bParcial = document.createElement("button");
  bParcial.type = "button";
  bParcial.className = "ans" + (current === "parcial" ? " sel-parcial" : "");
  bParcial.textContent = "Parcial";

  const bNao = document.createElement("button");
  bNao.type = "button";
  bNao.className = "ans" + (current === "nao" ? " sel-nao" : "");
  bNao.textContent = "Não";

  function refreshButtons() {
    const v = getAnswerValue(q.id);
    bSim.className = "ans" + (v === "sim" ? " sel-sim" : "");
    bParcial.className = "ans" + (v === "parcial" ? " sel-parcial" : "");
    bNao.className = "ans" + (v === "nao" ? " sel-nao" : "");
  }

  bSim.onclick = () => { setAnswer(q.id, "sim"); refreshButtons(); afterAnswerChanged(q.module); };
  bParcial.onclick = () => { setAnswer(q.id, "parcial"); refreshButtons(); afterAnswerChanged(q.module); };
  bNao.onclick = () => { setAnswer(q.id, "nao"); refreshButtons(); afterAnswerChanged(q.module); };

  answers.appendChild(bSim);
  answers.appendChild(bParcial);
  answers.appendChild(bNao);

  top.appendChild(left);
  top.appendChild(answers);
  wrap.appendChild(top);

  return wrap;
}

function afterAnswerChanged(moduleName) {
  renderModules();
  renderLeftKPIs();
  renderModuleHeader(moduleName);
}

function renderModuleHeader(moduleName) {
  const ms = computeModuleScore(moduleName, state.answersById);
  el.moduleTitleLine.textContent = `Checklist — ${moduleName}`;
  el.moduleProgressLine.textContent = `Respondidas: ${ms.answered}/${ms.total} • Pontos do módulo (ponderado): ${ms.pct}%`;
  el.rightTitle.textContent = `Checklist — ${moduleName}`;
  el.rightSubtitle.textContent = `Todas as perguntas visíveis (modo lista)`;
}

function openModule(moduleName) {
  state.ui.lastModule = moduleName;
  persist();
  renderLeftKPIs();

  showModuleView();
  renderModuleHeader(moduleName);

  const qs = getModuleQuestions(moduleName);
  el.moduleQuestionsList.innerHTML = "";
  qs.forEach((q, idx) => {
    el.moduleQuestionsList.appendChild(renderQuestionItem(q, idx, qs.length));
  });

  el.moduleQuestionsList.scrollIntoView({ behavior: "instant", block: "start" });
}

/* ---------- Dashboard ---------- */

function showDashboard() {
  showDashboardView();
  renderDirtyIndicators();
  el.rightTitle.textContent = "Dashboard";
  el.rightSubtitle.textContent = "Resumo da avaliação";

  const idx = computeLayerIndices(state.answersById);
  el.kpiGlobal.textContent = `${idx.Global}%`;
  el.kpiC.textContent = `${idx.C}%`;
  el.kpiP.textContent = `${idx.P}%`;
  el.kpiI.textContent = `${idx.I}%`;

  const pm = computePriorityMatrix(state.answersById);
  el.priorityTableBody.innerHTML = `
    <tr><td><b>P1 — CRÍTICO</b></td><td class="mono">${pm.P1.length}</td><td>Resposta = Não</td></tr>
    <tr><td><b>P2 — ALTO</b></td><td class="mono">${pm.P2.length}</td><td>Resposta = Parcial</td></tr>
    <tr><td><b>P3 — OK</b></td><td class="mono">${pm.P3.length}</td><td>Resposta = Sim</td></tr>
  `;

  const modules = getAllModules();
  el.modulesScoreBody.innerHTML = "";
  for (const m of modules) {
    const ms = computeModuleScore(m, state.answersById);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(m)}</td>
      <td class="mono">${ms.answered}/${ms.total}</td>
      <td class="mono"><b>${ms.pct}%</b></td>
    `;
    el.modulesScoreBody.appendChild(tr);
  }
}

/* ---------- Export TXT ---------- */

function formatAnswerPT(v) {
  if (v === "sim") return "Sim";
  if (v === "parcial") return "Parcial";
  if (v === "nao") return "Não";
  return "—";
}

function exportTxt() {
  const inst = state.institution || {};
  const idx = computeLayerIndices(state.answersById);
  const stats = computeStats(state.answersById);
  const pm = computePriorityMatrix(state.answersById);

  const lines = [];
  lines.push("=".repeat(80));
  lines.push("NS CHECKLIST SITUACIONAL CME — RELATÓRIO (MVP OFFLINE)");
  lines.push("Pontuação ponderada: RDC15/2012 peso 2 • nãoRDC peso 1 • Sim=100 Parcial=50 Não=0");
  lines.push("=".repeat(80));
  lines.push("");

  lines.push("DADOS DA INSTITUIÇÃO");
  lines.push("-".repeat(80));
  lines.push(`Nome: ${inst.name || ""}`);
  lines.push(`Cidade/UF: ${inst.city || ""}/${inst.state || ""}`);
  lines.push(`Tipo: ${inst.type || ""}`);
  lines.push(`Salas Cirúrgicas: ${inst.surgicalRooms ?? ""}`);
  lines.push(`Autoclaves: ${inst.autoclaves ?? ""}`);
  lines.push(`Responsável: ${inst.responsibleName || ""}`);
  lines.push(`Cargo/Função: ${inst.position || ""}`);
  lines.push(`Email: ${inst.email || ""}`);
  lines.push(`Telefone: ${inst.phone || ""}`);
  lines.push(`Data: ${new Date().toLocaleString("pt-BR")}`);
  lines.push("");

  lines.push("RESUMO");
  lines.push("-".repeat(80));
  lines.push(`Progresso: ${stats.progress}% (${stats.answered}/${stats.total})`);
  lines.push(`Índice Global (ponderado): ${idx.Global}%`);
  lines.push(`Compliance (C): ${idx.C}%`);
  lines.push(`Performance (P): ${idx.P}%`);
  lines.push(`Inteligência (I): ${idx.I}%`);
  lines.push("");
  lines.push("MATRIZ DE PRIORIDADE");
  lines.push("-".repeat(80));
  lines.push(`P1 (Não): ${pm.P1.length}`);
  lines.push(`P2 (Parcial): ${pm.P2.length}`);
  lines.push(`P3 (Sim): ${pm.P3.length}`);
  lines.push("");

  lines.push("RESPOSTAS (DETALHADAS)");
  lines.push("-".repeat(80));
  for (const q of getQuestions()) {
    const a = state.answersById[q.id]?.value || null;
    lines.push("");
    lines.push(`Pergunta ${q.id}: ${q.text}`);
    lines.push(`Módulo: ${q.module} | Submódulo: ${q.submodule || ""} | Camada: ${q.layer} | Categoria: ${q.category} | Norma: ${q.norma || "nãoRDC"}`);
    lines.push(`Resposta: ${formatAnswerPT(a)}`);
  }

  lines.push("");
  lines.push("=".repeat(80));

  const content = lines.join("\n");
  const filename = `CME_Checklist_${sanitizeFileName(inst.name)}_${new Date().toISOString().slice(0, 10)}.txt`;

  downloadTextFile(content, filename, "text/plain;charset=utf-8");
}

/* ---------- Export questions.js ---------- */

function buildQuestionsJsContent() {
  const normalized = getQuestions().map(normalizeQuestion);

  const lines = [];
  lines.push("/**");
  lines.push(" * PERGUNTAS - NS CheckList Situacional CME");
  lines.push(" * Arquivo exportado automaticamente pelo gerenciador de perguntas");
  lines.push(` * Data da exportação: ${new Date().toLocaleString("pt-BR")}`);
  lines.push(` * Total de perguntas: ${normalized.length}`);
  lines.push(" */");
  lines.push("");
  lines.push("const questions = [");

  normalized.forEach((q, index) => {
    lines.push(
      `    { id: ${Number(q.id)}, text: '${escapeJsString(q.text)}', module: '${escapeJsString(q.module)}', submodule: '${escapeJsString(q.submodule)}', layer: '${escapeJsString(q.layer)}', category: '${escapeJsString(q.category)}', weight: ${Number(q.weight)}, norma: '${escapeJsString(q.norma)}' }${index < normalized.length - 1 ? "," : ""}`
    );
  });

  lines.push("];");
  lines.push("");
  lines.push("/* ---------- Normalização e classificação normativa ---------- */");
  lines.push("");
  lines.push("const RDC15_MODULES = new Set([");
  lines.push("  'Recepção',");
  lines.push("  'Expurgo',");
  lines.push("  'Limpeza',");
  lines.push("  'Preparo',");
  lines.push("  'Embalagem',");
  lines.push("  'Esterilização',");
  lines.push("  'Armazenamento',");
  lines.push("  'Distribuição',");
  lines.push("  'Governança',");
  lines.push("  'Água',");
  lines.push("  'Consignados',");
  lines.push("  'Rastreabilidade',");
  lines.push("  'Integração CC'");
  lines.push("]);");
  lines.push("");
  lines.push("for (const q of questions) {");
  lines.push("  q.text = String(q.text || '').trim();");
  lines.push("  q.module = String(q.module || '').trim();");
  lines.push("  q.submodule = String(q.submodule || q.module || '').trim();");
  lines.push("  q.layer = String(q.layer || '').trim();");
  lines.push("  q.category = String(q.category || '').trim();");
  lines.push("  q.weight = Number(q.weight) > 0 ? Number(q.weight) : 1;");
  lines.push("  q.norma = RDC15_MODULES.has(q.module) ? 'RDC15/2012' : 'nãoRDC';");
  lines.push("}");
  lines.push("");
  lines.push("console.log('✓ Arquivo questions.js carregado com sucesso');");
  lines.push("console.log('✓ Total de perguntas base:', questions.length);");
  lines.push("");
  lines.push("if (typeof updateLoadingProgress === 'function') {");
  lines.push("  updateLoadingProgress();");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

function exportQuestionsJs() {
  const content = buildQuestionsJsContent();
  const filename = `questions_atualizado_${new Date().toISOString().slice(0, 10)}.js`;
  downloadTextFile(content, filename, "application/javascript;charset=utf-8");
  clearQuestionsDirty();
}

function downloadTextFile(content, filename, mimeType) {
  const a = document.createElement("a");
  a.setAttribute("href", `data:${mimeType},` + encodeURIComponent(content));
  a.setAttribute("download", filename);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ---------- Print ---------- */

function printQuestionsList() {
  const qs = getQuestions();
  const rows = qs.map(q => `
    <tr>
      <td>${q.id}</td>
      <td>${escapeHtml(q.text)}</td>
      <td>${escapeHtml(q.module)}</td>
      <td>${escapeHtml(q.submodule || "")}</td>
      <td>${escapeHtml(q.layer)} - ${escapeHtml(layerLabel(q.layer))}</td>
      <td>${escapeHtml(q.category)}</td>
      <td>${escapeHtml(String(q.weight))}</td>
      <td>${escapeHtml(q.norma || "nãoRDC")}</td>
    </tr>
  `).join("");

  const html = `
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Impressão das Perguntas</title>
        <style>
          body{font-family:Arial,Helvetica,sans-serif;margin:24px;color:#111827}
          h1{font-size:20px;margin-bottom:6px}
          p{font-size:12px;color:#6b7280;margin-bottom:16px}
          table{width:100%;border-collapse:collapse}
          th,td{border:1px solid #d1d5db;padding:8px;font-size:12px;vertical-align:top;text-align:left}
          th{background:#f3f4f6}
        </style>
      </head>
      <body>
        <h1>NS CheckList Situacional CME — Perguntas</h1>
        <p>Gerado em ${new Date().toLocaleString("pt-BR")} • Total de perguntas: ${qs.length}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pergunta</th>
              <th>Módulo</th>
              <th>Submódulo</th>
              <th>Camada</th>
              <th>Categoria</th>
              <th>Peso</th>
              <th>Norma</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;

  const win = window.open("", "_blank", "width=1200,height=800");
  if (!win) {
    alert("Não foi possível abrir a janela de impressão. Verifique se o navegador bloqueou pop-ups.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

/* ---------- Questions manager ---------- */

function openQuestionsManager() {
  populateManagerFilters();
  populateQuestionFormModuleOptions();
  resetQuestionForm();
  renderQuestionsManagerList();
  renderDirtyIndicators();
  el.questionsManagerModal.classList.remove("hidden");
  el.questionsManagerModal.setAttribute("aria-hidden", "false");
}

function closeQuestionsManager() {
  el.questionsManagerModal.classList.add("hidden");
  el.questionsManagerModal.setAttribute("aria-hidden", "true");
}

function populateManagerFilters() {
  const modules = getAllModules();
  const categories = getAllCategories();

  el.manageFilterModule.innerHTML = `<option value="">Todos</option>` +
    modules.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");

  el.manageFilterCategory.innerHTML = `<option value="">Todas</option>` +
    categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");

  el.manageFilterModule.value = state.ui.managerFilters.module || "";
  el.manageFilterLayer.value = state.ui.managerFilters.layer || "";
  el.manageFilterCategory.value = state.ui.managerFilters.category || "";
}

function populateQuestionFormModuleOptions() {
  const modules = getAllModules();
  el.questionModule.innerHTML = `<option value="">Selecione</option>` +
    modules.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");
}

function getManagerFilteredQuestions() {
  const filters = state.ui.managerFilters;
  return getQuestions().filter(q => {
    const okModule = !filters.module || q.module === filters.module;
    const okLayer = !filters.layer || q.layer === filters.layer;
    const okCategory = !filters.category || q.category === filters.category;
    return okModule && okLayer && okCategory;
  });
}

function canMoveQuestionUp(questionId) {
  const filtered = getManagerFilteredQuestions();
  const pos = filtered.findIndex(q => Number(q.id) === Number(questionId));
  return pos > 0;
}

function canMoveQuestionDown(questionId) {
  const filtered = getManagerFilteredQuestions();
  const pos = filtered.findIndex(q => Number(q.id) === Number(questionId));
  return pos >= 0 && pos < filtered.length - 1;
}

function moveQuestionWithinFiltered(questionId, direction) {
  const filtered = getManagerFilteredQuestions();
  const pos = filtered.findIndex(q => Number(q.id) === Number(questionId));
  if (pos < 0) return;

  const targetPos = direction === "up" ? pos - 1 : pos + 1;
  if (targetPos < 0 || targetPos >= filtered.length) return;

  const currentId = filtered[pos].id;
  const targetId = filtered[targetPos].id;

  const currentGlobalIndex = activeQuestions.findIndex(q => Number(q.id) === Number(currentId));
  const targetGlobalIndex = activeQuestions.findIndex(q => Number(q.id) === Number(targetId));
  if (currentGlobalIndex < 0 || targetGlobalIndex < 0) return;

  const temp = activeQuestions[currentGlobalIndex];
  activeQuestions[currentGlobalIndex] = activeQuestions[targetGlobalIndex];
  activeQuestions[targetGlobalIndex] = temp;

  persistQuestions();
  markQuestionsDirty();
  renderAllAfterQuestionsChange(state.ui.lastModule || null);
  renderQuestionsManagerList();
}

function renderQuestionsManagerList() {
  const list = getManagerFilteredQuestions();
  el.questionsManagerSummary.textContent = `${list.length} pergunta(s) encontrada(s) com os filtros atuais.`;
  el.questionsManagerList.innerHTML = "";

  if (!list.length) {
    el.questionsManagerList.innerHTML = `<div class="empty-box">Nenhuma pergunta encontrada para os filtros selecionados.</div>`;
    return;
  }

  for (const q of list) {
    const item = document.createElement("div");
    item.className = "admin-item";

    const disableUp = !canMoveQuestionUp(q.id);
    const disableDown = !canMoveQuestionDown(q.id);

    item.innerHTML = `
      <div class="admin-item-title">#${q.id} — ${escapeHtml(q.text)}</div>
      <div class="admin-item-meta">
        <span class="pill">${escapeHtml(q.module)}</span>
        <span class="pill">${escapeHtml(q.submodule || "")}</span>
        <span class="pill">${escapeHtml(q.layer)} — ${escapeHtml(layerLabel(q.layer))}</span>
        <span class="pill">Categoria: ${escapeHtml(q.category)}</span>
        <span class="pill">Peso: ${escapeHtml(String(q.weight))}</span>
        <span class="pill ${q.norma === "RDC15/2012" ? "pill-rdc" : "pill-nrdc"}">${escapeHtml(q.norma || "nãoRDC")}</span>
      </div>
      <div class="admin-item-actions">
        <button class="btn btn-ghost btn-sm" type="button" data-action="up" data-id="${q.id}" ${disableUp ? "disabled" : ""}>↑ Subir</button>
        <button class="btn btn-ghost btn-sm" type="button" data-action="down" data-id="${q.id}" ${disableDown ? "disabled" : ""}>↓ Descer</button>
        <button class="btn btn-secondary btn-sm" type="button" data-action="edit" data-id="${q.id}">Editar</button>
        <button class="btn btn-danger btn-sm" type="button" data-action="delete" data-id="${q.id}">Excluir</button>
      </div>
    `;
    el.questionsManagerList.appendChild(item);
  }

  el.questionsManagerList.querySelectorAll("[data-action='edit']").forEach(btn => {
    btn.addEventListener("click", () => startEditQuestion(Number(btn.dataset.id)));
  });

  el.questionsManagerList.querySelectorAll("[data-action='delete']").forEach(btn => {
    btn.addEventListener("click", () => deleteQuestion(Number(btn.dataset.id)));
  });

  el.questionsManagerList.querySelectorAll("[data-action='up']").forEach(btn => {
    btn.addEventListener("click", () => moveQuestionWithinFiltered(Number(btn.dataset.id), "up"));
  });

  el.questionsManagerList.querySelectorAll("[data-action='down']").forEach(btn => {
    btn.addEventListener("click", () => moveQuestionWithinFiltered(Number(btn.dataset.id), "down"));
  });
}

function resetQuestionForm(prefillFromFilters = true) {
  el.questionEditId.value = "";
  el.questionText.value = "";
  el.questionWeight.value = 1;
  el.questionSubmodule.value = "";

  if (prefillFromFilters) {
    el.questionModule.value = state.ui.managerFilters.module || "";
    el.questionLayer.value = state.ui.managerFilters.layer || "";
    el.questionCategory.value = state.ui.managerFilters.category || "";
  } else {
    el.questionModule.value = "";
    el.questionLayer.value = "";
    el.questionCategory.value = "";
  }

  if (!el.questionSubmodule.value && el.questionModule.value) {
    el.questionSubmodule.value = el.questionModule.value;
  }

  if (el.questionModule.value) {
    const firstSameModule = getQuestions().find(q => q.module === el.questionModule.value);
    if (firstSameModule) {
      el.questionNorma.value = firstSameModule.norma || "nãoRDC";
      if (!el.questionSubmodule.value) el.questionSubmodule.value = firstSameModule.submodule || firstSameModule.module;
    } else {
      el.questionNorma.value = "";
    }
  } else {
    el.questionNorma.value = "";
  }
}

function startEditQuestion(id) {
  const q = getQuestions().find(x => Number(x.id) === Number(id));
  if (!q) return;

  el.questionEditId.value = q.id;
  el.questionModule.value = q.module || "";
  el.questionSubmodule.value = q.submodule || q.module || "";
  el.questionLayer.value = q.layer || "";
  el.questionCategory.value = q.category || "";
  el.questionWeight.value = q.weight || 1;
  el.questionNorma.value = q.norma || "nãoRDC";
  el.questionText.value = q.text || "";

  el.questionText.scrollIntoView({ behavior: "smooth", block: "center" });
  el.questionText.focus();
}

function saveQuestionFromForm() {
  const payload = normalizeQuestion({
    id: el.questionEditId.value ? Number(el.questionEditId.value) : nextQuestionId(),
    text: el.questionText.value,
    module: el.questionModule.value,
    submodule: el.questionSubmodule.value,
    layer: el.questionLayer.value,
    category: el.questionCategory.value,
    weight: el.questionWeight.value,
    norma: el.questionNorma.value
  });

  if (!payload.text || !payload.module || !payload.submodule || !payload.layer || !payload.category || !payload.norma) {
    alert("Preencha todos os campos obrigatórios da pergunta.");
    return;
  }

  if (!["C", "P", "I"].includes(payload.layer)) {
    alert("Camada inválida.");
    return;
  }

  const editId = Number(el.questionEditId.value || 0);
  if (editId) {
    const idx = activeQuestions.findIndex(q => Number(q.id) === editId);
    if (idx >= 0) activeQuestions[idx] = payload;
  } else {
    activeQuestions.push(payload);
  }

  persistQuestions();
  markQuestionsDirty();
  removeAnswersForDeletedQuestions();
  renderAllAfterQuestionsChange(payload.module);
  resetQuestionForm(true);
  renderQuestionsManagerList();
  populateManagerFilters();
  populateQuestionFormModuleOptions();
  alert(editId ? "Pergunta atualizada com sucesso." : "Pergunta incluída com sucesso.");
}

function deleteQuestion(id) {
  const q = getQuestions().find(x => Number(x.id) === Number(id));
  if (!q) return;

  const ok = confirm(`Excluir a pergunta #${q.id}?\n\n"${q.text}"`);
  if (!ok) return;

  activeQuestions = activeQuestions.filter(x => Number(x.id) !== Number(id));
  delete state.answersById[id];
  persistQuestions();
  markQuestionsDirty();
  persist();

  if (state.ui.lastModule === q.module && !getModuleQuestions(q.module).length) {
    state.ui.lastModule = null;
  }

  renderAllAfterQuestionsChange(q.module);
  renderQuestionsManagerList();
  populateManagerFilters();
  populateQuestionFormModuleOptions();
}

function renderAllAfterQuestionsChange(preferredModule = null) {
  persist();
  renderModules();
  renderLeftKPIs();
  renderDirtyIndicators();
  showDashboard();

  if (preferredModule && getAllModules().includes(preferredModule)) {
    state.ui.lastModule = preferredModule;
  } else if (state.ui.lastModule && !getAllModules().includes(state.ui.lastModule)) {
    state.ui.lastModule = null;
  }
  persist();
}

/* ---------- Wiring ---------- */

function wire() {
  el.formInstitution.addEventListener("submit", (e) => {
    e.preventDefault();
    const inst = {
      name: document.getElementById("institutionName").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value,
      type: document.getElementById("institutionType").value,
      surgicalRooms: Number(document.getElementById("surgicalRooms").value),
      autoclaves: Number(document.getElementById("autoclaves").value),
      responsibleName: document.getElementById("responsibleName").value.trim(),
      position: document.getElementById("position").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      updatedAt: new Date().toISOString()
    };
    state.institution = inst;
    persist();
    showApp();
  });

  el.btnSetupClear.addEventListener("click", () => {
    if (!confirm("Limpar dados da instituição e respostas deste navegador?")) return;
    localStorage.removeItem(STORAGE_KEYS.institution);
    localStorage.removeItem(STORAGE_KEYS.answers);
    localStorage.removeItem(STORAGE_KEYS.ui);
    localStorage.removeItem(STORAGE_KEYS.questionsDirty);
    state.institution = null;
    state.answersById = {};
    state.ui = { lastModule: null, managerFilters: { module: "", layer: "", category: "" } };
    state.questionsDirty = false;
    showSetup(false);
  });

  el.btnEditInstitution1.addEventListener("click", () => showSetup(true));
  el.btnEditInstitution2.addEventListener("click", () => showSetup(true));

  el.btnGoDashboard.addEventListener("click", () => showDashboard());

  el.btnBackToModules.addEventListener("click", () => {
    renderModules();
    renderLeftKPIs();
    showEmptyRight();
  });

  el.btnToDashboard.addEventListener("click", () => showDashboard());

  el.btnScrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  el.btnClearModule.addEventListener("click", () => {
    const moduleName = state.ui.lastModule;
    if (!moduleName) return;

    const ok = confirm(`Limpar todas as respostas do módulo "${moduleName}"?\n\nIsso NÃO apaga outros módulos nem os dados da instituição.`);
    if (!ok) return;

    clearModuleAnswers(moduleName);
    renderModules();
    renderLeftKPIs();
    openModule(moduleName);
  });

  el.btnExportTxt.addEventListener("click", exportTxt);

  if (el.btnExportQuestionsJs) {
    el.btnExportQuestionsJs.addEventListener("click", exportQuestionsJs);
  }

  el.btnResetAll.addEventListener("click", () => {
    if (!confirm("Nova avaliação: apagar dados e respostas deste navegador?")) return;
    localStorage.removeItem(STORAGE_KEYS.institution);
    localStorage.removeItem(STORAGE_KEYS.answers);
    localStorage.removeItem(STORAGE_KEYS.ui);
    location.reload();
  });

  if (el.btnPrintQuestions) el.btnPrintQuestions.addEventListener("click", printQuestionsList);
  if (el.btnManageQuestions) el.btnManageQuestions.addEventListener("click", openQuestionsManager);
  if (el.btnCloseQuestionsManager) el.btnCloseQuestionsManager.addEventListener("click", closeQuestionsManager);

  if (el.questionsManagerModal) {
    el.questionsManagerModal.addEventListener("click", (e) => {
      if (e.target === el.questionsManagerModal) closeQuestionsManager();
    });
  }

  if (el.manageFilterModule) {
    el.manageFilterModule.addEventListener("change", () => {
      state.ui.managerFilters.module = el.manageFilterModule.value;
      persist();
      renderQuestionsManagerList();
      resetQuestionForm(true);
    });
  }

  if (el.manageFilterLayer) {
    el.manageFilterLayer.addEventListener("change", () => {
      state.ui.managerFilters.layer = el.manageFilterLayer.value;
      persist();
      renderQuestionsManagerList();
      resetQuestionForm(true);
    });
  }

  if (el.manageFilterCategory) {
    el.manageFilterCategory.addEventListener("change", () => {
      state.ui.managerFilters.category = el.manageFilterCategory.value;
      persist();
      renderQuestionsManagerList();
      resetQuestionForm(true);
    });
  }

  if (el.btnRefreshQuestionsManager) {
    el.btnRefreshQuestionsManager.addEventListener("click", () => {
      populateManagerFilters();
      populateQuestionFormModuleOptions();
      renderQuestionsManagerList();
      renderDirtyIndicators();
    });
  }

  if (el.btnNewQuestion) {
    el.btnNewQuestion.addEventListener("click", () => {
      resetQuestionForm(true);
      el.questionText.focus();
    });
  }

  if (el.btnCancelQuestionEdit) {
    el.btnCancelQuestionEdit.addEventListener("click", () => resetQuestionForm(true));
  }

  if (el.questionModule) {
    el.questionModule.addEventListener("change", () => {
      if (!el.questionSubmodule.value || el.questionSubmodule.value === state.ui.managerFilters.module) {
        el.questionSubmodule.value = el.questionModule.value || "";
      }

      const firstSameModule = getQuestions().find(q => q.module === el.questionModule.value);
      if (firstSameModule && !el.questionEditId.value) {
        el.questionNorma.value = firstSameModule.norma || "nãoRDC";
      }
    });
  }

  if (el.questionForm) {
    el.questionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveQuestionFromForm();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.questionsManagerModal && !el.questionsManagerModal.classList.contains("hidden")) {
      closeQuestionsManager();
    }
  });
}

/* ---------- Init ---------- */

function init() {
  removeAnswersForDeletedQuestions();
  wire();
  renderDirtyIndicators();
  if (state.institution) showApp();
  else showSetup(true);
}

document.addEventListener("DOMContentLoaded", init);