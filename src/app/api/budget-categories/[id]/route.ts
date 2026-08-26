import { NextResponse } from "next/server";
import type { BudgetCategory } from "../../../../domain/types";
import { getUserId } from "../../../../server/auth-helpers";
import { prisma } from "../../../../server/db";
import { rateLimit } from "../../../../server/rate-limit";
import { positiveAmount } from "../../../../server/validation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "budget-categories:write", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  const { id } = await context.params;
  const existing = await prisma.budgetCategory.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
  const body = (await request.json().catch(() => null)) as Partial<BudgetCategory> | null;
  if (body?.name !== undefined && !body.name.trim()) return NextResponse.json({ error: "name não pode ser vazio" }, { status: 400 });
  if (body?.monthlyAmount !== undefined && !positiveAmount(body.monthlyAmount)) return NextResponse.json({ error: "monthlyAmount precisa ser positivo" }, { status: 400 });
  const category = await prisma.budgetCategory.update({ where: { id }, data: { ...body, id: undefined, userId: undefined } });
  return NextResponse.json({ data: category });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "budget-categories:write", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  const { id } = await context.params;
  const existing = await prisma.budgetCategory.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
  await prisma.budgetCategory.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
