import type { InvestmentNews, InvestmentQuote, InvestmentSuggestion } from "../../domain/types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function scoreAsset(quote: InvestmentQuote, news: InvestmentNews[]): InvestmentSuggestion {
  const dividendComponent = clamp((quote.dividendYield / 15) * 100, 0, 100);
  const peComponent = quote.priceToEarnings === null ? 50 : clamp(100 - (quote.priceToEarnings / 30) * 100, 0, 100);
  const fundamentals = Math.round(dividendComponent * 0.6 + peComponent * 0.4);

  const sentimentValues: number[] = news.map((item) => (item.sentiment === "positivo" ? 100 : item.sentiment === "negativo" ? 0 : 50));
  const sentiment = sentimentValues.length ? Math.round(sentimentValues.reduce((sum, value) => sum + value, 0) / sentimentValues.length) : 50;

  const score = Math.round(fundamentals * 0.7 + sentiment * 0.3);
  return {
    ticker: quote.ticker,
    name: quote.name,
    assetClass: quote.assetClass,
    score,
    scoreBreakdown: { fundamentals, sentiment },
    explanation: buildExplanation(quote, fundamentals, sentiment, news),
    news,
    asOf: quote.updatedAt,
  };
}

function buildExplanation(quote: InvestmentQuote, fundamentals: number, sentiment: number, news: InvestmentNews[]): string {
  const dividendPart = `dividend yield de ${quote.dividendYield.toFixed(1)}%`;
  const peExplain = quote.priceToEarnings === null ? "sem P/L disponível" : `P/L de ${quote.priceToEarnings.toFixed(1)}`;
  const tone = sentiment >= 66 ? "positivo" : sentiment <= 33 ? "negativo" : "neutro";
  const newsPart = news.length ? `${news.length} notícia(s) recente(s) com tom predominantemente ${tone}` : "sem notícia recente monitorada";
  return `Fundamentos ${fundamentals}/100 (${dividendPart}, ${peExplain}). Notícias ${sentiment}/100: ${newsPart}. Cálculo auditável e versionado — não é promessa de retorno.`;
}
