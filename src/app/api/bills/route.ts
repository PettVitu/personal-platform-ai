import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { apiStore } from "../../../server/store";
import type { RecurringBill } from "../../../domain/types";

export function GET() { return NextResponse.json({ data: apiStore.bills }); }
export async function POST(request: Request) { const body = await request.json().catch(() => null) as Partial<RecurringBill> | null; if (!body?.name?.trim() || typeof body.amount !== "number" || body.amount <= 0 || !body.dueDate) return NextResponse.json({ error: "name, amount positivo e dueDate são obrigatórios" }, { status: 400 }); const bill: RecurringBill = { id: randomUUID(), name: body.name.trim(), amount: body.amount, dueDate: body.dueDate, paid: false }; apiStore.bills.push(bill); return NextResponse.json({ data: bill }, { status: 201 }); }
