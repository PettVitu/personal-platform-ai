import { NextResponse } from "next/server";
import type { Appointment } from "../../../domain/types";
import { getUserId } from "../../../server/auth-helpers";
import { prisma } from "../../../server/db";
import { rateLimit } from "../../../server/rate-limit";
import { isDate } from "../../../server/validation";

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "appointments:read", { limit: 120, windowMs: 60_000, userId });
  if (limited) return limited;
  const appointments = await prisma.appointment.findMany({ where: { userId }, orderBy: [{ date: "asc" }, { time: "asc" }] });
  return NextResponse.json({ data: appointments });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "appointments:write", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  const body = (await request.json().catch(() => null)) as Partial<Appointment> | null;
  if (!body?.title?.trim() || !isDate(body.date) || !body.time?.trim()) return NextResponse.json({ error: "title, date e time são obrigatórios" }, { status: 400 });
  const appointment = await prisma.appointment.create({ data: { userId, title: body.title.trim(), date: body.date, time: body.time.trim(), location: body.location } });
  return NextResponse.json({ data: appointment }, { status: 201 });
}
