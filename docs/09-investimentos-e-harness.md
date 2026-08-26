# 09 — Conselheiro de investimentos

## Escopo

Módulo público e somente informativo: sugere ações e FIIs brasileiros para o longo prazo, com fundamentos e notícias auditáveis. **Nunca executa ordens.** Trading automatizado (ex.: cripto via Binance) fica reservado para um projeto futuro, separado e privado — não faz parte deste repositório.

## Arquitetura implementada

```
Cotação/fundamentos (Brapi) ─┐
                              ├─→ Scoring por ativo ─→ Explicação em texto ─→ Painel de sugestões
Notícias (Marketaux)  ───────┘

Histórico (score + preço) ──7+ dias depois──→ preço atual (Brapi) ──→ retorno real ──→ Apriori ──→ Painel de insights
```

- `src/server/investments/watchlist.ts` — resolve a watchlist: se o usuário logado tem linhas na tabela `WatchlistItem`, usa elas; senão cai na `DEFAULT_WATCHLIST` fixa (6 tickers). Sem sessão, sempre a padrão.
- `src/server/investments/brapiClient.ts` — busca cotação/P·L da watchlist resolvida via Brapi (uma chamada por ticker — plano gratuito só aceita 1 por requisição) e, separadamente, o preço atual de um único ticker (usado na comparação de retorno). Ticker sem token, sem resposta real, ou fora da lista demonstrativa conhecida cai em valor placeholder neutro, nunca quebra.
- `src/server/investments/newsClient.ts` — busca notícias recentes por ticker via Marketaux, com sentimento (positivo/negativo/neutro). Sem `MARKETAUX_API_KEY`, ou se a chamada falhar, cai em notícias demonstrativas.
- `src/server/investments/scoring.ts` — função pura que combina fundamentos (60% dividend yield, 40% P/L invertido) e sentimento de notícia (30% do score final) num score de 0 a 100, com explicação em texto gerada por template.
- `src/server/investments/suggestions.ts` — resolve a watchlist do usuário, orquesta os clientes acima, grava o resultado no histórico (com o preço do momento) e devolve a lista ordenada por score.
- `src/server/investments/history.ts` — persiste cada sugestão gerada na tabela `InvestmentHistoryEntry` (Postgres via Prisma), sem `userId` porque é dado de mercado público, não pessoal. A cada leitura, avalia (de forma preguiçosa, sem cron) entradas reais com 7+ dias ainda sem retorno calculado, buscando o preço atual e gravando `realizedReturnPct`.
- `src/domain/investment-evaluation.ts` — função pura que julga se o score "acertou" a direção do retorno (score ≥ 60 esperando alta, ≤ 40 esperando queda/estabilidade; faixa neutra não faz chamada).
- `src/server/investments/apriori.ts` — algoritmo Apriori genérico (itemsets frequentes + regras de associação), sem nada específico de investimentos; testado contra o exemplo clássico de "cesta de compras".
- `src/server/investments/insights.ts` — traduz cada entrada avaliada do histórico em itens categóricos (faixa de fundamentos, faixa de notícia, classe do ativo, resultado positivo/não-positivo) e roda o Apriori em cima disso pra achar padrões tipo "quando fundamentos altos, retorno positivo em X% dos casos". Exige um mínimo de 8 sugestões avaliadas antes de mostrar qualquer regra.
- `GET /api/investments/suggestions`, `GET /api/investments/history` e `GET /api/investments/insights` — não exigem login; os dois primeiros usam a watchlist do usuário quando há sessão, senão a padrão (insights são sempre agregados, não pessoais).
- `GET/POST /api/investments/watchlist` e `DELETE /api/investments/watchlist/:ticker` — exigem login (editar lista pessoal sem identidade não faz sentido); a primeira mutação materializa a padrão como ponto de partida do usuário.
- `InvestmentsView` (`src/components/InvestmentsView.tsx`) — painel na interface com os chips da watchlist (editáveis se logado), os cartões de sugestão, a análise estatística (Apriori) e o histórico.

Validado com chaves reais de Brapi e Marketaux: preço, nome e P/L vêm reais da Brapi (uma chamada por ticker — o plano gratuito só aceita 1 ativo por requisição); dividend yield continua demonstrativo porque esse dado exige o módulo pago `defaultKeyStatistics`; notícias reais vêm da Marketaux.

## Decisão: sem LLM/agente conversacional por agora

Cogitou-se um "agente conselheiro" com IA real (LLM narrando a explicação, ou um chat tipo Amarildo respondendo sobre investimentos). Decisão: adiado, porque chamar uma API de LLM em produção tem custo por chamada que não se resolve com nenhum plano de assinatura (Claude.ai Pro/Max não dá créditos de API) — é dinheiro à parte, e ainda não faz sentido pra esse estágio do projeto. Em vez disso, o caminho escolhido foi um **componente estatístico determinístico (Apriori)**, que não depende de API paga nenhuma e usa exatamente o dado que o projeto já coleta (`realizedReturnPct`). Isso não é um cancelamento definitivo da ideia de LLM — é uma troca de prioridade: estatística primeiro, chat de IA depois, se algum dia fizer sentido o custo.

## Limitações conhecidas desta primeira versão

- classe do ativo (ação/FII) de um ticker adicionado manualmente é adivinhada por heurística (termina em "11" → FII) — nem sempre certo (units e BDRs também usam 11);
- dividend yield sempre demonstrativo (limitação do plano gratuito da Brapi, não do código);
- explicação do score é template determinístico, não LLM (decisão deliberada, ver seção acima — não é uma limitação temporária, é a direção escolhida);
- os insights por Apriori exigem volume de histórico avaliado (mínimo 8) que o projeto ainda não tem em produção — o painel mostra "dados insuficientes" honestamente até lá.

## Próximos passos

1. Avaliar upgrade do plano Brapi se dividend yield real for importante.
2. Deixar o histórico acumular volume real (semanas/meses de uso) até os insights por Apriori terem amostra suficiente pra aparecer.

## Sobre o futuro projeto de trading

Fica em repositório separado e privado, ainda não criado. Quando começar, ele pode reaproveitar o pipeline de scoring daqui como base de sinal, mas terá sua própria camada de execução, custódia de chave de exchange, limites de risco e kill switch — nada disso é responsabilidade deste repositório.
