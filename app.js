/* NS CheckList Situacional CME — MVP Offline
   Versão atualizada
   Mantém:
   - pontuação existente
   - dashboard
   - export TXT
   - impressão das perguntas
   - gerenciamento de perguntas (CRUD)
   - persistência local
   Acrescenta:
   - exibição de criticidade sugerida da pergunta
   - botão e modal de legenda das categorias
   - relatório básico em nova janela
   - relatório completo em nova janela
   Não exibe no questionário:
   - observação
   - criticidade editável
   - orientação técnica
*/

const STORAGE_KEYS = {
  institution: "cme_mvp_institution_v3",
  answers: "cme_mvp_answers_v6",
  ui: "cme_mvp_ui_v4",
  customQuestions: "cme_mvp_custom_questions_v1"
};

const CATEGORY_LEGEND = {
  intro: "As camadas e categorias ajudam a interpretar o foco principal de cada pergunta no diagnóstico situacional da CME.",
  layers: [
    { code: "C", name: "Compliance", description: "Requisitos, conformidade e controles essenciais do processamento." },
    { code: "P", name: "Performance", description: "Fluxo operacional, produtividade, organização e desempenho." },
    { code: "I", name: "Inteligência", description: "Gestão, tecnologia, análise e melhoria contínua." }
  ],
  groups: [
    {
      title: "Categorias Compliance",
      items: [
        { code: "C1", label: "Estrutura e requisitos básicos" },
        { code: "C2", label: "Monitoramento e controle do processo" },
        { code: "C3", label: "Fluxo e rastreabilidade" },
        { code: "C4", label: "Registros e evidências" },
        { code: "C5", label: "Qualificação e validação" },
        { code: "C6", label: "Não conformidade e ação corretiva" },
        { code: "C7", label: "Resíduos e descarte" },
        { code: "C8", label: "Integração institucional e segurança do paciente" }
      ]
    },
    {
      title: "Categorias Performance",
      items: [
        { code: "P1", label: "Pessoas e dimensionamento" },
        { code: "P2", label: "Fluxo operacional e organização" },
        { code: "P3", label: "Custos" },
        { code: "P4", label: "Consumo, perdas e insumos" },
        { code: "P5", label: "Indicadores e desempenho" }
      ]
    },
    {
      title: "Categorias Inteligência",
      items: [
        { code: "I1", label: "Gestão e melhoria contínua" },
        { code: "I2", label: "Tecnologia, integração e automação" },
        { code: "I3", label: "Análise de dados e apoio à decisão" }
      ]
    }
  ],
  scoreRanges: [
    {
      code: "Conforme",
      range: "≥ 85%",
      description: "Aderência consistente, com processos estruturados e bom nível de controle."
    },
    {
      code: "Alerta",
      range: "60% a 84%",
      description: "Cenário de alerta, com práticas parcialmente consolidadas e oportunidades relevantes de melhoria."
    },
    {
      code: "Crítico",
      range: "< 60%",
      description: "Fragilidade relevante, exigindo ação prioritária para reduzir riscos operacionais, regulatórios e assistenciais."
    }
  ]
};

const APP_CONFIG = window.CME_CONFIG && typeof window.CME_CONFIG === "object"
  ? window.CME_CONFIG
  : {};
const IS_LOCAL_HOST = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const ONLINE_FEATURE_FLAG = APP_CONFIG.enableOnline === true;
const ONLINE_API_BASE = String(
  APP_CONFIG.apiBase || window.CME_API_BASE || (IS_LOCAL_HOST ? "http://localhost:3001/api/v1" : "")
).trim().replace(/\/$/, "");
const ONLINE_FEATURES_ENABLED = ONLINE_FEATURE_FLAG && Boolean(ONLINE_API_BASE);

