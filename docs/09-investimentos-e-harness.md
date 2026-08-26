# 09 — Conselheiro de investimentos

## Escopo

Módulo público e somente informativo: sugere ações e FIIs brasileiros para o longo prazo, com fundamentos e notícias auditáveis. **Nunca executa ordens.** Trading automatizado (ex.: cripto via Binance) fica reservado para um projeto futuro, separado e privado — não faz parte deste repositório.

## Arquitetura implementada

```
Cotação/fundamentos (Brapi) ─┐
                              ├─→ Scoring por ativo ─→ Explicação em texto ─→ Painel de sugestões
Notícias (Marketaux)  ───────┘
```

- `src/server/investments/brapiClient.ts` — busca cotação/dividend yield/P·L de uma watchlist fixa de tickers BR (ações e FIIs) via Brapi. Sem `BRAPI_TOKEN`, ou se a chamada falhar, cai em dados demonstrativos.
- `src/server/investments/newsClient.ts` — busca notícias recentes por ticker via Marketaux, com sentimento (positivo/negativo/neutro). Sem `MARKETAUX_API_KEY`, ou se a chamada falhar, cai em notícias demonstrativas.
- `src/server/investments/scoring.ts` — função pura que combina fundamentos (60% dividend yield, 40% P/L invertido) e sentimento de notícia (30% do score final) num score de 0 a 100, com explicação em texto gerada por template.
- `src/server/investments/suggestions.ts` — orquestra os três acima, grava o resultado no histórico e devolve a lista ordenada por score, junto com as fontes usadas e se algum dado é demonstrativo.
- `src/server/investments/history.ts` — persiste cada sugestão gerada na tabela `InvestmentHistoryEntry` (Postgres via Prisma), sem `userId` porque é dado de mercado público, não pessoal.
- `GET /api/investments/suggestions` e `GET /api/investments/history` — expõem sugestões atuais e histórico recente.
- `InvestmentsView` (`src/components/InvestmentsView.tsx`) — painel na interface, aba própria "Investimentos", com o histórico visível abaixo dos cartões.

Validado com chaves reais de Brapi e Marketaux: preço, nome e P/L vêm reais da Brapi (uma chamada por ticker — o plano gratuito só aceita 1 ativo por requisição); dividend yield continua demonstrativo porque esse dado exige o módulo pago `defaultKeyStatistics`; notícias reais vêm da Marketaux.

## Limitações conhecidas desta primeira versão

- watchlist fixa no código (6 tickers), sem configuração pelo usuário ainda;
- dividend yield sempre demonstrativo (limitação do plano gratuito da Brapi, não do código);
- explicação é template determinístico, não uma chamada real de LLM (consistente com o resto do projeto, que ainda não chama IA de verdade);
- histórico ainda não é comparado automaticamente com o retorno real observado depois — só fica registrado.

## Próximos passos

1. Deixar a watchlist configurável pelo usuário.
2. Comparar automaticamente cada entrada do histórico com o retorno real observado depois.
3. Avaliar upgrade do plano Brapi se dividend yield real for importante.
4. Avaliar se cabe uma explicação via LLM real, mantendo a regra de que o LLM nunca calcula número, só explica.

## Sobre o futuro projeto de trading

Fica em repositório separado e privado, ainda não criado. Quando começar, ele pode reaproveitar o pipeline de scoring daqui como base de sinal, mas terá sua própria camada de execução, custódia de chave de exchange, limites de risco e kill switch — nada disso é responsabilidade deste repositório.
