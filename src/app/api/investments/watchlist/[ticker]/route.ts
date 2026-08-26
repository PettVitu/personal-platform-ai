import { NextResponse } from "next/server";
import { getUserId } from "../../../../../server/auth-helpers";
import { removeTicker } from "../../../../../server/investments/watchlist";

export async function DELETE(_request: Request, context: { params: Promise<{ ticker: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { ticker } = await context.params;
  const entries = await removeTicker(userId, ticker);
  return NextResponse.json({ data: { entries } });
}
