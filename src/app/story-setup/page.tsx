"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import StorySeedForm from "./components/StorySeedForm";
import DynamicPhaseEditor from "./components/DynamicPhaseEditor";
import { FLOWS, FlowType } from "../config/storyConstants";

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
  const [flowType, setFlowType] = useState<FlowType>("Standard");
  const [initLoading, setInitLoading] = useState(true);

  // --- AUTH CHECK ---
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  // --- INITIALIZATION ---
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
            // 1. Register Session
            await fetch(`${backend}/stories/continue_story`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
                body: JSON.stringify({ user_id: userId, story_id: passedStoryId })
            });

            // 2. Fetch Progress
            const progressRes = await fetch(`${backend}/stories/progress/${userId}/${passedStoryId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${accessToken}` }
            });
            const progressJson = await progressRes.json();

            if (progressJson.status === "success" && progressJson.data) {
                const { latest_phase, flow_type } = progressJson.data;
                const resolvedFlow = (flow_type && FLOWS[flow_type as FlowType]) ? flow_type as FlowType : "Standard";
                setFlowType(resolvedFlow);

                const phaseIdx = typeof latest_phase === 'number' ? latest_phase : parseInt(latest_phase) || 0;
                const safePhase = Math.min(Math.max(0, phaseIdx), FLOWS[resolvedFlow].length - 1);
                
                setMaxReachedPhaseIndex(safePhase);
                setActiveStepIndex(safePhase);
                setCompletedSteps(FLOWS[resolvedFlow].slice(0, safePhase).map(p => p.id));
            }
            setStoryId(passedStoryId);
        } catch (e) { console.error(e); }
      } else if (type === 'new') {
        // New Story
        try {
            const res = await fetch(`${backend}/stories/initialize_story?user_id=${userId}`, {
                headers: { "Authorization": `Bearer ${accessToken}` }, method: "POST"
            });
            const data = await res.json();
            if (data.story_id) setStoryId(data.story_id);
        } catch (e) { console.error(e); }
      }
      setInitLoading(false);
    };
    initializeStory();
  }, [userId, accessToken, searchParams, backend]);

  // --- HANDLERS ---
  const handlePhaseCompletion = (phaseId: string) => {
    if (!completedSteps.includes(phaseId)) {
        setCompletedSteps(prev => [...prev, phaseId]);
    }
    // Unlock next phase
    const nextIndex = activeStepIndex + 1;
    if (nextIndex < FLOWS[flowType].length) {
        setMaxReachedPhaseIndex(prev => Math.max(prev, nextIndex));
    }
  };

  if (authLoading || initLoading) return <div className="h-screen flex items-center justify-center text-[#636E72] font-bold">Loading Studio...</div>;

  const currentPhaseConfig = FLOWS[flowType][activeStepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F1] via-[#F5F9FF] to-[#F0FFF9] flex font-sans text-[#2D3436]">
      <Sidebar 
        flowType={flowType}
        activeStepIndex={activeStepIndex}
        maxReachedPhaseIndex={maxReachedPhaseIndex}
        completedSteps={completedSteps}
        onNavigate={setActiveStepIndex}
      />

      <main className="flex-1 p-4 h-screen overflow-hidden">
        <div className="h-full overflow-y-auto rounded-[2.5rem] bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#E5E5E5] p-8 md:p-12">
          <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-end gap-6 mb-10 border-b-2 border-dashed border-[#E5E5E5] pb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#6C5CE7] to-[#8E7CF0] flex items-center justify-center text-white shadow-lg">
                {React.createElement(currentPhaseConfig.icon, { size: 32 })}
              </div>
              <div>
                <span className="text-xs font-black uppercase text-[#6C5CE7] tracking-widest">Phase {activeStepIndex + 1}</span>
                <h2 className="text-4xl font-black text-[#2D3436]">{currentPhaseConfig.name}</h2>
              </div>
            </div>

            {/* Content Switcher */}
            {currentPhaseConfig.id === "seed" ? (
                <StorySeedForm
                    userId={userId!}
                    storyId={storyId!}
                    token={accessToken!}
                    backend={backend!}
                    onFlowChange={setFlowType}
                    onComplete={(data) => {
                        handlePhaseCompletion("seed");
                        // Optional: Auto-advance can be added here if desired
                    }}
                />
            ) : (
                <DynamicPhaseEditor
                    // Key forces remount on step change to reset state
                    key={`${storyId}-${currentPhaseConfig.id}`}
                    phaseConfig={currentPhaseConfig}
                    storyId={storyId!}
                    userId={userId!}
                    token={accessToken!}
                    backend={backend!}
                    activeStepIndex={activeStepIndex}
                    onPhaseComplete={handlePhaseCompletion}
                />
            )}

          </div>
        </div>
      </main>
    </div>
  );
}