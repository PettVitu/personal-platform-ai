import { NextResponse } from "next/server";
import { getHistory } from "../../../../server/investments/history";

export function GET() {
  return NextResponse.json({ data: getHistory() });
}
