"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useStoryInitialization } from "./components/useStoryInitialization";
import { MetadataPanel, useStoryMetadata } from "./components/MetadataPanel";
import { Sidebar } from "./components/Sidebar";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { MainWorkspace } from "./components/MainWorkspace";
import { PHASES } from "./constants";
// Assuming the import path matches your project structure
import { getDirectorNotes } from "../../lib/stories/api/getDirectorNotes"; 

export default function WhimseraApp() {
  const backend = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";
  
  const { storyId, loading: initLoading, error, userId, token } = useStoryInitialization(backend);
  const { 
    metadata, 
    setMetadata, 
    metaLoading, 
    saveMetadata, 
    updateMetadataFromContext 
  } = useStoryMetadata(backend, userId, storyId, token);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(true);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false); // New state
  const [metadataOpen, setMetadataOpen] = useState(true);
  const [openPhases, setOpenPhases] = useState<number[]>([0]);

  // Derived active phase
  const activePhaseIndex = openPhases[openPhases.length - 1];
  const activePhase = PHASES[activePhaseIndex];

  // Effect to fetch existing feedback when phase changes
  useEffect(() => {
    if (!storyId || !token || !activePhase) return;

    const fetchLastFeedback = async () => {
      setFeedbackLoading(true);
      try {
        // Appending _feedback to the queryKey as requested
        const feedbackKey = `${activePhase.queryKey}_feedback`;
        const response = await getDirectorNotes(
          backend,
          userId!,
          storyId,
          token,
          feedbackKey
        );
        
        // Assuming response contains the feedback string or is the feedback string
        if (response && typeof response === 'object') {
          setFeedbackText(response[feedbackKey] || null);
        } else {
          setFeedbackText(typeof response === 'string' ? response : null);
        }
      } catch (err) {
        console.error("Failed to fetch last feedback:", err);
        setFeedbackText(null);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchLastFeedback();
  }, [activePhase?.queryKey, storyId, userId, token, backend]);

  if (initLoading) return <div className="h-screen flex items-center justify-center text-[#6C5CE7]"><Loader2 className="animate-spin mr-2"/> Loading Story...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="h-screen bg-[#F5F9FF] flex overflow-hidden font-sans text-[#2D3436]">
       
       <Sidebar 
         collapsed={sidebarCollapsed} 
         setCollapsed={setSidebarCollapsed} 
         openPhases={openPhases}
         onOpenPhase={(idx) => !openPhases.includes(idx) && setOpenPhases([...openPhases, idx])}
         activePhaseIndex={activePhaseIndex}
       />

       <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
             
             <MainWorkspace 
                openPhases={openPhases}
                setOpenPhases={setOpenPhases}
                storyId={storyId!}
                token={token!}
                backend={backend}
                userId={userId!}
                metadata={metadata}
                syncMetadata={(context: string) => updateMetadataFromContext(context).then(() => {})}
                // Note: manual reviews still update the text immediately
                onFeedback={(txt: string) => { setFeedbackText(txt); setFeedbackOpen(true); }}
             />

             <FeedbackPanel 
                isOpen={feedbackOpen} 
                setIsOpen={setFeedbackOpen} 
                feedback={feedbackText} 
                loading={feedbackLoading} // Pass loading state
             />
          </div>
       </div>

       <MetadataPanel 
          isOpen={metadataOpen} 
          toggle={() => setMetadataOpen(!metadataOpen)}
          metadata={metadata}
          setMetadata={setMetadata}
          onManualSave={() => saveMetadata()}
          loading={metaLoading}
       />
    </div>
  );
}