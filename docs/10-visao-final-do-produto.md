# 10 — Visão do produto final

Este documento existe para responder uma pergunta só: **o que falta para cada parte do projeto estar pronta, e em que ordem fazer**. Os outros documentos (`01` a `09`) registram decisões e o porquê delas; este aqui é o checklist prático que amarra todos eles. Comece por aqui quando for decidir o que fazer a seguir.

## O produto quando estiver completo

Um app pessoal privado, mobile-first, que organiza tarefas, agenda, finanças básicas e documentos — e, à parte disso, um conselheiro de investimentos público que sugere ações e FIIs com base em dados reais e nunca executa nada sozinho. Funciona útil mesmo sem IA. Roda com conta própria, dados isolados por usuário, banco persistente e nada de dado sensível em `localStorage` ou em memória de processo.

O que **não** faz parte deste produto: banco/crédito, integração bancária, e-mail, colaboração multiusuário, marketplace, e qualquer execução automática de ordem de mercado — isso é [outro projeto, separado e privado](09-investimentos-e-harness.md#sobre-o-futuro-projeto-de-trading).

## Como navegar a documentação

| Pergunta | Documento |
|---|---|
| Por que essa decisão de escopo foi tomada? | [01 — Escopo e decisões](01-escopo-e-decisoes.md) |
| Como a navegação e as telas devem se comportar? | [02 — Fluxos e UX](02-fluxos-e-ux.md) |
| O que cada módulo precisa fazer, em detalhe? | [03 — Requisitos funcionais](03-requisitos-funcionais.md) |
| O que já foi entregue e o que vem a seguir? | [04 — Backlog do MVP](04-backlog-mvp.md) |
| Como a IA (Amarildo e o conselheiro) deve se comportar? | [05 — IA e prompts](05-ia-e-prompts.md) |
| O que precisa existir antes de produção, em segurança? | [06 — Segurança e LGPD](06-seguranca-e-lgpd.md) |
| Em que fase estamos e como medir sucesso? | [07 — Roadmap e métricas](07-roadmap-e-metricas.md) |
| Como a API e o modo offline funcionam hoje? | [08 — API e offline](08-api-e-offline.md) |
| Como funciona o conselheiro de investimentos? | [09 — Investimentos e harness](09-investimentos-e-harness.md) |

## Checklist por módulo

Cada linha é uma coisa concreta que falta. Quando todas as linhas de um módulo estiverem marcadas, o módulo está pronto para produção.

### Plataforma (transversal a todos os módulos)

- [x] banco de dados persistente substituindo a API em memória (Postgres via Prisma) ([06](06-seguranca-e-lgpd.md)) — validado com uma instância real no Supabase
- [x] autenticação e autorização server-side, com isolamento de dados por usuário (Auth.js + Google, sessão em JWT) — validado com login real; sessão precisou ser JWT (não "database") porque o middleware roda em Edge runtime e o Prisma padrão não funciona lá
- [x] criptografia em trânsito (HTTPS) — em produção em [personal-platform-ai.vercel.app](https://personal-platform-ai.vercel.app), HTTPS automático da Vercel
- [ ] criptografia em repouso no banco — depende de configuração do Supabase
- [x] sincronização real entre dispositivos — consequência do banco compartilhado, já validada
- [x] exportação e exclusão de dados verificáveis pelo usuário (LGPD) — `GET /api/account/export` baixa um JSON com tudo (usuário + tarefas, lançamentos, contas, compromissos, documentos, watchlist); `DELETE /api/account` apaga o usuário e cascateia o resto pelo schema. UI em Mais → Privacidade e dados.
- [ ] rate limiting em todas as rotas ([x] tasks/transactions/bills/investments/account, feito) e logs sem dado sensível (logs ainda não auditados)
- [x] suíte E2E consertada — provider `Credentials` só de teste (`E2E_TEST_AUTH_SECRET`, nunca em produção) autentica via `tests/auth.setup.ts` sem depender de conta Google real
- [x] testes de acesso indevido — `tests/isolation.spec.ts` confirma que usuário B recebe 404 tentando ler/editar/apagar dado do usuário A, e 401 sem sessão nenhuma
- [x] testes automatizados de domínio, além dos E2E já existentes — Vitest (`npm run test:unit`) cobrindo `src/server/validation.ts`, o algoritmo de scoring do conselheiro (`src/server/investments/scoring.ts`), validação de ticker da watchlist, mapeamento de erros da API (`src/domain/api-client.ts`) e o repositório local (`src/domain/repositories.ts`), 31 testes
- [x] acessibilidade auditada (foco visível, contraste, navegação por teclado, `prefers-reduced-motion`) — [02](02-fluxos-e-ux.md). Auditoria encontrou e corrigiu: variáveis CSS `--line`/`--positive`/`--negative` usadas mas nunca definidas (bordas e cores da Planilha renderizando sem cor); `--muted` e `--warning` abaixo do contraste mínimo AA (4.5:1) em texto normal; linha da tabela da Planilha clicável só por mouse (sem `tabIndex`/`role`/teclado); nav ativo sem `aria-current`; busca e filtro da Planilha e input de ticker sem label acessível. `prefers-reduced-motion` já existia e estava adequado.

### Tarefas, Finanças, Agenda, Documentos

- [x] CRUD completo com confirmação antes de excluir
- [x] estados de carregamento, vazio, erro e offline
- [x] persistência real e isolada por usuário (Postgres/Prisma) — falta só credenciais reais para validar ponta a ponta
- [ ] edição de documentos (hoje só criação)
- [ ] importação de arquivos para Documentos

### Amarildo (assistente de IA)

- [x] simulação local transparente, sem enviar dado a provedor nenhum
- [ ] chamada real a um provedor de IA, com schema de resposta e limite de custo
- [ ] RAG sobre documentos autorizados, com fonte citada e filtro por permissão — [05](05-ia-e-prompts.md)
- [ ] confirmação antes de qualquer criação/alteração/exclusão feita via IA

### Conselheiro de investimentos

- [x] scoring auditável (fundamentos + notícia) com explicação em texto
- [x] integração real com Brapi (preço, nome, P/L) e Marketaux (notícias)
- [x] fallback demonstrativo claro na interface quando falta chave de API
- [x] histórico de sugestões persistido em banco (Postgres via Prisma)
- [ ] dividend yield real (bloqueado pelo plano gratuito da Brapi — módulo `defaultKeyStatistics` é pago)
- [x] comparação automática entre score passado e retorno real observado depois — `InvestmentHistoryEntry` guarda `priceAtScoring`; a cada leitura do histórico, entradas reais (não-demo) com 7+ dias e ainda não avaliadas buscam o preço atual na Brapi e gravam `realizedReturnPct`/`evaluatedAt`. UI mostra o retorno e se o score "acertou" a direção (`src/domain/investment-evaluation.ts`)
- [x] watchlist configurável pelo usuário logado (`WatchlistItem` no Postgres), com padrão de 6 tickers para quem não personalizou
- [ ] explicação via LLM real, mantendo a regra de que a IA nunca calcula o número — [05](05-ia-e-prompts.md#ia-no-conselheiro-de-investimentos)

## Ordem recomendada

1. ~~Banco + autenticação~~ — feito, validado em produção.
2. ~~Deploy~~ — feito: [personal-platform-ai.vercel.app](https://personal-platform-ai.vercel.app), branch `main`, Postgres via pooler do Supabase.
3. ~~Consertar a suíte E2E~~ — feito, provider de teste em `tests/auth.setup.ts`.
4. ~~Testes de acesso indevido~~ — feito, `tests/isolation.spec.ts`.
5. ~~Conselheiro: watchlist configurável~~ — feito, `WatchlistItem` no Postgres.
6. ~~Rate limiting + exportação/exclusão de dados (LGPD)~~ — feito, ver `src/server/rate-limit.ts` e `src/app/api/account/*`. Falta só auditar logs por dado sensível.
7. ~~Testes automatizados de domínio~~ — feito, Vitest em `tests/unit/`.
8. ~~Acessibilidade auditada~~ — feito, ver notas na checklist acima.
9. ~~Comparação score histórico vs. retorno real~~ — feito, ver `src/server/investments/history.ts`.
10. **IA real** (Amarildo e explicação do conselheiro) — só depois da base de dados e do RAG terem onde se apoiar. Único item restante do checklist de LGPD/qualidade antes disso.
11. **Harness de trading (Binance)** — projeto novo e separado, só depois de tudo acima.

## Notas de deploy (Vercel + Supabase)

- **Framework Preset** do projeto na Vercel precisa estar em "Next.js", não "Other" — senão o build não roda de verdade.
- **`DATABASE_URL` em produção precisa ser a connection string do pooler do Supabase** (porta 6543, `aws-0-<região>.pooler.supabase.com`), nunca a conexão direta (porta 5432, `db.<ref>.supabase.co`) — essa é IPv6-only e a Vercel não alcança. `DIRECT_URL` (só usada por `prisma migrate`) pode continuar sendo a direta.
- O middleware (`src/middleware.ts`) usa `src/auth.config.ts` (sem adapter/Prisma) em vez de `src/auth.ts` (completo) — importar a versão completa no middleware estoura o limite de 1MB de Edge Function do plano Hobby, mesmo sem nunca consultar o banco.
- Sessão do Auth.js é `jwt`, não `database` — o middleware roda em Edge runtime e o Prisma padrão não abre conexão TCP lá.
- Depois de qualquer deploy novo com domínio diferente, adicionar `https://SEU-DOMINIO/api/auth/callback/google` nas Authorized redirect URIs do client OAuth no Google Cloud.

## Fora de escopo definitivo

Banco/crédito tradicional, integração bancária, e-mail, colaboração multiusuário, recursos sociais, marketplace, publicação pública, e qualquer execução automática de ordem de mercado dentro deste repositório.
