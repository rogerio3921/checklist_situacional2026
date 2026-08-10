# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.1.0] — 2026-08-10

### Corrigido
- **ERR_FILE_NOT_FOUND para `config.js`:** causado por abertura direta via `file://`; a solução recomendada é sempre usar um servidor HTTP local (ex.: `python3 -m http.server`). Documentado no README.
- **`ReferenceError: questions is not defined`:** corrigida a ordem de carregamento dos scripts em `index.html` — `config.js` é carregado antes de `questions.js`, e ambos antes de `app.js`.
- **`SyntaxError: Identifier 'STORAGE_KEYS' has already been declared`:** eliminado carregamento duplicado de `app.js`; `STORAGE_KEYS` agora é declarado apenas uma vez.
- **`-Infinity` / `NaN` no dashboard:** guards existentes em `computeStats` confirmados e documentados; adição de proteção para divisão por zero em todos os cálculos de percentual.

### Adicionado
- `recommendations.js` adicionado à sequência de scripts em `index.html` (já estava no fluxo de deploy, mas ausente no carregamento da página).
- `CHANGELOG.md` criado com histórico de versões.
- **README** completamente reescrito com: visão geral, requisitos, instruções de execução local (Python, npx serve, VS Code Live Server), estrutura de pastas, fluxo principal, configuração do modo online e tabela de troubleshooting.

### Alterado
- Ordem dos `<script>` em `index.html`: `config.js` → `questions.js` → `recommendations.js` → `app.js` (ordem determinística e explícita).
- README atualizado para orientar uso via servidor HTTP local em vez de `file://`.

### Removido
- Instrução incorreta de "Abra index.html no navegador" sem mencionar servidor HTTP — substituída por instruções corretas de execução local.

---

## [1.0.0] — 2026-07-01 (baseline)

### Adicionado
- MVP offline: formulário de diagnóstico situacional, dashboard de maturidade, export TXT, impressão.
- Gerenciamento de perguntas (CRUD) com persistência em `localStorage`.
- Relatório básico e completo em nova janela.
- Exibição de criticidade sugerida por pergunta.
- Modal de legenda das categorias.
- Deploy automático via GitHub Pages (`.github/workflows/deploy-pages.yml`).
- Backend Node.js opcional (fase futura) em `backend/`.
