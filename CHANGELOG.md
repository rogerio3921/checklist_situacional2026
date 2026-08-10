# Changelog

Todas as alterações notáveis neste projeto serão registradas aqui.

---

## [2.1.0] — 2026-08-10

### Corrigido
- **ERR_FILE_NOT_FOUND para `config.js`**: scripts agora carregam com `defer` e na ordem correta (`config.js` → `questions.js` → `app.js`), garantindo resolução correta via servidor HTTP local.
- **`ReferenceError: questions is not defined`**: adicionada verificação de guarda em `app.js` antes do uso de `questions`; `questions.js` agora expõe explicitamente `window.questions`.
- **`SyntaxError: Identifier 'STORAGE_KEYS' has already been declared`**: `STORAGE_KEYS` migrado para atribuição em `window.STORAGE_KEYS` com alias `var`, eliminando o erro de re-declaração em caso de duplo carregamento do script.

### Alterado
- `index.html`: ordem dos `<script>` ajustada e atributo `defer` adicionado.
- `app.js`: `const STORAGE_KEYS` substituído por padrão `window.STORAGE_KEYS || {...}` + `var STORAGE_KEYS`.
- `questions.js`: adicionado `window.questions = questions` para exposição global explícita.
- `README.md`: seção de uso local reescrita com instruções de servidor HTTP, estrutura de pastas e tabela de troubleshooting.

### Adicionado
- `CHANGELOG.md`: este arquivo.
- Mensagem de erro amigável ao usuário quando `questions` não está disponível ao iniciar o app.

### Removido
- Nenhum arquivo removido nesta versão.

---

## [2.0.0] — versão anterior

- Versão inicial com dashboard, pontuação por módulo e persistência localStorage.
