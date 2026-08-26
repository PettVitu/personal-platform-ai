<div align="center">

# personal platform AI

**Organizador pessoal privado — tarefas, finanças, agenda, documentos e um conselheiro de investimentos.**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-Postgres-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Auth.js](https://img.shields.io/badge/Auth.js-Google-000000?logo=auth0&logoColor=white)](https://authjs.dev)
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

O app exige login (Google) e um banco Postgres — copie `.env.example` para `.env.local` e preencha antes do primeiro `dev`:

```
DATABASE_URL=       # connection pooler do Supabase (porta 6543, com ?pgbouncer=true)
DIRECT_URL=         # conexão direta do Supabase (porta 5432), só para migrations
AUTH_SECRET=        # gere com `npx auth secret`
AUTH_GOOGLE_ID=      # client OAuth em console.cloud.google.com/apis/credentials
AUTH_GOOGLE_SECRET=
```

No client OAuth do Google, configure o redirect URI `http://localhost:3000/api/auth/callback/google` (ajuste o domínio em produção).

```powershell
npm.cmd install
npm.cmd run db:push   # cria as tabelas no banco a partir do prisma/schema.prisma
npm.cmd run dev
```

Abra [`http://localhost:3000`](http://localhost:3000) — você será redirecionado para login com Google antes de ver qualquer dado.

Para dados reais no conselheiro de investimentos (opcional — sem isso ele usa dados demonstrativos), adicione também:

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
| `npm.cmd run db:push` | Aplica o schema Prisma no banco (dev rápido, sem migration versionada) |
| `npm.cmd run db:migrate` | Cria uma migration versionada |
| `npm.cmd run db:studio` | Abre o Prisma Studio para inspecionar os dados |

## API

Todas as rotas abaixo, exceto `/api/health` e `/api/investments/*`, exigem sessão (Google) — sem ela respondem `401`.

| Rota | Descrição |
|---|---|
| `GET /api/health` | Status da API (persistência e autenticação configuradas ou não) |
| `GET\|POST /api/tasks`, `PATCH\|DELETE /api/tasks/:id` | Tarefas do usuário logado |
| `GET\|POST /api/transactions`, `PATCH\|DELETE /api/transactions/:id` | Lançamentos financeiros do usuário logado |
| `GET\|POST /api/bills`, `PATCH\|DELETE /api/bills/:id` | Contas recorrentes do usuário logado |
| `GET /api/investments/suggestions` | Sugestões de ações/FIIs com score (dado público, sem login) |
| `GET /api/investments/history` | Histórico recente de sugestões geradas (dado público, sem login) |
| `GET\|POST /api/auth/*` | Rotas do Auth.js (login, callback, logout) |

## Arquitetura

```
src/
├─ domain/        tipos, dados iniciais, contratos de API e persistência local (fallback offline)
├─ components/    shell, navegação e módulos de produto (uma view por aba)
├─ app/           rotas do Next.js — páginas e endpoints de API
├─ server/        Prisma client, autenticação (helper de sessão) e adaptadores de investimentos
├─ auth.ts        configuração do Auth.js (provider Google, sessão em banco)
└─ middleware.ts  protege páginas e rotas de API atrás de login
prisma/
└─ schema.prisma  modelos de usuário/sessão (Auth.js) e de domínio (tarefas, finanças, etc.)
```

## Estado atual

Frontend funcional em Next.js. Tarefas, finanças, agenda, documentos e o histórico do conselheiro persistem em Postgres via Prisma, isolados por usuário autenticado via Google. O código está pronto; falta uma instância real de banco (Supabase) e um client OAuth (Google Cloud) configurados via `.env.local` para rodar de ponta a ponta — sem isso, o app fica preso na tela de login. Ainda não há chamada real de IA — o Amarildo é uma simulação transparente.

Todas as decisões de escopo, princípios e limitações estão documentadas em [`docs/`](docs/README.md) — comece por [`docs/10-visao-final-do-produto.md`](docs/10-visao-final-do-produto.md) para o checklist do que falta em cada módulo.

## Princípios

- privacidade por padrão, mobile-first, simplicidade antes de quantidade de recursos;
- fatos separados de sugestões — o módulo financeiro nunca dá conselho, o de investimentos sempre deixa claro que é sugestão;
- nenhuma ação destrutiva sem confirmação;
- funcionamento útil mesmo sem IA.

## Próxima etapa

Configurar as credenciais reais (Supabase + Google OAuth) para validar login e persistência de ponta a ponta; depois, watchlist configurável no conselheiro e IA real no Amarildo.
