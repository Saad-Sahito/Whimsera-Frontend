import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      // Supabase JS doesn't include cookies in its type definition, but it's supported.
      // We explicitly mark it so TS ignores the false-positive.
       
      // @ts-expect-error Custom cookie management for middleware
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options?: CookieOptions) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  await supabase.auth.getSession();
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
