import type { InvestmentHistoryEntry, InvestmentSuggestion } from "../../domain/types";
import { prisma } from "../db";

const MAX_ENTRIES = 200;

export async function recordSuggestions(suggestions: InvestmentSuggestion[], demo: boolean): Promise<void> {
  await prisma.investmentHistoryEntry.createMany({
    data: suggestions.map((item) => ({
      ticker: item.ticker,
      score: item.score,
      fundamentals: item.scoreBreakdown.fundamentals,
      sentiment: item.scoreBreakdown.sentiment,
      asOf: new Date(item.asOf),
      demo,
    })),
  });
}

export async function getHistory(): Promise<InvestmentHistoryEntry[]> {
  const rows = await prisma.investmentHistoryEntry.findMany({ orderBy: { createdAt: "desc" }, take: MAX_ENTRIES });
  return rows.map((row) => ({
    id: row.id,
    ticker: row.ticker,
    score: row.score,
    scoreBreakdown: { fundamentals: row.fundamentals, sentiment: row.sentiment },
    asOf: row.asOf.toISOString(),
    demo: row.demo,
  }));
}
