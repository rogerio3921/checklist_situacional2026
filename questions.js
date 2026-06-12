/**
 * PERGUNTAS - NS CheckList Situacional CME v2
 * Completo, atualizado e compatível com a Fase 2 / Implementação 1
 * Acrescenta:
 * - criticality
 * - guidance.sim / guidance.parcial / guidance.nao
 * Mantém:
 * - ids
 * - módulos
 * - categorias
 * - pesos
 * - compatibilidade com o app
 */

function buildGuidance({ achado, impacto, base, melhoria, acoes }) {
  return {
    achado: achado || "",
    impacto: impacto || "",
    base: base || "",
    melhoria: melhoria || "",
    acoes: Array.isArray(acoes) ? acoes : []
  };
}

function guidanceByNorma(area, tema) {
  return {
    sim: buildGuidance({
      achado: `${tema} implantado e operacional no contexto de ${area}.`,
      impacto: "Favorece a segurança do processamento, a padronização das rotinas e a prontidão para monitoramento e auditoria.",
      base: "RDC15/2012 e orientações técnicas da Anvisa aplicáveis ao processamento de produtos para saúde.",
      melhoria: "Manter a prática implantada, com monitoramento periódico, revisão do processo e registro das evidências.",
      acoes: [
        "Monitorar periodicamente a conformidade da rotina.",
        "Revisar o procedimento de forma periódica.",
        "Registrar evidências da execução e do controle."
      ]
    }),
    parcial: buildGuidance({
      achado: `${tema} existente, porém com lacunas de padronização, execução ou registro em ${area}.`,
      impacto: "Reduz a confiabilidade do processo, dificulta o controle operacional e fragiliza a investigação de desvios.",
      base: "RDC15/2012 e orientações técnicas da Anvisa aplicáveis ao processamento de produtos para saúde.",
      melhoria: "Revisar e padronizar o processo, assegurando execução uniforme, capacitação da equipe e evidências documentais.",
      acoes: [
        "Revisar o fluxo atualmente adotado.",
        "Padronizar o procedimento e os registros associados.",
        "Treinar a equipe quanto à rotina definida.",
        "Auditar a aderência ao processo."
      ]
    }),
    nao: buildGuidance({
      achado: `Ausência de ${tema} estruturado em ${area}.`,
      impacto: "Compromete a segurança do processamento, fragiliza o controle da etapa e reduz a prontidão para investigação e auditoria.",
      base: "RDC15/2012 e orientações técnicas da Anvisa aplicáveis ao processamento de produtos para saúde.",
      melhoria: "Implantar o processo com definição de fluxo, responsáveis, registros, monitoramento e capacitação da equipe.",
      acoes: [
        "Definir o fluxo operacional da etapa.",
        "Formalizar procedimento e registros mínimos.",
        "Treinar a equipe envolvida.",
        "Monitorar a implantação e a aderência."
      ]
    })
  };
}

function guidanceByGoodPractice(area, tema) {
  return {
    sim: buildGuidance({
      achado: `${tema} implantado em ${area}.`,
      impacto: "Contribui para organização, previsibilidade e melhoria contínua do desempenho do setor.",
      base: "Boa prática gerencial e operacional.",
      melhoria: "Manter a prática implantada e revisar periodicamente sua efetividade.",
      acoes: [
        "Acompanhar a continuidade da prática.",
        "Revisar periodicamente sua efetividade."
      ]
    }),
    parcial: buildGuidance({
      achado: `${tema} parcialmente estruturado em ${area}.`,
      impacto: "Limita o aproveitamento gerencial das informações e reduz a capacidade de melhoria contínua.",
      base: "Boa prática gerencial e operacional.",
      melhoria: "Estruturar melhor o processo, com padronização, acompanhamento e análise periódica dos resultados.",
      acoes: [
        "Padronizar os critérios utilizados.",
        "Definir rotina de acompanhamento.",
        "Registrar e analisar resultados."
      ]
    }),
    nao: buildGuidance({
      achado: `Ausência de ${tema} estruturado em ${area}.`,
      impacto: "Reduz a capacidade de gestão, previsibilidade e tomada de decisão sobre o desempenho do setor.",
      base: "Boa prática gerencial e operacional.",
      melhoria: "Implantar o acompanhamento do processo para apoiar gestão, organização e melhoria operacional.",
      acoes: [
        "Definir escopo e objetivo do acompanhamento.",
        "Estabelecer campos ou indicadores mínimos.",
        "Capacitar responsáveis pelo registro e análise."
      ]
    })
  };
}

