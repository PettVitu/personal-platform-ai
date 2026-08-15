import { NextResponse } from "next/server";
import { apiStore } from "../../../../server/store";
import type { Transaction } from "../../../../domain/types";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const index = apiStore.transactions.findIndex((item) => item.id === id); if (index < 0) return NextResponse.json({ error: "Lançamento não encontrado" }, { status: 404 }); const body = await request.json().catch(() => null) as Partial<Transaction> | null; apiStore.transactions[index] = { ...apiStore.transactions[index], ...body, id }; return NextResponse.json({ data: apiStore.transactions[index] });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const index = apiStore.transactions.findIndex((item) => item.id === id); if (index < 0) return NextResponse.json({ error: "Lançamento não encontrado" }, { status: 404 }); apiStore.transactions.splice(index, 1); return new NextResponse(null, { status: 204 });
}
