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

function normalizeQuestion(q) {
  return Object.assign({
    id: q.id || 0,
    text: q.text || q.pergunta || "",
    module: q.module || q.modulo || "Geral",
    category: q.category || q.categoria || "",
    weight: q.weight || q.peso || 1,
    criticality: q.criticality || q.criticidade || "normal",
    guidance: q.guidance || {}
  }, q);
}

function safeJSONParse(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ---------- Questions source ---------- */

if (typeof window.questions === "undefined" || !Array.isArray(window.questions) || window.questions.length === 0) {
  console.error("[CME] Aviso: questions.js não carregou. Verifique se o app está sendo servido via HTTP (ex: python -m http.server 8000).");
  var errEl = document.getElementById("cmeLoadError");
  if (!errEl) {
    errEl = document.createElement("div");
    errEl.id = "cmeLoadError";
    errEl.style.cssText = "font-family:sans-serif;padding:1rem 1.2rem;color:#7c2d12;background:#fee2e2;border-radius:8px;margin:1rem 0;border:1px solid #fecaca;font-size:13px;line-height:1.5";
    errEl.innerHTML =
      '<strong>⚠ Atenção:</strong> Não foi possível carregar as perguntas do diagnóstico.<br>' +
      'Para uso local, execute via servidor HTTP:<br>' +
      '<code style="background:#fecaca;padding:2px 6px;border-radius:4px">python -m http.server 8000</code> e acesse ' +
      '<a href="http://localhost:8000" style="color:#7c2d12">http://localhost:8000</a>.';
    var setupCard = document.getElementById("screenSetup");
    if (setupCard) setupCard.insertAdjacentElement("afterend", errEl);
    else document.body.insertBefore(errEl, document.body.firstChild);
  }
  window.questions = window.questions || [];
}

const baseQuestions = cloneDeep(window.questions);
let activeQuestions = loadQuestions();

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

document.addEventListener("DOMContentLoaded", function init() {
  var form = document.getElementById("formInstitution");
  var screenSetup = document.getElementById("screenSetup");
  var screenApp = document.getElementById("screenApp");
  var btnClear = document.getElementById("btnSetupClear");

  if (btnClear) {
    btnClear.addEventListener("click", function () {
      if (form) form.reset();
    });
  }

  if (form && screenSetup && screenApp) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var institution = {
        name: document.getElementById("institutionName").value.trim(),
        city: document.getElementById("city").value.trim(),
        state: document.getElementById("state").value,
        type: document.getElementById("institutionType").value,
        surgicalRooms: document.getElementById("surgicalRooms").value,
        autoclaves: document.getElementById("autoclaves").value,
        responsibleName: document.getElementById("responsibleName").value.trim(),
        position: document.getElementById("position").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        date: new Date().toISOString()
      };

      try {
        localStorage.setItem(window.STORAGE_KEYS.institution, JSON.stringify(institution));
      } catch (_) {}

      screenSetup.classList.add("hidden");
      screenApp.classList.remove("hidden");
      renderApp(institution);
    });
  }
});

function renderApp(institution) {
  var screenApp = document.getElementById("screenApp");
  if (!screenApp) return;

  var questions = getQuestions();
  var answers = loadAnswers();

  screenApp.innerHTML =
    '<div class="card" style="width:100%">' +
      '<div class="card-h">' +
        '<div>' +
          '<h2>Diagnóstico — ' + escHtml(institution.name) + '</h2>' +
          '<div class="muted" style="font-size:12px;margin-top:4px">' +
            escHtml(institution.city) + ' / ' + escHtml(institution.state) + ' · ' + escHtml(institution.type) +
          '</div>' +
        '</div>' +
        '<button id="btnBack" class="btn btn-ghost btn-sm" type="button">← Voltar</button>' +
      '</div>' +
      '<div class="card-b">' +
        renderQuestionsHtml(questions, answers) +
        '<div class="btn-row" style="margin-top:16px">' +
          '<button id="btnFinish" class="btn btn-primary" type="button">Finalizar Diagnóstico</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.getElementById("btnBack").addEventListener("click", function () {
    document.getElementById("screenSetup").classList.remove("hidden");
    screenApp.classList.add("hidden");
    screenApp.innerHTML = "";
  });

  document.getElementById("btnFinish").addEventListener("click", function () {
    var ans = collectAnswers();
    persistAnswers(ans);
    showResults(institution, ans);
  });

  screenApp.querySelectorAll(".ans").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var qid = btn.dataset.qid;
      var val = btn.dataset.val;
      screenApp.querySelectorAll('.ans[data-qid="' + qid + '"]').forEach(function (b) {
        b.classList.remove("sel-sim", "sel-parcial", "sel-nao");
      });
      btn.classList.add(val === "sim" ? "sel-sim" : val === "parcial" ? "sel-parcial" : "sel-nao");
    });
  });

  restoreAnswers(answers);
}

