import { NextResponse } from "next/server";
import type { Transaction, TransactionType } from "../../../domain/types";
import { getUserId } from "../../../server/auth-helpers";
import { prisma } from "../../../server/db";
import { rateLimit } from "../../../server/rate-limit";

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "transactions:read", { limit: 120, windowMs: 60_000, userId });
  if (limited) return limited;
  const transactions = await prisma.transaction.findMany({ where: { userId }, orderBy: { date: "asc" } });
  return NextResponse.json({ data: transactions });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "transactions:write", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  const body = (await request.json().catch(() => null)) as Partial<Transaction> | null;
  if (!body?.description?.trim() || typeof body.amount !== "number" || body.amount <= 0 || !body.date) return NextResponse.json({ error: "description, amount positivo e date são obrigatórios" }, { status: 400 });
  const transaction = await prisma.transaction.create({
    data: { userId, type: body.type ?? ("expense" as TransactionType), description: body.description.trim(), amount: body.amount, date: body.date, category: body.category ?? "Geral", account: body.account ?? "Conta principal" },
  });
  return NextResponse.json({ data: transaction }, { status: 201 });
}
