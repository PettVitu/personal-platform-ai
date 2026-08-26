import { NextResponse } from "next/server";
import type { Transaction, TransactionType } from "../../../domain/types";
import { getUserId } from "../../../server/auth-helpers";
import { prisma } from "../../../server/db";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const transactions = await prisma.transaction.findMany({ where: { userId }, orderBy: { date: "asc" } });
  return NextResponse.json({ data: transactions });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Partial<Transaction> | null;
  if (!body?.description?.trim() || typeof body.amount !== "number" || body.amount <= 0 || !body.date) return NextResponse.json({ error: "description, amount positivo e date são obrigatórios" }, { status: 400 });
  const transaction = await prisma.transaction.create({
    data: { userId, type: body.type ?? ("expense" as TransactionType), description: body.description.trim(), amount: body.amount, date: body.date, category: body.category ?? "Geral", account: body.account ?? "Conta principal" },
  });
  return NextResponse.json({ data: transaction }, { status: 201 });
}
