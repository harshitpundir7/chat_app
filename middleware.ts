import { NextRequest, NextResponse } from "next/server";
import { getToken, GetTokenParams } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

if (!secret) {
  throw new Error("NEXTAUTH_SECRET is not set in the environment variables");
}
export async function middleware(req: NextRequest) {
  const getTokenParams: GetTokenParams = {
    req: req as unknown as GetTokenParams['req'],
    secret: secret!,
    salt: ""
  };

  const token = await getToken(getTokenParams);

  const { pathname } = req.nextUrl;

  if (token) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/profile") || pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url ?? "");
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/setting", "/profile", "/dashboard/:path*"],
};
