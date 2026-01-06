import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Protected routes - require authentication
  const protectedPaths = ["/payment", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Auth pages that should redirect if already logged in
  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.includes(request.nextUrl.pathname);

  // Only check auth for protected routes or auth pages
  // For public routes, skip auth check to avoid timeout
  if (isProtectedPath || isAuthPath) {
    try {
      // Add timeout to prevent hanging requests
      const getUserPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth check timeout")), 5000)
      );

      const {
        data: { user },
      } = await Promise.race([getUserPromise, timeoutPromise]) as {
        data: { user: any };
      };

      if (isProtectedPath && !user) {
        // Redirect to login if trying to access protected route without auth
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }

      if (isAuthPath && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/marketplace";
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // If auth check fails or times out, allow the request to proceed
      // This prevents the entire site from being blocked if Supabase is slow
      console.error("Auth check error in middleware:", error);
      
      // For protected routes, redirect to login on error
      if (isProtectedPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
      
      // For auth pages or public routes, allow access
      return supabaseResponse;
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse;
}
