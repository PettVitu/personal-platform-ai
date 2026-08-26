import { prisma } from "../db";
import { findFrequentItemsets, generateRules } from "./apriori";
import { guessAssetClass } from "./watchlist";

// Precisa de um mínimo de sugestões avaliadas pra qualquer regra fazer sentido —
// abaixo disso "suporte" e "confiança" seriam matematicamente válidos mas
// estatisticamente inúteis (ex.: 2/3 casos não é um padrão, é coincidência).
const MIN_SAMPLE_SIZE = 8;
const MIN_SUPPORT = 0.15;
const MIN_CONFIDENCE = 0.6;
const POSITIVE_OUTCOME = "retorno_positivo";
const NEGATIVE_OUTCOME = "retorno_estavel_ou_negativo";
const OUTCOME_ITEMS = new Set([POSITIVE_OUTCOME, NEGATIVE_OUTCOME]);

export type InvestmentInsight = {
  conditions: string[];
  outcome: typeof POSITIVE_OUTCOME | typeof NEGATIVE_OUTCOME;
  support: number;
  confidence: number;
  lift: number;
};

export type InvestmentInsightsResult = { insights: InvestmentInsight[]; sampleSize: number; minSampleSize: number };

export function band(value: number, prefix: string): string {
  if (value >= 66) return `${prefix}_alto`;
  if (value <= 33) return `${prefix}_baixo`;
  return `${prefix}_medio`;
}

export type EvaluatedEntry = { ticker: string; fundamentals: number; sentiment: number; realizedReturnPct: number };

// Puro (sem banco) de propósito: separado de getInvestmentInsights() só pra ser
// testável com dados de exemplo, sem precisar mockar o Prisma.
export function buildInsights(entries: EvaluatedEntry[]): InvestmentInsightsResult {
  const sampleSize = entries.length;
  if (sampleSize < MIN_SAMPLE_SIZE) return { insights: [], sampleSize, minSampleSize: MIN_SAMPLE_SIZE };

  const transactions = entries.map((entry) => [
    band(entry.fundamentals, "fundamentos"),
    band(entry.sentiment, "noticia"),
    guessAssetClass(entry.ticker) === "fii" ? "fii" : "acao",
    entry.realizedReturnPct > 0 ? POSITIVE_OUTCOME : NEGATIVE_OUTCOME,
  ]);

  const frequentItemsets = findFrequentItemsets(transactions, MIN_SUPPORT);
  const rules = generateRules(frequentItemsets, MIN_CONFIDENCE).filter(
    (rule) => rule.consequent.length === 1 && OUTCOME_ITEMS.has(rule.consequent[0]) && !rule.antecedent.some((item) => OUTCOME_ITEMS.has(item)),
  );

  return {
    insights: rules.slice(0, 8).map((rule) => ({
      conditions: rule.antecedent,
      outcome: rule.consequent[0] as InvestmentInsight["outcome"],
      support: rule.support,
      confidence: rule.confidence,
      lift: rule.lift,
    })),
    sampleSize,
    minSampleSize: MIN_SAMPLE_SIZE,
  };
}

export async function getInvestmentInsights(): Promise<InvestmentInsightsResult> {
  const rows = await prisma.investmentHistoryEntry.findMany({ where: { demo: false, realizedReturnPct: { not: null } } });
  return buildInsights(rows.map((row) => ({ ticker: row.ticker, fundamentals: row.fundamentals, sentiment: row.sentiment, realizedReturnPct: row.realizedReturnPct! })));
}
