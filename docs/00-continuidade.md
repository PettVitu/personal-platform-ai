# 00 — Prompt de continuidade

Cole isto (ou aponte pra este arquivo) no início de uma sessão nova quando a anterior perder contexto. Escrito pra alguém — humano ou IA — que nunca viu esse projeto antes.

## O que é este projeto

**personal platform AI**: app pessoal privado (Next.js 15, App Router) com tarefas, finanças básicas, agenda, documentos — e um módulo à parte, o **conselheiro de investimentos**, que sugere ações e FIIs brasileiros com scoring auditável (fundamentos + notícia), sem executar ordem nenhuma. Um projeto futuro e separado (Binance/trading) foi deliberadamente adiado — **não mexer nisso ainda**, só quando pedido explicitamente.

**Comece sempre por [`docs/10-visao-final-do-produto.md`](10-visao-final-do-produto.md)** — é o checklist vivo de o que está pronto e o que falta, por módulo. Este arquivo aqui (00) é só o "resumo pra não travar" antes de abrir aquele.

## Estado em 2026-08-26 (fim da última sessão)

Produção no ar em **https://personal-platform-ai.vercel.app**, funcionando de ponta a ponta:
- banco Postgres real (Supabase), autenticação Google real (Auth.js v5), tudo persistido e isolado por usuário;
- conselheiro de investimentos com dados reais (Brapi + Marketaux), watchlist configurável por usuário, comparação automática entre score passado e retorno real, e uma análise estatística (Apriori) que acha padrões nesse histórico assim que houver volume suficiente;
- rate limiting em todas as rotas de API, exportação/exclusão de dados (LGPD) pelo próprio usuário, acessibilidade auditada;
- Finanças ganhou um controle de orçamento diário (categorias de gasto pré-cadastradas + "quanto dá pra gastar hoje", zerando por dia);
- suíte E2E (Playwright, 8/8) e testes de domínio (Vitest, `npm run test:unit`) passando.

Todo o trabalho desta sessão (26/08) ficou só em `homolog` — o usuário pediu explicitamente pra não sincronizar com `main`/produção ainda, quer validar tudo antes. **Não sincronize `main` sem pedido explícito desta vez** — isso quebra o padrão de sessões anteriores, mas é o que foi pedido.

