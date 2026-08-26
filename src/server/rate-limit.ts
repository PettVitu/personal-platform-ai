import { NextResponse } from "next/server";
import { prisma } from "./db";

// Sem Redis/KV disponível (ver docs/00-continuidade.md) — usa o próprio Postgres.
// A janela de tempo fica embutida na chave (fixed window), então cada linha é
// escrita uma única vez por identificador+janela: um upsert atômico basta, sem
// corrida de leitura-e-reset. As linhas velhas são varridas de vez em quando.
const CLEANUP_PROBABILITY = 0.02;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

async function hit(identifier: string, scope: string, windowMs: number): Promise<number> {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const key = `${scope}:${identifier}:${windowStart}`;
  const entry = await prisma.rateLimitEntry.upsert({
    where: { key },
    create: { key, windowStart: new Date(windowStart) },
    update: { count: { increment: 1 } },
  });
  if (Math.random() < CLEANUP_PROBABILITY) {
    prisma.rateLimitEntry.deleteMany({ where: { windowStart: { lt: new Date(Date.now() - windowMs * 10) } } }).catch(() => undefined);
  }
  return entry.count;
}

/** Identifica por usuário logado quando existe, senão por IP. Retorna uma resposta 429 pronta ou null se liberado. */
export async function rateLimit(request: Request, scope: string, { limit, windowMs, userId }: { limit: number; windowMs: number; userId?: string | null }): Promise<NextResponse | null> {
  const identifier = userId ?? clientIp(request);
  const count = await hit(identifier, scope, windowMs);
  if (count <= limit) return null;
  return NextResponse.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
}
