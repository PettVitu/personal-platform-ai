import type { InvestmentHistoryEntry, InvestmentQuote, InvestmentSuggestion } from "../../domain/types";
import { prisma } from "../db";
import { fetchCurrentPrice } from "./brapiClient";

const MAX_ENTRIES = 200;

// Só dá pra comparar score com retorno real depois de um tempo — antes disso o
// preço mal se moveu e a comparação não diz nada. Só reavalia sugestões reais
// (nunca demo: o preço demonstrativo é estático, "retorno" seria sempre zero).
const MIN_AGE_FOR_EVALUATION_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_EVALUATIONS_PER_CALL = 15;

export async function recordSuggestions(suggestions: InvestmentSuggestion[], quotes: InvestmentQuote[], demo: boolean): Promise<void> {
  const priceByTicker = new Map(quotes.map((quote) => [quote.ticker, quote.price]));
  await prisma.investmentHistoryEntry.createMany({
    data: suggestions.map((item) => ({
      ticker: item.ticker,
      score: item.score,
      fundamentals: item.scoreBreakdown.fundamentals,
      sentiment: item.scoreBreakdown.sentiment,
      asOf: new Date(item.asOf),
      demo,
      priceAtScoring: priceByTicker.get(item.ticker) ?? null,
    })),
  });
}

export async function getHistory(): Promise<InvestmentHistoryEntry[]> {
  await evaluatePendingReturns();
  const rows = await prisma.investmentHistoryEntry.findMany({ orderBy: { createdAt: "desc" }, take: MAX_ENTRIES });
  return rows.map((row) => ({
    id: row.id,
    ticker: row.ticker,
    score: row.score,
    scoreBreakdown: { fundamentals: row.fundamentals, sentiment: row.sentiment },
    asOf: row.asOf.toISOString(),
    demo: row.demo,
    priceAtScoring: row.priceAtScoring,
    realizedReturnPct: row.realizedReturnPct,
    evaluatedAt: row.evaluatedAt?.toISOString() ?? null,
  }));
}

async function evaluatePendingReturns(): Promise<void> {
  const cutoff = new Date(Date.now() - MIN_AGE_FOR_EVALUATION_MS);
  const pending = await prisma.investmentHistoryEntry.findMany({
    where: { demo: false, evaluatedAt: null, priceAtScoring: { not: null }, asOf: { lte: cutoff } },
    take: MAX_EVALUATIONS_PER_CALL,
  });
  if (pending.length === 0) return;

  const tickers = [...new Set(pending.map((entry) => entry.ticker))];
  const currentPrices = new Map<string, number | null>();
  await Promise.all(tickers.map(async (ticker) => currentPrices.set(ticker, await fetchCurrentPrice(ticker).catch(() => null))));

  await Promise.all(pending.map((entry) => {
    const currentPrice = currentPrices.get(entry.ticker);
    if (currentPrice === null || currentPrice === undefined || entry.priceAtScoring === null) return Promise.resolve();
    const realizedReturnPct = ((currentPrice - entry.priceAtScoring) / entry.priceAtScoring) * 100;
    return prisma.investmentHistoryEntry.update({ where: { id: entry.id }, data: { realizedReturnPct, evaluatedAt: new Date() } });
  }));
}
