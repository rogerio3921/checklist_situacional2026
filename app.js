/* NS CheckList Situacional CME — MVP Offline
   Versão Fase 1: Criticidade, Recomendações e Observação em cada pergunta
   Última atualização: 30/05/2026
*/

// ... O restante do código é igual ao app.js já existente no seu repositório, com as seguintes mudanças principais ...

// 1. MODELO DE RESPOSTA EXPANDIDO
// Altere as funções setAnswer/getAnswer para:
function setAnswer(id, value, observation = "") {
  state.answersById[id] = {
    value,
    observation: observation || (state.answersById[id]?.observation ?? ""),
    updatedAt: new Date().toISOString()
  };
  persist();
}

function getAnswerObj(id) {
  return state.answersById[id] || null;
}

// 2. MOTOR DE CRITICIDADE
function getCriticidade({ resposta, camada }) {
  if (resposta === "sim") return { nivel: "Adequada", cor: "#25a142", prioridade: "Nenhuma", prazo: "-" };
  if (resposta === "parcial" && camada === "C") return { nivel: "Alta", cor: "#fcb900", prioridade: "Alta", prazo: "30 dias" };
  if (resposta === "nao" && camada === "C") return { nivel: "Crítica", cor: "#e00202", prioridade: "Muito Alta", prazo: "Imediato" };
  if (resposta === "parcial" && camada === "P") return { nivel: "Moderada", cor: "#ffe066", prioridade: "Média", prazo: "60 dias" };
  if (resposta === "nao" && camada === "P") return { nivel: "Alta", cor: "#ff9000", prioridade: "Alta", prazo: "30 dias" };
  if (resposta === "parcial" && camada === "I") return { nivel: "Oportunidade", cor: "#65a1eb", prioridade: "Baixa", prazo: "6 meses" };
  if (resposta === "nao" && camada === "I") return { nivel: "Moderada", cor: "#ffe066", prioridade: "Média", prazo: "60 dias" };
  return { nivel: "", cor: "#bbb", prioridade: "", prazo: "" };
}

// 3. EM CADA PERGUNTA: renderize o campo de observação e a crítica/recomendação:
function renderQuestionItem(q, idx, total) {
  // ...
  // Após os botões de resposta:
  // OBSERVAÇÃO
  const obsField = document.createElement("textarea");
  obsField.className = "observation-input";
  obsField.placeholder = "Observações (opcional)";
  obsField.value = getAnswerObj(q.id)?.observation || "";
  obsField.addEventListener("change", () => {
    setAnswer(q.id, getAnswerObj(q.id)?.value || null, obsField.value);
  });
  wrap.appendChild(obsField);

  // CRITICIDADE
  const resp = getAnswerObj(q.id)?.value;
  if (resp) {
    const critic = getCriticidade({ resposta: resp, camada: q.layer });
    const critBadge = document.createElement("div");
    critBadge.className = "criticidade-badge";
    critBadge.style.background = critic.cor;
    critBadge.style.color = "#fff";
    critBadge.textContent = `Criticidade: ${critic.nivel}`;
    wrap.appendChild(critBadge);
    // RECOMENDAÇÃO
    if (['parcial','nao'].includes(resp) && typeof getRecommendation === 'function') {
      const rec = getRecommendation(q.id, resp);
      if (rec) {
        const recBox = document.createElement("div");
        recBox.className = "recommendation-box";
        recBox.innerHTML = `<b>Recomendação:</b> ${rec.achado}<br><b>Impacto:</b> ${rec.impacto}<br><b>Base:</b> ${rec.base}<br><b>Melhoria:</b> ${rec.melhoria}`;
        wrap.appendChild(recBox);
      }
    }
  }
  // ...
  return wrap;
}

// ... Demais funções do app.js permanecem conforme sua versão atual ...

// Garanta que recommendations.js é carregado antes de app.js no index.html

// No final do arquivo, mantenha o init:
document.addEventListener("DOMContentLoaded", init);
