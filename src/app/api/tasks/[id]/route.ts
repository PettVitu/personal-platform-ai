import { NextResponse } from "next/server";
import { apiStore } from "../../../../server/store";
import type { Task } from "../../../../domain/types";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const index = apiStore.tasks.findIndex((task) => task.id === id); if (index < 0) return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  const body = await request.json().catch(() => null) as Partial<Task> | null; apiStore.tasks[index] = { ...apiStore.tasks[index], ...body, id }; return NextResponse.json({ data: apiStore.tasks[index] });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const index = apiStore.tasks.findIndex((task) => task.id === id); if (index < 0) return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 }); apiStore.tasks.splice(index, 1); return new NextResponse(null, { status: 204 });
}
