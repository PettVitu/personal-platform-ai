import { describe, expect, it } from "vitest";
import { isDate, isPriority, isTaskStatus, isTransactionType, positiveAmount } from "../../src/server/validation";

describe("isPriority", () => {
  it("aceita os três valores válidos", () => {
    expect(isPriority("alta")).toBe(true);
    expect(isPriority("media")).toBe(true);
    expect(isPriority("baixa")).toBe(true);
  });
  it("rejeita qualquer outro valor", () => {
    expect(isPriority("urgente")).toBe(false);
    expect(isPriority(undefined)).toBe(false);
    expect(isPriority(1)).toBe(false);
  });
});

describe("isTaskStatus", () => {
  it("aceita pending e completed", () => {
    expect(isTaskStatus("pending")).toBe(true);
    expect(isTaskStatus("completed")).toBe(true);
  });
  it("rejeita o resto", () => {
    expect(isTaskStatus("done")).toBe(false);
    expect(isTaskStatus(null)).toBe(false);
  });
});

describe("isTransactionType", () => {
  it("aceita income e expense", () => {
    expect(isTransactionType("income")).toBe(true);
    expect(isTransactionType("expense")).toBe(true);
  });
  it("rejeita o resto", () => {
    expect(isTransactionType("transfer")).toBe(false);
  });
});

describe("isDate", () => {
  it("aceita datas no formato YYYY-MM-DD", () => {
    expect(isDate("2026-08-26")).toBe(true);
    expect(isDate("0001-01-01")).toBe(true);
  });
  it("rejeita formatos diferentes, mesmo que sejam datas válidas", () => {
    expect(isDate("26/08/2026")).toBe(false);
    expect(isDate("2026-8-26")).toBe(false);
    expect(isDate("2026-08-26T00:00:00Z")).toBe(false);
    expect(isDate(20260826)).toBe(false);
    expect(isDate(undefined)).toBe(false);
  });
});

describe("positiveAmount", () => {
  it("aceita números positivos e finitos", () => {
    expect(positiveAmount(0.01)).toBe(true);
    expect(positiveAmount(1000)).toBe(true);
  });
  it("rejeita zero, negativos, não-números e infinito", () => {
    expect(positiveAmount(0)).toBe(false);
    expect(positiveAmount(-5)).toBe(false);
    expect(positiveAmount("10")).toBe(false);
    expect(positiveAmount(Infinity)).toBe(false);
    expect(positiveAmount(NaN)).toBe(false);
  });
});
