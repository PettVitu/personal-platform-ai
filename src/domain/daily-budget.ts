import type { BudgetCategory, RecurringBill, Transaction } from "./types";

export type DailyBudgetResult = {
  today: string;
  daysInMonth: number;
  daysRemaining: number;
  currentBalance: number;
  futureIncome: number;
  committedBills: number;
  committedCategories: number;
  dailyBudget: number;
  spentToday: number;
  remainingToday: number;
};

const daysInMonth = (year: number, monthIndex: number) => new Date(year, monthIndex + 1, 0).getDate();

/** Data de hoje no fuso local, como YYYY-MM-DD — não usa `new Date().toISOString()` de propósito, que é UTC e pode virar o dia errado perto da meia-noite em fusos negativos. */
export function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Puro e sem I/O de propósito — testável isoladamente. "today" é sempre uma data
 * real (YYYY-MM-DD), independente de qualquer data de demonstração hardcoded em
 * outras telas do app.
 */
export function computeDailyBudget(params: { today: string; transactions: Transaction[]; bills: RecurringBill[]; categories: BudgetCategory[] }): DailyBudgetResult {
  const { today, transactions, bills, categories } = params;
  const [year, month] = today.split("-").map(Number);
  const monthIndex = month - 1;
  const monthPrefix = today.slice(0, 7);
  const totalDaysInMonth = daysInMonth(year, monthIndex);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const daysRemaining = lastDay - Number(today.slice(8, 10)) + 1;

  const isInCurrentMonth = (date: string) => date.startsWith(monthPrefix);

  const currentBalance =
    transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0) -
    transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0) -
    bills.filter((bill) => bill.paid).reduce((sum, bill) => sum + bill.amount, 0);

  const futureIncome = transactions
    .filter((item) => item.type === "income" && item.date > today && isInCurrentMonth(item.date))
    .reduce((sum, item) => sum + item.amount, 0);

  const committedBills = bills
    .filter((bill) => !bill.paid && bill.dueDate >= today && isInCurrentMonth(bill.dueDate))
    .reduce((sum, bill) => sum + bill.amount, 0);

  const committedCategories = categories.reduce((sum, category) => sum + (category.monthlyAmount / totalDaysInMonth) * daysRemaining, 0);

  const dailyBudget = (currentBalance + futureIncome - committedBills - committedCategories) / daysRemaining;

  const spentToday = transactions.filter((item) => item.type === "expense" && item.date === today).reduce((sum, item) => sum + item.amount, 0);

  return {
    today,
    daysInMonth: totalDaysInMonth,
    daysRemaining,
    currentBalance,
    futureIncome,
    committedBills,
    committedCategories,
    dailyBudget,
    spentToday,
    remainingToday: dailyBudget - spentToday,
  };
}
