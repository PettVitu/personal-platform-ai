import { describe, expect, it } from "vitest";
import { DEFAULT_WATCHLIST, isValidTicker } from "../../src/server/investments/watchlist";

describe("isValidTicker", () => {
  it("aceita o formato da B3: 4 letras + 1 ou 2 dígitos", () => {
    expect(isValidTicker("PETR4")).toBe(true);
    expect(isValidTicker("MXRF11")).toBe(true);
  });
  it("rejeita minúsculas, poucos dígitos, letras a mais ou lixo", () => {
    expect(isValidTicker("petr4")).toBe(false);
    expect(isValidTicker("PETR")).toBe(false);
    expect(isValidTicker("PETRO4")).toBe(false);
    expect(isValidTicker("PETR444")).toBe(false);
    expect(isValidTicker("")).toBe(false);
  });
});

describe("DEFAULT_WATCHLIST", () => {
  it("tem 6 ativos, todos com ticker no formato válido da B3", () => {
    expect(DEFAULT_WATCHLIST).toHaveLength(6);
    for (const entry of DEFAULT_WATCHLIST) expect(isValidTicker(entry.ticker)).toBe(true);
  });
  it("não tem ticker duplicado", () => {
    const tickers = DEFAULT_WATCHLIST.map((entry) => entry.ticker);
    expect(new Set(tickers).size).toBe(tickers.length);
  });
});
