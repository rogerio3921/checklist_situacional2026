# Fase 1 - Backend minimo (online)

Este backend foi adicionado sem alterar o app atual (HTML + JS offline).
As regras de calculo foram espelhadas em `../shared/scoring.js`.

## O que existe nesta fase

- API minima com Express
- Endpoint de health
- Endpoint para calcular resultado com as mesmas regras atuais
- Endpoint para salvar avaliacao em SQLite
- Esquema SQL inicial em `db/schema.sql`

## Rotas

- `GET /api/v1/health`
- `POST /api/v1/calculate`
- `POST /api/v1/assessments`
- `GET /api/v1/assessments`
- `GET /api/v1/assessments/:id`

## Rodar local

```bash
cd backend
npm install
npm run dev
```

API em: `http://localhost:3001`

## Publicar no Render

O repositorio possui o arquivo [render.yaml](../render.yaml) com a configuracao inicial do servico.

Pontos importantes no Render:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/v1/health`
- Disk persistente montado para o SQLite

Variaveis principais:

- `ALLOWED_ORIGINS`: origin do frontend publicado no GitHub Pages
- `DB_PATH`: `/opt/render/project/src/backend/data/cme_checklist.db`

## Exemplo rapido de calculo

`POST /api/v1/calculate`

```json
{
  "questions": [
    { "id": 1, "module": "Recepcao", "layer": "C", "weight": 1, "norma": "RDC15/2012" },
    { "id": 2, "module": "Recepcao", "layer": "P", "weight": 1, "norma": "naoRDC" }
  ],
  "answersById": {
    "1": { "value": "sim" },
    "2": { "value": "parcial" }
  }
}
```

## Observacao

Nesta fase, a persistencia usa SQLite. Para piloto funciona bem, mas para escala maior o proximo passo recomendado e migrar para PostgreSQL.
