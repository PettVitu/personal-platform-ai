<div align="center">

# personal platform AI

**Organizador pessoal privado — tarefas, finanças, agenda, documentos e um conselheiro de investimentos.**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)](#estado-atual)

</div>

---

## Sobre

O **personal platform AI** é um app pessoal — pensado para uso privado, mobile-first — que reúne organização do dia a dia (tarefas, agenda, finanças básicas, documentos) e um módulo público de análise de investimentos que combina dados de mercado, notícias e um scoring auditável.

Não é um banco, não é um consultor financeiro certificado e não promete retorno. Cada módulo deixa isso explícito na própria interface.

## Módulos

| Módulo | O que faz | Estado |
|---|---|---|
| **Hoje** | Visão do dia: prioridade, resumo financeiro, próximos compromissos | ✅ funcional |
| **Tarefas** | Criar, concluir, reabrir e excluir, com prioridade e horário | ✅ funcional |
| **Finanças** | Lançamentos e contas recorrentes — registra fatos, não dá conselho | ✅ funcional |
| **Investimentos** | Sugestões de ações e FIIs BR com fundamentos + notícias, sem executar ordens | ✅ funcional (dados reais opcionais) |
| **Agenda** | Compromissos manuais | ✅ funcional |
| **Documentos** | Notas textuais com controle de acesso da IA | ✅ funcional |
| **Amarildo** | Assistente de IA | 🧪 simulação local, sem chamada real |
| **Planilha** | Visão tabular de tarefas, lançamentos e contas | ✅ funcional |

## Conselheiro de investimentos

O módulo mais novo: pontua ações e FIIs brasileiros combinando **fundamentos** (dividend yield, P/L, via [Brapi](https://brapi.dev)) e **sentimento de notícia** (via [Marketaux](https://www.marketaux.com)), com uma explicação em texto para cada score.

- Sem execução de ordens — é só informativo, a decisão é sempre do usuário.
- Sem as chaves de API configuradas, cai automaticamente em dados demonstrativos e avisa isso na tela.
- Cada rodada de sugestões fica registrada num histórico (em memória, por enquanto), para futuramente comparar o score com o retorno real.

Trading automatizado (ex.: execução via Binance) foi deliberadamente deixado fora deste repositório — é um projeto futuro, separado e privado. Detalhes em [`docs/09-investimentos-e-harness.md`](docs/09-investimentos-e-harness.md).

## Como rodar

```powershell
npm.cmd install
npm.cmd run dev
```

Abra [`http://localhost:3000`](http://localhost:3000).

Para dados reais no conselheiro de investimentos, copie `.env.example` para `.env.local` e preencha:

```
BRAPI_TOKEN=
MARKETAUX_API_KEY=
```

### Scripts

| Comando | O que faz |
|---|---|
| `npm.cmd run dev` | Sobe o servidor de desenvolvimento |
| `npm.cmd run build` | Build de produção (também valida tipos) |
| `npm.cmd run start` | Roda o build de produção |
| `npm.cmd run lint` | Lint do projeto |
| `npm.cmd run test:e2e` | Testes end-to-end com Playwright |

## API local

| Rota | Descrição |
|---|---|
| `GET /api/health` | Status da API |
| `GET\|POST /api/tasks`, `PATCH\|DELETE /api/tasks/:id` | Tarefas |
| `GET\|POST /api/transactions`, `PATCH\|DELETE /api/transactions/:id` | Lançamentos financeiros |
| `GET\|POST /api/bills`, `PATCH\|DELETE /api/bills/:id` | Contas recorrentes |
| `GET /api/investments/suggestions` | Sugestões de ações/FIIs com score |
| `GET /api/investments/history` | Histórico recente de sugestões geradas |

## Arquitetura

```
src/
├─ domain/        tipos, dados iniciais, contratos de API e persistência local
├─ components/    shell, navegação e módulos de produto (uma view por aba)
├─ app/           rotas do Next.js — páginas e endpoints de API
└─ server/        adaptadores de dados no servidor (store local, investimentos)
```

## Estado atual

Frontend funcional em Next.js. Tarefas, finanças, agenda e documentos persistem em `localStorage`; a API local usa memória de processo. Ainda não há banco definitivo, autenticação, sincronização entre dispositivos ou chamada real de IA — o Amarildo é uma simulação transparente.

Todas as decisões de escopo, princípios e limitações estão documentadas em [`docs/`](docs/README.md).

## Princípios

- privacidade por padrão, mobile-first, simplicidade antes de quantidade de recursos;
- fatos separados de sugestões — o módulo financeiro nunca dá conselho, o de investimentos sempre deixa claro que é sugestão;
- nenhuma ação destrutiva sem confirmação;
- funcionamento útil mesmo sem IA.

## Próxima etapa

Substituir os adaptadores locais (`localStorage`, API em memória) por persistência real com autenticação, mantendo os tipos e contratos de domínio independentes da interface.
