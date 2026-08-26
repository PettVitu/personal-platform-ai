import { NextResponse } from "next/server";
import { getUserId } from "../../../../server/auth-helpers";
import { getInvestmentInsights } from "../../../../server/investments/insights";
import { rateLimit } from "../../../../server/rate-limit";

// Público como os demais endpoints de investimentos (não expõe dado pessoal —
// os insights vêm do histórico agregado, não de dado de um usuário específico).
export async function GET(request: Request) {
  const userId = await getUserId();
  const limited = await rateLimit(request, "investments:insights", { limit: 30, windowMs: 60_000, userId });
  if (limited) return limited;
  return NextResponse.json({ data: await getInvestmentInsights() });
}
