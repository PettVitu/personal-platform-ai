import { NextResponse } from "next/server";
import { buildSuggestions } from "../../../../server/investments/suggestions";

export async function GET() {
  const result = await buildSuggestions();
  return NextResponse.json({ data: result });
}
