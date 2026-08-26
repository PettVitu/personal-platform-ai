import { NextResponse } from "next/server";
import type { RecurringBill } from "../../../../domain/types";
import { getUserId } from "../../../../server/auth-helpers";
import { prisma } from "../../../../server/db";
import { rateLimit } from "../../../../server/rate-limit";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "bills:write", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  const { id } = await context.params;
  const existing = await prisma.recurringBill.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 });
  const body = (await request.json().catch(() => null)) as Partial<RecurringBill> | null;
  const bill = await prisma.recurringBill.update({ where: { id }, data: { ...body, id: undefined, userId: undefined } });
  return NextResponse.json({ data: bill });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "bills:write", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  const { id } = await context.params;
  const existing = await prisma.recurringBill.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 });
  await prisma.recurringBill.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
