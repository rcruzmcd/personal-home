import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// A new client is created per request — Server Components can't set
// cookies, so writes fail silently there and rely on the proxy (below) to
// keep the session refreshed.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — ignore, the proxy handles
            // session refresh on the way in.
          }
        },
      },
    }
  );
}
