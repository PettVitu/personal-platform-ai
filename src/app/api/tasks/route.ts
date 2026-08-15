import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { apiStore } from "../../../server/store";
import type { Priority, Task } from "../../../domain/types";

export function GET() {
  return NextResponse.json({ data: apiStore.tasks });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Partial<Task> | null;
  if (!body?.title?.trim() || !body.date) return NextResponse.json({ error: "title e date são obrigatórios" }, { status: 400 });
  const task: Task = { id: randomUUID(), title: body.title.trim(), date: body.date, time: body.time, priority: body.priority ?? ("media" as Priority), status: "pending", notes: body.notes };
  apiStore.tasks.push(task);
  return NextResponse.json({ data: task }, { status: 201 });
}
