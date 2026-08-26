import { describe, expect, it } from "vitest";
import { computeDailyBudget } from "../../src/domain/daily-budget";
import type { BudgetCategory, RecurringBill, Transaction } from "../../src/domain/types";

function transaction(overrides: Partial<Transaction>): Transaction {
  return { id: "t1", type: "expense", description: "x", amount: 0, date: "2026-08-15", category: "Geral", account: "Conta principal", ...overrides };
}
function bill(overrides: Partial<RecurringBill>): RecurringBill {
  return { id: "b1", name: "Conta", amount: 0, dueDate: "2026-08-20", paid: false, ...overrides };
}
function category(overrides: Partial<BudgetCategory>): BudgetCategory {
  return { id: "c1", name: "Transporte", monthlyAmount: 0, ...overrides };
}

// Agosto/2026 tem 31 dias. "Hoje" = 15/08 → restam 17 dias (15 a 31, inclusive).
const TODAY = "2026-08-15";

describe("computeDailyBudget", () => {
  it("sem contas, categorias ou receita futura: orçamento = saldo atual / dias restantes", () => {
    const transactions = [transaction({ type: "income", amount: 3400, date: "2026-08-01" }), transaction({ type: "expense", amount: 400, date: "2026-08-05" })];
    const result = computeDailyBudget({ today: TODAY, transactions, bills: [], categories: [] });
    expect(result.currentBalance).toBe(3000);
    expect(result.daysRemaining).toBe(17);
    expect(result.dailyBudget).toBeCloseTo(3000 / 17, 5);
    expect(result.spentToday).toBe(0);
    expect(result.remainingToday).toBeCloseTo(3000 / 17, 5);
  });

  it("conta não paga com vencimento dentro do mês, de hoje em diante, reduz o orçamento", () => {
    const transactions = [transaction({ type: "income", amount: 3000, date: "2026-08-01" })];
    const bills = [bill({ amount: 850, dueDate: "2026-08-20", paid: false })];
    const result = computeDailyBudget({ today: TODAY, transactions, bills, categories: [] });
    expect(result.committedBills).toBe(850);
    expect(result.dailyBudget).toBeCloseTo((3000 - 850) / 17, 5);
  });

  it("conta com vencimento no mês seguinte não entra no cálculo", () => {
    const transactions = [transaction({ type: "income", amount: 3000, date: "2026-08-01" })];
    const bills = [bill({ amount: 850, dueDate: "2026-09-05", paid: false })];
    const result = computeDailyBudget({ today: TODAY, transactions, bills, categories: [] });
    expect(result.committedBills).toBe(0);
  });

  it("conta já paga não é descontada de novo (já está refletida no saldo)", () => {
    const transactions = [transaction({ type: "income", amount: 3000, date: "2026-08-01" })];
    const bills = [bill({ amount: 850, dueDate: "2026-08-10", paid: true })];
    const result = computeDailyBudget({ today: TODAY, transactions, bills, categories: [] });
    expect(result.committedBills).toBe(0);
    expect(result.currentBalance).toBe(3000 - 850);
  });

  it("receita futura dentro do mês aumenta o orçamento, mas receita futura do mês seguinte não", () => {
    const transactions = [transaction({ type: "income", amount: 1000, date: "2026-08-25" }), transaction({ type: "income", amount: 500, date: "2026-09-01" })];
    const result = computeDailyBudget({ today: TODAY, transactions, bills: [], categories: [] });
    expect(result.futureIncome).toBe(1000);
  });

  it("receita já lançada (data <= hoje) não conta como futura, pois já está no saldo", () => {
    const transactions = [transaction({ type: "income", amount: 1000, date: TODAY })];
    const result = computeDailyBudget({ today: TODAY, transactions, bills: [], categories: [] });
    expect(result.futureIncome).toBe(0);
  });

  it("categoria é prorateada pelos dias restantes, não pelo valor mensal cheio", () => {
    const categories = [category({ monthlyAmount: 310, name: "Transporte" })]; // 310/31 dias = 10/dia
    const result = computeDailyBudget({ today: TODAY, transactions: [], bills: [], categories });
    expect(result.committedCategories).toBeCloseTo(10 * 17, 5);
  });

  it("no último dia do mês, diasRestantes = 1 e o orçamento do dia é tudo que sobrou", () => {
    const transactions = [transaction({ type: "income", amount: 100, date: "2026-08-01" })];
    const result = computeDailyBudget({ today: "2026-08-31", transactions, bills: [], categories: [] });
    expect(result.daysRemaining).toBe(1);
    expect(result.dailyBudget).toBe(100);
  });

  it("gasto de hoje soma só transações do próprio dia e restanteHoje pode ficar negativo", () => {
    const transactions = [
      transaction({ type: "income", amount: 100, date: "2026-08-01" }),
      transaction({ type: "expense", amount: 30, date: TODAY }),
      transaction({ type: "expense", amount: 999, date: TODAY }),
      transaction({ type: "expense", amount: 50, date: "2026-08-10" }), // outro dia, não conta em spentToday
    ];
    const result = computeDailyBudget({ today: TODAY, transactions, bills: [], categories: [] });
    expect(result.spentToday).toBe(1029);
    expect(result.remainingToday).toBeLessThan(0);
  });
});