function rastreabilidadeGuidance() {
  return {
    sim: buildGuidance({
      achado: "A rastreabilidade do processamento está implantada e operacional.",
      impacto: "Favorece a investigação de falhas, a recuperação de histórico e a prontidão para auditorias.",
      base: "RDC 15/2012 exige rastreabilidade do processamento e sistema de informação manual ou automatizado.",
      melhoria: "Manter a padronização e revisar periodicamente a qualidade dos registros.",
      acoes: [
        "Monitorar a completude dos registros.",
        "Revisar periodicamente os campos obrigatórios.",
        "Auditar a consistência das informações registradas."
      ]
    }),
    parcial: buildGuidance({
      achado: "A rastreabilidade existe, mas apresenta lacunas de registro ou inconsistência no preenchimento.",
      impacto: "Reduz a confiabilidade das informações e dificulta a análise de desvios e eventos relacionados ao processamento.",
      base: "RDC 15/2012 exige rastreabilidade do processamento e sistema de informação manual ou automatizado.",
      melhoria: "Padronizar os registros e fortalecer a consistência do preenchimento.",
      acoes: [
        "Revisar os campos atualmente utilizados.",
        "Eliminar registros incompletos ou redundantes.",
        "Capacitar a equipe para preenchimento uniforme.",
        "Monitorar periodicamente a conformidade dos registros."
      ]
    }),
    nao: buildGuidance({
      achado: "Ausência de rastreabilidade estruturada do processamento.",
      impacto: "Fragiliza a investigação de falhas, a recuperação de histórico do processamento e a prontidão para auditorias.",
      base: "RDC 15/2012 exige rastreabilidade do processamento e sistema de informação manual ou automatizado.",
      melhoria: "Padronizar o registro da carga, ciclo, data, profissional responsável e destino do material.",
      acoes: [
        "Definir campos mínimos obrigatórios de rastreabilidade.",
        "Revisar formulários físicos ou parâmetros do sistema.",
        "Treinar a equipe para preenchimento correto.",
        "Auditar periodicamente a consistência dos registros."
      ]
    })
  };
}

function enrichQuestion(q) {
  const normModules = new Set([
    "Recepção",
    "Expurgo",
    "Limpeza",
    "Preparo",
    "Embalagem",
    "Esterilização",
    "Armazenamento",
    "Distribuição",
    "Governança",
    "Estrutura",
    "RH",
    "Consignados",
    "Rastreabilidade",
    "Água"
  ]);

  const norma = normModules.has(q.module) ? "RDC15/2012" : "nãoRDC";

  let criticality = "Média";
  if (q.layer === "C") criticality = "Alta";
  if (q.category === "C6" || q.category === "C5" || q.category === "C3") criticality = "Alta";
  if (q.module === "Esterilização" || q.module === "Rastreabilidade" || q.module === "Limpeza") criticality = "Alta";
  if (q.module === "Tecnologia" || q.module === "Sustentabilidade") criticality = "Média";
  if (q.layer === "I") criticality = "Baixa";
  if (q.id === 83 || q.id === 88 || q.id === 253 || q.id === 259) criticality = "Crítica";

  let guidance;
  if (q.module === "Rastreabilidade") {
    guidance = rastreabilidadeGuidance();
  } else if (norma === "RDC15/2012") {
    guidance = guidanceByNorma(q.module, q.text.toLowerCase());
  } else {
    guidance = guidanceByGoodPractice(q.module, q.text.toLowerCase());
  }

  return {
    ...q,
    norma,
    criticality,
    guidance
  };
}

