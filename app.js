/* NS CheckList Situacional CME — MVP Offline
   Versão atualizada
*/

if (!window.__CME_APP_BOOTSTRAPPED__) {
  window.__CME_APP_BOOTSTRAPPED__ = true;

  window.STORAGE_KEYS = window.STORAGE_KEYS || {
    institution: "cme_mvp_institution_v3",
    answers: "cme_mvp_answers_v6",
    ui: "cme_mvp_ui_v4",
    customQuestions: "cme_mvp_custom_questions_v1"
  };

  if (typeof window.questions === "undefined" || !Array.isArray(window.questions) || window.questions.length === 0) {
    console.error("[CME] Erro crítico: questions.js não carregou corretamente.");
    document.body.innerHTML = '<div style="font-family:sans-serif;padding:2rem;color:#7c2d12;background:#fee2e2;border-radius:8px;margin:2rem">' +
      '<strong>Erro ao carregar as perguntas.</strong><br>' +
      'Verifique o carregamento de <code>questions.js</code>.' +
      '</div>';
    throw new Error("[CME] questions is not defined or empty.");
  }

  document.addEventListener("DOMContentLoaded", function initMinimal() {
    // fallback mínimo para não quebrar fluxo no setup
  });
}
