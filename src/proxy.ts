import { NextResponse, type NextRequest } from "next/server";
import { ROLE_REDIRECTS, type Role } from "@/types/auth";

const SESSION_COOKIE = "df_session";
const ROLE_COOKIE = "df_role";

const ROUTE_ROLES: Record<string, Role> = {
  "/admin": "ADMIN",
  "/mco": "MILK_COLLECTION_OFFICER",
  "/farmer": "FARMER",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedPrefix = Object.keys(ROUTE_ROLES).find((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!matchedPrefix) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = request.cookies.get(ROLE_COOKIE)?.value as Role | undefined;
  const requiredRole = ROUTE_ROLES[matchedPrefix];

  if (role && role !== requiredRole) {
    const destination = ROLE_REDIRECTS[role] ?? "/login";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mco/:path*", "/farmer/:path*"],
};
