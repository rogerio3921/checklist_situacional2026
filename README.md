# NS CheckList Situacional CME

Aplicação web para diagnóstico situacional de Central de Material e Esterilização (CME), com preenchimento digital, dashboard de maturidade e geração de relatórios. Funciona inteiramente no navegador, sem backend obrigatório.

## Visão geral

O NS CheckList Situacional CME permite que profissionais de saúde realizem um diagnóstico rápido e estruturado da CME, respondendo a perguntas organizadas em módulos, visualizando o progresso e gerando relatórios para impressão ou exportação.

## Requisitos

- Navegador moderno: Chrome, Edge ou Firefox (versão atualizada)
- Servidor HTTP local para execução (ver instruções abaixo)
- Node.js 18+ (opcional, apenas para o backend experimental)

> **Importante:** Abrir o `index.html` diretamente via `file://` pode causar erros de carregamento de scripts em alguns navegadores. **Use sempre um servidor HTTP local.**

## Como rodar localmente

### Opção 1 — Python (sem instalação adicional)

```bash
# Na pasta raiz do projeto:
python3 -m http.server 8080
# Acesse: http://localhost:8080
```

### Opção 2 — Node.js (npx serve)

```bash
npx serve .
# Acesse o endereço exibido no terminal
```

### Opção 3 — VS Code Live Server

Instale a extensão **Live Server** no VS Code e clique em "Go Live" na barra de status.

## Estrutura de pastas

```
checklist_situacional2026/
├── index.html            Interface principal
├── config.js             Configuração de features opcionais
├── questions.js          Base de perguntas (módulos, pesos, orientações)
├── recommendations.js    Recomendações automáticas por resposta
├── app.js                Lógica principal do frontend
├── shared/
│   └── scoring.js        Funções de pontuação (referência compartilhada)
├── backend/              API Node.js opcional (fase futura)
│   ├── src/server.js
│   └── db/schema.sql
├── .github/workflows/
│   └── deploy-pages.yml  Deploy automático para GitHub Pages
├── README.md
├── CHANGELOG.md
└── DEPLOY_PHASE1.md
```

## Fluxo principal

1. **Identificação:** Preencha os dados da instituição e do avaliador.
2. **Questionário:** Responda as perguntas por módulo (Sim / Parcial / Não).
3. **Dashboard:** Acompanhe o progresso e os índices por camada em tempo real.
4. **Relatório:** Gere o relatório básico ou completo em nova janela, ou exporte em TXT.
5. **Impressão:** Imprima o questionário ou o relatório diretamente pelo navegador.

Os dados são salvos automaticamente no `localStorage` do navegador — sem necessidade de login ou conexão com servidor.

## Configuração do modo online (desativado por padrão)

```js
// config.js
window.CME_CONFIG = {
  enableOnline: false,
  apiBase: ""
};
```

Mantenha `enableOnline: false` para uso puramente local. O modo online será ativado quando o backend estiver configurado.

## Troubleshooting (erros comuns)

| Erro | Causa | Solução |
|------|-------|---------|
| `ERR_FILE_NOT_FOUND` para `config.js` ou outros scripts | Abertura via `file://` em vez de servidor HTTP | Use `python3 -m http.server 8080` e acesse via `http://localhost:8080` |
| `ReferenceError: questions is not defined` | `questions.js` não carregado antes de `app.js` | Verifique a ordem dos `<script>` em `index.html`: `config.js` → `questions.js` → `recommendations.js` → `app.js` |
| `SyntaxError: Identifier 'STORAGE_KEYS' has already been declared` | Arquivo `app.js` carregado mais de uma vez | Remova scripts duplicados em `index.html` |
| Dashboard mostra `-Infinity` ou `NaN` | Lista de perguntas vazia ou respostas corrompidas | Clique em "Limpar formulário" e reinicie o diagnóstico |
| Dados perdidos ao recarregar | `localStorage` desativado ou modo privado | Use o navegador em modo normal (não anônimo) |
| Relatório não abre | Popup bloqueado pelo navegador | Permita popups para `localhost` nas configurações do navegador |

## Publicação

O frontend é publicado automaticamente no **GitHub Pages** a cada push na branch `main` via `.github/workflows/deploy-pages.yml`.

Para publicação manual, veja [DEPLOY_PHASE1.md](DEPLOY_PHASE1.md).
