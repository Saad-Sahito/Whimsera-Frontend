"use client";
import { BookOpen, ChevronUp, Loader2 } from "lucide-react";
import { StoryMetadata, GENRES, SUB_GENRES_MAP, DEFAULT_METADATA, STORY_STRUCTURES } from "./../constants";
import { useState, useEffect, useCallback } from "react";
import { getStoryMetadata } from "../../../lib/stories/api/getStoryMetadata";
import { saveStoryMetadata } from "../../../lib/stories/api/saveStoryMetadata";
import { generateOrUpdateMetadata } from "../../../lib/stories/api/generateStoryMetadata";

export const useStoryMetadata = (
  backend: string,
  userId: string | null,
  storyId: string | null,
  token: string | null
) => {
  const [metadata, setMetadata] = useState<StoryMetadata>(DEFAULT_METADATA);
  const [metaLoading, setMetaLoading] = useState(false);

  useEffect(() => {
    if (!userId || !storyId || !token) return;
    let isCurrent = true;
    const load = async () => {
      try {
        const data = await getStoryMetadata(backend, userId, storyId, token);
        if (isCurrent) setMetadata(data);
      } catch (err) {
        console.error("Failed to load story metadata:", err);
      }
    };
    load();
    return () => { isCurrent = false; };
  }, [backend, userId, storyId, token]);

  const saveMetadata = useCallback(
    async (newMeta?: StoryMetadata) => {
      if (!userId || !storyId || !token) return;
      const metaToSave = newMeta ?? metadata;
      setMetaLoading(true);
      try {
        const metaToSend = {
          ...metaToSave,
          themes: metaToSave.themes ? metaToSave.themes.split(',').map(t => t.trim()) : []
        };
        await saveStoryMetadata(backend, userId, storyId, token, metaToSend);
        if (newMeta) setMetadata(newMeta);
      } catch (err) {
        console.error("Failed to save metadata:", err);
      } finally {
        setMetaLoading(false);
      }
    },
    [backend, userId, storyId, token, metadata]
  );

  const updateMetadataFromContext = useCallback(
    async (currentContextStr: string) => {
      if (!userId || !storyId || !token) return null;
      try {
        const metaToSend = {
          ...metadata,
          themes: metadata.themes ? metadata.themes.split(',').map(t => t.trim()) : []
        };
        const updated = await generateOrUpdateMetadata(
          backend, userId, storyId, token, metaToSend, currentContextStr
        );
        // MERGE: Keep user_notes from local state; AI only handles the rest
        const merged = { 
            ...updated, 
            themes: Array.isArray(updated.themes) ? updated.themes.join(', ') : updated.themes,
            user_notes: metadata.user_notes 
        };
        setMetadata(merged);
        return merged;
      } catch (err) {
        console.error("Failed to generate/update metadata:", err);
        return null;
      }
    },
    [backend, userId, storyId, token, metadata]
  );

  return { metadata, setMetadata, metaLoading, saveMetadata, updateMetadataFromContext };
};

// --- UI Component ---
interface MetadataPanelProps {
  isOpen: boolean;
  toggle: () => void;
  metadata: StoryMetadata;
  setMetadata: (m: StoryMetadata) => void;
  onManualSave: () => void;
  loading: boolean;
}