function escHtml(str) {
  return String(str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function renderQuestionsHtml(questions, savedAnswers) {
  if (!questions || questions.length === 0) {
    return '<div class="empty-box">Nenhuma pergunta disponível. Verifique se questions.js está carregado corretamente.</div>';
  }
  var html = '<div class="q-list">';
  questions.forEach(function (q) {
    var id = q.id;
    var saved = savedAnswers[id] || "";
    html +=
      '<div class="q-item">' +
        '<div class="q-item-top">' +
          '<div class="q-item-title">' + escHtml(q.text || q.pergunta || "") + '</div>' +
          '<div class="q-item-sub">' +
            '<span class="badge badge-ok" style="font-size:11px">' + escHtml(q.module || q.modulo || "") + '</span>' +
            (q.category || q.categoria ? '<span class="muted">' + escHtml(q.category || q.categoria) + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="answers">' +
          '<button class="ans' + (saved === "sim" ? " sel-sim" : "") + '" data-qid="' + id + '" data-val="sim" type="button">Sim</button>' +
          '<button class="ans' + (saved === "parcial" ? " sel-parcial" : "") + '" data-qid="' + id + '" data-val="parcial" type="button">Parcial</button>' +
          '<button class="ans' + (saved === "nao" ? " sel-nao" : "") + '" data-qid="' + id + '" data-val="nao" type="button">Não</button>' +
        '</div>' +
      '</div>';
  });
  html += '</div>';
  return html;
}

function loadAnswers() {
  return safeJSONParse(localStorage.getItem(window.STORAGE_KEYS.answers), {});
}

function collectAnswers() {
  var ans = {};
  document.querySelectorAll(".ans.sel-sim,.ans.sel-parcial,.ans.sel-nao").forEach(function (btn) {
    ans[btn.dataset.qid] = btn.dataset.val;
  });
  return ans;
}

function persistAnswers(ans) {
  try {
    localStorage.setItem(window.STORAGE_KEYS.answers, JSON.stringify(ans));
  } catch (_) {}
}

function restoreAnswers(savedAnswers) {
  Object.keys(savedAnswers).forEach(function (qid) {
    var val = savedAnswers[qid];
    var btn = document.querySelector('.ans[data-qid="' + qid + '"][data-val="' + val + '"]');
    if (btn) {
      document.querySelectorAll('.ans[data-qid="' + qid + '"]').forEach(function (b) {
        b.classList.remove("sel-sim", "sel-parcial", "sel-nao");
      });
      btn.classList.add(val === "sim" ? "sel-sim" : val === "parcial" ? "sel-parcial" : "sel-nao");
    }
  });
}

function showResults(institution, answers) {
  var questions = getQuestions();
  var total = questions.length;
  var totalWeight = 0;
  var earnedWeight = 0;

  questions.forEach(function (q) {
    var w = Number(q.weight || q.peso || 1);
    totalWeight += w;
    var ans = answers[q.id] || "nao";
    if (ans === "sim") earnedWeight += w;
    else if (ans === "parcial") earnedWeight += w * 0.5;
  });

  var pct = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  var level = pct >= 85 ? "Conforme" : pct >= 60 ? "Alerta" : "Crítico";
  var badgeCls = pct >= 85 ? "badge-ok" : pct >= 60 ? "badge-warn" : "badge-bad";

  var screenApp = document.getElementById("screenApp");
  screenApp.innerHTML =
    '<div class="card" style="width:100%">' +
      '<div class="card-h"><h2>Resultado do Diagnóstico</h2></div>' +
      '<div class="card-b">' +
        '<div class="kpis" style="margin-bottom:16px">' +
          '<div class="kpi"><div class="label">Instituição</div><div class="value" style="font-size:16px">' + escHtml(institution.name) + '</div></div>' +
          '<div class="kpi"><div class="label">Score Global</div><div class="value">' + pct + '%</div><div class="subvalue"><span class="badge ' + badgeCls + '">' + level + '</span></div></div>' +
          '<div class="kpi"><div class="label">Perguntas respondidas</div><div class="value">' + Object.keys(answers).length + ' / ' + total + '</div></div>' +
        '</div>' +
        '<div class="btn-row">' +
          '<button id="btnRestart" class="btn btn-primary" type="button">Novo Diagnóstico</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.getElementById("btnRestart").addEventListener("click", function () {
    try { localStorage.removeItem(window.STORAGE_KEYS.answers); } catch (_) {}
    screenApp.innerHTML = "";
    screenApp.classList.add("hidden");
    document.getElementById("screenSetup").classList.remove("hidden");
  });
}
