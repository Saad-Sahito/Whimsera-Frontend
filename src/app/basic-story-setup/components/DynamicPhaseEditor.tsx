import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { PhaseConfig, CHARACTER_TEMPLATES, DEFAULT_CHARACTER_TEMPLATE } from "../../config/storyConstants";
import { Wand2, Save, Loader2, AlertCircle, Plus, X, Trash2, MessageSquare } from "lucide-react";

interface DynamicPhaseEditorProps {
  phaseConfig: PhaseConfig;
  storyId: string;
  userId: string;
  token: string;
  backend: string;
  onPhaseComplete: (phaseId: string) => void;
  metadata?: any;
}

const AutoResizeTextarea = ({ value, onChange, className, placeholder }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  return (
    <textarea ref={textareaRef} className={`${className} overflow-hidden resize-none`}
      value={value} onChange={onChange} placeholder={placeholder} rows={1}
    />
  );
};

export default function DynamicPhaseEditor({
  phaseConfig,
  storyId,
  userId,
  token,
  backend,
  onPhaseComplete,
  metadata,
}: DynamicPhaseEditorProps) {
  const genre = metadata?.genre || "Fantasy";

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-initialize empty data with a main editable field for text-heavy phases
  useEffect(() => {
    if (data === null || (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)) {
      const textPhaseMainKey: Record<string, string> = {
        one_sentence: "One-Sentence Summary",
        one_paragraph: "One-Paragraph Summary",
        story_synopsis: "Full Synopsis",
      };
      if (phaseConfig.id in textPhaseMainKey) {
        setData({ [textPhaseMainKey[phaseConfig.id]]: "" });
      } else if (phaseConfig.id === "character_summaries") {
        // Leave empty – user adds characters manually
        setData({});
      } else if (phaseConfig.id === "expanded_character_sheets") {
        setData({});
      } else {
        setData({});
      }
    }
  }, [data, phaseConfig.id]);

  // Fetch existing data
  useEffect(() => {
    if (!storyId) return;
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const url = `${backend}/stories/director_notes/${userId}/${storyId}/${phaseConfig.queryKey}`;
        const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setData(json.data);
        } else {
          setData(null); // Will trigger auto-init above
        }
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [phaseConfig.id, storyId, userId, token, backend]);

  const handleAIAction = async (action: "review" | "regenerate" | "inspiration") => {
    if (!data || (typeof data === "object" && Object.keys(data).length === 0 && !Array.isArray(data))) {
      setError("Add some content first before requesting AI assistance.");
      return;
    }
    setAiLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backend}${phaseConfig.generateEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          user_id: userId,
          story_id: storyId,
          action,
          current_data: data,
          metadata
        }),
      });
      if (!res.ok) throw new Error("AI request failed");
      const json = await res.json();
      if (action === "regenerate") {
        setData(json.new_data || json.data || data);
        setHasUnsavedChanges(true);
      } else {
        setFeedback(json.feedback || json.suggestions || JSON.stringify(json, null, 2));
      }
    } catch (err) {
      setError("AI assistance failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        user_id: userId,
        story_id: storyId,
        document_dict: data // Always save as dict for consistency
      };
      const res = await fetch(`${backend}${phaseConfig.saveEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setHasUnsavedChanges(false);
      onPhaseComplete(phaseConfig.id);
    } catch (err) {
      setError("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  // Data manipulation handlers (enhanced add for characters)
  const handleDataChange = (path: (string|number)[], val: any) => {
    setHasUnsavedChanges(true);
    const clone = JSON.parse(JSON.stringify(data || {}));
    let target = clone;
    for (let i = 0; i < path.length - 1; i++) target = target[path[i]];
    target[path[path.length - 1]] = val;
    setData(clone);
  };

  const handleKeyRename = (path: (string | number)[], oldKey: string, newKey: string) => {
    if (!newKey || newKey === oldKey) return;
    setHasUnsavedChanges(true);
    const clone = JSON.parse(JSON.stringify(data));
    let target = clone;
    for (let i = 0; i < path.length; i++) target = target[path[i]];
    const value = target[oldKey];
    delete target[oldKey];
    target[newKey] = value;
    setData(clone);
  };

  const handleAddEntry = (path: (string | number)[]) => {
    setHasUnsavedChanges(true);
    const clone = JSON.parse(JSON.stringify(data || {}));
    let target = clone;
    for (let i = 0; i < path.length; i++) target = target[path[i]];

    let newKey = `new_field_${Date.now()}`;
    let newValue: any = "";

    if (path.length === 0) {
      if (phaseConfig.id === "character_summaries") {
        newKey = `Character ${Object.keys(clone).length + 1}`;
        newValue = "";
      } else if (phaseConfig.id === "expanded_character_sheets") {
        const fields = CHARACTER_TEMPLATES[genre] || DEFAULT_CHARACTER_TEMPLATE;
        newValue = fields.reduce((acc: any, f: string) => ({ ...acc, [f]: "" }), {});
        newKey = `Character ${Object.keys(clone).length + 1}`;
      }
    } else if (Array.isArray(target)) {
      target.push("");
    } else {
      target[newKey] = newValue;
    }

    if (path.length === 0 && !(phaseConfig.id in {character_summaries:1, expanded_character_sheets:1})) {
      clone[newKey] = newValue;
    }

    setData(clone);
  };

  const handleRemoveEntry = (path: (string | number)[], keyOrIndex: string | number) => {
    if (!window.confirm("Delete this entry?")) return;
    setHasUnsavedChanges(true);
    const clone = JSON.parse(JSON.stringify(data));
    let target = clone;
    for (let i = 0; i < path.length; i++) target = target[path[i]];
    if (Array.isArray(target)) {
      target.splice(typeof keyOrIndex === "number" ? keyOrIndex : parseInt(keyOrIndex as string), 1);
    } else {
      delete target[keyOrIndex];
    }
    setData(clone);
  };

  // Recursive renderer with larger textarea for root-level strings
  const renderNestedField = (
    key: string, 
    value: any, 
    path: (string | number)[], 
    depth = 0
  ) => {
    const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
    const isArrayField = Array.isArray(value);
    const isRootString = !isObject && !isArrayField && depth === 0;

    return (
      <div key={`${path.join('-')}-${key}`} className={`p-6 rounded-2xl bg-white border-2 ${depth === 0 ? 'border-[#E5E5E5]' : 'border-[#E5E5E5]/30'} mb-6 shadow-sm`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <input 
            type="text"
            className="bg-transparent font-bold text-lg text-[#2D3436] focus:outline-none border-b-2 border-transparent focus:border-[#6C5CE7]"
            value={key.replace(/_/g, " ")} 
            onChange={(e) => {
              const newKey = e.target.value.replace(/ /g, "_");
              handleKeyRename(path, key, newKey);
            }}
          />
          <div className="flex gap-2">
            {isObject && <button onClick={() => handleAddEntry([...path, key])} className="p-2 text-[#6C5CE7] hover:bg-[#6C5CE7]/10 rounded-xl"><Plus size={18} /></button>}
            <button onClick={() => handleRemoveEntry(path, key)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
          </div>
        </div>

        {/* Content */}
        {isObject ? (
          <div className="space-y-6 pl-6">
            {Object.entries(value).map(([nk, nv]) => renderNestedField(nk, nv, [...path, key], depth + 1))}
          </div>
        ) : isArrayField ? (
          // Array handling (unchanged)
          <div className="space-y-4">
            {(value as any[]).map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-1">
                  {typeof item === 'object' && item !== null ? (
                    <div className="pl-6 border-l-4 border-[#6C5CE7]/20">
                      {Object.entries(item).map(([sk, sv]) => renderNestedField(sk, sv, [...path, key, idx], depth + 1))}
                    </div>
                  ) : (
                    <AutoResizeTextarea
                      className="w-full p-4 border-2 border-[#E5E5E5] rounded-xl text-base"
                      value={item}
                      onChange={(e: any) => handleDataChange([...path, key, idx], e.target.value)}
                    />
                  )}
                </div>
                <button onClick={() => handleRemoveEntry([...path, key], idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><X size={18} /></button>
              </div>
            ))}
            <button onClick={() => handleAddEntry([...path, key])} className="text-[#6C5CE7] font-bold flex items-center gap-2">
              <Plus size={16} /> Add Item
            </button>
          </div>
        ) : (
          <AutoResizeTextarea
            className={`w-full p-6 rounded-xl border-2 border-[#E5E5E5] focus:border-[#6C5CE7] ${isRootString ? 'min-h-[500px] text-xl font-medium' : 'min-h-[120px] text-base'}`}
            value={String(value || "")}
            onChange={(e: any) => handleDataChange([...path, key], e.target.value)}
            placeholder="Start writing here..."
          />
        )}
      </div>
    );
  };

  if (fetchLoading) return <div className="p-20 text-center text-[#636E72]">Loading your work...</div>;

  const hasContent = data && (Object.keys(data).length > 0 || (Array.isArray(data) && data.length > 0));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
      {/* Left/Main: Guidance + Editor */}
      <div className="xl:col-span-2 space-y-8">
        {/* Phase Guidance */}
        <div className="p-10 bg-gradient-to-br from-[#F5F9FF] to-[#FFF8F1] rounded-3xl border-2 border-[#E5E5E5]">
          <h3 className="text-3xl font-black text-[#2D3436] mb-4">{phaseConfig.name}</h3>
          <p className="text-lg text-[#636E72] leading-relaxed">{phaseConfig.description}</p>
          {!hasContent && (
            <p className="mt-8 text-[#6C5CE7] font-bold">
              A blank canvas has been prepared for you below. Start writing — the AI is ready when you are.
            </p>
          )}
        </div>

        {/* AI Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button onClick={() => handleAIAction("review")} disabled={aiLoading || !hasContent} className="px-8 py-4 bg-[#6C5CE7] text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-[#5A4FCF] disabled:opacity-50">
            {aiLoading ? <Loader2 className="animate-spin" /> : <MessageSquare size={20} />}
            Review & Critique
          </button>
          <button onClick={() => handleAIAction("regenerate")} disabled={aiLoading || !hasContent} className="px-8 py-4 bg-[#00BFA6] text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-[#00A693] disabled:opacity-50">
            {aiLoading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            Regenerate / Improve
          </button>
          <button onClick={() => handleAIAction("inspiration")} disabled={aiLoading} className="px-8 py-4 bg-[#FFD166] text-[#2D3436] rounded-2xl font-bold flex items-center gap-3 hover:bg-[#FFC107]">
            {aiLoading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            Inspiration Ideas
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-6 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3">
            <AlertCircle size={24} /> {error}
          </div>
        )}

        {/* Editor */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${hasUnsavedChanges ? 'bg-[#FFD166] animate-pulse' : 'bg-[#00BFA6]'}`} />
              <span className="text-xl font-bold text-[#6C5CE7]">{hasUnsavedChanges ? "Unsaved Changes" : "Your Draft"}</span>
            </div>
            <button 
              onClick={handleSave} 
              disabled={!hasUnsavedChanges || loading}
              className="px-10 py-4 bg-[#00BFA6] text-white rounded-2xl font-bold flex items-center gap-3 disabled:opacity-50 hover:bg-[#00A693]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Save & Complete Phase
            </button>
          </div>

          <div className="space-y-6">
            {data && Object.entries(data).map(([k, v]) => renderNestedField(k, v, []))}
            <button 
              onClick={() => handleAddEntry([])} 
              className="w-full py-6 border-4 border-dashed border-[#6C5CE7]/40 text-[#6C5CE7] font-bold rounded-3xl hover:bg-[#6C5CE7]/5 flex items-center justify-center gap-3 text-lg"
            >
              <Plus size={28} /> Add New Section / Field
            </button>
          </div>
        </div>
      </div>

      {/* Right: Persistent AI Feedback "Panel" */}
      <div className="xl:col-span-1">
        <div className="sticky top-8 bg-white rounded-3xl shadow-xl border-2 border-[#E5E5E5] p-8 min-h-[600px]">
          <h4 className="text-2xl font-black text-[#6C5CE7] mb-6 flex items-center gap-3">
            <MessageSquare size={28} /> AI Feedback
          </h4>
          {feedback ? (
            <div className="space-y-6">
              <pre className="whitespace-pre-wrap text-[#2D3436] leading-relaxed text-base">{feedback}</pre>
              <button onClick={() => setFeedback(null)} className="text-[#6C5CE7] font-bold hover:underline">
                Clear Feedback
              </button>
            </div>
          ) : (
            <div className="text-center text-[#636E72] mt-20">
              <MessageSquare size={80} className="mx-auto opacity-20 mb-6" />
              <p className="text-xl font-medium">No feedback yet.</p>
              <p className="mt-4">Write some content, then click one of the AI buttons to get review, regeneration, or inspiration.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}