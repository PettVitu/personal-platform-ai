import type { Priority, TaskStatus, TransactionType } from "../domain/types";

export function isPriority(value: unknown): value is Priority { return value === "alta" || value === "media" || value === "baixa"; }
export function isTaskStatus(value: unknown): value is TaskStatus { return value === "pending" || value === "completed"; }
export function isTransactionType(value: unknown): value is TransactionType { return value === "income" || value === "expense"; }
export function isDate(value: unknown): value is string { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value); }
export function positiveAmount(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value) && value > 0; }
