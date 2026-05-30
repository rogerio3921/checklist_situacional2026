/**
 * PERGUNTAS - NS CheckList Situacional CME v3
 * Base consolidada + seção de Qualidade e Acreditação
 * Total: 284 perguntas
 */

const questions = [
  // =========================
  // RECEPÇÃO
  // =========================
  { id: 1, text: "Existe protocolo formal para recepção de materiais contaminados provenientes das unidades assistenciais e do centro cirúrgico?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },
  { id: 2, text: "A recepção dos materiais é realizada em área exclusiva da CME?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },
  { id: 3, text: "Existe registro formal de entrada dos materiais contendo data, horário, setor de origem e responsável?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C4", weight: 1 },
  { id: 4, text: "Os materiais são conferidos no momento da recepção quanto à quantidade e à integridade?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C4", weight: 1 },
  { id: 5, text: "Existe separação adequada entre materiais contaminados e materiais limpos durante o transporte interno?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C3", weight: 1 },
  { id: 6, text: "O transporte interno dos materiais contaminados é realizado em carrinhos fechados e identificados?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C3", weight: 1 },
  { id: 7, text: "Existe fluxo definido para evitar cruzamento entre materiais contaminados e áreas limpas?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C3", weight: 1 },
  { id: 8, text: "Os profissionais utilizam EPIs adequados durante a recepção dos materiais?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },
  { id: 9, text: "Existe rotina padronizada para identificação de materiais danificados ou incompletos no momento da recepção?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C4", weight: 1 },
  { id: 10, text: "Existe registro formal de não conformidades identificadas na recepção?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C6", weight: 1 },
  { id: 11, text: "O setor de origem é comunicado quando são identificadas falhas ou materiais incompletos?", module: "Recepção", submodule: "Recepção", layer: "P", category: "P2", weight: 1 },
  { id: 12, text: "Existe área física adequada para triagem inicial dos materiais recebidos?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },
  { id: 13, text: "Existe área física adequada para triagem inicial de materiais consignados/OPME recebidos pela CME?", module: "Recepção", submodule: "Recepção", layer: "C", category: "C1", weight: 1 },

  // =========================
  // EXPURGO
  // =========================
  { id: 14, text: "Existe área física exclusiva destinada ao expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 15, text: "O expurgo possui separação física das áreas limpas da CME?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 16, text: "O fluxo de materiais no expurgo é unidirecional?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C3", weight: 1 },
  { id: 17, text: "As superfícies do expurgo são de material lavável e resistente à desinfecção?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 18, text: "Existe sistema de ventilação ou exaustão adequado na área do expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 19, text: "As pias possuem dimensionamento adequado para limpeza dos materiais?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 20, text: "Existe sistema de água pressurizada para auxiliar na limpeza dos instrumentais?", module: "Expurgo", submodule: "Expurgo", layer: "P", category: "P2", weight: 1 },
  { id: 21, text: "Existe sistema de água tratada, como osmose reversa quando aplicável, para auxiliar no processamento dos instrumentais?", module: "Expurgo", submodule: "Expurgo", layer: "P", category: "P2", weight: 1 },
  { id: 22, text: "Os profissionais utilizam EPIs completos no expurgo, incluindo luvas grossas, avental impermeável e proteção facial?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 23, text: "Existe rotina padronizada de limpeza manual no expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 24, text: "Existe rotina padronizada de limpeza automatizada quando aplicável?", module: "Expurgo", submodule: "Expurgo", layer: "P", category: "P2", weight: 1 },
  { id: 25, text: "Existe descarte adequado de resíduos gerados no expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C7", weight: 1 },
  { id: 26, text: "Existe protocolo para manipulação segura de materiais perfurocortantes no expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 27, text: "Existe monitoramento ou testes da qualidade da limpeza realizada no expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "P", category: "P5", weight: 1 },
  { id: 28, text: "Existe treinamento periódico da equipe sobre os procedimentos realizados no expurgo?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },
  { id: 29, text: "O setor de expurgo/limpeza está conforme as normas sanitárias e estruturais aplicáveis quanto a pias, ralos, paredes, ventilação e iluminação?", module: "Expurgo", submodule: "Expurgo", layer: "C", category: "C1", weight: 1 },

  // =========================
  // LIMPEZA
  // =========================
  { id: 30, text: "Existe protocolo formal documentado para limpeza de produtos para saúde?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 31, text: "A limpeza segue as orientações do fabricante dos instrumentais e produtos para saúde?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 32, text: "Existe padronização dos detergentes utilizados no processo de limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 33, text: "Existe controle da diluição dos detergentes utilizados?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C4", weight: 1 },
  { id: 34, text: "Os detergentes utilizados possuem registro na Anvisa?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 35, text: "Existe controle de validade dos produtos utilizados na limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 36, text: "Existe registro do processo de limpeza manual?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C4", weight: 1 },
  { id: 37, text: "Existe registro do processo de limpeza automatizada quando aplicável?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C4", weight: 1 },
  { id: 38, text: "Existe monitoramento da eficácia da limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C2", weight: 1 },
  { id: 39, text: "São utilizados testes específicos para validação da limpeza quando aplicável?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C5", weight: 1 },
  { id: 40, text: "Existe separação de instrumentais delicados ou especiais durante a limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 41, text: "Existe rotina de inspeção visual após a limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C4", weight: 1 },
  { id: 42, text: "Existe processo definido para reprocessamento quando a limpeza não é satisfatória?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C6", weight: 1 },
  { id: 43, text: "Existe uso de escovas adequadas para cada tipo de instrumental?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },
  { id: 44, text: "Existe controle do desgaste das escovas utilizadas?", module: "Limpeza", submodule: "Limpeza", layer: "P", category: "P2", weight: 1 },
  { id: 45, text: "Existe monitoramento da qualidade da água utilizada na limpeza?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C2", weight: 1 },
  { id: 46, text: "Existe controle para impedir o reprocessamento de produtos para saúde cuja rotulagem indique proibição de reprocessamento, quando aplicável?", module: "Limpeza", submodule: "Limpeza", layer: "C", category: "C1", weight: 1 },

  // =========================
  // PREPARO
  // =========================
  { id: 47, text: "Existe área exclusiva para preparo e inspeção dos materiais?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 48, text: "A área de preparo está fisicamente separada da área suja?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 49, text: "Existe iluminação adequada para inspeção dos instrumentais?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 50, text: "Existe uso de lupas ou sistemas de ampliação quando necessário?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C2", weight: 1 },
  { id: 51, text: "Os instrumentais são inspecionados quanto à limpeza antes da montagem?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C4", weight: 1 },
  { id: 52, text: "Existe conferência da integridade funcional dos instrumentais?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 53, text: "Existe protocolo para retirada de instrumentais danificados de uso?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C6", weight: 1 },
  { id: 54, text: "Existe controle de manutenção dos instrumentais cirúrgicos?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 55, text: "Existe conferência da composição das caixas cirúrgicas?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 56, text: "Existe lista padrão para montagem de cada caixa cirúrgica?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 57, text: "Existe registro da montagem das caixas cirúrgicas?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C4", weight: 1 },
  { id: 58, text: "Existe rastreabilidade da montagem realizada?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C3", weight: 1 },
  { id: 59, text: "Existe conferência dupla na montagem de caixas críticas, quando aplicável?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C1", weight: 1 },
  { id: 60, text: "Existe identificação das caixas após a montagem?", module: "Preparo", submodule: "Preparo", layer: "C", category: "C4", weight: 1 },
  { id: 61, text: "Existe controle de substituição de instrumentais ausentes ou indisponíveis?", module: "Preparo", submodule: "Preparo", layer: "P", category: "P2", weight: 1 },

  // =========================
  // EMBALAGEM
  // =========================
  { id: 62, text: "Existe área exclusiva para embalagem dos materiais?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 63, text: "Os materiais de embalagem possuem registro na Anvisa, quando aplicável?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 64, text: "Existe padronização dos tipos de embalagem utilizados?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 65, text: "Existe controle de validade das embalagens?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 66, text: "Existe verificação da integridade das embalagens antes do uso?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C4", weight: 1 },
  { id: 67, text: "Existe técnica padronizada para embalagem dos materiais?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 68, text: "Existe treinamento específico da equipe para as atividades de embalagem?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 69, text: "Existe identificação adequada dos pacotes após a embalagem?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C4", weight: 1 },
  { id: 70, text: "Existe uso de indicadores químicos internos quando aplicável?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C2", weight: 1 },
  { id: 71, text: "Existe uso de indicadores químicos externos quando aplicável?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C2", weight: 1 },
  { id: 72, text: "Existe controle de rastreabilidade da embalagem realizada?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C3", weight: 1 },
  { id: 73, text: "Existe verificação da compatibilidade da embalagem com o método de esterilização adotado?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C1", weight: 1 },
  { id: 74, text: "Existe controle de peso ou volume das cargas embaladas, quando aplicável?", module: "Embalagem", submodule: "Embalagem", layer: "P", category: "P2", weight: 1 },
  { id: 75, text: "Existe monitoramento da qualidade da selagem das embalagens?", module: "Embalagem", submodule: "Embalagem", layer: "P", category: "P5", weight: 1 },
  { id: 76, text: "Existe inspeção final dos materiais embalados antes da esterilização?", module: "Embalagem", submodule: "Embalagem", layer: "C", category: "C4", weight: 1 },

  // =========================
  // ESTERILIZAÇÃO
  // =========================
  { id: 77, text: "Existe protocolo formal para esterilização de materiais?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C1", weight: 1 },
  { id: 78, text: "Os equipamentos de esterilização possuem qualificação de instalação, quando aplicável?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C5", weight: 1 },
  { id: 79, text: "Os equipamentos possuem qualificação operacional, quando aplicável?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C5", weight: 1 },
  { id: 80, text: "Os equipamentos possuem qualificação de desempenho, quando aplicável?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C5", weight: 1 },
  { id: 81, text: "Existe manutenção preventiva das autoclaves e demais equipamentos de esterilização?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C1", weight: 1 },
  { id: 82, text: "Existe registro de cada ciclo de esterilização?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C4", weight: 1 },
  { id: 83, text: "Existe monitoramento do processo com indicadores químicos?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C2", weight: 1 },
  { id: 84, text: "Existe monitoramento do processo com indicadores biológicos?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C2", weight: 1 },
  { id: 85, text: "Existe monitoramento dos parâmetros físicos do ciclo?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C4", weight: 1 },
  { id: 86, text: "Existe rastreabilidade das cargas esterilizadas?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C3", weight: 1 },
  { id: 87, text: "Existe controle de carga máxima dos equipamentos de esterilização?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C1", weight: 1 },
  { id: 88, text: "Existe registro de liberação da carga esterilizada?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C4", weight: 1 },
  { id: 89, text: "Existe protocolo para tratamento de cargas não conformes?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C6", weight: 1 },
  { id: 90, text: "Existe rotina de testes Bowie & Dick quando aplicável?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C2", weight: 1 },
  { id: 91, text: "Existe treinamento específico da equipe para operação dos equipamentos de esterilização?", module: "Esterilização", submodule: "Esterilização", layer: "C", category: "C1", weight: 1 },

  // =========================
  // ARMAZENAMENTO
  // =========================
  { id: 92, text: "Existe área exclusiva para armazenamento de materiais esterilizados?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 93, text: "Existe separação física entre materiais limpos e esterilizados, quando aplicável?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 94, text: "Existe controle ambiental da área de armazenamento?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 95, text: "Existe controle de temperatura e umidade na área de armazenamento?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 96, text: "Existe controle de acesso à área de armazenamento?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C1", weight: 1 },
  { id: 97, text: "Existe organização sistematizada das prateleiras e áreas de guarda?", module: "Armazenamento", submodule: "Armazenamento", layer: "P", category: "P2", weight: 1 },
  { id: 98, text: "Existe identificação adequada dos materiais armazenados?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C4", weight: 1 },
  { id: 99, text: "Existe controle da validade ou evento relacionado da esterilização, conforme critério institucional adotado?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C3", weight: 1 },
  { id: 100, text: "Existe inspeção periódica das embalagens armazenadas?", module: "Armazenamento", submodule: "Armazenamento", layer: "P", category: "P5", weight: 1 },
  { id: 101, text: "Existe controle de integridade das embalagens durante o armazenamento?", module: "Armazenamento", submodule: "Armazenamento", layer: "C", category: "C4", weight: 1 },

  // =========================
  // DISTRIBUIÇÃO
  // =========================
  { id: 102, text: "Existe protocolo formal para distribuição de materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 103, text: "Existe registro de saída dos materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C4", weight: 1 },
  { id: 104, text: "Existe rastreabilidade do destino dos materiais distribuídos?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C3", weight: 1 },
  { id: 105, text: "Existe controle do transporte interno de materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 106, text: "Os carrinhos de transporte são exclusivos para materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 107, text: "Existe conferência dos materiais no momento da entrega?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C4", weight: 1 },
  { id: 108, text: "Existe protocolo para devolução de materiais não utilizados?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 109, text: "Existe registro dos materiais devolvidos?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C4", weight: 1 },
  { id: 110, text: "Existe monitoramento de perdas de materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P2", weight: 1 },
  { id: 111, text: "Existe controle do tempo entre a esterilização e a disponibilização/uso dos materiais, conforme critério institucional adotado?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C3", weight: 1 },
  { id: 112, text: "Existe integração entre a CME e o centro cirúrgico para programação cirúrgica?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P2", weight: 1 },
  { id: 113, text: "Existe previsão de demanda de caixas cirúrgicas e materiais críticos?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P2", weight: 1 },
  { id: 114, text: "Existe controle da disponibilidade de instrumentais críticos?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P5", weight: 1 },
  { id: 115, text: "Existe controle de kits específicos para procedimentos?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C1", weight: 1 },
  { id: 116, text: "Existe monitoramento de atrasos na entrega de materiais esterilizados?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P5", weight: 1 },
  { id: 117, text: "Existe registro de incidentes relacionados à distribuição?", module: "Distribuição", submodule: "Distribuição", layer: "C", category: "C6", weight: 1 },
  { id: 118, text: "Existe comunicação estruturada entre a CME e os setores assistenciais durante a distribuição?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P2", weight: 1 },
  { id: 119, text: "Existe controle de materiais de alta rotatividade?", module: "Distribuição", submodule: "Distribuição", layer: "P", category: "P5", weight: 1 },
  { id: 120, text: "Existe monitoramento da eficiência do fluxo de distribuição?", module: "Distribuição", submodule: "Distribuição", layer: "I", category: "I3", weight: 1 },
  { id: 121, text: "Existe auditoria periódica do processo de distribuição?", module: "Distribuição", submodule: "Distribuição", layer: "I", category: "I1", weight: 1 },

  // =========================
  // GOVERNANÇA
  // =========================
  { id: 122, text: "Existe responsável técnico formalmente designado para a CME?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 123, text: "O responsável técnico possui formação compatível com a função?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 124, text: "Existe documento formal de designação do responsável técnico?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 125, text: "Existe manual de normas e rotinas da CME atualizado?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 126, text: "Existem procedimentos operacionais padrão (POPs) documentados para todas as etapas do processamento?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 127, text: "Os POPs estão disponíveis para consulta da equipe?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 128, text: "Existe controle de revisão periódica dos POPs?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 129, text: "Existe sistema de controle documental para protocolos e procedimentos da CME?", module: "Governança", submodule: "Governança", layer: "C", category: "C1", weight: 1 },
  { id: 130, text: "Existe programa de auditorias internas na CME?", module: "Governança", submodule: "Governança", layer: "C", category: "C7", weight: 1 },
  { id: 131, text: "Existe registro das auditorias realizadas?", module: "Governança", submodule: "Governança", layer: "C", category: "C4", weight: 1 },
  { id: 132, text: "Existe plano de ação para correção de não conformidades identificadas?", module: "Governança", submodule: "Governança", layer: "C", category: "C6", weight: 1 },
  { id: 133, text: "Existe acompanhamento das ações corretivas implementadas?", module: "Governança", submodule: "Governança", layer: "P", category: "P5", weight: 1 },
  { id: 134, text: "Existe sistema de registro de eventos adversos relacionados ao processamento de materiais?", module: "Governança", submodule: "Governança", layer: "C", category: "C6", weight: 1 },
  { id: 135, text: "Existe investigação formal dos eventos adversos relacionados ao processamento?", module: "Governança", submodule: "Governança", layer: "C", category: "C6", weight: 1 },
  { id: 136, text: "Existe comunicação estruturada com o Núcleo de Segurança do Paciente?", module: "Governança", submodule: "Governança", layer: "C", category: "C8", weight: 1 },
  { id: 137, text: "Existe participação da CME em comissões institucionais relevantes?", module: "Governança", submodule: "Governança", layer: "P", category: "P2", weight: 1 },
  { id: 138, text: "Existe integração da CME com a Comissão de Controle de Infecção Hospitalar?", module: "Governança", submodule: "Governança", layer: "C", category: "C8", weight: 1 },
  { id: 139, text: "Existe monitoramento sistemático de indicadores de qualidade da CME?", module: "Governança", submodule: "Governança", layer: "P", category: "P5", weight: 1 },
  { id: 140, text: "Existe reunião periódica para análise de desempenho da CME?", module: "Governança", submodule: "Governança", layer: "P", category: "P5", weight: 1 },
  { id: 141, text: "Existe planejamento estratégico para melhoria contínua da CME?", module: "Governança", submodule: "Governança", layer: "I", category: "I1", weight: 1 },

  // =========================
  // ESTRUTURA
  // =========================
  { id: 142, text: "A CME possui estrutura física compatível com o volume de materiais processados?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 143, text: "Existe separação física entre área suja, área limpa e área esterilizada?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 144, text: "O fluxo de materiais é unidirecional dentro da CME?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C3", weight: 1 },
  { id: 145, text: "As barreiras físicas impedem o cruzamento entre materiais contaminados e esterilizados?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 146, text: "As áreas da CME possuem identificação adequada?", module: "Governança", submodule: "Estrutura", layer: "P", category: "P2", weight: 1 },
  { id: 147, text: "Os pisos são laváveis e resistentes à desinfecção?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 148, text: "As paredes possuem revestimento adequado e lavável?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 149, text: "O teto possui acabamento adequado para ambiente assistencial?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 150, text: "Existe iluminação adequada em todas as áreas da CME?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 151, text: "Existe ventilação adequada nas áreas de processamento?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 152, text: "Existe sistema de exaustão na área de expurgo, quando aplicável?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 153, text: "Existe controle de temperatura nas áreas críticas?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 154, text: "Existe controle de umidade nas áreas de armazenamento, quando aplicável?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 155, text: "Existe área adequada para armazenamento de materiais esterilizados?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 156, text: "Existe área específica para armazenamento de materiais de embalagem?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 157, text: "Existe área destinada à manutenção de equipamentos, quando aplicável?", module: "Governança", submodule: "Estrutura", layer: "P", category: "P2", weight: 1 },
  { id: 158, text: "Existe área de apoio para higienização de carrinhos de transporte?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 159, text: "Existe área para armazenamento temporário de resíduos gerados na CME?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C7", weight: 1 },
  { id: 160, text: "Existe controle de acesso às áreas críticas da CME?", module: "Governança", submodule: "Estrutura", layer: "C", category: "C1", weight: 1 },
  { id: 161, text: "Existe avaliação periódica da adequação da estrutura física da CME?", module: "Governança", submodule: "Estrutura", layer: "I", category: "I1", weight: 1 },

  // =========================
  // RH
  // =========================
  { id: 162, text: "Existe dimensionamento adequado da equipe da CME?", module: "Governança", submodule: "RH", layer: "P", category: "P1", weight: 1 },
  { id: 163, text: "Existe descrição formal das funções dos profissionais da CME?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 164, text: "Existe processo formal de treinamento inicial para novos profissionais?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 165, text: "Existe programa de treinamento periódico para a equipe?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 166, text: "Existe registro das capacitações realizadas?", module: "Governança", submodule: "RH", layer: "C", category: "C4", weight: 1 },
  { id: 167, text: "Existe avaliação periódica da competência técnica dos profissionais?", module: "Governança", submodule: "RH", layer: "P", category: "P5", weight: 1 },
  { id: 168, text: "Existe supervisão técnica contínua das atividades da CME?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 169, text: "Existe treinamento específico sobre biossegurança?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 170, text: "Existe treinamento sobre prevenção de acidentes com materiais perfurocortantes?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 171, text: "Existe política institucional de vacinação ocupacional para os profissionais da CME?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 172, text: "Existe monitoramento de acidentes de trabalho na CME?", module: "Governança", submodule: "RH", layer: "C", category: "C6", weight: 1 },
  { id: 173, text: "Existe registro dos acidentes ocupacionais ocorridos no setor?", module: "Governança", submodule: "RH", layer: "C", category: "C4", weight: 1 },
  { id: 174, text: "Existe investigação das causas dos acidentes de trabalho?", module: "Governança", submodule: "RH", layer: "C", category: "C6", weight: 1 },
  { id: 175, text: "Existe plano de prevenção de acidentes ocupacionais?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 176, text: "Existe uso obrigatório de EPIs nas áreas de processamento?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 177, text: "Existe controle de fornecimento de EPIs para a equipe?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 178, text: "Existe treinamento sobre o uso correto de EPIs?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 179, text: "Existe monitoramento da adesão ao uso de EPIs?", module: "Governança", submodule: "RH", layer: "P", category: "P2", weight: 1 },
  { id: 180, text: "Existe política institucional de saúde ocupacional para os profissionais da CME?", module: "Governança", submodule: "RH", layer: "C", category: "C1", weight: 1 },
  { id: 181, text: "Existe avaliação periódica das condições de trabalho da equipe da CME?", module: "Governança", submodule: "RH", layer: "I", category: "I1", weight: 1 },

  // =========================
  // TECNOLOGIA
  // =========================
  { id: 182, text: "A CME utiliza algum sistema informatizado para gestão do processamento de materiais?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 183, text: "Existe registro digital das etapas do processamento dos materiais?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C4", weight: 1 },
  { id: 184, text: "Existe rastreabilidade informatizada das caixas cirúrgicas?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C3", weight: 1 },
  { id: 185, text: "Existe rastreabilidade informatizada dos instrumentais cirúrgicos individuais, quando aplicável?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 186, text: "O sistema utilizado permite rastrear materiais até o paciente, quando aplicável?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C3", weight: 1 },
  { id: 187, text: "Existe integração do sistema da CME com os equipamentos de esterilização?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 188, text: "Os dados dos ciclos de esterilização são registrados automaticamente no sistema?", module: "Tecnologia", submodule: "Tecnologia", layer: "P", category: "P5", weight: 1 },
  { id: 189, text: "Existe armazenamento digital dos relatórios de esterilização?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C4", weight: 1 },
  { id: 190, text: "Existe backup regular dos dados da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C1", weight: 1 },
  { id: 191, text: "Existe controle de acesso ao sistema por usuário e senha?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C1", weight: 1 },
  { id: 192, text: "Existe registro de auditoria das ações realizadas no sistema?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C4", weight: 1 },
  { id: 193, text: "Existe integração do sistema da CME com o prontuário eletrônico do paciente, quando aplicável?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 194, text: "Existe integração do sistema da CME com o sistema do centro cirúrgico?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 195, text: "Existe geração automática de relatórios operacionais da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "P", category: "P5", weight: 1 },
  { id: 196, text: "Existe geração automática de indicadores operacionais a partir do sistema?", module: "Tecnologia", submodule: "Tecnologia", layer: "P", category: "P5", weight: 1 },
  { id: 197, text: "Existe painel de monitoramento da produção da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 198, text: "Existe sistema de alerta para não conformidades no processamento?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I2", weight: 1 },
  { id: 199, text: "Existe monitoramento digital da produtividade da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "P", category: "P5", weight: 1 },
  { id: 200, text: "Existe armazenamento histórico dos dados operacionais da CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "C", category: "C4", weight: 1 },
  { id: 201, text: "Existe análise de dados para melhoria de processos na CME?", module: "Tecnologia", submodule: "Tecnologia", layer: "I", category: "I3", weight: 1 },

  // =========================
  // INDICADORES
  // =========================
  { id: 202, text: "Existe definição formal de indicadores de desempenho da CME?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 203, text: "Existe monitoramento da quantidade de materiais processados?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 204, text: "Existe monitoramento da quantidade de ciclos de esterilização realizados?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 205, text: "Existe monitoramento da taxa de retrabalho no processamento de materiais?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 206, text: "Existe monitoramento de falhas em ciclos de esterilização?", module: "Indicadores", submodule: "Indicadores", layer: "C", category: "C6", weight: 1 },
  { id: 207, text: "Existe monitoramento de materiais danificados durante o processamento?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 208, text: "Existe monitoramento da disponibilidade de caixas cirúrgicas?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P2", weight: 1 },
  { id: 209, text: "Existe monitoramento da produtividade da equipe da CME?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 210, text: "Existe análise periódica dos indicadores de desempenho?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P5", weight: 1 },
  { id: 211, text: "Existe apresentação periódica dos indicadores para a gestão hospitalar?", module: "Indicadores", submodule: "Indicadores", layer: "I", category: "I1", weight: 1 },
  { id: 212, text: "Existe plano de melhoria baseado nos indicadores monitorados?", module: "Indicadores", submodule: "Indicadores", layer: "I", category: "I1", weight: 1 },
  { id: 213, text: "Existe monitoramento de perdas de instrumentais cirúrgicos?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P4", weight: 1 },
  { id: 214, text: "Existe monitoramento de custos operacionais da CME?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P3", weight: 1 },
  { id: 215, text: "Existe monitoramento do consumo de insumos utilizados na CME?", module: "Indicadores", submodule: "Indicadores", layer: "P", category: "P4", weight: 1 },

  // =========================
  // INTEGRAÇÃO CC
  // =========================
  { id: 216, text: "Existe comunicação estruturada entre a CME e o centro cirúrgico?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P2", weight: 1 },
  { id: 217, text: "Existe acesso da CME à programação cirúrgica diária?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P2", weight: 1 },
  { id: 218, text: "Existe planejamento antecipado das caixas cirúrgicas necessárias para os procedimentos programados?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P2", weight: 1 },
  { id: 219, text: "Existe monitoramento da disponibilidade de instrumentais para as cirurgias programadas?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P5", weight: 1 },
  { id: 220, text: "Existe protocolo para atendimento de cirurgias de urgência?", module: "Integração CC", submodule: "Integração", layer: "C", category: "C1", weight: 1 },
  { id: 221, text: "Existe fluxo definido para devolução das caixas cirúrgicas após o uso?", module: "Integração CC", submodule: "Integração", layer: "C", category: "C1", weight: 1 },
  { id: 222, text: "Existe conferência das caixas após o retorno do centro cirúrgico?", module: "Integração CC", submodule: "Integração", layer: "C", category: "C4", weight: 1 },
  { id: 223, text: "Existe rastreabilidade do uso das caixas cirúrgicas em cada procedimento?", module: "Integração CC", submodule: "Integração", layer: "C", category: "C3", weight: 1 },
  { id: 224, text: "Existe comunicação imediata quando há falha em material cirúrgico?", module: "Integração CC", submodule: "Integração", layer: "P", category: "P2", weight: 1 },
  { id: 225, text: "Existe análise de incidentes envolvendo instrumentais cirúrgicos e interface com o centro cirúrgico?", module: "Integração CC", submodule: "Integração", layer: "I", category: "I1", weight: 1 },

  // =========================
  // ÁGUA
  // =========================
  { id: 226, text: "Existe controle da qualidade da água utilizada no processamento?", module: "Água", submodule: "Água", layer: "C", category: "C5", weight: 1 },
  { id: 227, text: "Existe análise microbiológica periódica da água utilizada?", module: "Água", submodule: "Água", layer: "C", category: "C5", weight: 1 },
  { id: 228, text: "Existe controle da qualidade da água utilizada nos equipamentos de esterilização, quando aplicável?", module: "Água", submodule: "Água", layer: "C", category: "C5", weight: 1 },
  { id: 229, text: "Existe registro das análises realizadas na água?", module: "Água", submodule: "Água", layer: "C", category: "C4", weight: 1 },
  { id: 230, text: "Existe controle da procedência dos produtos saneantes e insumos utilizados no processamento?", module: "Água", submodule: "Água", layer: "C", category: "C1", weight: 1 },
  { id: 231, text: "Existe controle da validade dos insumos utilizados na CME?", module: "Água", submodule: "Água", layer: "C", category: "C1", weight: 1 },
  { id: 232, text: "Existe armazenamento adequado de produtos químicos e insumos?", module: "Água", submodule: "Água", layer: "C", category: "C1", weight: 1 },
  { id: 233, text: "Existe controle de estoque dos insumos da CME?", module: "Água", submodule: "Água", layer: "P", category: "P4", weight: 1 },

  // =========================
  // SUSTENTABILIDADE
  // =========================
  { id: 234, text: "Existe monitoramento do consumo de água da CME?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P4", weight: 1 },
  { id: 235, text: "Existe monitoramento do consumo de energia dos equipamentos de esterilização?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P4", weight: 1 },
  { id: 236, text: "Existe análise da eficiência das cargas de esterilização?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P2", weight: 1 },
  { id: 237, text: "Existe monitoramento de ciclos realizados com baixa carga?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P5", weight: 1 },
  { id: 238, text: "Existe estratégia para otimização das cargas dos equipamentos de esterilização?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "I", category: "I1", weight: 1 },
  { id: 239, text: "Existe análise de desperdícios operacionais na CME?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "I", category: "I3", weight: 1 },
  { id: 240, text: "Existe plano de redução do consumo de recursos naturais na CME?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "I", category: "I1", weight: 1 },
  { id: 241, text: "Existe análise de impacto ambiental das operações da CME?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "I", category: "I1", weight: 1 },
  { id: 242, text: "Existe monitoramento da eficiência operacional da CME sob a ótica de uso de recursos?", module: "Sustentabilidade", submodule: "Sustentabilidade", layer: "P", category: "P5", weight: 1 },

  // =========================
  // CONSIGNADOS
  // =========================
  { id: 243, text: "Existe controle de entrada de materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C1", weight: 1 },
  { id: 244, text: "Existe registro da rastreabilidade de materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C3", weight: 1 },
  { id: 245, text: "Existe conferência dos materiais consignados antes do procedimento cirúrgico?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C4", weight: 1 },
  { id: 246, text: "Existe conferência dos materiais consignados após o procedimento cirúrgico?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C4", weight: 1 },
  { id: 247, text: "Existe registro da utilização dos materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C4", weight: 1 },
  { id: 248, text: "Existe controle da devolução dos materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "C", category: "C1", weight: 1 },
  { id: 249, text: "Existe controle de perdas ou danos em materiais consignados?", module: "Consignados", submodule: "Consignados", layer: "P", category: "P4", weight: 1 },

  // =========================
  // RASTREABILIDADE
  // =========================
  { id: 250, text: "Existe rastreabilidade das caixas cirúrgicas utilizadas em cada cirurgia?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 251, text: "Existe rastreabilidade dos instrumentais utilizados nos procedimentos, quando aplicável?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 252, text: "Existe registro do lote de esterilização associado ao procedimento cirúrgico?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 253, text: "Existe rastreabilidade dos materiais até o paciente, quando aplicável?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 254, text: "Existe rastreabilidade dos profissionais envolvidos no processamento?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C4", weight: 1 },
  { id: 255, text: "Existe rastreabilidade das cargas de esterilização?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C3", weight: 1 },
  { id: 256, text: "Existe rastreabilidade dos indicadores biológicos utilizados?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C2", weight: 1 },
  { id: 257, text: "Existe rastreabilidade dos indicadores químicos utilizados?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C2", weight: 1 },
  { id: 258, text: "Existe rastreabilidade das não conformidades identificadas no processamento?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C6", weight: 1 },
  { id: 259, text: "Existe protocolo para rastreamento de materiais em caso de falha de esterilização?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "C", category: "C6", weight: 1 },
  { id: 260, text: "Existe integração da rastreabilidade com sistemas hospitalares, quando aplicável?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "I", category: "I2", weight: 1 },
  { id: 261, text: "Existe análise de eventos relacionados à falha de rastreabilidade?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "I", category: "I1", weight: 1 },
  { id: 262, text: "Existe auditoria periódica do sistema ou processo de rastreabilidade?", module: "Rastreabilidade", submodule: "Rastreabilidade", layer: "I", category: "I3", weight: 1 },

  // =========================
  // QUALIDADE E ACREDITAÇÃO
  // =========================
  { id: 263, text: "Existe política institucional de qualidade formalmente aplicada à CME?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "C", category: "C1", weight: 1 },
  { id: 264, text: "A CME possui procedimentos operacionais padrão atualizados para processos críticos relacionados à acreditação?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "C", category: "C4", weight: 1 },
  { id: 265, text: "Os documentos da CME possuem versionamento, aprovação e controle formal de revisão?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "C", category: "C4", weight: 1 },
  { id: 266, text: "Existe organização formal de evidências para auditorias internas, externas ou processos de acreditação?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "C", category: "C4", weight: 1 },
  { id: 267, text: "Existe avaliação sistemática de riscos assistenciais e operacionais nos processos da CME?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "C", category: "C6", weight: 1 },
  { id: 268, text: "Eventos adversos, falhas de processo e quase falhas são registrados, analisados e tratados com plano de ação?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "C", category: "C6", weight: 1 },
  { id: 269, text: "A CME participa de ações institucionais relacionadas à segurança do paciente?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "C", category: "C6", weight: 1 },
  { id: 270, text: "Existe comunicação estruturada entre a CME e setores críticos como centro cirúrgico, endoscopia e unidades assistenciais?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "C", category: "C8", weight: 1 },
  { id: 271, text: "A equipe recebe treinamento periódico sobre qualidade, segurança do paciente e conformidade regulatória?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "P", category: "P1", weight: 1 },
  { id: 272, text: "Existe registro formal dos treinamentos, competências avaliadas e reciclagens da equipe?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "P", category: "P1", weight: 1 },
  { id: 273, text: "Novos colaboradores passam por integração estruturada antes de atuar de forma autônoma na CME?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "P", category: "P1", weight: 1 },
  { id: 274, text: "Existe plano de melhoria contínua da CME com prioridades, responsáveis e prazos definidos?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "I", category: "I1", weight: 1 },
  { id: 275, text: "As ações de melhoria implementadas são reavaliadas quanto à sua efetividade?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "I", category: "I1", weight: 1 },
  { id: 276, text: "A liderança da CME acompanha metas institucionais relacionadas à qualidade, segurança e eficiência operacional?", module: "Governança", submodule: "Qualidade e Acreditação", layer: "I", category: "I1", weight: 1 },
  { id: 277, text: "Existe rastreabilidade completa dos produtos para saúde processados na CME com possibilidade de recuperação rápida da informação?", module: "Rastreabilidade", submodule: "Qualidade e Acreditação", layer: "C", category: "C3", weight: 1 },
  { id: 278, text: "A rastreabilidade permite identificar carga, ciclo, equipamento, data, profissional responsável e destino do material?", module: "Rastreabilidade", submodule: "Qualidade e Acreditação", layer: "C", category: "C3", weight: 1 },
  { id: 279, text: "Há controle formal de não conformidades relacionadas à rastreabilidade, processamento e liberação de materiais?", module: "Rastreabilidade", submodule: "Qualidade e Acreditação", layer: "C", category: "C6", weight: 1 },
  { id: 280, text: "Existe mecanismo para localizar rapidamente materiais potencialmente envolvidos em eventos ou falhas de processo?", module: "Rastreabilidade", submodule: "Qualidade e Acreditação", layer: "C", category: "C6", weight: 1 },
  { id: 281, text: "A CME acompanha indicadores operacionais e de qualidade formalmente definidos para apoio à gestão?", module: "Indicadores", submodule: "Qualidade e Acreditação", layer: "P", category: "P5", weight: 1 },
  { id: 282, text: "Os resultados dos indicadores são analisados periodicamente pela liderança e utilizados em reuniões de desempenho?", module: "Indicadores", submodule: "Qualidade e Acreditação", layer: "P", category: "P5", weight: 1 },
  { id: 283, text: "Existe monitoramento documentado dos controles físicos, químicos e biológicos como evidência de conformidade dos processos de esterilização?", module: "Indicadores", submodule: "Qualidade e Acreditação", layer: "C", category: "C2", weight: 1 },
  { id: 284, text: "Desvios identificados em indicadores ou monitoramentos geram plano de ação com acompanhamento de efetividade?", module: "Indicadores", submodule: "Qualidade e Acreditação", layer: "I", category: "I3", weight: 1 }
];

// Confirmação de carregamento
console.log("✓ Arquivo questions.js carregado com sucesso");
console.log("✓ Total de perguntas: " + questions.length);

// Notificar que o script foi carregado
if (typeof updateLoadingProgress === "function") {
  updateLoadingProgress();
}

// --- CLASSIFICAÇÃO RDC15/2012 vs nãoRDC ---
const RDC15_MODULES = new Set([
  "Recepção",
  "Expurgo",
  "Limpeza",
  "Preparo",
  "Embalagem",
  "Esterilização",
  "Armazenamento",
  "Distribuição",
  "Governança",
  "Água",
  "Consignados",
  "Rastreabilidade",
  "Integração CC"
  "Qualidade e Acreditação"
]);

for (const q of questions) {
  q.text = String(q.text || "").trim();
  q.module = String(q.module || "").trim();
  q.submodule = String(q.submodule || q.module || "").trim();
  q.layer = String(q.layer || "").trim();
  q.category = String(q.category || "").trim();
  q.weight = Number(q.weight) > 0 ? Number(q.weight) : 1;
  q.norma = RDC15_MODULES.has(q.module) ? "RDC15/2012" : "nãoRDC";
}