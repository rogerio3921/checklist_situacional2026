# NS CheckList Situacional CME

Aplicacao web para diagnostico situacional de CME, com preenchimento digital, dashboard de maturidade e geracao de relatorios.

## Estrutura

- [index.html](index.html): interface principal
- [app.js](app.js): logica do frontend
- [questions.js](questions.js): base de perguntas
- [recommendations.js](recommendations.js): recomendacoes automaticas
- [config.js](config.js): configuracao de recursos opcionais
- [backend/src/server.js](backend/src/server.js): API Node.js opcional para fase futura

## Uso local

Frontend:

1. Abra [index.html](index.html) no navegador.

O fluxo principal atual e local:

1. preencher a avaliacao no navegador
2. visualizar dashboard e relatorios
3. imprimir ou exportar o resultado

## Publicacao recomendada

- frontend: GitHub Pages
- backend: opcional, para fase futura

Guia resumido em [DEPLOY_PHASE1.md](DEPLOY_PHASE1.md).

## Configuracao do modo online

Nesta fase, o recomendado e manter o modo online desligado:

window.CME_CONFIG = {
	enableOnline: false,
	apiBase: ""
};

## Observacao importante

Os relatorios e o dashboard funcionam sem backend. A sincronizacao online pode ser reativada depois, quando houver necessidade de armazenamento centralizado.
