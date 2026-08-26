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
- `src/server/investments/suggestions.ts` — orquestra os três acima e devolve a lista ordenada por score, junto com as fontes usadas e se algum dado é demonstrativo.
- `GET /api/investments/suggestions` — expõe o resultado.
- `InvestmentsView` (`src/components/InvestmentsView.tsx`) — painel na interface, aba própria "Investimentos".

## Limitações conhecidas desta primeira versão

- watchlist fixa no código (6 tickers), sem configuração pelo usuário ainda;
- sem histórico: cada carregamento recalcula do zero, não há registro de sugestões passadas nem feedback sobre resultado real;
- explicação é template determinístico, não uma chamada real de LLM (consistente com o resto do projeto, que ainda não chama IA de verdade);
- Brapi e Marketaux ainda não foram validados com chave real — a integração está pronta, mas testada só com o fallback demonstrativo.

## Próximos passos (quando houver chaves reais)

1. Configurar `BRAPI_TOKEN` e `MARKETAUX_API_KEY` em `.env.local` e validar contra dados reais.
2. Persistir cada sugestão gerada (score, timestamp, fontes) para permitir comparar com o resultado real depois.
3. Deixar a watchlist configurável pelo usuário.
4. Só depois disso: avaliar se cabe uma explicação via LLM real, mantendo a regra de que o LLM nunca calcula número, só explica.

## Sobre o futuro projeto de trading

Fica em repositório separado e privado, ainda não criado. Quando começar, ele pode reaproveitar o pipeline de scoring daqui como base de sinal, mas terá sua própria camada de execução, custódia de chave de exchange, limites de risco e kill switch — nada disso é responsabilidade deste repositório.
