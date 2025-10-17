
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetup() {
  const { setAuthenticated, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tagError, setTagError] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setTagError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const uniqueUserTag = formData.get("uniqueUserTag") as string;
    const nickname = formData.get("nickname") as string;
    const age = formData.get("age") ? parseInt(formData.get("age") as string) : null;

    if (!uniqueUserTag || !nickname) {
      setFormError("All required fields must be filled");
      setLoading(false);
      return;
    }

    try {
      // Log accessToken for debugging
      console.log("Sending request to /api/register-with-tag with accessToken:", accessToken);

      // Call Supabase /api/register-with-tag
      const resp = await fetch("/api/register-with-tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ uniqueUserTag, nickname, age }),
      });

      const json = await resp.json();
      console.log("Response from /api/register-with-tag:", json);

      if (!resp.ok) {
        if (json.error === "user_tag_taken" || json.error === "user_tag_taken_race") {
          setTagError("This user tag is already taken");
        } else if (json.error.includes("Unauthorized")) {
          setFormError("Authentication failed. Please log in again.");
          router.push("/login");
        } else {
          setFormError("Profile setup failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      const newUserId = json.userId || json.id;

      // Only proceed to FastAPI call if Supabase call succeeds
      try {
        const payload = {
          nickname,
          user_tag: uniqueUserTag,
          age,
          stories: [],
          user_id: newUserId,
        };
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        console.log("Sending request to FastAPI /users:", payload);
        const backendResp = await fetch(`${backendUrl}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!backendResp.ok) {
          console.error("FastAPI response:", await backendResp.text());
          setFormError("Profile setup succeeded but backend registration failed.");
          setLoading(false);
          return;
        }

        console.log("FastAPI registration successful");
        router.push("/dashboard");
      } catch (err) {
        console.error("🔥 Backend request failed:", err);
        setFormError("Profile setup succeeded but backend registration failed. Please contact support.");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("🔥 Error in profile setup:", error);
      setFormError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/download.jpeg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 bg-white/10 shadow-2xl w-[90%] max-w-xl flex flex-col items-center backdrop-blur-lg signup-box"
        style={{
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.85), rgba(0, 191, 166, 0.85))",
          padding: "28px",
          gap: "25px",
          borderRadius: "48px",
        }}
      >
        <Link
          href="/"
          className="text-6xl md:text-7xl lg:text-8xl leading-none font-bold text-white drop-shadow-lg"
          style={{ fontFamily: "var(--font-annie)" }}
        >
          Whimsera
        </Link>

        <h2 className="text-3xl font-fredoka font-bold text-white">Set Up Your Profile</h2>

        {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}

        <form className="w-full flex flex-col space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col text-left">
            <label className="text-lg font-nunito mb-2 text-white">Unique User Tag</label>
            <input
              type="text"
              name="uniqueUserTag"
              placeholder="@dreamweaver"
              className="px-4 py-3 rounded-xl border border-white/50 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white text-lg"
              required
            />
            {tagError && <p className="text-red-500 text-sm mt-1">{tagError}</p>}
          </div>
          <div className="flex flex-col text-left">
            <label className="text-lg font-nunito mb-2 text-white">Nickname</label>
            <input
              type="text"
              name="nickname"
              placeholder="Your nickname (e.g., Luna)"
              className="px-4 py-3 rounded-xl border border-white/50 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white text-lg"
              required
            />
          </div>
          <div className="flex flex-col text-left">
            <label className="text-lg font-nunito mb-2 text-white">Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              className="px-4 py-3 rounded-xl border border-white/50 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00BFA6] to-[#FFD166] text-[#2D3436] py-3 rounded-xl text-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Setting Up..." : "Complete Profile"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
