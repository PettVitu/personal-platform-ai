import { NextResponse } from "next/server";
import { getHistory } from "../../../../server/investments/history";
import { rateLimit } from "../../../../server/rate-limit";

export async function GET(request: Request) {
  const limited = await rateLimit(request, "investments:history", { limit: 60, windowMs: 60_000 });
  if (limited) return limited;
  return NextResponse.json({ data: await getHistory() });
}
