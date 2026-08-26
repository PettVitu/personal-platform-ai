import { NextResponse } from "next/server";
import { getHistory } from "../../../../server/investments/history";

export async function GET() {
  return NextResponse.json({ data: await getHistory() });
}
