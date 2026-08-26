import { describe, expect, it } from "vitest";
import { formatWeekdayAndDay, greetingForHour } from "../../src/domain/greeting";

describe("greetingForHour", () => {
  it("madrugada e noite dizem boa noite", () => {
    expect(greetingForHour(0)).toBe("Boa noite");
    expect(greetingForHour(4)).toBe("Boa noite");
    expect(greetingForHour(19)).toBe("Boa noite");
    expect(greetingForHour(23)).toBe("Boa noite");
  });
  it("manhã diz bom dia", () => {
    expect(greetingForHour(5)).toBe("Bom dia");
    expect(greetingForHour(11)).toBe("Bom dia");
  });
  it("tarde diz boa tarde", () => {
    expect(greetingForHour(12)).toBe("Boa tarde");
    expect(greetingForHour(17)).toBe("Boa tarde");
  });
});

describe("formatWeekdayAndDay", () => {
  it("formata dia da semana e data em pt-BR", () => {
    const result = formatWeekdayAndDay(new Date(2026, 7, 14)); // 14 de agosto de 2026 é uma sexta-feira
    expect(result).toContain("sexta-feira");
    expect(result).toContain("14");
    expect(result).toContain("agosto");
  });
});
