import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { apiStore } from "../../../server/store";
import type { Transaction, TransactionType } from "../../../domain/types";

export function GET() {
  return NextResponse.json({ data: apiStore.transactions });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Partial<Transaction> | null;
  if (!body?.description?.trim() || typeof body.amount !== "number" || body.amount <= 0 || !body.date) return NextResponse.json({ error: "description, amount positivo e date são obrigatórios" }, { status: 400 });
  const transaction: Transaction = { id: randomUUID(), type: body.type ?? ("expense" as TransactionType), description: body.description.trim(), amount: body.amount, date: body.date, category: body.category ?? "Geral", account: body.account ?? "Conta principal" };
  apiStore.transactions.push(transaction);
  return NextResponse.json({ data: transaction }, { status: 201 });
}
