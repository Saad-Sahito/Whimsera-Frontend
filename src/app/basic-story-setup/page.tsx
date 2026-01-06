// Updated page.tsx (removes right panel, uses enhanced draggable Sidebar)
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import DynamicPhaseEditor from "./components/DynamicPhaseEditor";
import { PHASES, GENRES, TONES } from "../config/storyConstants";
import { ChevronDown, ChevronUp, X } from "lucide-react";

export default function WhimseraPlanner() {
  const { accessToken, userId, isAuthenticated, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const backend = process.env.NEXT_PUBLIC_API_BASE_URL;

  // --- STATE ---
  const [storyId, setStoryId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [maxReachedPhaseIndex, setMaxReachedPhaseIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [openPhases, setOpenPhases] = useState<number[]>([0]);
  const [metadata, setMetadata] = useState<any>(null);
  const [editedMetadata, setEditedMetadata] = useState<any>(null);
  const [metadataOpen, setMetadataOpen] = useState(true);
  const [initLoading, setInitLoading] = useState(true);

  // --- AUTH CHECK ---
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // --- STORY INITIALIZATION ---
  useEffect(() => {
    const initializeStory = async () => {
      if (!userId || !accessToken) return;
      const type = searchParams.get('type');
      setInitLoading(true);

      if (type === 'continue') {
        const passedStoryId = searchParams.get('story_id');
        if (!passedStoryId || passedStoryId === 'None') {
          console.error("Invalid story_id for continue");
          setInitLoading(false);
          return;
        }

        try {
          await fetch(`${backend}/stories/continue_story`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            body: JSON.stringify({ user_id: userId, story_id: passedStoryId })
          });

          const progressRes = await fetch(`${backend}/stories/progress/${userId}/${passedStoryId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}` }
          });
          const progressJson = await progressRes.json();

          if (progressJson.status === "success" && progressJson.data) {
            const { latest_phase } = progressJson.data;
            const phaseIdx = typeof latest_phase === 'number' ? latest_phase : parseInt(latest_phase) || 0;
            const safePhase = Math.min(Math.max(0, phaseIdx), PHASES.length - 1);

            setMaxReachedPhaseIndex(safePhase);
            setActiveStepIndex(safePhase);
            setOpenPhases([safePhase]);
            setCompletedSteps(PHASES.slice(0, safePhase).map(p => p.id));
          }

          setStoryId(passedStoryId);
        } catch (e) {
          console.error(e);
        }
      } else if (type === 'new') {
        try {
          const res = await fetch(`${backend}/stories/initialize_story?user_id=${userId}`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "POST"
          });
          const data = await res.json();
          if (data.story_id) {
            setStoryId(data.story_id);
            setActiveStepIndex(0);
            setMaxReachedPhaseIndex(0);
            setOpenPhases([0]);
            setCompletedSteps([]);
          }
        } catch (e) {
          console.error(e);
        }
      }

      setInitLoading(false);
    };

    initializeStory();
  }, [userId, accessToken, searchParams, backend]);

  // --- METADATA FETCH (with defaults) ---
  useEffect(() => {
    if (!storyId || !accessToken || !userId) return;

    const fetchMetadata = async () => {
      try {
        const res = await fetch(`${backend}/stories/progress/${userId}/${storyId}/update-request`, {
          headers: { "Authorization": `Bearer ${accessToken}` }
        });
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setMetadata(json.data);
          setEditedMetadata(json.data);
        } else {
          const defaults = {
            genre: "Fantasy",
            tone: "Hopeful",
            target_audience_age: 18,
            themes: "",
            user_notes: ""
          };
          setMetadata(defaults);
          setEditedMetadata(defaults);
        }
      } catch (e) {
        console.error(e);
        const defaults = {
          genre: "Fantasy",
          tone: "Hopeful",
          target_audience_age: 18,
          themes: "",
          user_notes: ""
        };
        setMetadata(defaults);
        setEditedMetadata(defaults);
      }
    };

    fetchMetadata();
  }, [storyId, accessToken, userId, backend]);

  // --- AUTO-OPEN ACTIVE PHASE ---
  useEffect(() => {
    setOpenPhases(prev => prev.includes(activeStepIndex) ? prev : [...prev, activeStepIndex]);
  }, [activeStepIndex]);

  // --- HANDLERS ---
  const handlePhaseCompletion = (phaseId: string) => {
    if (!completedSteps.includes(phaseId)) {
      setCompletedSteps(prev => [...prev, phaseId]);
    }

    const currentIndex = PHASES.findIndex(p => p.id === phaseId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < PHASES.length) {
      setMaxReachedPhaseIndex(prev => Math.max(prev, nextIndex));
    }
  };

  const handleMetadataSave = async () => {
    if (!editedMetadata || !storyId || !accessToken || !userId) return;

    try {
      const res = await fetch(`${backend}/stories/progress/${userId}/${storyId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
        body: JSON.stringify(editedMetadata)
      });

      if (res.ok) {
        setMetadata(editedMetadata);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragStart = (index: number) => {
    // Optional: visual feedback if needed
  };

  // --- LOADING ---
  if (authLoading || initLoading) {
    return (
      <div className="h-screen flex flex-col gap-4 items-center justify-center text-[#636E72] font-bold bg-[#F5F9FF]">
        <div className="w-12 h-12 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin"></div>
        Loading Studio...
      </div>
    );
  }

  if (!storyId) {
    return <div className="p-10 text-center text-red-600">Failed to initialize story.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F1] via-[#F5F9FF] to-[#F0FFF9] flex font-sans text-[#2D3436]">
      <Sidebar
        activeStepIndex={activeStepIndex}
        maxReachedPhaseIndex={maxReachedPhaseIndex}
        completedSteps={completedSteps}
        onNavigate={setActiveStepIndex}
        openPhases={openPhases}
        onDragStart={handleDragStart}
      />

      <main className="flex-1 relative">
        {/* Workspace - Drop Zone */}
        <div
          className="overflow-x-auto py-12 px-6 h-full"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const indexStr = e.dataTransfer.getData("phaseIndex");
            if (indexStr) {
              const index = parseInt(indexStr);
              if (index <= maxReachedPhaseIndex && !openPhases.includes(index)) {
                setOpenPhases(prev => [...prev, index]);
              }
            }
          }}
        >
          <div className="flex gap-12 min-h-screen items-start">
            {openPhases.map((index) => {
              const phase = PHASES[index];
              const isActive = index === activeStepIndex;

              return (
                <div key={index} className="min-w-[800px] max-w-5xl flex-shrink-0">
                  <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-[#E5E5E5] p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex gap-6 items-center">
                        {React.createElement(phase.icon, { size: 40, className: "text-[#6C5CE7]" })}
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black uppercase text-[#6C5CE7] tracking-widest">Phase {index + 1}</span>
                            {isActive && <span className="text-xs font-bold text-[#00BFA6]">Current</span>}
                          </div>
                          <h2 className="text-4xl font-black text-[#2D3436] tracking-tight mt-1">{phase.name}</h2>
                          <p className="text-[#636E72] mt-2 font-medium max-w-2xl">{phase.description}</p>
                        </div>
                      </div>

                      {openPhases.length > 1 && (
                        <button
                          onClick={() => {
                            setOpenPhases(prev => prev.filter(p => p !== index));
                            if (isActive && openPhases.length > 1) {
                              const remaining = openPhases.filter(p => p !== index);
                              setActiveStepIndex(remaining[0]);
                            }
                          }}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <X size={24} />
                        </button>
                      )}
                    </div>

                    <DynamicPhaseEditor
                      key={`${storyId}-${phase.id}`}
                      phaseConfig={phase}
                      storyId={storyId}
                      userId={userId!}
                      token={accessToken!}
                      backend={backend!}
                      onPhaseComplete={handlePhaseCompletion}
                      metadata={metadata}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Fixed Metadata Box */}
      {metadata && (
        <div className="fixed top-8 right-8 z-50 w-96">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#E5E5E5] p-6">
            <button
              onClick={() => setMetadataOpen(!metadataOpen)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="text-xl font-black">Story Metadata</h3>
              {metadataOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {metadataOpen && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#636E72] mb-1">Genre</label>
                  <select
                    value={editedMetadata?.genre || ""}
                    onChange={(e) => setEditedMetadata({ ...editedMetadata, genre: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E5E5E5] focus:border-[#6C5CE7] outline-none"
                  >
                    <option value="">Select Genre</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#636E72] mb-1">Tone</label>
                  <select
                    value={editedMetadata?.tone || ""}
                    onChange={(e) => setEditedMetadata({ ...editedMetadata, tone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E5E5E5] focus:border-[#6C5CE7] outline-none"
                  >
                    <option value="">Select Tone</option>
                    {TONES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#636E72] mb-1">Target Audience Age</label>
                  <input
                    type="number"
                    value={editedMetadata?.target_audience_age || 18}
                    onChange={(e) => setEditedMetadata({ ...editedMetadata, target_audience_age: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-[#E5E5E5] focus:border-[#6C5CE7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#636E72] mb-1">Themes</label>
                  <textarea
                    rows={3}
                    value={editedMetadata?.themes || ""}
                    onChange={(e) => setEditedMetadata({ ...editedMetadata, themes: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E5E5E5] focus:border-[#6C5CE7] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#636E72] mb-1">User Notes</label>
                  <textarea
                    rows={4}
                    value={editedMetadata?.user_notes || ""}
                    onChange={(e) => setEditedMetadata({ ...editedMetadata, user_notes: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E5E5E5] focus:border-[#6C5CE7] outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleMetadataSave}
                  className="w-full py-3 bg-[#6C5CE7] text-white rounded-xl font-bold hover:bg-[#5A4FCF] transition-colors"
                >
                  Save Metadata
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}