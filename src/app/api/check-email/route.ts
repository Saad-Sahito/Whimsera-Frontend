
import { NextRequest, NextResponse } from "next/server";
import { User, createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Minimal server-side helper to create a Supabase admin client.
 * Uses SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from environment.
 */
async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  }
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const supabase = await createSupabaseServerClient();

  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const emailExists = users.some((user: User) => user.email === email);
  return NextResponse.json({ exists: emailExists });
}