export const MetadataPanel = ({ isOpen, toggle, metadata, setMetadata, onManualSave, loading }: MetadataPanelProps) => {

  const toggleSelection = (key: 'genre' | 'sub_genre', value: string, max = 3) => {
    const current = metadata[key] || [];
    const exists = current.includes(value);
    const updated = exists 
      ? current.filter(v => v !== value) 
      : (current.length < max ? [...current, value] : current);
    setMetadata({ ...metadata, [key]: updated });
  };

  if (!isOpen) {
    return (
      <button onClick={toggle} className="fixed top-6 right-20 z-40 bg-white p-2 rounded-full shadow-lg border border-[#E5E5E5] text-[#2D3436] hover:scale-110 transition-transform">
        <BookOpen size={20} />
      </button>
    );
  }

  const availableSubGenres = metadata.genre.flatMap(g => SUB_GENRES_MAP[g] || []);

  return (
    <div className="fixed top-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] flex flex-col max-h-[85vh]">
      <div className="p-4 bg-[#2D3436] text-white flex justify-between items-center rounded-t-2xl">
        <h3 className="font-bold text-sm uppercase tracking-wide">Story Bible</h3>
        <button onClick={toggle}><ChevronUp size={18} /></button>
      </div>

      <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
        {/* Title */}
        <div>
          <label className="text-[10px] font-bold uppercase text-[#636E72]">Story Title</label>
          <input type="text" className="w-full p-2 border border-gray-200 rounded text-sm font-bold" value={metadata.story_title ?? ""} onChange={e => setMetadata({...metadata, story_title: e.target.value})} />
        </div>

        {/* Genre & Sub-Genre */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#636E72] flex justify-between">Genre <span>{metadata.genre.length}/3</span></label>
            <div className="flex flex-wrap gap-1 mt-1">
              {GENRES.map(g => (
                <button key={g} onClick={() => toggleSelection('genre', g)} className={`px-2 py-1 text-[10px] rounded-full border ${metadata.genre.includes(g) ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]' : 'bg-white text-gray-500 border-gray-200'}`}>{g}</button>
              ))}
            </div>
          </div>
          {availableSubGenres.length > 0 && (
            <div>
              <label className="text-[10px] font-bold uppercase text-[#636E72] flex justify-between">Sub-Genre <span>{metadata.sub_genre.length}/3</span></label>
              <div className="flex flex-wrap gap-1 mt-1">
                {availableSubGenres.map(sg => (
                  <button key={sg} onClick={() => toggleSelection('sub_genre', sg)} className={`px-2 py-1 text-[10px] rounded-full border ${metadata.sub_genre.includes(sg) ? 'bg-[#00BFA6] text-white border-[#00BFA6]' : 'bg-white text-gray-500 border-gray-200'}`}>{sg}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Themes (Single String) */}
        <div>
          <label className="text-[10px] font-bold uppercase text-[#636E72]">Main Themes</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-200 rounded text-xs" 
            value={metadata.themes ?? ""} 
            onChange={e => setMetadata({...metadata, themes: e.target.value})}
            placeholder="e.g. Redemption, Sacrifice, Greed"
          />
        </div>

        {/* Structure Dropdown */}
        <div>
          <label className="text-[10px] font-bold uppercase text-[#636E72]">Story Structure</label>
          <select 
            className="w-full p-2 border border-gray-200 rounded text-xs bg-white"
            value={metadata.story_structure ?? ""}
            onChange={e => setMetadata({...metadata, story_structure: e.target.value})}
          >
            <option value="">Select a structure...</option>
            {STORY_STRUCTURES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Tone, Acts, Length */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#636E72]">Tone</label>
            <input type="text" className="w-full p-2 border rounded text-xs" value={metadata.tone ?? ""} onChange={e => setMetadata({...metadata, tone: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-[#636E72]">Total Acts</label>
            <input type="number" className="w-full p-2 border rounded text-xs" value={metadata.total_act ?? 3} onChange={e => setMetadata({...metadata, total_act: parseInt(e.target.value)})} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold uppercase text-[#636E72]">Est. Words</label>
            <input type="number" className="w-full p-2 border rounded text-xs" value={metadata.target_length ?? 50000} onChange={e => setMetadata({...metadata, target_length: parseInt(e.target.value)})} />
          </div>
        </div>

        {/* User Notes (Saved but not overwritten by AI) */}
        <div>
          <label className="text-[10px] font-bold uppercase text-[#636E72]">User Notes (Private)</label>
          <textarea 
            className="w-full p-2 border rounded text-xs h-24 resize-none bg-yellow-50/30 border-yellow-100" 
            value={metadata.user_notes ?? ""} 
            onChange={e => setMetadata({...metadata, user_notes: e.target.value})}
            placeholder="Add your personal notes or plot beats here..."
          />
        </div>

        <button onClick={onManualSave} disabled={loading} className="w-full py-3 bg-[#6C5CE7] text-white font-bold rounded-xl text-xs hover:bg-[#5A4FCF] transition-colors flex justify-center shadow-lg shadow-[#6C5CE7]/20">
            {loading ? <Loader2 className="animate-spin" size={14} /> : "Save Metadata"}
        </button>
      </div>
    </div>
  );
};