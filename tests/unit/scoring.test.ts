import { describe, expect, it } from "vitest";
import { scoreAsset } from "../../src/server/investments/scoring";
import type { InvestmentNews, InvestmentQuote } from "../../src/domain/types";

function quote(overrides: Partial<InvestmentQuote> = {}): InvestmentQuote {
  return { ticker: "TEST3", name: "Teste ON", assetClass: "acao", price: 10, dividendYield: 0, priceToEarnings: null, updatedAt: "2026-08-26T00:00:00.000Z", ...overrides };
}

function news(sentiment: InvestmentNews["sentiment"]): InvestmentNews {
  return { headline: "Notícia", url: "https://example.com", source: "Fonte", publishedAt: "2026-08-26T00:00:00.000Z", sentiment, relatedTickers: ["TEST3"] };
}

describe("scoreAsset", () => {
  it("dividend yield alto (>=15%) e sem notícia soma fundamentals=80 e sentiment neutro=50 => score 71", () => {
    const result = scoreAsset(quote({ dividendYield: 15, priceToEarnings: null }), []);
    expect(result.scoreBreakdown).toEqual({ fundamentals: 80, sentiment: 50 });
    expect(result.score).toBe(71);
  });

  it("dividend yield zero, P/L alto (30) e notícia única positiva => fundamentals=0, sentiment=100, score=30", () => {
    const result = scoreAsset(quote({ dividendYield: 0, priceToEarnings: 30 }), [news("positivo")]);
    expect(result.scoreBreakdown).toEqual({ fundamentals: 0, sentiment: 100 });
    expect(result.score).toBe(30);
  });

  it("clampa dividend yield acima de 15% e P/L negativo/zero no teto de 100", () => {
    const result = scoreAsset(quote({ dividendYield: 30, priceToEarnings: 0 }), []);
    expect(result.scoreBreakdown.fundamentals).toBe(100);
  });

  it("P/L ausente vale 50 pontos fixos no componente de P/L", () => {
    const comNulo = scoreAsset(quote({ dividendYield: 0, priceToEarnings: null }), []);
    const comCinquenta = scoreAsset(quote({ dividendYield: 0, priceToEarnings: 15 }), []); // peComponent = 100 - 50 = 50
    expect(comNulo.scoreBreakdown.fundamentals).toBe(comCinquenta.scoreBreakdown.fundamentals);
  });

  it("sentimento é a média arredondada de várias notícias", () => {
    const result = scoreAsset(quote(), [news("positivo"), news("negativo"), news("neutro")]);
    expect(result.scoreBreakdown.sentiment).toBe(50); // (100+0+50)/3 = 50
  });

  it("preserva metadados do ativo e ecoa a lista de notícias recebida", () => {
    const items = [news("positivo")];
    const result = scoreAsset(quote({ ticker: "MXRF11", name: "Maxi Renda FII", assetClass: "fii" }), items);
    expect(result.ticker).toBe("MXRF11");
    expect(result.assetClass).toBe("fii");
    expect(result.news).toBe(items);
    expect(result.explanation).toContain("Fundamentos");
  });
});
