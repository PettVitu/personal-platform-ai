import { NextResponse } from "next/server";
import { getUserId } from "../../../../../server/auth-helpers";
import { removeTicker } from "../../../../../server/investments/watchlist";
import { rateLimit } from "../../../../../server/rate-limit";

export async function DELETE(request: Request, context: { params: Promise<{ ticker: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "investments:write", { limit: 20, windowMs: 60_000, userId });
  if (limited) return limited;
  const { ticker } = await context.params;
  const entries = await removeTicker(userId, ticker);
  return NextResponse.json({ data: { entries } });
}
