import { NextResponse } from "next/server";
import { getUserId } from "../../../../server/auth-helpers";
import { addTicker, getWatchlistForUser } from "../../../../server/investments/watchlist";
import { rateLimit } from "../../../../server/rate-limit";

export async function GET(request: Request) {
  const userId = await getUserId();
  const limited = await rateLimit(request, "investments:read", { limit: 60, windowMs: 60_000, userId });
  if (limited) return limited;
  const { entries, isDefault } = await getWatchlistForUser(userId);
  return NextResponse.json({ data: { entries, isDefault, editable: userId !== null } });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "investments:write", { limit: 20, windowMs: 60_000, userId });
  if (limited) return limited;
  const body = (await request.json().catch(() => null)) as { ticker?: string } | null;
  if (!body?.ticker?.trim()) return NextResponse.json({ error: "ticker é obrigatório" }, { status: 400 });
  try {
    const entries = await addTicker(userId, body.ticker);
    return NextResponse.json({ data: { entries } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível adicionar o ticker" }, { status: 400 });
  }
}
