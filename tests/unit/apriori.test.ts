import { describe, expect, it } from "vitest";
import { findFrequentItemsets, generateRules } from "../../src/server/investments/apriori";

// Exemplo clássico de "cesta de compras" usado em todo material didático de
// Apriori — serve pra conferir o algoritmo contra um resultado conhecido de cabeça.
const BASKETS = [
  ["milk", "bread", "butter"],
  ["bread", "butter"],
  ["milk", "bread"],
  ["milk", "bread", "butter"],
  ["bread"],
];

describe("findFrequentItemsets", () => {
  it("acha os itemsets de tamanho 1 com suporte >= mínimo", () => {
    const frequent = findFrequentItemsets(BASKETS, 0.6);
    const singles = frequent.filter((item) => item.items.length === 1);
    expect(singles).toEqual(
      expect.arrayContaining([
        { items: ["bread"], support: 1 },
        { items: ["butter"], support: 0.6 },
        { items: ["milk"], support: 0.6 },
      ]),
    );
  });

  it("acha os pares frequentes e descarta milk+butter (suporte 0.4 < 0.6)", () => {
    const frequent = findFrequentItemsets(BASKETS, 0.6);
    const pairs = frequent.filter((item) => item.items.length === 2).map((item) => [...item.items].sort());
    expect(pairs).toContainEqual(["bread", "butter"]);
    expect(pairs).toContainEqual(["bread", "milk"]);
    expect(pairs).not.toContainEqual(["butter", "milk"]);
  });

  it("nunca gera um trio, já que um dos pares que o compõe não é frequente", () => {
    const frequent = findFrequentItemsets(BASKETS, 0.6);
    expect(frequent.some((item) => item.items.length === 3)).toBe(false);
  });

  it("retorna vazio para uma lista de transações vazia", () => {
    expect(findFrequentItemsets([], 0.5)).toEqual([]);
  });
});

describe("generateRules", () => {
  it("gera só as regras com confiança >= mínima, com support/confidence/lift corretos", () => {
    const frequent = findFrequentItemsets(BASKETS, 0.6);
    const rules = generateRules(frequent, 0.8);
    expect(rules).toEqual([
      { antecedent: ["butter"], consequent: ["bread"], support: 0.6, confidence: 1, lift: 1 },
      { antecedent: ["milk"], consequent: ["bread"], support: 0.6, confidence: 1, lift: 1 },
    ]);
  });

  it("uma confiança mínima mais baixa também libera bread->butter e bread->milk (confiança 0.6)", () => {
    const frequent = findFrequentItemsets(BASKETS, 0.6);
    const rules = generateRules(frequent, 0.5);
    expect(rules).toContainEqual({ antecedent: ["bread"], consequent: ["butter"], support: 0.6, confidence: 0.6, lift: 1 });
    expect(rules).toContainEqual({ antecedent: ["bread"], consequent: ["milk"], support: 0.6, confidence: 0.6, lift: 1 });
  });
});
