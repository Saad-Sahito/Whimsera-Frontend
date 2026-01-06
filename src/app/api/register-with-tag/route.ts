import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nickname, age } = body;

  if (!nickname) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Log environment variables for debugging
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing");

  // Initialize Supabase client with anon key for user token validation
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    // Log headers for debugging
    const authHeader = req.headers.get("Authorization");
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing or invalid Authorization header" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Token:", token.slice(0, 20) + "..."); // Log partial token for security

    // Validate user with access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error("User fetch error:", userError?.message);
      return NextResponse.json({ error: `Unauthorized: Invalid token - ${userError?.message || "No user found"}` }, { status: 401 });
    }

    console.log("Authenticated user:", user.id);

    // Use service role client for database operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if profile already exists for this user
    const { count: profileCount, error: profileCheckError } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("id", user.id);

    if (profileCheckError) {
      console.error("Profile check error:", profileCheckError);
      return NextResponse.json({ error: "Error checking profile" }, { status: 500 });
    }

    if (profileCount && profileCount > 0) {
      return NextResponse.json({ error: "profile_already_exists" }, { status: 409 });
    }

    // Insert profile row
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: user.id,
      nickname,
      age: age ?? null,
    });

    if (profileError) {
      console.error("Profile insert failed:", profileError);
      const isDup = profileError.message?.includes("duplicate key") || profileError.code === "23505";
      return NextResponse.json(
        { error: isDup ? "profile_already_exists" : "profile_insert_failed" },
        { status: isDup ? 409 : 500 }
      );
    }

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}