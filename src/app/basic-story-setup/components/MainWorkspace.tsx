"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { PHASES, StoryMetadata } from "../constants";
import { getDirectorNotes, } from "../../../lib/stories/api/getDirectorNotes";
import { generatePhaseContent, } from "../../../lib/stories/api/generatePhaseContent";
import { reviewPhaseContent, } from "../../../lib/stories/api/reviewPhaseContent";
import { savePhaseContent, } from "../../../lib/stories/api/savePhaseContent";


// BufferedInput remains the same
const BufferedInput = ({ value, onCommit, className, placeholder }: any) => {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <input
      className={className}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => onCommit(local)}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      placeholder={placeholder}
    />
  );
};

interface PhaseEditorProps {
  phase: any;
  storyId: string;
  token: string;
  backend: string;
  userId: string;
  metadata: StoryMetadata;
  syncMetadata: (context: string) => Promise<void>;
  onFeedback: (text: string) => void;
}

const PhaseEditor = ({
  phase,
  storyId,
  token,
  backend,
  userId,
  metadata,
  syncMetadata,
  onFeedback,
}: PhaseEditorProps) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Load phase content
  useEffect(() => {
    if (!storyId) return;

    const load = async () => {
      try {
        const content = await getDirectorNotes(
          backend,
          userId,
          storyId,
          token,
          phase.queryKey
        );
        setData(content);
      } catch (err) {
        console.error("Failed to load director notes:", err);
        setData({});
      }
    };

    load();
  }, [phase.queryKey, storyId, userId, token, backend]);

  const handleGenerate = async () => {
    setAiLoading(true);
    const docStr = JSON.stringify(data || {});

    try {
      await syncMetadata(docStr);
      const result = await generatePhaseContent(
        backend,
        phase.generateEndpoint,
        userId,
        storyId,
        token,
        metadata,
        docStr
      );
      setData(result);
    } catch (err) {
      console.error("Generate failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleReview = async () => {
    setAiLoading(true);
    const docStr = JSON.stringify(data || {});

    try {
      await syncMetadata(docStr);
      const feedback = await reviewPhaseContent(
        backend,
        phase.feedbackEndpoint,
        userId,
        storyId,
        token,
        metadata,
        docStr
      );
      onFeedback(feedback);
    } catch (err) {
      console.error("Review failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const docStr = JSON.stringify(data || {});

    try {
      await syncMetadata(docStr);
      await savePhaseContent(
        backend,
        phase.saveEndpoint,
        userId,
        storyId,
        token,
        metadata,
        docStr
      );
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Recursive field renderer (unchanged logic, just kept here)
  const renderField = (key: string, val: any, path: string[]) => {
    const isObj = typeof val === "object" && val !== null && !Array.isArray(val);
    const isArr = Array.isArray(val);

    const updateState = (newVal: any, p: string[]) => {
      const clone = JSON.parse(JSON.stringify(data));
      let ref = clone;
      for (let i = 0; i < p.length - 1; i++) ref = ref[p[i]];
      ref[p[p.length - 1]] = newVal;
      setData(clone);
    };

    const renameKey = (oldK: string, newK: string) => {
      if (!newK || oldK === newK) return;
      const clone = JSON.parse(JSON.stringify(data));
      const newVal = clone[oldK];
      delete clone[oldK];
      clone[newK] = newVal;
      setData(clone);
    };

    return (
      <div key={path.join("-")} className="mb-4 ml-2 border-l-2 border-gray-100 pl-4">
        <div className="flex justify-between items-center mb-2">
          <BufferedInput
            value={key.replace(/_/g, " ")}
            onCommit={(v: string) => renameKey(key, v.replace(/ /g, "_"))}
            className="font-bold text-gray-700 bg-transparent focus:border-b border-[#6C5CE7] outline-none"
          />
        </div>

        {isObj
          ? Object.entries(val).map(([k, v]) => renderField(k, v, [...path, k]))
          : isArr
            ? (val as any[]).map((v, i) => (
              <textarea
                key={i}
                className="w-full p-2 border rounded mb-2 text-sm"
                value={v}
                onChange={(e) => {
                  const clone = [...(val as any[])];
                  clone[i] = e.target.value;
                  updateState(clone, path);
                }}
              />
            ))
            : (
              <textarea
                className="w-full p-3 border rounded-xl text-sm focus:ring-2 ring-[#6C5CE7]/20 outline-none"
                rows={4}
                value={val as string}
                onChange={(e) => updateState(e.target.value, path)}
              />
            )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={aiLoading}
            className="px-3 py-1.5 bg-[#6C5CE7] text-white rounded text-xs font-bold flex gap-2 items-center"
          >
            {aiLoading && <Loader2 size={12} className="animate-spin" />} Generate
          </button>
          <button
            onClick={handleReview}
            disabled={aiLoading}
            className="px-3 py-1.5 bg-[#00BFA6] text-white rounded text-xs font-bold flex gap-2 items-center"
          >
            {aiLoading && <Loader2 size={12} className="animate-spin" />} Review
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-3 py-1.5 bg-[#2D3436] text-white rounded text-xs font-bold flex gap-2 items-center"
          >
            {loading && <Loader2 size={12} className="animate-spin" />} Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(data).length > 0 ? (
          Object.entries(data).map(([k, v]) => renderField(k, v, [k]))
        ) : (
          <div className="text-gray-400 text-center mt-10">Empty</div>
        )}

        <button
          onClick={() => setData({ ...data, "New Section": "" })}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-200 rounded text-gray-400 font-bold hover:bg-gray-50"
        >
          + Add Section
        </button>
      </div>
    </div>
  );
};
// --- Main Workspace Container ---
interface MainWorkspaceProps {
  openPhases: number[];
  setOpenPhases: (indices: number[]) => void;
  storyId: string;
  token: string;
  backend: string;
  userId: string;
  metadata: StoryMetadata;
  syncMetadata: (context: string) => Promise<void>;
  onFeedback: (text: string) => void;
}
// MainWorkspace remains almost unchanged (only imports & prop types updated if needed)
export const MainWorkspace = ({
  openPhases,
  setOpenPhases,
  storyId,
  token,
  backend,
  userId,
  metadata,
  syncMetadata,
  onFeedback,
}: MainWorkspaceProps) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const idxStr = e.dataTransfer.getData("phaseIndex");
    if (idxStr) {
      const idx = parseInt(idxStr);
      if (!openPhases.includes(idx)) setOpenPhases([...openPhases, idx]);
    }
  };

  return (
    <main
      className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-[#F5F9FF]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="h-full flex gap-6 w-max">
        {openPhases.map((idx) => (
          <div
            key={idx}
            className="w-[600px] h-full bg-white rounded-2xl shadow-xl flex flex-col border border-[#E5E5E5] flex-shrink-0"
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <span className="font-bold flex items-center gap-2">
                {React.createElement(PHASES[idx].icon, { size: 16 })} {PHASES[idx].name}
              </span>
              <button
                onClick={() => setOpenPhases(openPhases.filter((i) => i !== idx))}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PhaseEditor
                phase={PHASES[idx]}
                storyId={storyId}
                token={token}
                backend={backend}
                userId={userId}
                metadata={metadata}
                syncMetadata={syncMetadata}
                onFeedback={onFeedback}
              />
            </div>
          </div>
        ))}

        <div className="w-[200px] h-full border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-bold opacity-50">
          Drag phases here
        </div>
      </div>
    </main>
  );
};