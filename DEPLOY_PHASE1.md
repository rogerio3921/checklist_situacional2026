# Deploy Fase 1

Este projeto ja esta preparado para uma primeira publicacao com frontend estatico e backend Node.js separado.

## Objetivo da Fase 1

Permitir que o usuario acesse o checklist por link externo, preencha a avaliacao, sincronize com a API e gere os relatorios no navegador.

## Arquitetura recomendada

- frontend estatico: GitHub Pages
- backend Node.js: Render
- banco inicial: SQLite

## 1. Publicar o backend no Render

Pasta: backend

Se quiser evitar configuracao manual repetitiva, o repositorio agora inclui o blueprint [render.yaml](render.yaml).

### Variaveis de ambiente

Use como base o arquivo [backend/.env.example](backend/.env.example).

Variaveis:

- PORT: porta do servico
- ALLOWED_ORIGINS: lista de origens permitidas separadas por virgula
- DB_PATH: caminho do arquivo SQLite

### Configuracao sugerida no Render

- Root Directory: backend
- Build Command: npm install
- Start Command: npm start
- Environment: Node
- Health Check Path: /api/v1/health

### Opcao A - Criar pelo blueprint render.yaml

1. No Render, clique em New +.
2. Escolha Blueprint.
3. Conecte este repositorio.
4. O Render vai ler [render.yaml](render.yaml) automaticamente.
5. Preencha apenas a variavel ALLOWED_ORIGINS com a URL final do GitHub Pages.

O blueprint ja define:

- servico web Node
- rootDir como backend
- health check
- disco persistente para SQLite
- caminho do banco em DB_PATH

### Opcao B - Criar manualmente

Se preferir criar sem blueprint, use os mesmos campos abaixo.

Defina ALLOWED_ORIGINS com a URL final do GitHub Pages.

Exemplo:

ALLOWED_ORIGINS=https://rogerio3921.github.io/checklist_situacional2026

Para DB_PATH, use:

DB_PATH=/opt/render/project/src/backend/data/cme_checklist.db

Observacao: se for manter SQLite em producao de piloto, use disco persistente no Render. Sem isso, os dados podem ser perdidos em reinicios.

### Comandos

Instalacao:

npm.cmd install

Execucao local:

npm.cmd start

### Endpoints principais

- GET /api/v1/health
- POST /api/v1/assessments
- GET /api/v1/assessments
- GET /api/v1/assessments/:id

## 2. Publicar o frontend no GitHub Pages

Arquivos principais:

- [index.html](index.html)
- [app.js](app.js)
- [questions.js](questions.js)
- [recommendations.js](recommendations.js)
- [config.js](config.js)
- [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)

Antes do deploy final, edite [config.js](config.js) com a URL publica da API.

Exemplo:

window.CME_CONFIG = {
  apiBase: "https://seu-backend.onrender.com/api/v1"
};

### Como habilitar o GitHub Pages

1. Envie este projeto para a branch main.
2. No repositorio do GitHub, abra Settings > Pages.
3. Em Source, selecione GitHub Actions.
4. O workflow [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) fara o deploy automatico a cada push na main.

A URL esperada sera semelhante a:

https://rogerio3921.github.io/checklist_situacional2026

## 3. Teste minimo de ponta a ponta

Antes do teste, atualize [config.js](config.js) com a URL publica do backend no Render e faca novo push para o GitHub.

1. Abrir o link publico do frontend.
2. Preencher identificacao da instituicao.
3. Responder algumas perguntas.
4. Clicar em Salvar online.
5. Confirmar retorno positivo no status online.
6. Abrir o dashboard.
7. Gerar relatorio basico e relatorio completo.
8. Testar Carregar ultimo online.

## 4. Limitacoes desta fase

- sem autenticacao
- sem controle por usuario
- sem segregacao por instituicao
- relatorios ainda gerados no navegador
- SQLite serve para piloto, nao para escala maior

## 5. Proxima fase recomendada

Depois desta fase, o passo seguinte e:

- autenticacao
- banco PostgreSQL
- historico por instituicao
- exportacao PDF mais robusta
- seguranca da API
