//src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true, // ✅ keeps session in localStorage
      autoRefreshToken: true, // ✅ automatically refreshes expired tokens
      detectSessionInUrl: true,
    },
  }
);
