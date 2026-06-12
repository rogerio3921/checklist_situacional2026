# NS CheckList Situacional CME

Aplicacao web para diagnostico situacional de CME, com preenchimento digital, dashboard de maturidade e geracao de relatorios.

## Estrutura

- [index.html](index.html): interface principal
- [app.js](app.js): logica do frontend
- [questions.js](questions.js): base de perguntas
- [recommendations.js](recommendations.js): recomendacoes automaticas
- [config.js](config.js): configuracao da URL da API
- [backend/src/server.js](backend/src/server.js): API Node.js

## Uso local

Frontend:

1. Abra [index.html](index.html) no navegador.

Backend:

1. Entre na pasta backend.
2. Rode npm.cmd install.
3. Rode npm.cmd start.

Em ambiente local, se [config.js](config.js) estiver vazio, o frontend usa automaticamente http://localhost:3001/api/v1.

## Publicacao recomendada

- frontend: GitHub Pages
- backend: Render

Guia resumido em [DEPLOY_PHASE1.md](DEPLOY_PHASE1.md).

## Configuracao da API publica

Depois de publicar o backend, edite [config.js](config.js) assim:

window.CME_CONFIG = {
	apiBase: "https://seu-backend.onrender.com/api/v1"
};

## Observacao importante

Se [config.js](config.js) estiver sem URL publica, os botoes online ficam desabilitados fora do ambiente local.
