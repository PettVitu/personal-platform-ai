import { NextResponse } from "next/server";
import type { Task } from "../../../../domain/types";
import { getUserId } from "../../../../server/auth-helpers";
import { prisma } from "../../../../server/db";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { id } = await context.params;
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  const body = (await request.json().catch(() => null)) as Partial<Task> | null;
  const task = await prisma.task.update({ where: { id }, data: { ...body, id: undefined, userId: undefined } });
  return NextResponse.json({ data: task });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { id } = await context.params;
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  await prisma.task.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