function safeJSONParse(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
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

function normalizeGuidanceNode(node) {
  if (!node || typeof node !== "object") {
    return {
      achado: "",
      impacto: "",
      base: "",
      melhoria: "",
      acoes: []
    };
  }

  return {
    achado: String(node.achado || "").trim(),
    impacto: String(node.impacto || "").trim(),
    base: String(node.base || "").trim(),
    melhoria: String(node.melhoria || "").trim(),
    acoes: Array.isArray(node.acoes) ? node.acoes.map(x => String(x).trim()).filter(Boolean) : []
  };
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
    norma: q.norma === "RDC15/2012" ? "RDC15/2012" : "nãoRDC",
    criticality: ["Baixa", "Média", "Alta", "Crítica"].includes(q.criticality) ? q.criticality : "",
    guidance: {
      sim: normalizeGuidanceNode(q.guidance?.sim),
      parcial: normalizeGuidanceNode(q.guidance?.parcial),
      nao: normalizeGuidanceNode(q.guidance?.nao)
    }
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

function formatAnswerPT(v) {
  if (v === "sim") return "Sim";
  if (v === "parcial") return "Parcial";
  if (v === "nao") return "Não";
  return "—";
}

function layerLabel(layer) {
  return ({ C: "Compliance", P: "Performance", I: "Inteligência" }[layer]) || layer;
}

function normaMultiplier(q) {
  return (q.norma === "RDC15/2012") ? 2 : 1;
}

function questionFinalWeight(q) {
  const base = (typeof q.weight === "number" && !Number.isNaN(q.weight)) ? q.weight : 1;
  return base * normaMultiplier(q);
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

function getCategoryDescription(code) {
  for (const group of CATEGORY_LEGEND.groups) {
    const found = group.items.find(item => item.code === code);
    if (found) return found.label;
  }
  return "";
}

/* ---------- Metrics ---------- */

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
  let answered = 0, sum = 0, max = 0;
  let sim = 0, parcial = 0, nao = 0;

  for (const q of qs) {
    const a = answersById[q.id]?.value;
    const pts = answerToPoints(a);
    if (pts === null) continue;

    answered++;
    if (a === "sim") sim += 1;
    if (a === "parcial") parcial += 1;
    if (a === "nao") nao += 1;
    const w = questionFinalWeight(q);
    sum += pts * w;
    max += 100 * w;
  }

  const pct = max ? Math.round((sum / max) * 100) : 0;
  return { total: qs.length, answered, pct, sim, parcial, nao };
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

function computeRiskPriorityMatrix(answersById) {
  const m = { P1: [], P2: [], P3: [], P4: [] };
  const sensitiveModules = new Set(["Esterilização", "Limpeza", "Rastreabilidade", "Recepção", "Preparo", "Governança"]);

  for (const q of getQuestions()) {
    const answer = answersById[q.id]?.value;
    if (!["sim", "parcial", "nao"].includes(answer)) continue;

    const critRank = criticalityRank(q.criticality);
    const responseScore = answer === "nao" ? 40 : (answer === "parcial" ? 24 : 0);
    const criticalityScore = critRank * 10;
    const normaScore = q.norma === "RDC15/2012" ? 14 : 0;
    const layerScore = q.layer === "C" ? 12 : (q.layer === "P" ? 7 : 4);
    const weightScore = (Number(q.weight) > 0 ? Number(q.weight) : 1) * 3;
    const moduleScore = sensitiveModules.has(q.module) ? 8 : 0;
    const riskScore = responseScore + criticalityScore + normaScore + layerScore + weightScore + moduleScore;

    const isHighRegulatoryRisk = critRank >= 3 && q.norma === "RDC15/2012" && q.layer === "C";

    let bucket = "P4";
    if (answer === "nao" && (riskScore >= 78 || isHighRegulatoryRisk)) {
      bucket = "P1";
    } else if ((answer === "nao" && riskScore >= 58) || (answer === "parcial" && (riskScore >= 68 || isHighRegulatoryRisk))) {
      bucket = "P2";
    } else if (answer === "nao" || answer === "parcial") {
      bucket = "P3";
    }

    m[bucket].push({ q, answer, riskScore, critRank });
  }

  for (const key of Object.keys(m)) {
    m[key].sort((a, b) => {
      const byRisk = b.riskScore - a.riskScore;
      if (byRisk !== 0) return byRisk;
      const byCrit = b.critRank - a.critRank;
      if (byCrit !== 0) return byCrit;
      return String(a.q.module).localeCompare(String(b.q.module), "pt-BR");
    });
  }

  return m;
}

function computePartialIndex(answersById) {
  let totalQuestions = 0;
  let partialQuestions = 0;
  let simQuestions = 0;
  let naoQuestions = 0;

  for (const q of getQuestions()) {
    const a = answersById[q.id]?.value;
    totalQuestions += 1;
    if (a === "parcial") partialQuestions += 1;
    if (a === "sim") simQuestions += 1;
    if (a === "nao") naoQuestions += 1;
  }

  const simPct = totalQuestions > 0 ? Math.round((simQuestions / totalQuestions) * 100) : 0;
  const partialPct = totalQuestions > 0 ? Math.round((partialQuestions / totalQuestions) * 100) : 0;
  const naoPct = totalQuestions > 0 ? Math.round((naoQuestions / totalQuestions) * 100) : 0;

  return { totalQuestions, simQuestions, partialQuestions, naoQuestions, simPct, partialPct, naoPct };
}

/* ---------- State ---------- */

const state = {
  institution: safeJSONParse(localStorage.getItem(STORAGE_KEYS.institution), null),
  answersById: safeJSONParse(localStorage.getItem(STORAGE_KEYS.answers), {}),
  ui: safeJSONParse(localStorage.getItem(STORAGE_KEYS.ui), {
    lastModule: null,
    managerFilters: { module: "", layer: "", category: "" },
    lastOnlineAssessmentId: null,
    lastOnlineSavedAt: null
  })
};

if (!state.answersById || typeof state.answersById !== "object") {
  state.answersById = {};
}

if (!state.ui || typeof state.ui !== "object") {
  state.ui = {
    lastModule: null,
    managerFilters: { module: "", layer: "", category: "" },
    lastOnlineAssessmentId: null,
    lastOnlineSavedAt: null
  };
}

if (!state.ui.managerFilters) {
  state.ui.managerFilters = { module: "", layer: "", category: "" };
}

if (typeof state.ui.lastOnlineAssessmentId === "undefined") {
  state.ui.lastOnlineAssessmentId = null;
}

if (typeof state.ui.lastOnlineSavedAt === "undefined") {
  state.ui.lastOnlineSavedAt = null;
}

function persist() {
  localStorage.setItem(STORAGE_KEYS.institution, JSON.stringify(state.institution));
  localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(state.answersById));
  localStorage.setItem(STORAGE_KEYS.ui, JSON.stringify(state.ui));
}

function removeAnswersForDeletedQuestions() {
  const validIds = new Set(getQuestions().map(q => String(q.id)));
  for (const id of Object.keys(state.answersById)) {
    if (!validIds.has(String(id))) {
      delete state.answersById[id];
    } else {
      const current = state.answersById[id];
      state.answersById[id] = {
        value: ["sim", "parcial", "nao"].includes(current?.value) ? current.value : null,
        updatedAt: current?.updatedAt || null
      };
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
  kpiPartialCount: document.getElementById("kpiPartialCount"),
  kpiNaoCount: document.getElementById("kpiNaoCount"),
  kpiC: document.getElementById("kpiC"),
  kpiP: document.getElementById("kpiP"),
  kpiI: document.getElementById("kpiI"),
  priorityTableBody: document.getElementById("priorityTableBody"),
  modulesScoreBody: document.getElementById("modulesScoreBody"),
  btnSaveOnline: document.getElementById("btnSaveOnline"),
  btnLoadOnline: document.getElementById("btnLoadOnline"),
  onlineSyncStatus: document.getElementById("onlineSyncStatus"),
  btnExportTxt: document.getElementById("btnExportTxt"),
  btnResetAll: document.getElementById("btnResetAll"),

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

/* ---------- Legend modal ---------- */

function ensureLegendModal() {
  let modal = document.getElementById("legendModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "legendModal";
  modal.className = "modal hidden";
  modal.setAttribute("aria-hidden", "true");

  const layerCards = CATEGORY_LEGEND.layers.map(layer => `
    <div style="
      border:1px solid #e4e8ff;
      background:linear-gradient(180deg,#f8f7ff 0%, #f4f7ff 100%);
      border-radius:14px;
      padding:12px 14px;
      box-shadow:0 4px 14px rgba(99,102,241,.06);
    ">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-width:28px;
          height:28px;
          padding:0 10px;
          border-radius:999px;
          background:#eef2ff;
          color:#4f46e5;
          font-size:13px;
          font-weight:900;
          border:1px solid #c7d2fe;
        ">${escapeHtml(layer.code)}</span>
        <span style="font-size:14px;font-weight:800;color:#1f2a44">${escapeHtml(layer.name)}</span>
      </div>
      <div style="font-size:13px;line-height:1.5;color:#5b6478;margin-top:6px">
        ${escapeHtml(layer.description)}
      </div>
    </div>
  `).join("");

  const groupsHtml = CATEGORY_LEGEND.groups.map(group => `
    <section style="margin-top:18px">
      <div style="
        font-size:14px;
        font-weight:900;
        color:#2b3560;
        margin-bottom:10px;
        padding-bottom:6px;
        border-bottom:1px solid #e8eaf6;
      ">
        ${escapeHtml(group.title)}
      </div>
      <div style="display:grid;gap:8px;">
        ${group.items.map(item => `
          <div style="
            display:flex;
            align-items:flex-start;
            gap:10px;
            padding:10px 12px;
            border:1px solid #eceff8;
            border-radius:12px;
            background:#fbfcff;
          ">
            <span style="
              flex:0 0 auto;
              display:inline-flex;
              align-items:center;
              justify-content:center;
              min-width:38px;
              height:28px;
              padding:0 10px;
              border-radius:999px;
              background:#f3f4ff;
              border:1px solid #d9dcff;
              color:#4f46e5;
              font-size:12px;
              font-weight:900;
            ">${escapeHtml(item.code)}</span>
            <div style="font-size:13px;line-height:1.45;color:#4b5568;padding-top:3px;">
              ${escapeHtml(item.label)}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `).join("");

  const scoreRangesHtml = CATEGORY_LEGEND.scoreRanges.map(item => `
    <div style="
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:14px;
      padding:10px 12px;
      border:1px solid #eceff8;
      border-radius:12px;
      background:#fbfcff;
      flex-wrap:wrap;
    ">
      <div>
        <div style="font-size:13px;font-weight:900;color:#1f2a44">${escapeHtml(item.code)}</div>
        <div style="font-size:12px;color:#5b6478;line-height:1.45;margin-top:3px">${escapeHtml(item.description)}</div>
      </div>
      <div style="
        flex:0 0 auto;
        font-size:12px;
        font-weight:900;
        color:#4f46e5;
        background:#eef2ff;
        border:1px solid #c7d2fe;
        border-radius:999px;
        padding:6px 10px;
      ">${escapeHtml(item.range)}</div>
    </div>
  `).join("");

  modal.innerHTML = `
    <div class="modal-box" style="
      width:min(680px, 92vw);
      max-height:78vh;
      overflow:hidden;
      display:flex;
      flex-direction:column;
      border-radius:18px;
      border:1px solid #e7e8f3;
      box-shadow:0 24px 60px rgba(15,23,42,.22);
      background:#ffffff;
    ">
      <div class="modal-head" style="
        flex:0 0 auto;
        padding:16px 18px;
        border-bottom:1px solid #ececf5;
        background:linear-gradient(135deg,#5b6ee1 0%, #7c4dcc 100%);
        color:#fff;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
      ">
        <div>
          <div style="font-size:17px;font-weight:900;line-height:1.2">Legenda das camadas e categorias</div>
          <div style="font-size:12px;opacity:.92;margin-top:4px">Ajuda de interpretação do checklist</div>
        </div>
        <button id="btnCloseLegendModal" type="button" style="
          border:1px solid rgba(255,255,255,.35);
          background:rgba(255,255,255,.14);
          color:#fff;
          border-radius:10px;
          padding:8px 12px;
          font-size:12px;
          font-weight:800;
          cursor:pointer;
        ">Fechar</button>
      </div>

      <div class="modal-body" style="
        overflow-y:auto;
        padding:16px 18px 18px;
        background:#ffffff;
      ">
        <div style="
          font-size:13px;
          line-height:1.6;
          color:#5d667b;
          margin-bottom:16px;
          background:#f8f9ff;
          border:1px solid #ebedff;
          border-radius:14px;
          padding:12px 14px;
        ">
          ${escapeHtml(CATEGORY_LEGEND.intro)}
        </div>

        <section>
          <div style="
            font-size:14px;
            font-weight:900;
            color:#2b3560;
            margin-bottom:10px;
            padding-bottom:6px;
            border-bottom:1px solid #e8eaf6;
          ">
            Camadas
          </div>
          <div style="display:grid;gap:10px;grid-template-columns:1fr;">
            ${layerCards}
          </div>
        </section>

        ${groupsHtml}

        <section style="margin-top:18px">
          <div style="
            font-size:14px;
            font-weight:900;
            color:#2b3560;
            margin-bottom:10px;
            padding-bottom:6px;
            border-bottom:1px solid #e8eaf6;
          ">
            Faixas de classificação dos módulos
          </div>
          <div style="font-size:13px;line-height:1.6;color:#5d667b;margin-bottom:10px;">
            A classificação dos módulos e índices segue estas faixas para apoiar a leitura do desempenho e a priorização de ações.
          </div>
          <div style="display:grid;gap:8px;">
            ${scoreRangesHtml}
          </div>
        </section>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLegendModal();
  });

  const closeBtn = modal.querySelector("#btnCloseLegendModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeLegendModal);
  }

  return modal;
}

function openLegendModal() {
  const modal = ensureLegendModal();
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeLegendModal() {
  const modal = document.getElementById("legendModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function renderModuleLegendButton() {
  let container = document.getElementById("moduleLegendArea");
  if (!container) {
    container = document.createElement("div");
    container.id = "moduleLegendArea";
    container.style.marginTop = "16px";
    el.viewModule.appendChild(container);
  }

  container.innerHTML = `
    <div class="card" style="padding:14px 16px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div>
          <div style="font-size:14px;font-weight:800;color:#111827">Legenda das categorias</div>
          <div style="font-size:13px;color:#6b7280;margin-top:2px">Consulte o significado das camadas, categorias e faixas de classificação.</div>
        </div>
        <button id="btnOpenLegendModal" type="button" class="btn btn-secondary">Ver legenda completa</button>
      </div>
    </div>
  `;

  const btn = document.getElementById("btnOpenLegendModal");
  if (btn) {
    btn.addEventListener("click", openLegendModal);
  }
}

/* ---------- Shared report helpers ---------- */

function buildUnifiedPanoramaHtml(data) {
  return `
    <div class="grid five unified-panorama">
      <div class="kpi-card"><div class="kpi-label">Progresso</div><div class="kpi-value">${data.stats.progress}%</div><div class="kpi-sub">${data.stats.answered}/${data.stats.total} respondidas</div></div>
      <div class="kpi-card"><div class="kpi-label">Índice Global</div><div class="kpi-value">${data.indices.Global}%</div><div class="kpi-sub">resultado ponderado</div></div>
      <div class="kpi-card"><div class="kpi-label">Compliance</div><div class="kpi-value">${data.indices.C}%</div><div class="kpi-sub">camada C</div></div>
      <div class="kpi-card"><div class="kpi-label">Performance</div><div class="kpi-value">${data.indices.P}%</div><div class="kpi-sub">camada P</div></div>
      <div class="kpi-card"><div class="kpi-label">Inteligência</div><div class="kpi-value">${data.indices.I}%</div><div class="kpi-sub">camada I</div></div>
    </div>
  `;
}

function getUnifiedReportStyles() {
  return `
    *{box-sizing:border-box}
    body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f5f7fb;color:#1f2937}
    .page{max-width:1280px;margin:0 auto;padding:24px}
    .header{background:linear-gradient(135deg,#5b6ee1 0%, #7c4dcc 100%);color:#fff;border-radius:18px;padding:24px;box-shadow:0 16px 40px rgba(91,110,225,.20)}
    .header h1{margin:0;font-size:30px;line-height:1.2}
    .header p{margin:8px 0 0 0;font-size:14px;opacity:.95}
    .actions{margin-top:14px;display:flex;gap:10px;flex-wrap:wrap}
    .actions button{border:none;border-radius:12px;padding:10px 14px;background:#fff;color:#334155;font-size:13px;font-weight:700;cursor:pointer}
    .section{margin-top:18px;background:#fff;border:1px solid #e6eaf3;border-radius:18px;padding:20px;box-shadow:0 8px 24px rgba(15,23,42,.05)}
    .section h2{margin:0 0 14px 0;font-size:18px;color:#24324a}
    .grid{display:grid;gap:12px}
    .grid.one{grid-template-columns:1fr}
    .grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}
    .grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}
    .grid.five{grid-template-columns:repeat(5,minmax(0,1fr))}
    .info-card,.kpi-card,.priority-card,.analysis-card,.summary-card,.action-card{border:1px solid #e8ecf5;border-radius:14px;padding:14px;background:#fbfcff}
    .label,.kpi-label{font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.03em}
    .value{margin-top:6px;font-size:15px;font-weight:700;color:#1f2937}
    .kpi-value,.priority-value{margin-top:8px;font-size:30px;font-weight:900;color:#1f2a44}
    .kpi-sub,.priority-sub{margin-top:4px;font-size:12px;color:#6b7280}
    .priority-title{font-size:14px;font-weight:800}
    .priority-bad{background:#fff5f5;border-color:#fecaca}
    .priority-bad .priority-title,.priority-bad .priority-value{color:#b91c1c}
    .priority-warn{background:#fffaf0;border-color:#fed7aa}
    .priority-warn .priority-title,.priority-warn .priority-value{color:#c2410c}
    .priority-ok{background:#f0fdf4;border-color:#bbf7d0}
    .priority-ok .priority-title,.priority-ok .priority-value{color:#15803d}
    .executive{font-size:15px;line-height:1.7;color:#374151;background:#f8f9ff;border:1px solid #e5e7ff;border-radius:14px;padding:16px}
    .analysis-card{margin-bottom:10px}
    .analysis-card strong{display:block;margin-bottom:6px;color:#24324a}
    .analysis-card p{margin:0;line-height:1.6;color:#4b5568;font-size:14px}
    table{width:100%;border-collapse:collapse}
    th,td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top;font-size:13px}
    th{background:#f8fafc;color:#334155;font-weight:800}
    tbody tr:nth-child(even){background:#fcfcfd}
    .muted{color:#6b7280;font-size:13px;margin-top:-6px;margin-bottom:12px;line-height:1.5}
    .status,.tag{display:inline-block;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:800;white-space:nowrap}
    .status.ok,.tag-ok{background:#dcfce7;color:#14532d;border:1px solid #bbf7d0}
    .status.warn,.tag-warn,.tag-mid{background:#ffedd5;color:#7c2d12;border:1px solid #fed7aa}
    .status.bad,.tag-bad{background:#fee2e2;color:#7f1d1d;border:1px solid #fecaca}
    .tag-neutral{background:#f3f4f6;color:#374151;border:1px solid #e5e7eb}
    .empty-cell{text-align:center;color:#6b7280;padding:18px;background:#fafafa}
    ul{margin:0;padding-left:20px;line-height:1.7;color:#374151;font-size:14px}
    .plan-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    .plan-card{border:1px solid #e8ecf5;border-radius:14px;padding:14px;background:#fbfcff}
    .plan-card h3{font-size:15px;margin:0 0 10px;color:#24324a}
    .summary-card p,.action-card p{margin:0;color:#4b5568;line-height:1.6;font-size:14px}
    .summary-card h3,.action-card h3{margin:0 0 8px 0;font-size:15px;color:#24324a}
    .action-card ul{margin-top:8px}
    @media print{body{background:#fff}.page{max-width:none;padding:0}.header{box-shadow:none}.section{box-shadow:none;break-inside:avoid}.actions{display:none}}
    @media(max-width:1000px){.grid.five,.grid.two,.grid.three,.plan-grid{grid-template-columns:1fr}}
  `;
}

/* ---------- Basic report ---------- */

function ensureBasicReportButton() {
  if (document.getElementById("btnBasicReport")) return;

  const referenceButton =
    el.btnExportTxt ||
    document.querySelector("[data-action='export-txt']") ||
    document.querySelector(".actions-bar") ||
    document.querySelector(".toolbar");

  const btn = document.createElement("button");
  btn.id = "btnBasicReport";
  btn.type = "button";
  btn.className = "btn btn-secondary";
  btn.textContent = "Relatório básico";
  btn.addEventListener("click", openBasicReportWindow);

  if (referenceButton && referenceButton.parentElement) {
    referenceButton.parentElement.insertBefore(btn, referenceButton);
  } else if (el.viewDashboard) {
    const fallbackWrap = document.createElement("div");
    fallbackWrap.style.marginBottom = "12px";
    fallbackWrap.appendChild(btn);
    el.viewDashboard.prepend(fallbackWrap);
  }
}

function getBasicReportData() {
  const inst = state.institution || {};
  const stats = computeStats(state.answersById);
  const indices = computeLayerIndices(state.answersById);
  const priority = computeRiskPriorityMatrix(state.answersById);
  const modules = getAllModules().map(moduleName => {
    const ms = computeModuleScore(moduleName, state.answersById);
    return {
      module: moduleName,
      answered: ms.answered,
      total: ms.total,
      pct: ms.pct
    };
  });

  const responses = getQuestions().map(q => {
    const a = state.answersById[q.id]?.value || null;
    return {
      id: q.id,
      module: q.module,
      submodule: q.submodule || "",
      layer: q.layer,
      layerName: layerLabel(q.layer),
      category: q.category,
      categoryDescription: getCategoryDescription(q.category),
      norma: q.norma || "nãoRDC",
      criticality: q.criticality || "—",
      question: q.text,
      answer: formatAnswerPT(a)
    };
  });

  return {
    institution: {
      name: inst.name || "",
      city: inst.city || "",
      state: inst.state || "",
      type: inst.type || "",
      surgicalRooms: inst.surgicalRooms ?? "",
      autoclaves: inst.autoclaves ?? "",
      responsibleName: inst.responsibleName || "",
      position: inst.position || "",
      email: inst.email || "",
      phone: inst.phone || ""
    },
    generatedAt: new Date().toLocaleString("pt-BR"),
    stats,
    indices,
    priority: {
      p1: priority.P1.length,
      p2: priority.P2.length,
      p3: priority.P3.length,
      p4: priority.P4.length
    },
    modules,
    responses
  };
}

function openBasicReportWindow() {
  const data = getBasicReportData();

  const institutionHtml = `
    <div class="grid two">
      <div class="info-card"><div class="label">Instituição</div><div class="value">${escapeHtml(data.institution.name || "—")}</div></div>
      <div class="info-card"><div class="label">Data</div><div class="value">${escapeHtml(data.generatedAt)}</div></div>
      <div class="info-card"><div class="label">Cidade/UF</div><div class="value">${escapeHtml((data.institution.city || "—") + "/" + (data.institution.state || "—"))}</div></div>
      <div class="info-card"><div class="label">Tipo</div><div class="value">${escapeHtml(data.institution.type || "—")}</div></div>
      <div class="info-card"><div class="label">Salas cirúrgicas</div><div class="value">${escapeHtml(String(data.institution.surgicalRooms || "—"))}</div></div>
      <div class="info-card"><div class="label">Autoclaves</div><div class="value">${escapeHtml(String(data.institution.autoclaves || "—"))}</div></div>
      <div class="info-card"><div class="label">Responsável</div><div class="value">${escapeHtml(data.institution.responsibleName || "—")}</div></div>
      <div class="info-card"><div class="label">Cargo/Função</div><div class="value">${escapeHtml(data.institution.position || "—")}</div></div>
      <div class="info-card"><div class="label">Email</div><div class="value">${escapeHtml(data.institution.email || "—")}</div></div>
      <div class="info-card"><div class="label">Telefone</div><div class="value">${escapeHtml(data.institution.phone || "—")}</div></div>
    </div>
  `;

  const summaryHtml = buildUnifiedPanoramaHtml(data);

  const priorityHtml = `
    <div class="grid two">
      <div class="priority-card priority-bad">
        <div class="priority-title">P1 — Ação imediata</div>
        <div class="priority-value">${data.priority.p1}</div>
        <div class="priority-sub">falha grave com alto risco regulatório/assistencial</div>
      </div>
      <div class="priority-card priority-warn">
        <div class="priority-title">P2 — Curto prazo</div>
        <div class="priority-value">${data.priority.p2}</div>
        <div class="priority-sub">risco relevante que exige correção prioritária</div>
      </div>
      <div class="priority-card" style="background:#eef2ff;border-color:#dbe4ff">
        <div class="priority-title">P3 — Ação planejada</div>
        <div class="priority-value">${data.priority.p3}</div>
        <div class="priority-sub">ajustes importantes com menor urgência</div>
      </div>
      <div class="priority-card priority-ok">
        <div class="priority-title">P4 — Monitoramento</div>
        <div class="priority-value">${data.priority.p4}</div>
        <div class="priority-sub">itens sob controle no cenário atual</div>
      </div>
    </div>
  `;

  const modulesRows = data.modules.map(item => `
    <tr>
      <td>${escapeHtml(item.module)}</td>
      <td>${item.answered}/${item.total}</td>
      <td><strong>${item.pct}%</strong></td>
    </tr>
  `).join("");

  const responsesRows = data.responses.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${escapeHtml(item.module)}</td>
      <td>${escapeHtml(item.submodule || "—")}</td>
      <td>${escapeHtml(item.layer)} — ${escapeHtml(item.layerName)}</td>
      <td>${escapeHtml(item.category)}${item.categoryDescription ? ` — ${escapeHtml(item.categoryDescription)}` : ""}</td>
      <td>${escapeHtml(item.norma)}</td>
      <td>${escapeHtml(item.criticality)}</td>
      <td>${escapeHtml(item.answer)}</td>
      <td>${escapeHtml(item.question)}</td>
    </tr>
  `).join("");

  const reportHtml = `
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Relatório Básico — NS CheckList Situacional CME</title>
        <style>${getUnifiedReportStyles()}</style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>Relatório Básico</h1>
            <p>NS CheckList Situacional CME — resumo objetivo da avaliação preenchida.</p>
            <div class="actions">
              <button onclick="window.print()">Imprimir / Salvar em PDF</button>
              <button onclick="window.close()">Fechar</button>
            </div>
          </div>

          <section class="section">
            <h2>1. Identificação</h2>
            ${institutionHtml}
          </section>

          <section class="section">
            <h2>2. Panorama geral de desempenho</h2>
            ${summaryHtml}
          </section>

          <section class="section">
            <h2>3. Matriz de Prioridade (Risco e Ação)</h2>
            ${priorityHtml}
          </section>

          <section class="section">
            <h2>4. Desempenho por Módulo</h2>
            <div class="muted">Pontuação calculada com ponderação por norma e respostas registradas.</div>
            <table>
              <thead>
                <tr>
                  <th>Módulo</th>
                  <th>Respondidas</th>
                  <th>Pontuação</th>
                </tr>
              </thead>
              <tbody>
                ${modulesRows}
              </tbody>
            </table>
          </section>

          <section class="section">
            <h2>5. Respostas Detalhadas</h2>
            <div class="muted">Listagem completa das perguntas com resposta e criticidade sugerida.</div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Módulo</th>
                  <th>Submódulo</th>
                  <th>Camada</th>
                  <th>Categoria</th>
                  <th>Norma</th>
                  <th>Criticidade</th>
                  <th>Resposta</th>
                  <th>Pergunta</th>
                </tr>
              </thead>
              <tbody>
                ${responsesRows}
              </tbody>
            </table>
          </section>
        </div>
      </body>
    </html>
  `;

  const win = window.open("", "_blank", "width=1400,height=900");
  if (!win) {
    alert("Não foi possível abrir a janela do relatório. Verifique se o navegador bloqueou pop-ups.");
    return;
  }

  win.document.open();
  win.document.write(reportHtml);
  win.document.close();
  win.focus();
}

/* ---------- Complete report ---------- */

function ensureCompleteReportButton() {
  if (document.getElementById("btnCompleteReport")) return;

  const btn = document.createElement("button");
  btn.id = "btnCompleteReport";
  btn.type = "button";
  btn.className = "btn btn-primary";
  btn.textContent = "Relatório completo";
  btn.addEventListener("click", openCompleteReportWindow);

  const basicBtn = document.getElementById("btnBasicReport");

  if (basicBtn && basicBtn.parentElement) {
    basicBtn.parentElement.insertBefore(btn, basicBtn.nextSibling);
    return;
  }

  const referenceButton = el.btnExportTxt;

  if (referenceButton && referenceButton.parentElement) {
    referenceButton.parentElement.insertBefore(btn, referenceButton);
  } else if (el.viewDashboard) {
    const wrap = document.createElement("div");
    wrap.style.marginBottom = "12px";
    wrap.appendChild(btn);
    el.viewDashboard.prepend(wrap);
  }
}

function classifyReportScore(score) {
  const value = Number(score) || 0;

  if (value >= 85) {
    return {
      label: "Conforme",
      tone: "ok",
      text: "Aderência consistente, com processos estruturados e bom nível de controle."
    };
  }

  if (value >= 60) {
    return {
      label: "Alerta",
      tone: "warn",
      text: "Cenário de alerta, com práticas parcialmente consolidadas e oportunidades relevantes de melhoria."
    };
  }

  return {
    label: "Crítico",
    tone: "bad",
    text: "Fragilidade relevante, exigindo ação prioritária para reduzir riscos operacionais, regulatórios e assistenciais."
  };
}

function criticalityRank(value) {
  return ({
    "Crítica": 4,
    "Alta": 3,
    "Média": 2,
    "Baixa": 1
  }[value]) || 0;
}

function interpretLayerScore(layer, score) {
  const cls = classifyReportScore(score);

  const focus = {
    C: "conformidade regulatória, registros, rastreabilidade, requisitos essenciais e controles mínimos do processamento",
    P: "desempenho operacional, produtividade, fluxo, organização, perdas, consumo e indicadores",
    I: "gestão, tecnologia, integração, automação, análise de dados e melhoria contínua"
  }[layer] || "dimensão avaliada";

  return `${layerLabel(layer)}: ${score}%. O resultado demonstra ${cls.text.toLowerCase()} Esta camada reflete principalmente ${focus}.`;
}

function getCompleteResponseRows() {
  return getQuestions().map(q => {
    const rawAnswer = state.answersById[q.id]?.value || null;

    return {
      id: q.id,
      module: q.module,
      submodule: q.submodule || "",
      layer: q.layer,
      layerName: layerLabel(q.layer),
      category: q.category,
      categoryDescription: getCategoryDescription(q.category),
      norma: q.norma || "nãoRDC",
      criticality: q.criticality || "—",
      question: q.text,
      rawAnswer,
      answer: formatAnswerPT(rawAnswer),
      guidanceNao: normalizeGuidanceNode(q.guidance?.nao),
      guidanceParcial: normalizeGuidanceNode(q.guidance?.parcial)
    };
  });
}

function getPriorityFindings(responses) {
  return responses
    .filter(item => item.rawAnswer === "nao")
    .sort((a, b) => {
      const byCrit = criticalityRank(b.criticality) - criticalityRank(a.criticality);
      if (byCrit !== 0) return byCrit;
      return String(a.module).localeCompare(String(b.module), "pt-BR");
    });
}

function getAttentionFindings(responses) {
  return responses
    .filter(item => item.rawAnswer === "parcial")
    .sort((a, b) => {
      const byCrit = criticalityRank(b.criticality) - criticalityRank(a.criticality);
      if (byCrit !== 0) return byCrit;
      return String(a.module).localeCompare(String(b.module), "pt-BR");
    });
}

function buildFallbackActionText(item, mode = "nao") {
  const actionsNao = {
    C1: "Adequar a estrutura, os requisitos básicos e as condições mínimas do processo avaliado.",
    C2: "Implantar ou reforçar controles e monitoramentos do processo.",
    C3: "Revisar o fluxo e assegurar rastreabilidade adequada em todas as etapas.",
    C4: "Fortalecer registros, evidências e rotinas documentais.",
    C5: "Realizar qualificação, validação e monitoramento técnico das etapas críticas.",
    C6: "Estruturar tratativa formal de não conformidades com ação corretiva e acompanhamento.",
    C7: "Adequar o manejo, segregação e descarte de resíduos.",
    C8: "Reforçar integração institucional e segurança do paciente nas interfaces do processo.",
    P1: "Revisar dimensionamento, distribuição e capacitação da equipe.",
    P2: "Padronizar o fluxo operacional e melhorar a organização do processo.",
    P3: "Reavaliar custos, uso de recursos e eficiência operacional.",
    P4: "Controlar consumo, perdas e uso de insumos.",
    P5: "Implantar ou fortalecer indicadores e rotina de acompanhamento de desempenho.",
    I1: "Fortalecer práticas de gestão e melhoria contínua.",
    I2: "Ampliar tecnologia, integração e automação dos controles.",
    I3: "Melhorar análise de dados e apoio à tomada de decisão."
  };

  const actionsParcial = {
    C1: "Completar as adequações de estrutura e consolidar os requisitos básicos já iniciados.",
    C2: "Fortalecer os controles existentes e ampliar o monitoramento do processo.",
    C3: "Aprimorar o fluxo e consolidar a rastreabilidade nas etapas ainda incompletas.",
    C4: "Padronizar e completar registros e evidências documentais.",
    C5: "Finalizar qualificação, validação ou monitoramento técnico pendente.",
    C6: "Consolidar a rotina de tratativa de não conformidades e acompanhamento das ações.",
    C7: "Melhorar a consistência do manejo e descarte de resíduos.",
    C8: "Fortalecer a integração institucional e consolidar práticas de segurança do paciente.",
    P1: "Aprimorar dimensionamento, capacitação e organização da equipe.",
    P2: "Padronizar melhor o fluxo operacional e reduzir variabilidade do processo.",
    P3: "Refinar a análise de custos e aumentar a eficiência do uso de recursos.",
    P4: "Reduzir perdas e melhorar controle de consumo e insumos.",
    P5: "Consolidar indicadores e rotina de análise do desempenho.",
    I1: "Ampliar práticas de gestão e melhoria contínua já existentes.",
    I2: "Evoluir o uso de tecnologia, integração e automação.",
    I3: "Aprofundar análise de dados para melhor apoio à decisão."
  };

  const map = mode === "parcial" ? actionsParcial : actionsNao;
  if (map[item.category]) return map[item.category];

  if (mode === "parcial") {
    return `Completar a implementação parcial identificada na pergunta "${item.question}", consolidando processo, responsável e monitoramento.`;
  }

  return `Tratar a não conformidade identificada na pergunta "${item.question}", definindo adequação, responsável e prazo de implementação.`;
}

function getDetailedActionBlocks(items, mode = "nao") {
  return items.map(item => {
    const g = mode === "parcial"
      ? (item.guidanceParcial || normalizeGuidanceNode(null))
      : (item.guidanceNao || normalizeGuidanceNode(null));

    const actions = Array.isArray(g.acoes) && g.acoes.length ? g.acoes : [buildFallbackActionText(item, mode)];

    return {
      id: item.id,
      module: item.module,
      question: item.question,
      achado: g.achado || "",
      impacto: g.impacto || "",
      base: g.base || item.norma || "",
      melhoria: g.melhoria || "",
      actions
    };
  });
}
function getCompleteReportData() {
  const basic = getBasicReportData();
  const responses = getCompleteResponseRows();

  const modules = getAllModules().map(moduleName => {
    const ms = computeModuleScore(moduleName, state.answersById);
    const cls = classifyReportScore(ms.pct);

    return {
      module: moduleName,
      answered: ms.answered,
      total: ms.total,
      pct: ms.pct,
      classification: cls.label,
      tone: cls.tone,
      interpretation: cls.text
    };
  });

  const priorityFindings = getPriorityFindings(responses);
  const attentionFindings = getAttentionFindings(responses);
  const unanswered = responses.filter(item => !item.rawAnswer);

  return {
    ...basic,
    responses,
    modules,
    priorityFindings,
    attentionFindings,
    unanswered,
    priorityActions: getDetailedActionBlocks(priorityFindings, "nao"),
    attentionActions: getDetailedActionBlocks(attentionFindings, "parcial"),
    layerInterpretations: {
      C: interpretLayerScore("C", basic.indices.C),
      P: interpretLayerScore("P", basic.indices.P),
      I: interpretLayerScore("I", basic.indices.I)
    }
  };
}

function buildExecutiveSummary(data) {
  const globalClass = classifyReportScore(data.indices.Global);
  const p1 = data.priorityFindings.length;
  const p2 = data.attentionFindings.length;
  const unansweredCount = data.unanswered.length;

  const worstModules = [...data.modules]
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3)
    .map(m => `${m.module} (${m.pct}%)`);

  const worstText = worstModules.length
    ? `Os módulos com maior necessidade de atenção são: ${worstModules.join(", ")}.`
    : "Não foram identificados módulos com desempenho crítico até o momento.";

  const unfinishedText = unansweredCount > 0
    ? `A avaliação permanece parcialmente concluída, com ${unansweredCount} item(ns) sem resposta. `
    : "";

  return `A avaliação apresenta Índice Global de ${data.indices.Global}%, classificado como ${globalClass.label}. O diagnóstico indica ${globalClass.text.toLowerCase()} Foram identificados ${p1} achado(s) prioritário(s) com resposta “Não” e ${p2} ponto(s) de atenção com resposta “Parcial”. No panorama das camadas, Compliance apresenta ${data.indices.C}%, Performance ${data.indices.P}% e Inteligência ${data.indices.I}%. ${worstText} ${unfinishedText}Esta leitura deve orientar a priorização de ações corretivas, fortalecimento dos registros, melhoria dos fluxos operacionais e evolução da gestão da CME.`;
}

function buildCompleteRecommendations(data) {
  const recommendations = [];

  const hasRDC15 = data.priorityFindings.some(i => i.norma === "RDC15/2012");
  const mergedFindings = data.priorityFindings.concat(data.attentionFindings);

  const hasC3 = mergedFindings.some(i => i.category === "C3");
  const hasC4 = mergedFindings.some(i => i.category === "C4");
  const hasC5 = mergedFindings.some(i => i.category === "C5");
  const hasC6 = mergedFindings.some(i => i.category === "C6");
  const hasP1 = mergedFindings.some(i => i.category === "P1");
  const hasP5 = mergedFindings.some(i => i.category === "P5");
  const hasI2 = mergedFindings.some(i => i.category === "I2" || i.layer === "I");

  if (hasRDC15) {
    recommendations.push("Priorizar a correção dos itens relacionados à RDC15/2012, especialmente aqueles classificados como Alta ou Crítica, por representarem maior risco regulatório e assistencial.");
  }

  if (hasC3) {
    recommendations.push("Revisar os fluxos de rastreabilidade, garantindo identificação clara de materiais, cargas, processos, profissionais envolvidos e destino final.");
  }

  if (hasC4) {
    recommendations.push("Fortalecer registros e evidências documentais, reduzindo lacunas de preenchimento, ausência de dados e fragilidade para auditorias.");
  }

  if (hasC5) {
    recommendations.push("Reavaliar processos de qualificação, validação e monitoramento técnico, especialmente em etapas críticas como limpeza, esterilização, água e equipamentos.");
  }

  if (hasC6) {
    recommendations.push("Estruturar plano formal de tratativa de não conformidades, com registro, análise de causa, ação corretiva, responsável e prazo.");
  }

  if (hasP1) {
    recommendations.push("Avaliar dimensionamento, capacitação e distribuição da equipe, considerando volume processado, complexidade dos materiais e carga operacional da CME.");
  }

  if (hasP5) {
    recommendations.push("Implantar ou fortalecer indicadores de desempenho para monitorar produtividade, retrabalho, atrasos, falhas e eficiência operacional.");
  }

  if (hasI2 || data.indices.I < 60) {
    recommendations.push("Evoluir a camada de tecnologia, integração e análise de dados, reduzindo dependência de controles manuais e ampliando a capacidade de decisão da gestão.");
  }

  if (!recommendations.length) {
    recommendations.push("Manter o monitoramento periódico dos processos, revisando indicadores, registros e aderência às boas práticas de CME.");
  }

  return recommendations;
}

function buildSuggestedActionPlan(data) {
  const shortTerm = [
    "Tratar imediatamente itens com resposta “Não” e criticidade Crítica ou Alta.",
    "Revisar não conformidades relacionadas à RDC15/2012.",
    "Validar registros mínimos obrigatórios nas etapas críticas do processamento."
  ];

  const mediumTerm = [
    "Padronizar fluxos operacionais com maior número de respostas parciais.",
    "Implantar rotina de auditoria interna por módulo avaliado.",
    "Fortalecer indicadores de desempenho e reuniões periódicas de análise."
  ];

  const continuous = [
    "Monitorar mensalmente os indicadores de conformidade, performance e inteligência.",
    "Reavaliar periodicamente os módulos com menor desempenho.",
    "Manter plano de melhoria contínua com responsáveis, prazos e evidências."
  ];

  if (data.indices.I < 60) {
    mediumTerm.push("Estruturar plano de evolução tecnológica, integração de dados e automação dos registros da CME.");
  }

  if (data.indices.P < 60) {
    mediumTerm.push("Revisar produtividade, fluxo de trabalho, dimensionamento e gargalos operacionais.");
  }

  if (data.indices.C < 60) {
    shortTerm.push("Priorizar adequações de conformidade regulatória e segurança do processamento.");
  }

  return { shortTerm, mediumTerm, continuous };
}

function criticalityClass(value) {
  if (value === "Crítica") return "tag-bad";
  if (value === "Alta") return "tag-warn";
  if (value === "Média") return "tag-mid";
  if (value === "Baixa") return "tag-ok";
  return "tag-neutral";
}

function renderFindingRows(items, emptyMessage) {
  if (!items.length) {
    return `<tr><td colspan="7" class="empty-cell">${escapeHtml(emptyMessage)}</td></tr>`;
  }

  return items.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${escapeHtml(item.module)}</td>
      <td>${escapeHtml(item.category)}${item.categoryDescription ? ` — ${escapeHtml(item.categoryDescription)}` : ""}</td>
      <td>${escapeHtml(item.norma)}</td>
      <td><span class="tag ${criticalityClass(item.criticality)}">${escapeHtml(item.criticality)}</span></td>
      <td>${escapeHtml(item.answer)}</td>
      <td>${escapeHtml(item.question)}</td>
    </tr>
  `).join("");
}

function renderList(items) {
  return `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderActionCards(items, emptyMessage, actionTitle = "Ações necessárias") {
  if (!items.length) {
    return `<div class="summary-card"><p>${escapeHtml(emptyMessage)}</p></div>`;
  }

  return items.map(item => `
    <div class="action-card" style="margin-bottom:12px">
      <h3>ID ${item.id} — ${escapeHtml(item.module)}</h3>
      <p><strong>Pergunta:</strong> ${escapeHtml(item.question)}</p>
      ${item.achado ? `<p><strong>Achado:</strong> ${escapeHtml(item.achado)}</p>` : ""}
      ${item.impacto ? `<p><strong>Impacto:</strong> ${escapeHtml(item.impacto)}</p>` : ""}
      ${item.base ? `<p><strong>Base:</strong> ${escapeHtml(item.base)}</p>` : ""}
      ${item.melhoria ? `<p><strong>Direção de melhoria:</strong> ${escapeHtml(item.melhoria)}</p>` : ""}
      <div style="margin-top:8px">
        <strong style="font-size:14px;color:#24324a">${escapeHtml(actionTitle)}:</strong>
        ${renderList(item.actions)}
      </div>
    </div>
  `).join("");
}

function openCompleteReportWindow() {
  const data = getCompleteReportData();
  const executiveSummary = buildExecutiveSummary(data);
  const recommendations = buildCompleteRecommendations(data);
  const actionPlan = buildSuggestedActionPlan(data);

  const institutionHtml = `
    <div class="grid two">
      <div class="info-card"><div class="label">Instituição</div><div class="value">${escapeHtml(data.institution.name || "—")}</div></div>
      <div class="info-card"><div class="label">Data</div><div class="value">${escapeHtml(data.generatedAt)}</div></div>
      <div class="info-card"><div class="label">Cidade/UF</div><div class="value">${escapeHtml((data.institution.city || "—") + "/" + (data.institution.state || "—"))}</div></div>
      <div class="info-card"><div class="label">Tipo</div><div class="value">${escapeHtml(data.institution.type || "—")}</div></div>
      <div class="info-card"><div class="label">Responsável</div><div class="value">${escapeHtml(data.institution.responsibleName || "—")}</div></div>
      <div class="info-card"><div class="label">Cargo/Função</div><div class="value">${escapeHtml(data.institution.position || "—")}</div></div>
    </div>
  `;

  const panoramaHtml = buildUnifiedPanoramaHtml(data);

  const layerHtml = `
    <div class="analysis-card"><strong>Compliance</strong><p>${escapeHtml(data.layerInterpretations.C)}</p></div>
    <div class="analysis-card"><strong>Performance</strong><p>${escapeHtml(data.layerInterpretations.P)}</p></div>
    <div class="analysis-card"><strong>Inteligência</strong><p>${escapeHtml(data.layerInterpretations.I)}</p></div>
  `;

  const modulesRows = data.modules.map(item => `
    <tr>
      <td>${escapeHtml(item.module)}</td>
      <td>${item.answered}/${item.total}</td>
      <td><strong>${item.pct}%</strong></td>
      <td><span class="status ${item.tone}">${escapeHtml(item.classification)}</span></td>
      <td>${escapeHtml(item.interpretation)}</td>
    </tr>
  `).join("");

  const responsesRows = data.responses.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${escapeHtml(item.module)}</td>
      <td>${escapeHtml(item.submodule || "—")}</td>
      <td>${escapeHtml(item.layer)} — ${escapeHtml(item.layerName)}</td>
      <td>${escapeHtml(item.category)}${item.categoryDescription ? ` — ${escapeHtml(item.categoryDescription)}` : ""}</td>
      <td>${escapeHtml(item.norma)}</td>
      <td>${escapeHtml(item.criticality)}</td>
      <td>${escapeHtml(item.answer)}</td>
      <td>${escapeHtml(item.question)}</td>
    </tr>
  `).join("");

  const pendingSummaryHtml = `
    <div class="summary-card">
      <h3>Pendências de preenchimento</h3>
      <p>
        ${data.unanswered.length > 0
          ? `A avaliação permanece com ${data.unanswered.length} item(ns) sem resposta, o que pode influenciar a leitura consolidada dos resultados.`
          : "A avaliação não apresenta pendências de preenchimento no momento."}
      </p>
    </div>
  `;

  const reportHtml = `
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Relatório Completo — NS CheckList Situacional CME</title>
        <style>${getUnifiedReportStyles()}</style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>Relatório Completo</h1>
            <p>NS CheckList Situacional CME — análise consultiva, interpretativa e orientada à ação.</p>
            <div class="actions">
              <button onclick="window.print()">Imprimir / Salvar em PDF</button>
              <button onclick="window.close()">Fechar</button>
            </div>
          </div>

          <section class="section"><h2>1. Identificação da avaliação</h2>${institutionHtml}</section>
          <section class="section"><h2>2. Resumo executivo</h2><div class="executive">${escapeHtml(executiveSummary)}</div></section>
          <section class="section"><h2>3. Panorama geral de desempenho</h2>${panoramaHtml}</section>
          <section class="section"><h2>4. Leitura interpretativa das camadas</h2>${layerHtml}</section>

          <section class="section">
            <h2>5. Análise por módulo</h2>
            <div class="muted">Classificação por faixa: Conforme ≥85%, Alerta 60–84%, Crítico &lt;60%.</div>
            <table>
              <thead>
                <tr>
                  <th>Módulo</th>
                  <th>Respondidas</th>
                  <th>Score</th>
                  <th>Classificação</th>
                  <th>Leitura interpretativa</th>
                </tr>
              </thead>
              <tbody>${modulesRows}</tbody>
            </table>
          </section>

          <section class="section">
            <h2>6. Achados prioritários</h2>
            <div class="muted">Perguntas com resposta “Não”, ordenadas por criticidade e módulo.</div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Módulo</th>
                  <th>Categoria</th>
                  <th>Norma</th>
                  <th>Criticidade</th>
                  <th>Resposta</th>
                  <th>Pergunta</th>
                </tr>
              </thead>
              <tbody>${renderFindingRows(data.priorityFindings, "Nenhum achado prioritário identificado com resposta Não.")}</tbody>
            </table>
          </section>

          <section class="section">
            <h2>6.1. Ações necessárias para os achados prioritários</h2>
            <div class="muted">Orientações acionáveis para tratamento dos itens com resposta “Não”.</div>
            ${renderActionCards(data.priorityActions, "Não há ações prioritárias pendentes no momento.", "Ações necessárias")}
          </section>

          <section class="section">
            <h2>7. Pontos de atenção</h2>
            <div class="muted">Perguntas com resposta “Parcial”, representando aderência incompleta ou oportunidade de melhoria.</div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Módulo</th>
                  <th>Categoria</th>
                  <th>Norma</th>
                  <th>Criticidade</th>
                  <th>Resposta</th>
                  <th>Pergunta</th>
                </tr>
              </thead>
              <tbody>${renderFindingRows(data.attentionFindings, "Nenhum ponto de atenção identificado com resposta Parcial.")}</tbody>
            </table>
          </section>

          <section class="section">
            <h2>7.1. Ações recomendadas para os pontos de atenção</h2>
            <div class="muted">Orientações para consolidar os itens com resposta “Parcial” e elevar sua aderência.</div>
            ${renderActionCards(data.attentionActions, "Não há ações recomendadas pendentes para os pontos de atenção no momento.", "Ações recomendadas")}
          </section>

          <section class="section"><h2>8. Recomendações automáticas</h2>${renderList(recommendations)}</section>

          <section class="section">
            <h2>9. Priorização sugerida</h2>
            <div class="plan-grid">
              <div class="plan-card"><h3>Curto prazo</h3>${renderList(actionPlan.shortTerm)}</div>
              <div class="plan-card"><h3>Médio prazo</h3>${renderList(actionPlan.mediumTerm)}</div>
              <div class="plan-card"><h3>Monitoramento contínuo</h3>${renderList(actionPlan.continuous)}</div>
            </div>
          </section>

          <section class="section">
            <h2>10. Pendências de preenchimento</h2>
            ${pendingSummaryHtml}
          </section>

          <section class="section">
            <h2>11. Anexo detalhado</h2>
            <div class="muted">Listagem completa das perguntas para rastreabilidade da avaliação.</div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Módulo</th>
                  <th>Submódulo</th>
                  <th>Camada</th>
                  <th>Categoria</th>
                  <th>Norma</th>
                  <th>Criticidade</th>
                  <th>Resposta</th>
                  <th>Pergunta</th>
                </tr>
              </thead>
              <tbody>${responsesRows}</tbody>
            </table>
          </section>
        </div>
      </body>
    </html>
  `;

  const win = window.open("", "_blank", "width=1500,height=950");
  if (!win) {
    alert("Não foi possível abrir a janela do relatório completo. Verifique se o navegador bloqueou pop-ups.");
    return;
  }

  win.document.open();
  win.document.write(reportHtml);
  win.document.close();
  win.focus();
}

/* ---------- App screens ---------- */

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
  ensureBasicReportButton();
  ensureCompleteReportButton();

  if (state.ui.lastModule && getAllModules().includes(state.ui.lastModule)) {
    openModule(state.ui.lastModule);
  } else {
    showEmptyRight();
  }
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
  ensureBasicReportButton();
  ensureCompleteReportButton();
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
        <div class="module-title">${m}</div>
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

/* ---------- Answers ---------- */

function ensureAnswerRecord(id) {
  if (!state.answersById[id] || typeof state.answersById[id] !== "object") {
    state.answersById[id] = {
      value: null,
      updatedAt: null
    };
  }
  return state.answersById[id];
}

function getAnswerValue(id) {
  return state.answersById[id]?.value || null;
}

function setAnswer(id, value) {
  const current = ensureAnswerRecord(id);
  current.value = value;
  current.updatedAt = new Date().toISOString();
  persist();
}

function clearModuleAnswers(moduleName) {
  const qs = getModuleQuestions(moduleName);
  for (const q of qs) {
    delete state.answersById[q.id];
  }
  persist();
}

/* ---------- Question UI ---------- */

function renderQuestionItem(q, idx, total) {
  const wrap = document.createElement("div");
  wrap.className = "q-item";

  const current = getAnswerValue(q.id);
  const categoryDescription = getCategoryDescription(q.category);

  const top = document.createElement("div");
  top.className = "q-item-top";

  const left = document.createElement("div");
  left.style.minWidth = "0";
  left.innerHTML = `
    <div class="q-item-title">${idx + 1}/${total}. ${q.text}</div>
    <div class="q-item-sub">
      <span class="pill">${q.layer} — ${layerLabel(q.layer)}</span>
      <span class="pill" title="${escapeHtml(categoryDescription || q.category)}">Categoria: ${q.category}</span>
      <span class="pill">${q.submodule || q.module}</span>
      <span class="pill ${q.norma === "RDC15/2012" ? "pill-rdc" : "pill-nrdc"}">${q.norma || "nãoRDC"}</span>
      ${q.criticality ? `<span class="pill">Criticidade sugerida: ${escapeHtml(q.criticality)}</span>` : ""}
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

  renderModuleLegendButton();
  el.moduleQuestionsList.scrollIntoView({ behavior: "instant", block: "start" });
}

/* ---------- Dashboard ---------- */

function showDashboard() {
  showDashboardView();
  el.rightTitle.textContent = "Dashboard";
  el.rightSubtitle.textContent = "Resumo da avaliação";

  const idx = computeLayerIndices(state.answersById);
  const stats = computeStats(state.answersById);
  const riskPriority = computeRiskPriorityMatrix(state.answersById);
  const partial = computePartialIndex(state.answersById);

  el.kpiGlobal.textContent = `${partial.simQuestions}/${partial.totalQuestions} (${partial.simPct}%)`;
  el.kpiPartialCount.textContent = `${partial.partialQuestions}/${partial.totalQuestions} (${partial.partialPct}%)`;
  el.kpiNaoCount.textContent = `${partial.naoQuestions}/${partial.totalQuestions} (${partial.naoPct}%)`;
  el.kpiC.textContent = `${idx.C}%`;
  el.kpiP.textContent = `${idx.P}%`;
  el.kpiI.textContent = `${idx.I}%`;

  el.priorityTableBody.innerHTML = `
    <tr><td><b>P1 — AÇÃO IMEDIATA</b></td><td class="mono">${riskPriority.P1.length}</td><td>Falha grave + alto risco regulatório/assistencial</td></tr>
    <tr><td><b>P2 — CURTO PRAZO</b></td><td class="mono">${riskPriority.P2.length}</td><td>Risco relevante com necessidade de correção prioritária</td></tr>
    <tr><td><b>P3 — AÇÃO PLANEJADA</b></td><td class="mono">${riskPriority.P3.length}</td><td>Ajustes importantes com menor urgência imediata</td></tr>
    <tr><td><b>P4 — MONITORAMENTO</b></td><td class="mono">${riskPriority.P4.length}</td><td>Itens sob controle e manutenção de rotina</td></tr>
  `;

  const modules = getAllModules();
  el.modulesScoreBody.innerHTML = "";
  for (const m of modules) {
    const ms = computeModuleScore(m, state.answersById);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m}</td>
      <td class="mono">${ms.sim}</td>
      <td class="mono">${ms.parcial}</td>
      <td class="mono">${ms.nao}</td>
      <td class="mono">${ms.answered}/${ms.total}</td>
      <td class="mono"><b>${ms.pct}%</b></td>
    `;
    el.modulesScoreBody.appendChild(tr);
  }

  renderOnlineSyncStatus();

  ensureBasicReportButton();
  ensureCompleteReportButton();
}

/* ---------- Online sync ---------- */

function getOnlinePayload() {
  return {
    institution: state.institution,
    questions: getQuestions(),
    answersById: state.answersById
  };
}

function renderOnlineSyncStatus(customText, tone = "muted") {
  if (!el.onlineSyncStatus) return;

  if (!ONLINE_FEATURES_ENABLED) {
    const partial = computePartialIndex(state.answersById);
    const pm = computePriorityMatrix(state.answersById);
    const stats = computeStats(state.answersById);
    const simCountLabel = pm.P3.length === 1 ? "1 pergunta sim" : `${pm.P3.length} perguntas sim`;
    const partialCountLabel = pm.P2.length === 1 ? "1 pergunta parcial" : `${pm.P2.length} perguntas parciais`;
    const naoCountLabel = pm.P1.length === 1 ? "1 pergunta não" : `${pm.P1.length} perguntas não`;
    el.onlineSyncStatus.textContent = `Fluxo atual: preenchimento local com geração de relatório no navegador. Índice sim: ${partial.simQuestions}/${partial.totalQuestions} (${partial.simPct}%). Índice parcial: ${partial.partialQuestions}/${partial.totalQuestions} (${partial.partialPct}%). Índice não: ${partial.naoQuestions}/${partial.totalQuestions} (${partial.naoPct}%). Cobertura atual: ${stats.answered}/${stats.total} respondidas.`;
    el.onlineSyncStatus.style.color = "";
    return;
  }

  if (customText) {
    el.onlineSyncStatus.textContent = customText;
  } else if (state.ui.lastOnlineAssessmentId) {
    const dateText = state.ui.lastOnlineSavedAt
      ? new Date(state.ui.lastOnlineSavedAt).toLocaleString("pt-BR")
      : "data indisponível";

    el.onlineSyncStatus.textContent = `Online: sincronizado. ID ${state.ui.lastOnlineAssessmentId} em ${dateText}.`;
  } else {
    el.onlineSyncStatus.textContent = "Online: não sincronizado.";
  }

  if (tone === "ok") {
    el.onlineSyncStatus.style.color = "#14532d";
  } else if (tone === "warn") {
    el.onlineSyncStatus.style.color = "#92400e";
  } else if (tone === "bad") {
    el.onlineSyncStatus.style.color = "#7f1d1d";
  } else {
    el.onlineSyncStatus.style.color = "";
  }
}

async function saveAssessmentOnline() {
  if (!ONLINE_FEATURES_ENABLED) {
    alert("Funcionalidade online desabilitada nesta configuracao do app.");
    return;
  }

  if (!state.institution) {
    alert("Preencha primeiro os dados da instituição para sincronizar online.");
    return;
  }

  renderOnlineSyncStatus("Online: sincronizando avaliação...", "warn");

  try {
    const response = await fetch(`${ONLINE_API_BASE}/assessments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getOnlinePayload())
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.error || `Falha HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const saved = await response.json();
    state.ui.lastOnlineAssessmentId = saved.id || null;
    state.ui.lastOnlineSavedAt = saved.createdAt || new Date().toISOString();
    persist();
    renderOnlineSyncStatus(null, "ok");
    alert("Avaliação salva online com sucesso.");
  } catch (error) {
    renderOnlineSyncStatus(`Online: falha na sincronização (${error.message}).`, "bad");
    alert(`Não foi possível salvar online. Detalhe: ${error.message}`);
  }
}

function normalizeOnlineAnswers(rawAnswersById) {
  const normalized = {};

  if (!rawAnswersById || typeof rawAnswersById !== "object") {
    return normalized;
  }

  for (const id of Object.keys(rawAnswersById)) {
    const current = rawAnswersById[id] || {};
    normalized[String(id)] = {
      value: ["sim", "parcial", "nao"].includes(current.value) ? current.value : null,
      updatedAt: current.updatedAt || null
    };
  }

  return normalized;
}

async function loadLatestAssessmentOnline() {
  if (!ONLINE_FEATURES_ENABLED) {
    alert("Funcionalidade online desabilitada nesta configuracao do app.");
    return;
  }

  renderOnlineSyncStatus("Online: buscando última avaliação...", "warn");

  try {
    const listResponse = await fetch(`${ONLINE_API_BASE}/assessments`);
    if (!listResponse.ok) {
      throw new Error(`Falha HTTP ${listResponse.status}`);
    }

    const listPayload = await listResponse.json();
    const items = Array.isArray(listPayload.items) ? listPayload.items : [];

    if (!items.length) {
      renderOnlineSyncStatus("Online: nenhuma avaliação encontrada para carregar.", "warn");
      alert("Nenhuma avaliação online encontrada.");
      return;
    }

    const latest = [...items].sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return tb - ta;
    })[0];

    const detailResponse = await fetch(`${ONLINE_API_BASE}/assessments/${latest.id}`);
    if (!detailResponse.ok) {
      throw new Error(`Falha HTTP ${detailResponse.status}`);
    }

    const loaded = await detailResponse.json();

    state.institution = loaded.institution || null;
    state.answersById = normalizeOnlineAnswers(loaded.answersById);
    state.ui.lastOnlineAssessmentId = loaded.id || latest.id || null;
    state.ui.lastOnlineSavedAt = loaded.createdAt || latest.createdAt || new Date().toISOString();

    removeAnswersForDeletedQuestions();
    renderAllAfterQuestionsChange(state.ui.lastModule);
    showDashboard();
    persist();

    renderOnlineSyncStatus("Online: avaliação carregada com sucesso.", "ok");
    alert("Última avaliação online carregada com sucesso.");
  } catch (error) {
    renderOnlineSyncStatus(`Online: falha ao carregar (${error.message}).`, "bad");
    alert(`Não foi possível carregar a avaliação online. Detalhe: ${error.message}`);
  }
}

/* ---------- Export TXT ---------- */

function exportTxt() {
  const inst = state.institution || {};
  const idx = computeLayerIndices(state.answersById);
  const stats = computeStats(state.answersById);
  const riskPriority = computeRiskPriorityMatrix(state.answersById);

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
  lines.push("MATRIZ DE PRIORIDADE (RISCO E AÇÃO)");
  lines.push("-".repeat(80));
  lines.push(`P1 (Ação imediata): ${riskPriority.P1.length}`);
  lines.push(`P2 (Curto prazo): ${riskPriority.P2.length}`);
  lines.push(`P3 (Ação planejada): ${riskPriority.P3.length}`);
  lines.push(`P4 (Monitoramento): ${riskPriority.P4.length}`);
  lines.push("");

  lines.push("RESPOSTAS (DETALHADAS)");
  lines.push("-".repeat(80));

  for (const q of getQuestions()) {
    const answer = state.answersById[q.id] || {};
    const responseValue = answer.value || null;

    lines.push("");
    lines.push(`Pergunta ${q.id}: ${q.text}`);
    lines.push(`Módulo: ${q.module} | Submódulo: ${q.submodule || ""} | Camada: ${q.layer} (${layerLabel(q.layer)}) | Categoria: ${q.category} (${getCategoryDescription(q.category) || "—"}) | Norma: ${q.norma || "nãoRDC"} | Criticidade sugerida: ${q.criticality || "—"}`);
    lines.push(`Resposta: ${formatAnswerPT(responseValue)}`);
  }

  lines.push("");
  lines.push("=".repeat(80));

  const content = lines.join("\n");
  const filename = `CME_Checklist_${sanitizeFileName(inst.name)}_${new Date().toISOString().slice(0,10)}.txt`;

  const a = document.createElement("a");
  a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  a.setAttribute("download", filename);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ---------- Print questions ---------- */

function printQuestionsList() {
  const qs = getQuestions();
  const rows = qs.map(q => `
    <tr>
      <td>${q.id}</td>
      <td>${escapeHtml(q.text)}</td>
      <td>${escapeHtml(q.module)}</td>
      <td>${escapeHtml(q.submodule || "")}</td>
      <td>${escapeHtml(q.layer)} - ${escapeHtml(layerLabel(q.layer))}</td>
      <td>${escapeHtml(q.category)} - ${escapeHtml(getCategoryDescription(q.category) || "")}</td>
      <td>${escapeHtml(String(q.weight))}</td>
      <td>${escapeHtml(q.norma || "nãoRDC")}</td>
      <td>${escapeHtml(q.criticality || "—")}</td>
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
              <th>Criticidade sugerida</th>
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
  setTimeout(() => {
    win.print();
  }, 300);
}

/* ---------- Questions manager ---------- */

function openQuestionsManager() {
  populateManagerFilters();
  populateQuestionFormModuleOptions();
  resetQuestionForm();
  renderQuestionsManagerList();
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
    categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)} — ${escapeHtml(getCategoryDescription(c) || "")}</option>`).join("");

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
    item.innerHTML = `
      <div class="admin-item-title">#${q.id} — ${escapeHtml(q.text)}</div>
      <div class="admin-item-meta">
        <span class="pill">${escapeHtml(q.module)}</span>
        <span class="pill">${escapeHtml(q.submodule || "")}</span>
        <span class="pill">${escapeHtml(q.layer)} — ${escapeHtml(layerLabel(q.layer))}</span>
        <span class="pill">Categoria: ${escapeHtml(q.category)} — ${escapeHtml(getCategoryDescription(q.category) || "")}</span>
        <span class="pill">Peso: ${escapeHtml(String(q.weight))}</span>
        <span class="pill ${q.norma === "RDC15/2012" ? "pill-rdc" : "pill-nrdc"}">${escapeHtml(q.norma || "nãoRDC")}</span>
        <span class="pill">Criticidade: ${escapeHtml(q.criticality || "—")}</span>
      </div>
      <div class="admin-item-actions">
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
    if (idx >= 0) {
      payload.guidance = activeQuestions[idx].guidance || payload.guidance;
      payload.criticality = activeQuestions[idx].criticality || payload.criticality;
      activeQuestions[idx] = payload;
    }
  } else {
    activeQuestions.push(payload);
  }

  persistQuestions();
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
  if (preferredModule && getAllModules().includes(preferredModule)) {
    state.ui.lastModule = preferredModule;
  } else if (state.ui.lastModule && !getAllModules().includes(state.ui.lastModule)) {
    state.ui.lastModule = null;
  }

  persist();
  renderModules();
  renderLeftKPIs();

  if (!el.viewDashboard.classList.contains("hidden")) {
    showDashboard();
  } else if (state.ui.lastModule && getAllModules().includes(state.ui.lastModule)) {
    openModule(state.ui.lastModule);
  } else {
    showEmptyRight();
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
    state.institution = null;
    state.answersById = {};
    state.ui = {
      lastModule: null,
      managerFilters: { module: "", layer: "", category: "" },
      lastOnlineAssessmentId: null,
      lastOnlineSavedAt: null
    };
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

  if (el.btnSaveOnline) {
    el.btnSaveOnline.addEventListener("click", () => {
      saveAssessmentOnline();
    });
  }

  if (el.btnLoadOnline) {
    el.btnLoadOnline.addEventListener("click", () => {
      loadLatestAssessmentOnline();
    });
  }

  el.btnResetAll.addEventListener("click", () => {
    if (!confirm("Nova avaliação: apagar dados e respostas deste navegador?")) return;
    localStorage.removeItem(STORAGE_KEYS.institution);
    localStorage.removeItem(STORAGE_KEYS.answers);
    localStorage.removeItem(STORAGE_KEYS.ui);
    location.reload();
  });

  if (el.btnPrintQuestions) {
    el.btnPrintQuestions.addEventListener("click", printQuestionsList);
  }

  if (el.btnManageQuestions) {
    el.btnManageQuestions.addEventListener("click", openQuestionsManager);
  }

  if (el.btnCloseQuestionsManager) {
    el.btnCloseQuestionsManager.addEventListener("click", closeQuestionsManager);
  }

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
    });
  }

  if (el.btnNewQuestion) {
    el.btnNewQuestion.addEventListener("click", () => {
      resetQuestionForm(true);
      el.questionText.focus();
    });
  }

  if (el.btnCancelQuestionEdit) {
    el.btnCancelQuestionEdit.addEventListener("click", () => {
      resetQuestionForm(true);
    });
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
    if (e.key === "Escape") {
      if (el.questionsManagerModal && !el.questionsManagerModal.classList.contains("hidden")) {
        closeQuestionsManager();
      }
      const legendModal = document.getElementById("legendModal");
      if (legendModal && !legendModal.classList.contains("hidden")) {
        closeLegendModal();
      }
    }
  });
}

/* ---------- Init ---------- */

function setupOnlineControls() {
  if (el.btnSaveOnline) {
    el.btnSaveOnline.disabled = !ONLINE_FEATURES_ENABLED;
    el.btnSaveOnline.hidden = !ONLINE_FEATURES_ENABLED;
    el.btnSaveOnline.title = ONLINE_FEATURES_ENABLED ? "" : "Sincronização online desativada nesta fase do produto.";
  }

  if (el.btnLoadOnline) {
    el.btnLoadOnline.disabled = !ONLINE_FEATURES_ENABLED;
    el.btnLoadOnline.hidden = !ONLINE_FEATURES_ENABLED;
    el.btnLoadOnline.title = ONLINE_FEATURES_ENABLED ? "" : "Sincronização online desativada nesta fase do produto.";
  }

  renderOnlineSyncStatus();
}

function init() {
  removeAnswersForDeletedQuestions();
  ensureLegendModal();
  wire();
  setupOnlineControls();
  if (state.institution) showApp();
  else showSetup(true);
}

document.addEventListener("DOMContentLoaded", init);