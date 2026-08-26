import { NextResponse } from "next/server";
import type { RecurringBill } from "../../../domain/types";
import { getUserId } from "../../../server/auth-helpers";
import { prisma } from "../../../server/db";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const bills = await prisma.recurringBill.findMany({ where: { userId }, orderBy: { dueDate: "asc" } });
  return NextResponse.json({ data: bills });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Partial<RecurringBill> | null;
  if (!body?.name?.trim() || typeof body.amount !== "number" || body.amount <= 0 || !body.dueDate) return NextResponse.json({ error: "name, amount positivo e dueDate são obrigatórios" }, { status: 400 });
  const bill = await prisma.recurringBill.create({ data: { userId, name: body.name.trim(), amount: body.amount, dueDate: body.dueDate, paid: false } });
  return NextResponse.json({ data: bill }, { status: 201 });
}
