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

/* ---------- Storage keys (window assignment avoids SyntaxError on double-load) ---------- */
window.STORAGE_KEYS = window.STORAGE_KEYS || {
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

if (typeof window.questions === "undefined" || !Array.isArray(window.questions) || window.questions.length === 0) {
  console.error("[CME] Erro crítico: questions.js não carregou corretamente. Execute o app via servidor HTTP local (ex: python -m http.server 8000).");
  document.body.innerHTML = '<div style="font-family:sans-serif;padding:2rem;color:#7c2d12;background:#fee2e2;border-radius:8px;margin:2rem">' +
    '<strong>Erro ao carregar as perguntas.</strong><br>' +
    'Execute o aplicativo via servidor HTTP local, não pelo protocolo <code>file://</code>.<br>' +
    '<code>python -m http.server 8000</code> e acesse <a href="http://localhost:8000">http://localhost:8000</a>.' +
    '</div>';
  throw new Error("[CME] questions is not defined or empty. Serve via HTTP.");
}

const baseQuestions = cloneDeep(window.questions);
let activeQuestions = loadQuestions();

function normalizeQuestion(q) {
  return Object.assign({ weight: 1, module: "Geral", category: "", criticality: "" }, q);
}

function loadQuestions() {
  const saved = safeJSONParse(localStorage.getItem(window.STORAGE_KEYS.customQuestions), null);
  if (Array.isArray(saved) && saved.length > 0) {
    return saved.map(normalizeQuestion);
  }
  return cloneDeep(baseQuestions).map(normalizeQuestion);
}

function persistQuestions() {
  localStorage.setItem(window.STORAGE_KEYS.customQuestions, JSON.stringify(activeQuestions));
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

/* ---------- Scoring helpers ---------- */

function calcScore(answers) {
  const qs = getQuestions();
  let total = 0, earned = 0;
  qs.forEach(function (q) {
    const w = q.weight || 1;
    total += w;
    const a = answers[q.id];
    if (a === "sim") earned += w;
    else if (a === "parcial") earned += w * 0.5;
  });
  return total > 0 ? Math.round((earned / total) * 100) : 0;
}

function calcModuleScore(mod, answers) {
  const qs = getQuestions().filter(function (q) { return q.module === mod; });
  let total = 0, earned = 0, answered = 0;
  qs.forEach(function (q) {
    const w = q.weight || 1;
    const a = answers[q.id];
    if (a) {
      answered++;
      total += w;
      if (a === "sim") earned += w;
      else if (a === "parcial") earned += w * 0.5;
    }
  });
  return { pct: total > 0 ? Math.round((earned / total) * 100) : null, answered: answered, total: qs.length };
}

function scoreBadgeClass(pct) {
  if (pct === null) return "badge-warn";
  if (pct >= 85) return "badge-ok";
  if (pct >= 60) return "badge-warn";
  return "badge-bad";
}

function scoreLabel(pct) {
  if (pct === null) return "—";
  if (pct >= 85) return "Conforme";
  if (pct >= 60) return "Alerta";
  return "Crítico";
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------- Persist answers ---------- */

function loadAnswers() {
  return safeJSONParse(localStorage.getItem(window.STORAGE_KEYS.answers), {});
}

function saveAnswers(answers) {
  localStorage.setItem(window.STORAGE_KEYS.answers, JSON.stringify(answers));
}

/* ---------- Persist institution ---------- */

function loadInstitution() {
  return safeJSONParse(localStorage.getItem(window.STORAGE_KEYS.institution), null);
}

function saveInstitution(data) {
  localStorage.setItem(window.STORAGE_KEYS.institution, JSON.stringify(data));
}

/* ---------- Render ---------- */

function renderModuleList(container, answers, activeModule) {
  const modules = getAllModules();
  let html = '<div class="list">';
  modules.forEach(function (mod) {
    const s = calcModuleScore(mod, answers);
    const pct = s.pct;
    const active = mod === activeModule ? "border-color:#c7d2fe;box-shadow:0 6px 16px rgba(0,0,0,.05);" : "";
    html += '<div class="module-card" style="' + active + '" data-module="' + esc(mod) + '">' +
      '<div style="flex:1;min-width:0">' +
        '<div class="module-title">' + esc(mod) + '</div>' +
        '<div class="module-meta">' + s.answered + ' / ' + s.total + ' respondidas</div>' +
        '<div class="meter"><div style="width:' + (pct !== null ? pct : 0) + '%"></div></div>' +
      '</div>' +
      '<span class="badge ' + scoreBadgeClass(pct) + '">' + (pct !== null ? pct + "%" : "—") + '</span>' +
    '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
  container.querySelectorAll(".module-card").forEach(function (card) {
    card.addEventListener("click", function () {
      window._cmeActiveModule = card.dataset.module;
      rebuildApp();
    });
  });
}

function renderKpis(container, answers, institution) {
  const pct = calcScore(answers);
  const qs = getQuestions();
  const total = qs.length;
  const answered = qs.filter(function (q) { return answers[q.id]; }).length;
  const inst = institution ? esc(institution.institutionName || "—") : "—";
  container.innerHTML =
    '<div class="kpis">' +
      '<div class="kpi">' +
        '<div class="label">Instituição</div>' +
        '<div class="value" style="font-size:14px;line-height:1.3">' + inst + '</div>' +
      '</div>' +
      '<div class="kpi">' +
        '<div class="label">Progresso</div>' +
        '<div class="value">' + answered + '<span style="font-size:14px;font-weight:600">/' + total + '</span></div>' +
        '<div class="subvalue">' + Math.round((answered / total) * 100) + '% preenchido</div>' +
      '</div>' +
      '<div class="kpi">' +
        '<div class="label">Score Geral</div>' +
        '<div class="value">' + (answered > 0 ? pct + "%" : "—") + '</div>' +
        '<div class="subvalue">' + (answered > 0 ? scoreLabel(pct) : "Responda perguntas") + '</div>' +
      '</div>' +
    '</div>';
}

function renderQuestions(container, mod, answers) {
  const qs = getQuestions().filter(function (q) { return q.module === mod; });
  if (qs.length === 0) {
    container.innerHTML = '<div class="empty-box">Nenhuma pergunta neste módulo.</div>';
    return;
  }
  let html = '<div class="q-list">';
  qs.forEach(function (q) {
    const sel = answers[q.id] || "";
    html += '<div class="q-item">' +
      '<div class="q-item-top">' +
        '<div style="flex:1;min-width:0">' +
          '<div class="q-item-title">' + esc(q.text || q.question || "") + '</div>' +
          '<div class="q-item-sub">' +
            (q.module ? '<span>' + esc(q.module) + '</span>' : '') +
            (q.category ? '<span class="pill" style="font-size:11px;padding:3px 8px">' + esc(q.category) + '</span>' : '') +
            (q.criticality ? '<span style="font-size:11px;color:var(--muted)">Criticidade: ' + esc(q.criticality) + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="answers">' +
        '<button class="ans' + (sel === "sim" ? " sel-sim" : "") + '" data-qid="' + esc(q.id) + '" data-val="sim">✔ Sim</button>' +
        '<button class="ans' + (sel === "parcial" ? " sel-parcial" : "") + '" data-qid="' + esc(q.id) + '" data-val="parcial">◑ Parcial</button>' +
        '<button class="ans' + (sel === "nao" ? " sel-nao" : "") + '" data-qid="' + esc(q.id) + '" data-val="nao">✘ Não</button>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
  container.querySelectorAll(".ans").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const qid = btn.dataset.qid;
      const val = btn.dataset.val;
      const stored = loadAnswers();
      if (stored[qid] === val) {
        delete stored[qid];
      } else {
        stored[qid] = val;
      }
      saveAnswers(stored);
      rebuildApp();
    });
  });
}

/* ---------- Main app render ---------- */

function rebuildApp() {
  const screenApp = document.getElementById("screenApp");
  if (!screenApp) return;
  const answers = loadAnswers();
  const institution = loadInstitution();
  const modules = getAllModules();
  const activeModule = window._cmeActiveModule || modules[0] || "";

  screenApp.innerHTML =
    '<div>' +
      '<div id="kpiBox" style="margin-bottom:12px"></div>' +
      '<div class="card">' +
        '<div class="card-h"><h2>Módulos</h2></div>' +
        '<div class="card-b" id="moduleListBox"></div>' +
      '</div>' +
      '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">' +
        '<button id="btnRestart" class="btn btn-ghost btn-sm" type="button">⟵ Reiniciar</button>' +
        '<button id="btnExport" class="btn btn-secondary btn-sm" type="button">📄 Exportar TXT</button>' +
      '</div>' +
    '</div>' +
    '<div>' +
      '<div class="card">' +
        '<div class="card-h"><h2 id="moduleTitle">' + esc(activeModule) + '</h2></div>' +
        '<div class="card-b" id="questionBox"></div>' +
      '</div>' +
    '</div>';

  renderKpis(document.getElementById("kpiBox"), answers, institution);
  renderModuleList(document.getElementById("moduleListBox"), answers, activeModule);
  renderQuestions(document.getElementById("questionBox"), activeModule, answers);

  document.getElementById("btnRestart").addEventListener("click", function () {
    if (confirm("Reiniciar diagnóstico? Os dados do formulário serão mantidos, mas as respostas serão apagadas.")) {
      saveAnswers({});
      window._cmeActiveModule = null;
      showSetup();
    }
  });

  document.getElementById("btnExport").addEventListener("click", exportTxt);
}

/* ---------- Export ---------- */

function exportTxt() {
  const answers = loadAnswers();
  const institution = loadInstitution() || {};
  const qs = getQuestions();
  const lines = [
    "NS CheckList Situacional CME — Diagnóstico",
    "Data: " + new Date().toLocaleDateString("pt-BR"),
    "Instituição: " + (institution.institutionName || "—"),
    "Responsável: " + (institution.responsibleName || "—"),
    "Score Geral: " + calcScore(answers) + "%",
    "",
    "--- RESPOSTAS ---"
  ];
  qs.forEach(function (q) {
    const a = answers[q.id] || "Não respondida";
    lines.push("[" + esc(q.module) + "] " + (q.text || q.question || q.id) + ": " + a.toUpperCase());
  });
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "diagnostico_cme_" + new Date().toISOString().slice(0, 10) + ".txt";
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- Screen transitions ---------- */

function showSetup() {
  const setup = document.getElementById("screenSetup");
  const app = document.getElementById("screenApp");
  if (setup) setup.classList.remove("hidden");
  if (app) { app.classList.add("hidden"); app.innerHTML = ""; }
}

function showApp() {
  const setup = document.getElementById("screenSetup");
  const app = document.getElementById("screenApp");
  if (setup) setup.classList.add("hidden");
  if (app) app.classList.remove("hidden");
  rebuildApp();
}

/* ---------- Bootstrap ---------- */

document.addEventListener("DOMContentLoaded", function init() {
  /* Restore setup form from localStorage if available */
  const saved = loadInstitution();
  if (saved) {
    ["institutionName","city","state","institutionType","surgicalRooms","autoclaves",
     "responsibleName","position","email","phone"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el && saved[id] !== undefined) el.value = saved[id];
    });
  }

  /* Clear button */
  const btnClear = document.getElementById("btnSetupClear");
  if (btnClear) {
    btnClear.addEventListener("click", function () {
      document.getElementById("formInstitution").reset();
      localStorage.removeItem(window.STORAGE_KEYS.institution);
    });
  }

  /* Form submit — main entry point into the diagnosis wizard */
  const form = document.getElementById("formInstitution");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = {
        institutionName: document.getElementById("institutionName").value.trim(),
        city: document.getElementById("city").value.trim(),
        state: document.getElementById("state").value,
        institutionType: document.getElementById("institutionType").value,
        surgicalRooms: document.getElementById("surgicalRooms").value,
        autoclaves: document.getElementById("autoclaves").value,
        responsibleName: document.getElementById("responsibleName").value.trim(),
        position: document.getElementById("position").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim()
      };
      saveInstitution(data);
      window._cmeActiveModule = null;
      showApp();
    });
  }

  /* If institution data already saved and answers exist, offer to continue */
  if (saved && Object.keys(loadAnswers()).length > 0) {
    const continueBtn = document.createElement("button");
    continueBtn.className = "btn btn-success btn-sm";
    continueBtn.type = "button";
    continueBtn.textContent = "▶ Continuar diagnóstico anterior";
    continueBtn.addEventListener("click", function () {
      window._cmeActiveModule = null;
      showApp();
    });
    const btnRow = document.querySelector("#screenSetup .btn-row");
    if (btnRow) btnRow.appendChild(continueBtn);
  }
});
