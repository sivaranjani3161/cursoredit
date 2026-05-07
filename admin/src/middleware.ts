import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { Role } from "@/types/roles";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = (token?.role as string) || "viewer";

    // Handle unauthorized users (not in DB)
    if (role === "unauthorized" && pathname !== "/unauthorized") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Root redirect: all authenticated roles go to /admin dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Master routes: Only 'admin' role can access Users and Permissions management
    if (
      (pathname.startsWith("/admin/users") || pathname.startsWith("/admin/permissions")) &&
      role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Other /admin paths (courses, blogs, etc.) are filtered by the UI based on permissions
    // but the route itself is accessible to authenticated users in the DB

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
