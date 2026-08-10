# NS CheckList Situacional CME

Aplicação web para diagnóstico situacional de CME, com preenchimento digital, dashboard de maturidade e geração de relatórios.

## Requisitos

- Navegador moderno (Chrome, Edge ou Firefox atuais)
- Servidor HTTP local para execução (não abrir via `file://`)

## Como rodar localmente

**Passo 1 — Clone o repositório:**
```bash
git clone https://github.com/rogerio3921/checklist_situacional2026.git
cd checklist_situacional2026
```

**Passo 2 — Inicie um servidor HTTP local:**

Opção A — Python:
```bash
python -m http.server 8000
```

Opção B — Node.js:
```bash
npx serve .
```

Opção C — VS Code: use a extensão **Live Server** e abra `index.html` por ela.

**Passo 3 — Acesse no navegador:**
```
http://localhost:8000
```

> ⚠️ Não abra o `index.html` diretamente como arquivo (`file://`). Scripts relativos podem falhar nesse modo.

## Estrutura de pastas

```
checklist_situacional2026/
├── index.html          # Interface principal
├── app.js              # Lógica do frontend
├── questions.js        # Base de perguntas (266 itens)
├── config.js           # Configuração de recursos opcionais
├── recommendations.js  # Recomendações automáticas
├── backend/            # API Node.js (opcional, fase futura)
└── README.md
```

## Fluxo principal

1. Preencher identificação da instituição
2. Responder o diagnóstico (Sim / Parcial / Não)
3. Visualizar o dashboard de maturidade por módulo
4. Imprimir ou exportar o resultado em TXT

## Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `ERR_FILE_NOT_FOUND` para `config.js` | Abertura via `file://` | Use servidor HTTP local |
| `ReferenceError: questions is not defined` | `questions.js` não carregou | Serve via HTTP; verifique o console |
| `SyntaxError: STORAGE_KEYS already declared` | `app.js` incluído duas vezes | Limpe o cache do navegador; recarregue |

## Publicação recomendada

- **Frontend:** GitHub Pages (automático via workflow `.github/workflows/deploy-pages.yml`)
- **Backend:** opcional, para fase futura

## Configuração do modo online

```js
// config.js
window.CME_CONFIG = {
  enableOnline: false,
  apiBase: ""
};
```

Mantenha `enableOnline: false` enquanto o backend não estiver disponível.
