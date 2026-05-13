import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { Role } from "@/types/roles";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = (token?.role as string) || "viewer";

    if (role === "unauthorized" && pathname !== "/unauthorized") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (
      (pathname.startsWith("/admin/users") || pathname.startsWith("/admin/permissions")) &&
      role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

 

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/admin/:path*", "/unauthorized"],
};
