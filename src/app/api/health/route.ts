import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "personal-platform-ai-api",
    persistence: process.env.DATABASE_URL ? "postgres" : "not-configured",
    authentication: process.env.AUTH_GOOGLE_ID ? "google" : "not-configured",
  });
}
