# personal platform AI

Aplicativo pessoal privado para organizar tarefas, compromissos, finanças básicas e documentos textuais.

## Estado atual

Esta primeira entrega é um frontend funcional em Next.js com persistência local via `localStorage`. Os dados são demonstrativos na primeira execução e permanecem neste dispositivo depois das alterações.

O Amarildo e a reformulação de textos são demonstrações locais. A API local já existe, mas usa memória do processo; ainda não há banco persistente, autenticação, sincronização, importação de arquivos ou chamada real de IA.

## Executar

```powershell
npm.cmd install
npm.cmd run dev
```

Abra `http://localhost:3000`.

Endpoints locais:

- `GET /api/health`
- `GET|POST /api/tasks`
- `PATCH|DELETE /api/tasks/:id`
- `GET|POST /api/transactions`
- `PATCH|DELETE /api/transactions/:id`
- `GET|POST /api/bills`
- `PATCH|DELETE /api/bills/:id`
- `GET /api/investments/suggestions`

O conselheiro de investimentos (aba "Investimentos") sugere ações e FIIs brasileiros com base em fundamentos e notícias. Sem as variáveis `BRAPI_TOKEN` e `MARKETAUX_API_KEY` (ver `.env.example`), ele usa dados demonstrativos e sinaliza isso na interface. Não executa ordens — é só informativo.

Para validar produção:

```powershell
npm.cmd run build
```

## Arquitetura

- `src/domain`: tipos, dados iniciais e persistência.
- `src/components`: shell, navegação e módulos de produto.
- `src/app`: entrada do aplicativo e metadata.
- `public`: manifest e service worker.

## Próxima etapa

Substituir o adaptador de `localStorage` por uma API autenticada, mantendo os tipos e contratos de domínio independentes da interface.
