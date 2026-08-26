import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((request) => {
  if (request.auth) return;
  const isApi = request.nextUrl.pathname.startsWith("/api/");
  if (isApi) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const signInUrl = new URL("/api/auth/signin", request.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: ["/((?!api/auth|api/health|api/investments|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icon.svg).*)"],
};
