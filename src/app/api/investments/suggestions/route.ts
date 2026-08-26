import { NextResponse } from "next/server";
import { getUserId } from "../../../../server/auth-helpers";
import { buildSuggestions } from "../../../../server/investments/suggestions";
import { rateLimit } from "../../../../server/rate-limit";

// Sem sessão, usa a watchlist padrão — este endpoint não exige login (não expõe
// dado pessoal). Com sessão, personaliza pela watchlist do usuário logado.
// Limite mais apertado porque cada chamada consome cota das APIs externas
// (Brapi/Marketaux, ambas de plano gratuito).
export async function GET(request: Request) {
  const userId = await getUserId();
  const limited = await rateLimit(request, "investments:suggestions", { limit: 20, windowMs: 60_000, userId });
  if (limited) return limited;
  const result = await buildSuggestions(userId);
  return NextResponse.json({ data: result });
}
