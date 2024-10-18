import { NextRequest, NextResponse } from "next/server";
import { getToken, GetTokenParams } from "next-auth/jwt";

// Define your secret (you should have a secret key in your NextAuth.js config)
const secret = process.env.NEXTAUTH_SECRET;

if (secret==undefined) {
  throw new Error("NEXTAUTH_SECRET is not set in the environment variables");
}
export async function middleware(req: NextRequest) {
  // Type the parameters for `getToken` by using `GetTokenParams` and ensuring compatibility with `NextRequest`
  const getTokenParams: GetTokenParams = {
    req: req as unknown as GetTokenParams['req'], // Type casting to satisfy the type requirement
    secret,
  };

  // Extract the token using the properly typed `getTokenParams`
  const token = await getToken(getTokenParams);

  const { pathname } = req.nextUrl;

  // If the user has a token, allow access
  if (token) {
    return NextResponse.next();
  }

  // If the user is trying to access a protected route and not authenticated
  if (pathname.startsWith("/profile") || pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow requests to public routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/setting","/profile", "/dashboard/:path*"], // Define the routes to be protected
};
