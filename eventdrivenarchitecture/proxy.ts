import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/api/webhook/register", "/sign-in", "/sign-up"];

export default async function middleware(req: NextRequest) {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // ---------------------------
  // Unauthenticated Users
  // ---------------------------
  if (!userId && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ---------------------------
  // Authenticated Users
  // ---------------------------
  if (userId) {
    try {
      const user = await currentUser();
      const role = user?.publicMetadata?.role as string | undefined;

      // Admin redirect to admin-dashboard when visiting /dashboard
      if (role === "admin" && pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      // Block non-admin users from admin routes
      if (role !== "admin" && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Redirect authenticated users trying to access public routes(meaning signin and signup or any)
      if (publicRoutes.includes(pathname)) {
        return NextResponse.redirect(
          new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", req.url)
        );
      }
    } catch (error) {
      console.error("Error fetching user data from Clerk:", error);
      return NextResponse.redirect(new URL("/error", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
