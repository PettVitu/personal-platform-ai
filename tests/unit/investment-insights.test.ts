import { describe, expect, it } from "vitest";
import { band, buildInsights, type EvaluatedEntry } from "../../src/server/investments/insights";

describe("band", () => {
  it("classifica >=66 como alto, <=33 como baixo, e o resto como médio", () => {
    expect(band(66, "fundamentos")).toBe("fundamentos_alto");
    expect(band(100, "fundamentos")).toBe("fundamentos_alto");
    expect(band(33, "noticia")).toBe("noticia_baixo");
    expect(band(0, "noticia")).toBe("noticia_baixo");
    expect(band(50, "noticia")).toBe("noticia_medio");
  });
});

describe("buildInsights", () => {
  const alto: EvaluatedEntry = { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: 5 };
  const baixo: EvaluatedEntry = { ticker: "VALE3", fundamentals: 10, sentiment: 50, realizedReturnPct: -3 };

  it("não gera nenhum insight abaixo do tamanho mínimo de amostra", () => {
    const result = buildInsights(Array(7).fill(alto));
    expect(result.insights).toEqual([]);
    expect(result.sampleSize).toBe(7);
    expect(result.minSampleSize).toBeGreaterThan(7);
  });

  it("acha a regra fundamentos altos -> retorno positivo quando o padrão é consistente", () => {
    const entries = [...Array(5).fill(alto), ...Array(5).fill(baixo)];
    const result = buildInsights(entries);
    expect(result.sampleSize).toBe(10);
    expect(result.insights).toContainEqual({ conditions: ["fundamentos_alto"], outcome: "retorno_positivo", support: 0.5, confidence: 1, lift: 2 });
    expect(result.insights).toContainEqual({ conditions: ["fundamentos_baixo"], outcome: "retorno_estavel_ou_negativo", support: 0.5, confidence: 1, lift: 2 });
  });

  it("nunca devolve uma regra cujo antecedente já contenha o próprio resultado", () => {
    const entries = [...Array(5).fill(alto), ...Array(5).fill(baixo)];
    const result = buildInsights(entries);
    for (const insight of result.insights) {
      expect(insight.conditions).not.toContain(insight.outcome);
    }
  });

  it("sem padrão nenhum (metade positivo, metade negativo em cada faixa), não força regra", () => {
    const misto: EvaluatedEntry[] = [
      { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: 5 },
      { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: -5 },
      { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: 5 },
      { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: -5 },
      { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: 5 },
      { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: -5 },
      { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: 5 },
      { ticker: "PETR4", fundamentals: 90, sentiment: 50, realizedReturnPct: -5 },
    ];
    const result = buildInsights(misto);
    const fundamentosAltoRule = result.insights.find((insight) => insight.conditions.length === 1 && insight.conditions[0] === "fundamentos_alto");
    expect(fundamentosAltoRule).toBeUndefined();
  });
});
