import NextAuth from "next-auth";
import { auth } from "@/auth";

export { auth as middleware } from "@/auth";

export default NextAuth(auth).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
