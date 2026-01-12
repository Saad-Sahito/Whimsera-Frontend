// src/hooks/useStoryInitialization.ts
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // adjust path
import { initializeNewStory } from "../../../lib/stories/api/initializeStory";
import { continueExistingStory } from "../../../lib/stories/api/continueStory";

export const useStoryInitialization = (backend: string) => {
  const { userId, accessToken: token } = useAuth();
  const [storyId, setStoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    const init = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(window.location.search);
      const type = searchParams.get("type");
      let sid = searchParams.get("story_id");

      try {
        // 1. Create new story
        if (type === "new" && (!sid || sid === "None")) {
          sid = await initializeNewStory(backend, userId, token);
        }

        // 2. Load/continue existing story
        if (type === "continue" && sid) {
          await continueExistingStory(backend, sid, userId, token);
        }

        // Set story ID if we have one
        if (sid) {
          setStoryId(sid);
        }
      } catch (err: any) {
        console.error("Story initialization failed:", err);
        setError(err.message || "Failed to load or create story");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [userId, token, backend]);

  return { storyId, loading, error, userId, token };
};