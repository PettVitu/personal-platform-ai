import { NextResponse } from "next/server";
import { apiStore } from "../../../../server/store";
import type { RecurringBill } from "../../../../domain/types";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { const { id } = await context.params; const index = apiStore.bills.findIndex((bill) => bill.id === id); if (index < 0) return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 }); const body = await request.json().catch(() => null) as Partial<RecurringBill> | null; apiStore.bills[index] = { ...apiStore.bills[index], ...body, id }; return NextResponse.json({ data: apiStore.bills[index] }); }
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) { const { id } = await context.params; const index = apiStore.bills.findIndex((bill) => bill.id === id); if (index < 0) return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 }); apiStore.bills.splice(index, 1); return new NextResponse(null, { status: 204 }); }
