// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;

  // --- Redirect logged-in users from auth pages ---
  if (
    token &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/admin/signin"))
  ) {
    const redirectTo = token.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // --- Protect Admin Routes ---
  if (
    url.pathname.startsWith("/admin") &&
    url.pathname !== "/admin/signin" &&
    url.pathname !== "/admin/signup"
  ) {
    if (!token || token.role !== "admin") {
      // Redirect non-admins trying to access admin pages to the admin sign-in page
      return NextResponse.redirect(new URL("/admin/signin", request.url));
    }
  }

  // --- Protect General Content Pages ---
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// Update the matcher to include the new admin route
export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/signout",
    "/dashboard/:path*",
    "/schedule/:path*",
    "/verify",
    "/admin/:path*", // Add the admin route to the matcher
  ],
};
