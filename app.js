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
  // Placeholder init to keep original bootstrap behavior.
});
