# 00 — Prompt de continuidade

Cole isto (ou aponte pra este arquivo) no início de uma sessão nova quando a anterior perder contexto. Escrito pra alguém — humano ou IA — que nunca viu esse projeto antes.

## O que é este projeto

**personal platform AI**: app pessoal privado (Next.js 15, App Router) com tarefas, finanças básicas, agenda, documentos — e um módulo à parte, o **conselheiro de investimentos**, que sugere ações e FIIs brasileiros com scoring auditável (fundamentos + notícia), sem executar ordem nenhuma. Um projeto futuro e separado (Binance/trading) foi deliberadamente adiado — **não mexer nisso ainda**, só quando pedido explicitamente.

**Comece sempre por [`docs/10-visao-final-do-produto.md`](10-visao-final-do-produto.md)** — é o checklist vivo de o que está pronto e o que falta, por módulo. Este arquivo aqui (00) é só o "resumo pra não travar" antes de abrir aquele.

## Estado em 2026-08-26 (fim da última sessão)

Produção no ar em **https://personal-platform-ai.vercel.app**, funcionando de ponta a ponta:
- banco Postgres real (Supabase), autenticação Google real (Auth.js v5), tudo persistido e isolado por usuário;
- conselheiro de investimentos com dados reais (Brapi + Marketaux) e watchlist configurável por usuário;
- suíte E2E (Playwright) consertada e com testes de isolamento entre usuários, 8/8 passando.

Fluxo de branch: **`homolog`** é onde o trabalho acontece; **`main`** é o que a Vercel realmente faz deploy (produção). Depois de cada mudança validada em `homolog`, faz-se `git checkout main && git merge --ff-only origin/homolog && git push origin main && git checkout homolog`. Isso é rotina, já foi feito várias vezes — repita o padrão.

## Stack e decisões que não são óbvias (não redescubra do zero)

- **Prisma 6.19.3, não 7.x** — a v7 mudou a config do `datasource` de um jeito incompatível com `@auth/prisma-adapter` no momento em que isso foi decidido. Se for atualizar, teste a fundo antes.
- **Sessão do Auth.js é `jwt`, não `database`** — o middleware roda em Edge runtime, e o Prisma padrão não abre conexão TCP lá.
- **`src/auth.config.ts` (leve, sem Prisma) vs `src/auth.ts` (completo, com adapter)** — o middleware importa só o `auth.config.ts`. Importar o `auth.ts` completo no middleware estourou o limite de 1MB de Edge Function da Vercel (aconteceu de verdade, não é teoria).
- **Prisma CLI e `playwright test` não leem `.env.local` sozinhos** — os scripts `db:push`, `db:migrate`, `db:studio` e `test:e2e` no `package.json` já vêm envolvidos em `dotenv-cli` por causa disso. Não tire isso achando que é redundante.
- **`DATABASE_URL` em produção precisa ser o pooler do Supabase** (porta 6543, `aws-0-<região>.pooler.supabase.com`), nunca a conexão direta (porta 5432, `db.<ref>.supabase.co` — IPv6-only, a Vercel não alcança). `DIRECT_URL` (só usada por `prisma migrate`) pode continuar sendo a direta. Local (`.env.local`) usa a direta pras duas, funciona bem pra dev.
- **Framework Preset do projeto na Vercel precisa estar em "Next.js"**, não "Other" — já aconteceu de estar errado e o build não rodar de verdade (ficava "Ready" em poucos segundos sem buildar nada).
- **Playwright: `request.newContext()` chamado de dentro de um teste herda o `storageState` do projeto** (a sessão logada do setup) a menos que você passe `storageState: { cookies: [], origins: [] }` explicitamente. Gotcha real, já mordeu um teste de "usuário anônimo" que não era anônimo.
- **Provider `test-credentials`** (`src/auth.ts`) só existe fora de produção e com `E2E_TEST_AUTH_SECRET` setado — é assim que os testes E2E logam sem precisar de conta Google de verdade. Nunca configurar essa env var na Vercel.
- **Investimentos ficam abertos (`/api/investments/*`) sem exigir login no middleware** — não expõem dado pessoal por padrão (usam a watchlist padrão quando não há sessão), mas personalizam quando há. Editar a watchlist (POST/DELETE) exige login mesmo assim.

## Credenciais

Já configuradas em `.env.local` (local) e nas Environment Variables do projeto na Vercel (produção) — **não precisa pedir de novo ao usuário**: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `BRAPI_TOKEN`, `MARKETAUX_API_KEY`. Ver `.env.example` pra saber o que cada uma faz. Se algo parecer não estar configurado, pergunte antes de assumir — não foi documentado o valor delas aqui de propósito (são segredos).

## Próximos passos (nessa ordem, salvo pedido em contrário)

Ver checklist completo em `docs/10-visao-final-do-produto.md`, seção "Ordem recomendada". Resumo do que falta:

1. Rate limiting e exportação/exclusão de dados verificável (LGPD).
2. Testes automatizados de domínio além dos E2E.
3. Acessibilidade auditada.
4. Comparação automática entre score do histórico de investimentos e retorno real observado depois.
5. IA real (Amarildo e explicação do conselheiro via LLM) — mantendo sempre a regra: IA explica, nunca calcula número.
6. Harness de trading (Binance) — repositório novo, separado e privado. Só começar se pedido explicitamente.

## Como trabalhar aqui

- Sempre rodar `npm run build` (e, se mexeu em API/auth/testes, `npm run test:e2e`) antes de considerar algo pronto.
- Depois de validar em `homolog`, sincronizar `main` (ver comando acima) pra refletir em produção.
- Nunca commitar `.env.local` nem qualquer arquivo com segredo solto na pasta (já aconteceu um `client_secret_*.json` do Google cair na raiz do projeto — foi removido, mas fique atento).
- Ao debugar produção, dá pra usar o Vercel CLI com um token de acesso pessoal do usuário (peça se precisar) — `vercel logs <url> --token <token>` mostra os logs de runtime, incluindo erros do Auth.js/Prisma que não aparecem em lugar nenhum além disso.
