// recommendations.js
// Exemplo de recomendações para perguntas essenciais. Expanda este arquivo conforme necessidade!

const recommendations = {
  1: {
    nao: {
      achado: "Não existe protocolo formal para recepção de materiais contaminados.",
      impacto: "Falha compromete o controle de infecção e rastreabilidade.",
      base: "RDC 15/2012, Art. X, §Y",
      melhoria: "Implantar protocolo formalizado, treinar equipe e monitorar adesão.",
      acoes: "Elaborar POP, aprovar na CCIH, divulgar, auditar execução.",
      prioridade: "Alta",
      prazo: "Imediato",
      evidencia: "POP de recepção aprovado e registrado."
    },
    parcial: {
      achado: "Protocolo existe, mas está desatualizado ou não está incorporado por todos.",
      impacto: "Risco de falhas no controle institucional.",
      base: "RDC 15/2012, Art. X, §Y",
      melhoria: "Atualizar e difundir protocolo para toda a equipe.",
      acoes: "Atualizar POP, reforçar capacitação, monitorar adesão.",
      prioridade: "Alta",
      prazo: "Até 30 dias",
      evidencia: "POP revisado e assentado, registro de treinamento."
    }
  },
  // Exemplo: adicione outros IDs conforme necessidade.
};

function getRecommendation(questionId, resposta) {
  return recommendations[questionId]?.[resposta] || null;
}

if (typeof window !== 'undefined') {
  window.recommendations = recommendations;
  window.getRecommendation = getRecommendation;
}
