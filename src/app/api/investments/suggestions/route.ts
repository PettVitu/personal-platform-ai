import { NextResponse } from "next/server";
import { getUserId } from "../../../../server/auth-helpers";
import { buildSuggestions } from "../../../../server/investments/suggestions";

// Sem sessão, usa a watchlist padrão — este endpoint não exige login (não expõe
// dado pessoal). Com sessão, personaliza pela watchlist do usuário logado.
export async function GET() {
  const userId = await getUserId();
  const result = await buildSuggestions(userId);
  return NextResponse.json({ data: result });
}