IA real (LLM) foi cogitada e **adiada por decisão de custo** — ver seção própria mais abaixo e em [09](09-investimentos-e-harness.md#decisão-sem-llmagente-conversacional-por-agora). Não é um item esquecido, foi decidido não fazer por ora.

Fluxo de branch (retomar quando o usuário pedir para ir a produção): **`homolog`** é onde o trabalho acontece; **`main`** é o que a Vercel realmente faz deploy. `git checkout main && git merge --ff-only origin/homolog && git push origin main && git checkout homolog`.

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
- **Rate limiting é feito no Postgres, não em Redis/KV** — não há Redis configurado no projeto, e o middleware roda em Edge (onde o Prisma não conecta), então o limite é aplicado dentro de cada route handler via `src/server/rate-limit.ts`, chamando `rateLimit(request, escopo, { limit, windowMs, userId })` logo após o `getUserId()`. Usa "fixed window": a janela de tempo fica embutida na própria chave (`escopo:identificador:inícioDaJanela`), então cada linha é gravada uma única vez por identificador+janela — um `upsert` atômico basta, sem corrida de leitura-e-reset. Linhas velhas são varridas probabilisticamente (2% das chamadas) em vez de precisar de um cron job. Identificador é o `userId` quando logado, IP (`x-forwarded-for`) quando anônimo.
- **Exportação/exclusão de dados (LGPD)**: `GET /api/account/export` (baixa um JSON com tudo do usuário) e `DELETE /api/account` (apaga o usuário; cascata pelo schema cuida do resto). UI em Mais → Privacidade e dados (`src/components/MoreView.tsx`). Como a sessão é JWT, ela some só quando expira — por isso `DELETE /api/account` usa `deleteMany` (idempotente) em vez de `delete`, senão um segundo clique com a mesma sessão (usuário já apagado) estoura erro do Prisma em vez de responder 204.
- **`styles.css` é um arquivo único minificado numa linha só** (não é gerado, é escrito assim de propósito) — `src/app/overrides.css` complementa com CSS não-minificado por seção. A auditoria de acessibilidade achou `--line`, `--positive`, `--negative` usados em `overrides.css` (bordas e cores da Planilha, do histórico de investimentos e da watchlist) mas nunca definidos em `:root` — renderizavam sem cor/borda silenciosamente, sem erro nenhum. Foram mapeados pra `--border`/`--success`/`--danger` respectivamente. `--muted` e `--warning` também foram escurecidos porque não batiam o contraste mínimo AA (4.5:1) contra o fundo.
- **Controle de orçamento diário (Finanças)** — `src/domain/daily-budget.ts` é uma função pura (`computeDailyBudget`) que calcula quanto dá pra gastar hoje: `(saldo atual + receitas futuras do mês − contas não pagas do mês − categorias de gasto proporcionais aos dias restantes) / dias restantes no mês`. Zera todo dia de propósito (não acumula sobra) — é um freio, decisão explícita do usuário, não esqueci de implementar rollover. `BudgetCategory` é um model novo (Postgres) só com nome + valor mensal estimado, pra gasto do tipo "transporte/lazer/futilidades" que normalmente não vira lançamento individual. Fora de escopo de propósito (backlog, não esquecido): visualização "farol" colorido por dia, projeção de longo prazo (até 2 anos), e parcelamento/recorrência dentro de `RecurringBill` (cartão parcelado × único × recorrente indefinido) — isso último fazia parte do pedido original mas não foi reconfirmado nas rodadas de esclarecimento, então ficou de fora desta entrega.
- **Sem LLM/agente conversacional por decisão de custo (2026-08-26)** — cogitou-se um "agente conselheiro" com IA real (LLM narrando explicação, ou chat tipo Amarildo respondendo sobre investimentos). O usuário decidiu adiar: chamar API de LLM em produção cobra por token, e a assinatura do Claude.ai (Pro/Max) **não** dá créditos de API pra plugar num app próprio — precisaria de uma `ANTHROPIC_API_KEY` paga à parte, e o usuário preferiu não gastar nisso agora. Em vez disso, o conselheiro ganhou um componente estatístico determinístico: Apriori (regras de associação) sobre `InvestmentHistoryEntry` avaliado, sem depender de nenhuma API paga. Ver decisão completa em [09](09-investimentos-e-harness.md#decisão-sem-llmagente-conversacional-por-agora) e [05](05-ia-e-prompts.md#ia-no-conselheiro-de-investimentos). Se o usuário topar pagar por API no futuro, isso pode voltar — não foi descartado, só adiado.
- **Comparação score x retorno real é avaliada de forma preguiçosa (lazy), sem cron** — não há infra de job agendado no projeto (é Vercel serverless), então `getHistory()` (`src/server/investments/history.ts`), toda vez que é chamado, verifica se há entradas reais (`demo:false`) com 7+ dias e ainda sem `evaluatedAt`; se houver, busca o preço atual na Brapi e grava `realizedReturnPct`. Só acontece de fato quando alguém abre a tela de Investimentos — pode demorar até a próxima visita depois dos 7 dias, o que é aceitável pra um app pessoal. Entradas demo nunca são avaliadas (preço demonstrativo é estático, retorno seria sempre zero).
- **Testes de domínio são Vitest (`npm run test:unit`), separados do Playwright (`npm run test:e2e`)** — ficam em `tests/unit/*.test.ts`. Gotcha real: o `testMatch` padrão do Playwright já casa com `*.test.ts`, então sem o `testIgnore` em `playwright.config.ts` (projeto `chromium`) ele tentava rodar os arquivos do Vitest como se fossem E2E e quebrava com "Vitest cannot be imported in a CommonJS module". `testIgnore` setado no projeto `chromium` **substitui** o do nível raiz em vez de somar — por isso o ignore de `tests/unit` está dentro do array `testIgnore` do projeto, não só no topo do config. Ambiente do Vitest é `jsdom`, mas essa versão de jsdom não expõe `window.localStorage` de forma confiável sob este Node — há um polyfill em `tests/unit/setup.ts` para isso.

## Credenciais

Já configuradas em `.env.local` (local) e nas Environment Variables do projeto na Vercel (produção) — **não precisa pedir de novo ao usuário**: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `BRAPI_TOKEN`, `MARKETAUX_API_KEY`. Ver `.env.example` pra saber o que cada uma faz. Se algo parecer não estar configurado, pergunte antes de assumir — não foi documentado o valor delas aqui de propósito (são segredos).

## Próximos passos (nessa ordem, salvo pedido em contrário)

Ver checklist completo em `docs/10-visao-final-do-produto.md`, seção "Ordem recomendada". Rate limiting, LGPD, testes de domínio, acessibilidade, comparação score x retorno real e a análise estatística (Apriori) já estão feitos (ver seções acima). O que resta:

1. Deixar o histórico do conselheiro acumular volume real de uso — os insights por Apriori só aparecem com 8+ sugestões avaliadas, e hoje a produção ainda não tem isso.
2. IA real com LLM (Amarildo e explicação do conselheiro) — **adiada por decisão de custo**, não é falta de trabalho. Só retomar se o usuário topar pagar por uma `ANTHROPIC_API_KEY` em produção.
3. Harness de trading (Binance) — repositório novo, separado e privado. Só começar se pedido explicitamente.

## Como trabalhar aqui

- Sempre rodar `npm run build` (e, se mexeu em API/auth/testes, `npm run test:e2e` e `npm run test:unit`) antes de considerar algo pronto.
- Depois de validar em `homolog`, sincronizar `main` (ver comando acima) pra refletir em produção.
- Nunca commitar `.env.local` nem qualquer arquivo com segredo solto na pasta (já aconteceu um `client_secret_*.json` do Google cair na raiz do projeto — foi removido, mas fique atento).
- Ao debugar produção, dá pra usar o Vercel CLI com um token de acesso pessoal do usuário (peça se precisar) — `vercel logs <url> --token <token>` mostra os logs de runtime, incluindo erros do Auth.js/Prisma que não aparecem em lugar nenhum além disso.
