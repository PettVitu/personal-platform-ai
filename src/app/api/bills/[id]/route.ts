import { NextResponse } from "next/server";
import type { RecurringBill } from "../../../../domain/types";
import { getUserId } from "../../../../server/auth-helpers";
import { prisma } from "../../../../server/db";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { id } = await context.params;
  const existing = await prisma.recurringBill.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 });
  const body = (await request.json().catch(() => null)) as Partial<RecurringBill> | null;
  const bill = await prisma.recurringBill.update({ where: { id }, data: { ...body, id: undefined, userId: undefined } });
  return NextResponse.json({ data: bill });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { id } = await context.params;
  const existing = await prisma.recurringBill.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 });
  await prisma.recurringBill.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
