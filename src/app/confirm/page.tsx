
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { createClient } from "@supabase/supabase-js";

export default function Confirm() {
  const { setAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("🔥 No valid session found:", error);
          router.push("/login"); // Redirect to login if no valid session
          return;
        }

        // ✅ Set authenticated state and redirect to profile setup
        setAuthenticated(true);
        router.push("/profile-setup");
      } catch (error) {
        console.error("🔥 Error checking session:", error);
        router.push("/login");
      }
    };

    checkSession();
  }, [router, setAuthenticated]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div className="relative z-20 text-white text-lg">
        Verifying your email... Please wait.
      </div>
    </main>
  );
}
