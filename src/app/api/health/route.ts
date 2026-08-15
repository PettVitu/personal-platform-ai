import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", service: "personal-platform-ai-api", persistence: "memory", authentication: "pending" });
}
