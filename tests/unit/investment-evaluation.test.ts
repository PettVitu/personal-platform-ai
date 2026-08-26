import { describe, expect, it } from "vitest";
import { evaluateScoreCall } from "../../src/domain/investment-evaluation";

describe("evaluateScoreCall", () => {
  it("score alto (>=60) acerta quando o retorno é positivo", () => {
    expect(evaluateScoreCall(60, 0.01)).toBe("acertou");
    expect(evaluateScoreCall(90, 15)).toBe("acertou");
  });

  it("score alto (>=60) erra quando o retorno é zero ou negativo", () => {
    expect(evaluateScoreCall(60, 0)).toBe("errou");
    expect(evaluateScoreCall(75, -3)).toBe("errou");
  });

  it("score baixo (<=40) acerta quando o retorno é zero ou negativo", () => {
    expect(evaluateScoreCall(40, 0)).toBe("acertou");
    expect(evaluateScoreCall(10, -8)).toBe("acertou");
  });

  it("score baixo (<=40) erra quando o retorno é positivo", () => {
    expect(evaluateScoreCall(40, 0.01)).toBe("errou");
  });

  it("faixa neutra (41 a 59) não faz chamada nenhuma", () => {
    expect(evaluateScoreCall(41, 20)).toBeNull();
    expect(evaluateScoreCall(50, -20)).toBeNull();
    expect(evaluateScoreCall(59, -1)).toBeNull();
  });
});
