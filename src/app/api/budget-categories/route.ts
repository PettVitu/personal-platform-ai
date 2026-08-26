import { NextResponse } from "next/server";
import type { BudgetCategory } from "../../../domain/types";
import { getUserId } from "../../../server/auth-helpers";
import { prisma } from "../../../server/db";
import { rateLimit } from "../../../server/rate-limit";
import { positiveAmount } from "../../../server/validation";

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "budget-categories:read", { limit: 120, windowMs: 60_000, userId });
  if (limited) return limited;
  const categories = await prisma.budgetCategory.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ data: categories });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "budget-categories:write", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  const body = (await request.json().catch(() => null)) as Partial<BudgetCategory> | null;
  if (!body?.name?.trim() || !positiveAmount(body.monthlyAmount)) return NextResponse.json({ error: "name e monthlyAmount positivo são obrigatórios" }, { status: 400 });
  const category = await prisma.budgetCategory.create({ data: { userId, name: body.name.trim(), monthlyAmount: body.monthlyAmount } });
  return NextResponse.json({ data: category }, { status: 201 });
}
