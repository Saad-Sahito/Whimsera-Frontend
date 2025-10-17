// app/api/register/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/confirm`,
      },
    });

    if (error) {
      if (error.code === "user_already_exists") {
        return NextResponse.json(
          { error: "email_taken" },
          { status: 400 }
        );
      }
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("User creation failed");
    }

    return NextResponse.json(
      { userId: data.user.id, message: "Registration successful, please check your email to confirm" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}