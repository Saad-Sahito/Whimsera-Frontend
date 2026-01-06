"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Sparkles, User, Save } from "lucide-react";
import {
  StorySeed,
  FlowType,
  ALL_GENRES,
  POVS,
  TONES,
  MEDIUMS,
  PROSE_STYLES,
  STRUCTURE_RECOMMENDATIONS,
  STRUCTURE_ACT_MAP,
  STRUCTURE_LIST
} from "../../config/storyConstants";

// --- HELPER COMPONENT: Auto-Expanding Textarea ---
const AutoResizeTextarea = ({ value, onChange, className, placeholder }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight for shrinking
      textareaRef.current.style.height = "auto";
      // Set height to scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={`${className} overflow-hidden`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
    />
  );
};

interface StorySeedFormProps {
  userId: string;
  storyId: string;
  token: string;
  backend: string;
  // We keep initialData optional, but we will fetch if it's missing/stale
  onFlowChange: (newFlow: FlowType) => void;
  onComplete: (data: StorySeed) => void;
}

export default function StorySeedForm({
  userId,
  storyId,
  token,
  backend,
  onFlowChange,
  onComplete
}: StorySeedFormProps) {
  const [seedTab, setSeedTab] = useState<"general" | "protagonist">("general");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initial State Definition
  const [seed, setSeed] = useState<StorySeed>({
    title: "",
    pov: "Third Person Limited",
    tone: "Adventurous",
    genre: [],
    sub_genre: [],
    setting: "",
    prose_style: "Descriptive",
    themes: [],
    target_audience_age: 16,
    target_length: 60000,
    target_medium: "Novel",
    act_count: 3,
    story_structure: "Three Act Structure",
    protagonist_specs: {
      name: "",
      age: "",
      gender: "",
      archetype: "",
      core_trait: "",
      background: "",
      desire: "",
      fear: "",
      relationships: "",
      physical_description: ""
    }
  });

  // --- 1. FETCHING LOGIC (The Fix) ---
  // This ensures that when you load this component, it pulls the data from the server
  useEffect(() => {
    const fetchSeedData = async () => {
      if (!userId || !token || !storyId) return;
      
      // Prevent fetching if we are just switching tabs locally, 
      // but you might want to force fetch on mount:
      setFetchLoading(true);

      try {
        const url = `${backend}/stories/director_notes/${userId}/${storyId.trim()}/story_seed`;
        const res = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();

        if (json.status === "success" && json.data) {
          let parsedData = json.data;
          
          // Handle potential double-stringification from backend
          if (typeof json.data === 'string') {
            try { parsedData = JSON.parse(json.data); } catch (e) { console.error("Parse error", e); }
          }

          // Merge fetched data with default structure to prevent missing keys
          setSeed(prev => ({
            ...prev,
            ...parsedData,
            protagonist_specs: {
              ...prev.protagonist_specs,
              ...(parsedData.protagonist_specs || {})
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching seed data:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchSeedData();
  }, [userId, storyId, token, backend]);


  // --- 2. RECOMMENDATION LOGIC ---
  useEffect(() => {
    if (seed.genre.length === 0) return;
    const currentGenres = seed.genre.map(g => g.toLowerCase());
    let bestStructure = seed.story_structure;
    let maxMatch = 0;

    for (const [structure, combos] of Object.entries(STRUCTURE_RECOMMENDATIONS)) {
      for (const combo of combos) {
        const comboWords = combo.toLowerCase().split(/ \+ |\/| /);
        const matchCount = currentGenres.filter(g => comboWords.includes(g)).length;
        if (matchCount > maxMatch) {
          maxMatch = matchCount;
          bestStructure = structure;
        }
      }
    }
    if (bestStructure !== seed.story_structure) {
      setSeed(prev => ({ ...prev, story_structure: bestStructure }));
    }
  }, [seed.genre]);

  useEffect(() => {
    const recommendedActs = STRUCTURE_ACT_MAP[seed.story_structure] || 3;
    if (seed.act_count !== recommendedActs) {
      setSeed(prev => ({ ...prev, act_count: recommendedActs }));
    }
  }, [seed.story_structure]);

  // --- 3. FLOW SWITCHING LOGIC ---
  useEffect(() => {
    let newFlow: FlowType = "Standard";
    if (seed.target_length < 40000) newFlow = "Compact";
    else if (seed.target_length >= 40000 && seed.target_length <= 80000) newFlow = "Standard";
    else newFlow = "Epic";
    
    // Notify parent of flow change
    onFlowChange(newFlow);
  }, [seed.target_length]);


  // --- HANDLERS ---
  const handleSubmit = async (isSaveOnly: boolean) => {
    if (!userId || !token || !storyId) return;
    setLoading(true);

    const endpoint = isSaveOnly ? "/change/add_story_seed" : "/creation/add_story_seed";

    try {
      const res = await fetch(`${backend}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          story_id: storyId,
          document_dict: seed
        })
      });

      const json = await res.json();

      if (json.status === "success" || json.story_id || json.data) {
        setHasUnsavedChanges(false);
        if (isSaveOnly) {
          alert("Story Seed Saved Successfully.");
        } else {
          onComplete(seed);
        }
      } else {
        alert("Failed to save story seed.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (key: keyof StorySeed, val: any) => {
    setHasUnsavedChanges(true);
    setSeed(prev => ({ ...prev, [key]: val }));
  };

  const handleProtoInput = (key: string, val: any) => {
    setHasUnsavedChanges(true);
    setSeed(prev => ({
      ...prev,
      protagonist_specs: { ...prev.protagonist_specs, [key]: val }
    }));
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E5E5E5] border-t-[#6C5CE7]"></div>
        <p className="text-[#636E72] font-bold">Loading Story Seed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- TAB NAVIGATION --- */}
      <div className="flex justify-between items-center border-b-2 border-[#E5E5E5] pb-1">
        <div className="flex gap-4">
          <button
            onClick={() => setSeedTab("general")}
            className={`pb-3 px-2 font-black text-sm uppercase tracking-wide transition-colors ${
              seedTab === "general"
                ? "border-b-4 border-[#6C5CE7] text-[#6C5CE7]"
                : "text-[#636E72] hover:text-[#2D3436]"
            }`}
          >
            <Sparkles size={16} className="inline mr-2 mb-1" /> General Foundation
          </button>
          <button
            onClick={() => setSeedTab("protagonist")}
            className={`pb-3 px-2 font-black text-sm uppercase tracking-wide transition-colors ${
              seedTab === "protagonist"
                ? "border-b-4 border-[#6C5CE7] text-[#6C5CE7]"
                : "text-[#636E72] hover:text-[#2D3436]"
            }`}
          >
            <User size={16} className="inline mr-2 mb-1" /> Protagonist
          </button>
        </div>

        <button
          onClick={() => handleSubmit(true)}
          disabled={!hasUnsavedChanges || loading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            hasUnsavedChanges
              ? "bg-[#00BFA6] text-white shadow-lg"
              : "bg-[#E5E5E5] text-[#636E72]/50 cursor-not-allowed"
          }`}
        >
          <Save size={16} /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* --- GENERAL TAB CONTENT --- */}
      {seedTab === "general" && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#FFF8F1] p-5 rounded-2xl border-2 border-transparent focus-within:border-[#FFD166] transition-all shadow-sm">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#6C5CE7] mb-2">
                Story Title
              </label>
              <input
                type="text"
                className="w-full bg-transparent text-lg font-bold text-[#2D3436] placeholder-[#636E72]/40 focus:outline-none"
                placeholder="The Great Adventure..."
                value={seed.title || ""}
                onChange={e => handleInput("title", e.target.value)}
              />
            </div>
            <div className="bg-[#F5F9FF] p-5 rounded-2xl border-2 border-transparent focus-within:border-[#74C0FC] transition-all shadow-sm">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#6C5CE7] mb-2">
                Setting Foundation
              </label>
              <input
                type="text"
                className="w-full bg-transparent text-lg font-bold text-[#2D3436] placeholder-[#636E72]/40 focus:outline-none"
                placeholder="A neo-tokyo floating city..."
                value={seed.setting || ""}
                onChange={e => handleInput("setting", e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-[#E5E5E5]">
            <label className="block text-xs uppercase tracking-wider font-bold text-[#6C5CE7] mb-4">
              Core Genres
            </label>
            <div className="flex flex-wrap gap-3">
              {ALL_GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => {
                    setHasUnsavedChanges(true);
                    setSeed(prev => ({
                      ...prev,
                      genre: prev.genre.includes(g)
                        ? prev.genre.filter(item => item !== g)
                        : [...prev.genre, g]
                    }));
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    seed.genre.includes(g)
                      ? "bg-[#00BFA6] text-white shadow-lg"
                      : "bg-[#E5E5E5] text-[#636E72] hover:bg-[#FFD166]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#FFF8F1] p-5 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#636E72] mb-2">
                Sub-Genres
              </label>
              <input
                className="w-full bg-transparent font-semibold text-[#2D3436] focus:outline-none"
                value={seed.sub_genre.join(", ")}
                onChange={e => {
                   setHasUnsavedChanges(true);
                   setSeed(prev => ({...prev, sub_genre: e.target.value.split(",").map(s => s.trim())}));
                }}
              />
            </div>
            <div className="bg-[#F5F9FF] p-5 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#636E72] mb-2">
                Themes
              </label>
              <input
                className="w-full bg-transparent font-semibold text-[#2D3436] focus:outline-none"
                value={seed.themes.join(", ")}
                onChange={e => {
                    setHasUnsavedChanges(true);
                    setSeed(prev => ({...prev, themes: e.target.value.split(",").map(s => s.trim())}));
                }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#FFF8F1] p-5 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#636E72] mb-2">
                Medium
              </label>
              <select
                className="w-full bg-transparent font-semibold text-[#2D3436] focus:outline-none"
                value={seed.target_medium}
                onChange={e => handleInput("target_medium", e.target.value)}
              >
                {MEDIUMS.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-[#F5F9FF] p-5 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#636E72] mb-2">
                POV
              </label>
              <select
                className="w-full bg-transparent font-semibold text-[#2D3436] focus:outline-none"
                value={seed.pov}
                onChange={e => handleInput("pov", e.target.value)}
              >
                {POVS.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-[#F0FFF9] p-5 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#636E72] mb-2">
                Tone
              </label>
              <select
                className="w-full bg-transparent font-semibold text-[#2D3436] focus:outline-none"
                value={seed.tone}
                onChange={e => handleInput("tone", e.target.value)}
              >
                {TONES.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-[#FFF8F1] p-4 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-[10px] uppercase font-bold text-[#636E72] mb-1">
                Structure
              </label>
              <select
                className="w-full bg-transparent font-bold text-sm text-[#2D3436] focus:outline-none"
                value={seed.story_structure}
                onChange={e => handleInput("story_structure", e.target.value)}
              >
                {STRUCTURE_LIST.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-[#F5F9FF] p-4 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-[10px] uppercase font-bold text-[#636E72] mb-1">
                Act Count
              </label>
              <input
                type="number"
                className="w-full bg-transparent font-bold text-sm text-[#2D3436] focus:outline-none"
                value={seed.act_count}
                onChange={e => handleInput("act_count", parseInt(e.target.value) || 3)}
              />
            </div>
            <div className="bg-[#F0FFF9] p-4 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-[10px] uppercase font-bold text-[#636E72] mb-1">
                Prose Style
              </label>
              <select
                className="w-full bg-transparent font-bold text-sm text-[#2D3436] focus:outline-none"
                value={seed.prose_style}
                onChange={e => handleInput("prose_style", e.target.value)}
              >
                {PROSE_STYLES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-[#FFF5F7] p-4 rounded-3xl border-2 border-[#E5E5E5]">
              <label className="block text-[10px] uppercase font-bold text-[#636E72] mb-1">
                Audience Age
              </label>
              <input
                type="number"
                className="w-full bg-transparent font-bold text-sm text-[#2D3436] focus:outline-none"
                value={seed.target_audience_age}
                onChange={e =>
                  handleInput("target_audience_age", parseInt(e.target.value) || 16)
                }
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6C5CE7]/10 to-[#00BFA6]/10 p-6 rounded-3xl border-2 border-[#6C5CE7]/30">
            <label className="block text-xs uppercase tracking-wider font-bold text-[#6C5CE7] mb-3">
              Target Length (Words)
            </label>
            <div className="flex items-baseline gap-3">
              <input
                type="number"
                className="w-32 bg-white/50 px-3 py-1 rounded-lg text-2xl font-black text-[#2D3436] focus:outline-none"
                value={seed.target_length}
                onChange={e =>
                  handleInput("target_length", parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </>
      )}

      {/* --- PROTAGONIST TAB CONTENT (RESTORED FULLY) --- */}
      {seedTab === "protagonist" && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-[#E5E5E5] space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase">Name</label>
              <input
                className="w-full bg-[#F5F9FF] p-3 rounded-xl font-bold border-2 border-transparent focus:border-[#74C0FC] focus:outline-none"
                placeholder="Enter Name"
                value={seed.protagonist_specs.name}
                onChange={e => handleProtoInput("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase">Age</label>
              <input
                className="w-full bg-[#F5F9FF] p-3 rounded-xl font-bold border-2 border-transparent focus:border-[#74C0FC] focus:outline-none"
                placeholder="e.g. 24"
                value={seed.protagonist_specs.age}
                onChange={e => handleProtoInput("age", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase">Gender</label>
              <input
                className="w-full bg-[#F5F9FF] p-3 rounded-xl font-bold border-2 border-transparent focus:border-[#74C0FC] focus:outline-none"
                placeholder="e.g. Female"
                value={seed.protagonist_specs.gender}
                onChange={e => handleProtoInput("gender", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase">Archetype</label>
              <input
                className="w-full bg-[#FFF8F1] p-3 rounded-xl font-medium border-2 border-transparent focus:border-[#FFD166] focus:outline-none"
                placeholder="e.g. The Reluctant Hero"
                value={seed.protagonist_specs.archetype}
                onChange={e => handleProtoInput("archetype", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase">Core Trait</label>
              <input
                className="w-full bg-[#FFF8F1] p-3 rounded-xl font-medium border-2 border-transparent focus:border-[#FFD166] focus:outline-none"
                placeholder="e.g. Unwavering Optimism"
                value={seed.protagonist_specs.core_trait}
                onChange={e => handleProtoInput("core_trait", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#636E72] uppercase">
              Physical Description
            </label>
            <AutoResizeTextarea
              className="w-full bg-gray-50 p-4 rounded-xl border-2 border-[#E5E5E5] focus:border-[#6C5CE7] focus:outline-none min-h-[80px]"
              placeholder="Tall, scar on left cheek..."
              value={seed.protagonist_specs.physical_description}
              onChange={(e: any) =>
                handleProtoInput("physical_description", e.target.value)
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase">Desire</label>
              <AutoResizeTextarea
                className="w-full bg-[#F0FFF9] p-3 rounded-xl border-2 border-transparent focus:border-[#00BFA6] focus:outline-none min-h-[80px]"
                placeholder="To find their lost sibling..."
                value={seed.protagonist_specs.desire}
                onChange={(e: any) => handleProtoInput("desire", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase">Fear</label>
              <AutoResizeTextarea
                className="w-full bg-[#FFF5F7] p-3 rounded-xl border-2 border-transparent focus:border-[#FF7675] focus:outline-none min-h-[80px]"
                placeholder="Fear of failure..."
                value={seed.protagonist_specs.fear}
                onChange={(e: any) => handleProtoInput("fear", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#636E72] uppercase">Background</label>
            <AutoResizeTextarea
              className="w-full bg-gray-50 p-4 rounded-xl border-2 border-[#E5E5E5] focus:border-[#6C5CE7] focus:outline-none min-h-[100px]"
              placeholder="Born in the slums of Sector 7..."
              value={seed.protagonist_specs.background}
              onChange={(e: any) => handleProtoInput("background", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#636E72] uppercase">
              Relationships
            </label>
            <AutoResizeTextarea
              className="w-full bg-gray-50 p-4 rounded-xl border-2 border-[#E5E5E5] focus:border-[#6C5CE7] focus:outline-none min-h-[80px]"
              placeholder="Close with sister, rival with neighbor..."
              value={seed.protagonist_specs.relationships}
              onChange={(e: any) => handleProtoInput("relationships", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* --- SUBMIT BUTTON --- */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading || seed.genre.length === 0}
          className="group relative px-10 py-6 bg-gradient-to-r from-[#6C5CE7] to-[#8E7CF0] text-white rounded-3xl font-black text-lg w-full md:w-auto min-w-[320px] transition-all hover:scale-[1.02] shadow-2xl shadow-[#6C5CE7]/30"
        >
          <span className="relative flex items-center justify-center gap-3">
            {loading ? "Initializing..." : "Begin My Story"}
            <Sparkles
              size={22}
              className={
                loading ? "animate-pulse" : "group-hover:rotate-12 transition-transform"
              }
            />
          </span>
        </button>
      </div>
    </div>
  );
}