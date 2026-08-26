import { NextResponse } from "next/server";
import type { Priority, Task } from "../../../domain/types";
import { getUserId } from "../../../server/auth-helpers";
import { prisma } from "../../../server/db";
import { rateLimit } from "../../../server/rate-limit";
import { isDate, isPriority } from "../../../server/validation";

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "tasks:read", { limit: 120, windowMs: 60_000, userId });
  if (limited) return limited;
  const tasks = await prisma.task.findMany({ where: { userId }, orderBy: { date: "asc" } });
  return NextResponse.json({ data: tasks });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "tasks:write", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  const body = (await request.json().catch(() => null)) as Partial<Task> | null;
  if (!body?.title?.trim() || !isDate(body.date) || (body.priority !== undefined && !isPriority(body.priority))) return NextResponse.json({ error: "Dados de tarefa inválidos" }, { status: 400 });
  const task = await prisma.task.create({
    data: { userId, title: body.title.trim(), date: body.date, time: body.time, priority: (body.priority ?? "media") as Priority, notes: body.notes },
  });
  return NextResponse.json({ data: task }, { status: 201 });
}