const rawQuestions = [
  { id: 1, text: "Existe protocolo formal para recepção de materiais contaminados provenientes das unidades assistenciais e centro cirúrgico?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },
  { id: 2, text: "A recepção dos materiais é realizada em área exclusiva da CME?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },
  { id: 3, text: "Existe registro formal de entrada dos materiais contendo data, horário, setor de origem e responsável?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C4", weight: 1 },
  { id: 4, text: "Os materiais são conferidos no momento da recepção quanto à quantidade e integridade?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C4", weight: 1 },
  { id: 5, text: "Existe separação adequada entre materiais contaminados e materiais limpos durante o transporte?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C3", weight: 1 },
  { id: 6, text: "O transporte interno dos materiais contaminados é realizado em carrinhos fechados e identificados?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C3", weight: 1 },
  { id: 7, text: "Existe fluxo definido para evitar cruzamento entre materiais contaminados e áreas limpas?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C3", weight: 1 },
  { id: 8, text: "Os profissionais utilizam EPIs adequados durante a recepção dos materiais?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },
  { id: 9, text: "Existe rotina padronizada para identificação de materiais danificados ou incompletos no momento da recepção?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C4", weight: 1 },
  { id: 10, text: "Existe registro formal de não conformidades identificadas na recepção?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C6", weight: 1 },
  { id: 11, text: "O setor de origem é comunicado quando são identificadas falhas ou materiais incompletos?", module: "Recepção", submodule: "Recepção", layer: "P", category: "P2", weight: 1 },
  { id: 12, text: "Existe área física adequada para triagem inicial dos materiais recebidos?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },

  { id: 16, text: "Existe área física exclusiva destinada ao expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 17, text: "O expurgo possui separação física das áreas limpas da CME?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 18, text: "O fluxo de materiais no expurgo é unidirecional?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C3", weight: 1 },
  { id: 19, text: "As superfícies do expurgo são de material lavável e resistente à desinfecção?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 20, text: "Existe sistema de ventilação ou exaustão adequado na área do expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 21, text: "As pias possuem dimensionamento adequado para limpeza de materiais?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 22, text: "Existe sistema de água pressurizada para auxiliar na limpeza dos instrumentais?", module: "Expurgo", submodule: "Expurgo", layer: "P", category: "P2", weight: 1 },
  { id: 23, text: "Os profissionais utilizam EPIs completos no expurgo (luvas grossas, avental impermeável, proteção facial)?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 24, text: "Existe rotina padronizada de limpeza manual?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 25, text: "Existe rotina padronizada de limpeza automatizada?", module: "Expurgo", submodule: "Expurgo", layer: "P", category: "P2", weight: 1 },
  { id: 27, text: "Existe descarte adequado de resíduos gerados no expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C7", weight: 1 },
  { id: 28, text: "Existe protocolo para manipulação segura de materiais perfurocortantes?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 29, text: "Existe monitoramento/testes da qualidade da limpeza realizada no expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "P", category: "P5", weight: 1 },
  { id: 30, text: "Existe treinamento periódico da equipe sobre procedimentos de limpeza?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },

  { id: 31, text: "Existe protocolo formal documentado para limpeza de produtos para saúde?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 32, text: "A limpeza segue orientações do fabricante dos instrumentais?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 33, text: "Existe padronização de detergentes utilizados no processo de limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 34, text: "Existe controle de diluição dos detergentes utilizados?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C4", weight: 1 },
  { id: 35, text: "Os detergentes possuem registro na ANVISA?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 36, text: "Existe controle de validade dos produtos de limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 37, text: "Existe registro do processo de limpeza manual?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C4", weight: 1 },
  { id: 38, text: "Existe monitoramento da eficácia da limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C2", weight: 1 },
  { id: 39, text: "São utilizados testes específicos para validação da limpeza quando aplicável?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C5", weight: 1 },
  { id: 40, text: "Existe separação de instrumentais delicados ou especiais durante a limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 41, text: "Existe rotina de inspeção visual após limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C4", weight: 1 },
  { id: 42, text: "Existe processo definido para reprocessamento quando a limpeza não é satisfatória?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C6", weight: 1 },
  { id: 43, text: "Existe uso de escovas adequadas para cada tipo de instrumental?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 44, text: "Existe controle de desgaste das escovas utilizadas?", module: "Limpeza", submodule: "Limpeza", layer: "P", category: "P2", weight: 1 },
  { id: 45, text: "Existe monitoramento da qualidade da água utilizada na limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C2", weight: 1 },

  { id: 46, text: "Existe área exclusiva para preparo e inspeção dos materiais?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 47, text: "A área de preparo está fisicamente separada da área suja?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 48, text: "Existe iluminação adequada para inspeção dos instrumentais?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 49, text: "Existe uso de lupas ou sistemas de ampliação quando necessário?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C2", weight: 1 },
  { id: 50, text: "Os instrumentais são inspecionados quanto à limpeza antes da montagem?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C4", weight: 1 },
  { id: 51, text: "Existe conferência da integridade funcional dos instrumentais?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 52, text: "Existe protocolo para retirada de instrumentais danificados?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C6", weight: 1 },
  { id: 53, text: "Existe controle de manutenção dos instrumentais cirúrgicos?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 54, text: "Existe conferência da composição das caixas cirúrgicas?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 55, text: "Existe lista padrão para montagem de cada caixa cirúrgica?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 56, text: "Existe registro de montagem das caixas cirúrgicas?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C4", weight: 1 },
  { id: 57, text: "Existe rastreabilidade da montagem realizada?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C3", weight: 1 },
  { id: 58, text: "Existe conferência dupla na montagem de caixas críticas?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 59, text: "Existe identificação das caixas após montagem?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C4", weight: 1 },
  { id: 60, text: "Existe controle de substituição de instrumentais ausentes?", module: "Preparo", submodule: "Preparo", layer: "P", category: "P2", weight: 1 },

  { id: 61, text: "Existe área exclusiva para embalagem dos materiais?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 62, text: "Os materiais de embalagem possuem registro na ANVISA?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 63, text: "Existe padronização dos tipos de embalagem utilizados?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 64, text: "Existe controle de validade das embalagens?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 65, text: "Existe verificação da integridade das embalagens antes do uso?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C4", weight: 1 },
  { id: 66, text: "Existe técnica padronizada de embalagem?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 67, text: "Existe treinamento específico da equipe para embalagem?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 68, text: "Existe identificação adequada dos pacotes após embalagem?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C4", weight: 1 },
  { id: 69, text: "Existe uso de indicadores químicos internos?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C2", weight: 1 },
  { id: 70, text: "Existe uso de indicadores químicos externos?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C2", weight: 1 },
  { id: 71, text: "Existe controle de rastreabilidade da embalagem realizada?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C3", weight: 1 },
  { id: 72, text: "Existe verificação da compatibilidade da embalagem com o método de esterilização?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 73, text: "Existe controle de peso ou volume das cargas embaladas?", module: "Embalagem", submodule: "Embalagem", layer: "P", category: "P2", weight: 1 },
  { id: 74, text: "Existe monitoramento da qualidade da selagem das embalagens?", module: "Embalagem", submodule: "Embalagem", layer: "P", category: "P5", weight: 1 },
  { id: 75, text: "Existe inspeção final antes da esterilização?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C4", weight: 1 },

  { id: 76, text: "Existe protocolo formal para esterilização de materiais?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C1", weight: 1 },
  { id: 77, text: "Os equipamentos de esterilização possuem qualificação de instalação?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C5", weight: 1 },
  { id: 78, text: "Os equipamentos possuem qualificação operacional?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C5", weight: 1 },
  { id: 79, text: "Os equipamentos possuem qualificação de desempenho?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C5", weight: 1 },
  { id: 80, text: "Existe manutenção preventiva das autoclaves?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C1", weight: 1 },
  { id: 81, text: "Existe registro de cada ciclo de esterilização?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C4", weight: 1 },
  { id: 82, text: "Existe monitoramento com indicadores químicos?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C2", weight: 1 },
  { id: 83, text: "Existe monitoramento com indicadores biológicos?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C2", weight: 1 },
  { id: 84, text: "Existe monitoramento de parâmetros físicos do ciclo?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C4", weight: 1 },
  { id: 85, text: "Existe rastreabilidade das cargas esterilizadas?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C3", weight: 1 },
  { id: 86, text: "Existe controle de carga máxima das autoclaves?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C1", weight: 1 },
  { id: 87, text: "Existe registro de liberação da carga esterilizada?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C4", weight: 1 },
  { id: 88, text: "Existe protocolo para cargas não conformes?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C6", weight: 1 },
  { id: 89, text: "Existe rotina de testes Bowie & Dick quando aplicável?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C2", weight: 1 },
  { id: 90, text: "Existe treinamento específico da equipe para operação dos equipamentos?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C1", weight: 1 },

  { id: 91, text: "Existe área exclusiva para armazenamento de materiais esterilizados?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 92, text: "Existe separação física entre área limpa e esterilizada?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 93, text: "Existe controle ambiental da área de armazenamento?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 94, text: "Existe controle de temperatura e umidade?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 95, text: "Existe controle de acesso à área de armazenamento?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 96, text: "Existe organização sistematizada das prateleiras?", module: "Armazenamento", submodule: "Armazenamento", layer: "P", category: "P2", weight: 1 },
  { id: 97, text: "Existe identificação adequada dos materiais armazenados?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C4", weight: 1 },
  { id: 98, text: "Existe controle de validade da esterilização?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C3", weight: 1 },
  { id: 99, text: "Existe inspeção periódica das embalagens armazenadas?", module: "Armazenamento", submodule: "Armazenamento", layer: "P", category: "P5", weight: 1 },
  { id: 100, text: "Existe controle de integridade das embalagens durante armazenamento?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C4", weight: 1 },

  { id: 101, text: "Existe protocolo formal para distribuição de materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 102, text: "Existe registro de saída dos materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C4", weight: 1 },
  { id: 103, text: "Existe rastreabilidade do destino dos materiais distribuídos?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C3", weight: 1 },
  { id: 104, text: "Existe controle de transporte interno de materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 105, text: "Os carrinhos de transporte são exclusivos para materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 106, text: "Existe conferência no momento da entrega dos materiais?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C4", weight: 1 },
  { id: 107, text: "Existe protocolo para devolução de materiais não utilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 108, text: "Existe registro de materiais devolvidos?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C4", weight: 1 },
  { id: 109, text: "Existe monitoramento de perdas de materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P2", weight: 1 },
  { id: 110, text: "Existe controle de tempo entre esterilização e utilização?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C3", weight: 1 },
  { id: 111, text: "Existe integração entre CME e centro cirúrgico para programação cirúrgica?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P2", weight: 1 },
  { id: 112, text: "Existe previsão de demanda de caixas cirúrgicas?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P2", weight: 1 },
  { id: 113, text: "Existe controle de disponibilidade de instrumentais críticos?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P5", weight: 1 },
  { id: 114, text: "Existe controle de kits específicos para procedimentos?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 115, text: "Existe monitoramento de atrasos na entrega de materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P5", weight: 1 },
  { id: 116, text: "Existe registro de incidentes relacionados à distribuição?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C6", weight: 1 },
  { id: 117, text: "Existe comunicação estruturada entre CME e setores assistenciais?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P2", weight: 1 },
  { id: 118, text: "Existe controle de materiais de alta rotatividade?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P5", weight: 1 },
  { id: 119, text: "Existe monitoramento da eficiência do fluxo de distribuição?", module: "Distribuição", submodule: "Distribuição", layer: "I", category: "I3", weight: 1 },
  { id: 120, text: "Existe auditoria periódica do processo de distribuição?", module: "Distribuição", submodule: "Distribuição", layer: "I", category: "I1", weight: 1 },

  { id: 121, text: "Existe responsável técnico formalmente designado para a CME?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 122, text: "O responsável técnico possui formação compatível com a função?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 123, text: "Existe documento formal de designação do responsável técnico?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 124, text: "Existe manual de normas e rotinas da CME atualizado?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 125, text: "Existem procedimentos operacionais padrão (POPs) documentados para todas as etapas do processamento?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 126, text: "Os POPs estão disponíveis para consulta da equipe?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 127, text: "Existe controle de revisão periódica dos POPs?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 128, text: "Existe sistema de controle documental para protocolos e procedimentos?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 129, text: "Existe programa de auditorias internas na CME?", module: "Governança", submodule: "Governança", layer: "C", category: "C7", weight: 1 },
  { id: 130, text: "Existe registro das auditorias realizadas?", module: "Governança", submodule: "Governança", layer: "C", category: "C4", weight: 1 },
  { id: 131, text: "Existe plano de ação para correção de não conformidades identificadas?", module: "Governança", submodule: "Governança", layer: "C", category: "C6", weight: 1 },
  { id: 132, text: "Existe acompanhamento das ações corretivas implementadas?", module: "Governança", submodule: "Governança", layer: "P", category: "P5", weight: 1 },
  { id: 133, text: "Existe sistema de registro de eventos adversos relacionados ao processamento de materiais?", module: "Governança", submodule: "Governança", layer: "C", category: "C6", weight: 1 },
  { id: 134, text: "Existe investigação formal de eventos adversos?", module: "Governança", submodule: "Governança", layer: "C", category: "C6", weight: 1 },
  { id: 135, text: "Existe comunicação estruturada com o núcleo de segurança do paciente?", module: "Governança", submodule: "Governança", layer: "C", category: "C8", weight: 1 },
  { id: 136, text: "Existe participação da CME em comissões institucionais relevantes?", module: "Governança", submodule: "Governança", layer: "P", category: "P2", weight: 1 },
  { id: 137, text: "Existe integração da CME com a comissão de controle de infecção hospitalar?", module: "Governança", submodule: "Governança", layer: "C", category: "C8", weight: 1 },
  { id: 138, text: "Existe monitoramento sistemático de indicadores de qualidade da CME?", module: "Governança", submodule: "Governança", layer: "P", category: "P5", weight: 1 },
  { id: 139, text: "Existe reunião periódica para análise de desempenho da CME?", module: "Governança", submodule: "Governança", layer: "P", category: "P5", weight: 1 },
  { id: 140, text: "Existe planejamento estratégico para melhoria contínua da CME?", module: "Governança", submodule: "Governança", layer: "I", category: "I1", weight: 1 },

  { id: 141, text: "A CME possui estrutura física compatível com o volume de materiais processados?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 142, text: "Existe separação física entre área suja, área limpa e área esterilizada?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 143, text: "O fluxo de materiais é unidirecional dentro da CME?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C3", weight: 1 },
  { id: 144, text: "As barreiras físicas impedem o cruzamento entre materiais contaminados e esterilizados?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 145, text: "As áreas da CME possuem identificação adequada?", module: "Estrutura", submodule: "Estrutura", layer: "P", category: "P2", weight: 1 },
  { id: 146, text: "Os pisos são laváveis e resistentes à desinfecção?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 147, text: "As paredes são revestidas com material lavável?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 148, text: "O teto possui acabamento adequado para ambientes hospitalares?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 149, text: "Existe iluminação adequada em todas as áreas da CME?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 150, text: "Existe ventilação adequada nas áreas de processamento?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 151, text: "Existe sistema de exaustão na área de expurgo?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 152, text: "Existe controle de temperatura nas áreas críticas?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 153, text: "Existe controle de umidade nas áreas de armazenamento?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 154, text: "Existe área adequada para armazenamento de materiais esterilizados?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 155, text: "Existe área específica para armazenamento de materiais de embalagem?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 156, text: "Existe área destinada à manutenção de equipamentos?", module: "Estrutura", submodule: "Estrutura", layer: "P", category: "P2", weight: 1 },
  { id: 157, text: "Existe área de apoio para higienização de carrinhos de transporte?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 158, text: "Existe área de armazenamento temporário de resíduos?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C7", weight: 1 },
  { id: 159, text: "Existe acesso controlado às áreas críticas da CME?", module: "Estrutura", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 160, text: "Existe avaliação periódica da adequação da estrutura física da CME?", module: "Estrutura", submodule: "Estrutura", layer: "I", category: "I1", weight: 1 },

  { id: 161, text: "Existe dimensionamento adequado da equipe da CME?", module: "RH", submodule: "RH", layer: "P", category: "P1", weight: 1 },
  { id: 162, text: "Existe descrição formal das funções dos profissionais da CME?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 163, text: "Existe processo formal de treinamento inicial para novos profissionais?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 164, text: "Existe programa de treinamento periódico para a equipe?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 165, text: "Existe registro das capacitações realizadas?", module: "RH", submodule: "RH", layer: "C", category: "C4", weight: 1 },
  { id: 166, text: "Existe avaliação periódica de competência técnica dos profissionais?", module: "RH", submodule: "RH", layer: "P", category: "P5", weight: 1 },
  { id: 167, text: "Existe supervisão técnica contínua das atividades da CME?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 168, text: "Existe treinamento específico sobre biossegurança?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 169, text: "Existe treinamento sobre prevenção de acidentes com material perfurocortante?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 170, text: "Existe política institucional de vacinação ocupacional para profissionais da CME?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 171, text: "Existe monitoramento de acidentes de trabalho na CME?", module: "RH", submodule: "RH", layer: "C", category: "C6", weight: 1 },
  { id: 172, text: "Existe registro de acidentes ocupacionais ocorridos no setor?", module: "RH", submodule: "RH", layer: "C", category: "C4", weight: 1 },
  { id: 173, text: "Existe investigação das causas de acidentes de trabalho?", module: "RH", submodule: "RH", layer: "C", category: "C6", weight: 1 },
  { id: 174, text: "Existe plano de prevenção de acidentes ocupacionais?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 175, text: "Existe uso obrigatório de EPIs nas áreas de processamento?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 176, text: "Existe controle de fornecimento de EPIs para a equipe?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 177, text: "Existe treinamento sobre uso correto de EPIs?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 178, text: "Existe monitoramento da adesão ao uso de EPIs?", module: "RH", submodule: "RH", layer: "P", category: "P2", weight: 1 },
  { id: 179, text: "Existe política institucional de saúde ocupacional para profissionais da CME?", module: "RH", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 180, text: "Existe avaliação periódica das condições de trabalho da equipe?", module: "RH", submodule: "RH", layer: "I", category: "I1", weight: 1 },

  { id: 181, text: "A CME utiliza algum sistema informatizado para gestão do processamento de materiais?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 182, text: "Existe registro digital das etapas do processamento dos materiais?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C4", weight: 1 },
  { id: 183, text: "Existe rastreabilidade informatizada das caixas cirúrgicas?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C3", weight: 1 },
  { id: 184, text: "Existe rastreabilidade informatizada dos instrumentais cirúrgicos individuais?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 185, text: "O sistema utilizado permite rastrear materiais até o paciente?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C3", weight: 1 },
  { id: 186, text: "Existe integração do sistema da CME com os equipamentos de esterilização?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 187, text: "Os dados dos ciclos de esterilização são registrados automaticamente no sistema?", module: "Tecnologia", submodule: "Tecnologia", layer: "P", category: "P5", weight: 1 },
  { id: 188, text: "Existe armazenamento digital dos relatórios de esterilização?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C4", weight: 1 },
  { id: 189, text: "Existe backup regular dos dados da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C1", weight: 1 },
  { id: 190, text: "Existe controle de acesso ao sistema por usuário e senha?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C1", weight: 1 },
  { id: 191, text: "Existe registro de auditoria das ações realizadas no sistema?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C4", weight: 1 },
  { id: 192, text: "Existe integração do sistema da CME com o prontuário eletrônico do paciente?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 193, text: "Existe integração do sistema da CME com o sistema do centro cirúrgico?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 194, text: "Existe geração automática de relatórios operacionais da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "P", category: "P5", weight: 1 },
  { id: 195, text: "Existe geração de indicadores operacionais a partir do sistema?", module: "Tecnologia", submodule: "Tecnologia", layer: "P", category: "P5", weight: 1 },
  { id: 196, text: "Existe painel de monitoramento da produção da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 197, text: "Existe sistema de alerta para não conformidades no processamento?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 198, text: "Existe monitoramento digital da produtividade da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "P", category: "P5", weight: 1 },
  { id: 199, text: "Existe armazenamento histórico dos dados operacionais da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C4", weight: 1 },
  { id: 200, text: "Existe análise de dados para melhoria de processos na CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I3", weight: 1 },

  { id: 201, text: "Existe definição formal de indicadores de desempenho da CME?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 202, text: "Existe monitoramento da quantidade de materiais processados?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 203, text: "Existe monitoramento da quantidade de ciclos de esterilização realizados?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 204, text: "Existe monitoramento da taxa de retrabalho no processamento de materiais?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 205, text: "Existe monitoramento de falhas em ciclos de esterilização?", module: "Indicadores", submodule: "Indicadores", layer: "C", category: "C6", weight: 1 },
  { id: 206, text: "Existe monitoramento de materiais danificados durante o processamento?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 207, text: "Existe monitoramento de atrasos na entrega de materiais esterilizados?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P2", weight: 1 },
  { id: 208, text: "Existe monitoramento da disponibilidade de caixas cirúrgicas?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P2", weight: 1 },
  { id: 209, text: "Existe monitoramento da produtividade da equipe da CME?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 210, text: "Existe análise periódica dos indicadores de desempenho?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 211, text: "Existe apresentação periódica dos indicadores para a gestão hospitalar?", module: "Indicadores", submodule: "Indicadores", layer: "I", category: "I1", weight: 1 },
  { id: 212, text: "Existe plano de melhoria baseado nos indicadores monitorados?", module: "Indicadores", submodule: "Indicadores", layer: "I", category: "I1", weight: 1 },
  { id: 213, text: "Existe monitoramento de perdas de instrumentais cirúrgicos?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P4", weight: 1 },
  { id: 214, text: "Existe monitoramento de custos operacionais da CME?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P3", weight: 1 },
  { id: 215, text: "Existe monitoramento do consumo de insumos utilizados na CME?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P4", weight: 1 },

  { id: 216, text: "Existe comunicação estruturada entre CME e centro cirúrgico?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P2", weight: 1 },
  { id: 217, text: "Existe acesso da CME à programação cirúrgica diária?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P2", weight: 1 },
  { id: 218, text: "Existe planejamento antecipado das caixas cirúrgicas necessárias?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P2", weight: 1 },
  { id: 219, text: "Existe monitoramento da disponibilidade de instrumentais para cirurgias programadas?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P5", weight: 1 },
  { id: 220, text: "Existe protocolo para atendimento de cirurgias de urgência?", module: "Integração CC", submodule: "Integração", layer: "C", category: "C1", weight: 1 },
  { id: 221, text: "Existe fluxo definido para devolução de caixas cirúrgicas após uso?", module: "Integração CC", submodule: "Integração", layer: "C", category: "C1", weight: 1 },
  { id: 222, text: "Existe conferência das caixas após retorno do centro cirúrgico?", module: "Integração CC", submodule: "Integração", layer: "C", category: "C4", weight: 1 },
  { id: 223, text: "Existe rastreabilidade do uso das caixas cirúrgicas em cada procedimento?", module: "Integração CC", submodule: "Integração", layer: "C", category: "C3", weight: 1 },
  { id: 224, text: "Existe comunicação imediata quando há falha em material cirúrgico?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P2", weight: 1 },
  { id: 225, text: "Existe análise de incidentes envolvendo instrumentais cirúrgicos?", module: "Integração CC", submodule: "Integração", layer: "I", category: "I1", weight: 1 },

  { id: 226, text: "Existe controle da qualidade da água utilizada no processamento?", module: "Água", submodule: "Água", layer: "C", category: "C5", weight: 1 },
  { id: 227, text: "Existe análise microbiológica periódica da água utilizada?", module: "Água", submodule: "Água", layer: "C", category: "C5", weight: 1 },
  { id: 228, text: "Existe controle da qualidade da água utilizada em autoclaves?", module: "Água", submodule: "Água", layer: "C", category: "C5", weight: 1 },
  { id: 229, text: "Existe registro das análises realizadas na água?", module: "Água", submodule: "Água", layer: "C", category: "C4", weight: 1 },
  { id: 230, text: "Existe controle da procedência dos detergentes utilizados?", module: "Água", submodule: "Água", layer: "C", category: "C1", weight: 1 },
  { id: 231, text: "Existe controle da validade dos insumos utilizados na CME?", module: "Água", submodule: "Água", layer: "C", category: "C1", weight: 1 },
  { id: 232, text: "Existe armazenamento adequado de produtos químicos?", module: "Água", submodule: "Água", layer: "C", category: "C1", weight: 1 },
  { id: 233, text: "Existe controle de estoque dos insumos da CME?", module: "Água", submodule: "Água", layer: "P", category: "P4", weight: 1 },

  { id: 234, text: "Existe monitoramento do consumo de água da CME?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P4", weight: 1 },
  { id: 235, text: "Existe monitoramento do consumo de energia dos equipamentos de esterilização?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P4", weight: 1 },
  { id: 236, text: "Existe análise da eficiência das cargas de esterilização?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P2", weight: 1 },
  { id: 237, text: "Existe monitoramento de ciclos realizados com baixa carga?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P5", weight: 1 },
  { id: 238, text: "Existe estratégia para otimização das cargas de autoclave?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "I", category: "I1", weight: 1 },
  { id: 239, text: "Existe análise de desperdícios operacionais na CME?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "I", category: "I3", weight: 1 },
  { id: 240, text: "Existe plano de redução de consumo de recursos naturais?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "I", category: "I1", weight: 1 },
  { id: 241, text: "Existe análise de impacto ambiental das operações da CME?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "I", category: "I1", weight: 1 },
  { id: 242, text: "Existe monitoramento da eficiência operacional da CME?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P5", weight: 1 },

  { id: 243, text: "Existe controle de entrada de materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C1", weight: 1 },
  { id: 244, text: "Existe registro da rastreabilidade de materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C3", weight: 1 },
  { id: 245, text: "Existe conferência dos materiais consignados antes do procedimento cirúrgico?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C4", weight: 1 },
  { id: 246, text: "Existe conferência dos materiais consignados após o procedimento?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C4", weight: 1 },
  { id: 247, text: "Existe registro de utilização dos materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C4", weight: 1 },
  { id: 248, text: "Existe controle de devolução dos materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C1", weight: 1 },
  { id: 249, text: "Existe controle de perdas ou danos em materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "P", category: "P4", weight: 1 },

  { id: 250, text: "Existe rastreabilidade das caixas cirúrgicas utilizadas em cada cirurgia?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 251, text: "Existe rastreabilidade dos instrumentais utilizados nos procedimentos?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 252, text: "Existe registro do lote de esterilização associado ao procedimento cirúrgico?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 253, text: "Existe rastreabilidade dos materiais até o paciente?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 254, text: "Existe rastreabilidade dos profissionais envolvidos no processamento?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C4", weight: 1 },
  { id: 255, text: "Existe rastreabilidade das cargas de esterilização?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 256, text: "Existe rastreabilidade dos indicadores biológicos utilizados?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C2", weight: 1 },
  { id: 257, text: "Existe rastreabilidade dos indicadores químicos utilizados?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C2", weight: 1 },
  { id: 258, text: "Existe rastreabilidade de não conformidades identificadas?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C6", weight: 1 },
  { id: 259, text: "Existe protocolo para rastreamento de materiais em caso de falha de esterilização?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C6", weight: 1 },
  { id: 260, text: "Existe integração da rastreabilidade com sistemas hospitalares?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "I", category: "I2", weight: 1 },
  { id: 261, text: "Existe análise de eventos relacionados à falha de rastreabilidade?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "I", category: "I1", weight: 1 },
  { id: 262, text: "Existe auditoria periódica do sistema de rastreabilidade?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "I", category: "I3", weight: 1 },

  { id: 263, text: "Existe área física adequada para triagem inicial de materiais consignados OPME?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C1", weight: 1 },
  { id: 264, text: "Existe sistema de água tratada (osmose) para auxiliar na limpeza dos instrumentais?", module: "Expurgo", submodule: "Expurgo", layer: "P", category: "P2", weight: 1 },
  { id: 265, text: "O setor do expurgo/limpeza está conforme as normas da RDC e da vigilância sanitária quanto à estrutura física (pias, ralos, paredes, ventilação, iluminação)?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 266, text: "Existe registro do processo de limpeza automatizado?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C4", weight: 1 }
];

const questions = rawQuestions.map(enrichQuestion);

console.log("✓ Arquivo questions.js atualizado carregado com sucesso");
console.log("✓ Total de perguntas: " + questions.length);

if (typeof updateLoadingProgress === "function") {
  updateLoadingProgress();
}