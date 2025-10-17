
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { uniqueUserTag, nickname, age } = body;

  if (!uniqueUserTag || !nickname) {
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

    // Check if tag exists
    const { count: tagCount, error: tagCheckError } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("unique_user_tag", uniqueUserTag);

    if (tagCheckError) {
      console.error("Tag check error:", tagCheckError);
      return NextResponse.json({ error: "Error checking tag" }, { status: 500 });
    }

    if (tagCount && tagCount > 0) {
      return NextResponse.json({ error: "user_tag_taken" }, { status: 409 });
    }

    // Insert profile row
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: user.id,
      unique_user_tag: uniqueUserTag,
      nickname,
      age: age ?? null,
    });

    if (profileError) {
      console.error("Profile insert failed:", profileError);
      const isDup = profileError.message?.includes("duplicate key") || profileError.code === "23505";
      return NextResponse.json(
        { error: isDup ? "user_tag_taken_race" : "profile_insert_failed" },
        { status: isDup ? 409 : 500 }
      );
    }

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
