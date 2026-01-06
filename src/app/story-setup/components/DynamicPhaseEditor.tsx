"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Plus, X, Trash2, ArrowLeft, ArrowRight, Save, Sparkles } from "lucide-react";
import { PhaseConfig } from "../../config/storyConstants";

// --- HELPER FOR TEXTAREA ---
const AutoResizeTextarea = ({ value, onChange, className, placeholder }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  return (
    <textarea ref={textareaRef} className={`${className} overflow-hidden`}
      value={value} onChange={onChange} placeholder={placeholder} rows={1}
    />
  );
};

interface PhaseEditorProps {
  phaseConfig: PhaseConfig;
  storyId: string;
  userId: string;
  token: string;
  backend: string;
  activeStepIndex: number;
  onPhaseComplete: (phaseId: string) => void;
}

export default function DynamicPhaseEditor({ phaseConfig, storyId, userId, token, backend, activeStepIndex, onPhaseComplete }: PhaseEditorProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [listPageIndex, setListPageIndex] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    if (!storyId || !phaseConfig.queryKey) return;
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const url = `${backend}/stories/director_notes/${userId}/${storyId.trim()}/${phaseConfig.queryKey}`;
        const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setData(json.data);
          setHasUnsavedChanges(false);
        } else {
            setData(null);
        }
      } catch (err) { console.error(err); } 
      finally { setFetchLoading(false); }
    };
    fetchData();
  }, [phaseConfig.id, storyId]);

  // --- SERVER ACTIONS ---
  const handleGenerate = async () => {
    setLoading(true);
    try {
        let body: any = { user_id: userId, story_id: storyId };
        if (phaseConfig.id === "tracker" || phaseConfig.id === "quality") body.last_phase = activeStepIndex;

        const res = await fetch(`${backend}${phaseConfig.endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.status === "success" || json.data) {
            setData(json.data || json);
            setHasUnsavedChanges(false);
            onPhaseComplete(phaseConfig.id);
        }
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!phaseConfig.saveEndpoint) return;
    setLoading(true);
    try {
        const isList = Array.isArray(data);
        const body: any = { user_id: userId, story_id: storyId };
        if (isList) body.document_list_dict = data;
        else body.document_dict = data;
        
        const res = await fetch(`${backend}${phaseConfig.saveEndpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            setHasUnsavedChanges(false);
            alert("Saved successfully.");
        }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // --- DATA MANIPULATION HANDLERS ---
  const handleDataChange = (path: (string|number)[], val: any) => {
    setHasUnsavedChanges(true);
    const clone = JSON.parse(JSON.stringify(data));
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
    const clone = JSON.parse(JSON.stringify(data));
    let target = clone;
    for (let i = 0; i < path.length; i++) target = target[path[i]];
    
    if (Array.isArray(target)) {
        target.push(""); 
    } else {
        target[`new_field_${Date.now()}`] = "";
    }
    setData(clone);
  };

  const handleRemoveEntry = (path: (string | number)[], keyOrIndex: string | number) => {
    if (!window.confirm("Delete this field?")) return;
    setHasUnsavedChanges(true);
    const clone = JSON.parse(JSON.stringify(data));
    let target = clone;
    for (let i = 0; i < path.length; i++) target = target[path[i]];

    if (Array.isArray(target)) {
        target.splice(typeof keyOrIndex === 'string' ? parseInt(keyOrIndex) : keyOrIndex, 1);
    } else {
        delete target[keyOrIndex];
    }
    setData(clone);
  };

  // --- RECURSIVE RENDERER ---
  const renderNestedField = (
    key: string, 
    value: any, 
    path: (string | number)[], 
    depth = 0
  ) => {
    const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
    const isArrayField = Array.isArray(value);
    
    const depthColors = ['bg-white', 'bg-[#F9FAFB]', 'bg-[#F3F4F6]', 'bg-[#E5E7EB]'];
    const borderColor = depth === 0 ? 'border-[#E5E5E5]' : 'border-l-4 border-[#6C5CE7]/20';

    return (
      <div key={`${path.join('-')}-${key}`} className={`p-4 rounded-xl ${depthColors[depth % 4]} ${borderColor} mb-3 shadow-sm`}>
         
         {/* HEADER: Key Name + Controls */}
         <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2 flex-1">
                {depth > 0 && <span className="text-[#6C5CE7]">↳</span>}
                <div className="flex-1">
                   <input 
                      type="text"
                      className="bg-transparent font-bold text-xs uppercase tracking-wider text-[#636E72] focus:text-[#6C5CE7] focus:outline-none border-b border-transparent focus:border-[#6C5CE7] w-full"
                      value={key.replace(/_/g, " ")} 
                      onChange={(e) => {
                         const newKey = e.target.value.replace(/ /g, "_");
                         handleKeyRename(path, key, newKey);
                      }}
                   />
                </div>
            </div>

            <div className="flex items-center gap-1">
                {isObject && (
                  <button onClick={() => handleAddEntry([...path, key])} className="p-1.5 text-[#00BFA6] hover:bg-[#00BFA6]/10 rounded-lg transition-colors" title="Add Field Inside"><Plus size={14} /></button>
                )}
                <button onClick={() => handleRemoveEntry(path, key)} className="p-1.5 text-[#FF7675] hover:bg-[#FF7675]/10 rounded-lg transition-colors" title="Remove Field"><Trash2 size={14} /></button>
            </div>
         </div>

         {/* CONTENT: Value Editor */}
         <div className="pl-2">
            {isObject ? (
                <div className="space-y-2">
                    {Object.entries(value).map(([nestedKey, nestedValue]) => 
                        renderNestedField(nestedKey, nestedValue, [...path, key], depth + 1)
                    )}
                </div>
            ) : isArrayField ? (
                // --- ARRAY HANDLING (Fixed for Nested Dicts) ---
                <div className="space-y-3">
                    {(value as any[]).map((item, idx) => {
                        // Check if the array item itself is a dict/object
                        const isItemObject = typeof item === 'object' && item !== null;

                        return (
                            <div key={idx} className="flex gap-2">
                                <div className="flex-1">
                                    {isItemObject ? (
                                        // RECURSIVE CALL for Objects inside Arrays
                                        <div className="border-l-2 border-[#6C5CE7]/30 pl-3">
                                            {Object.entries(item).map(([subKey, subVal]) => 
                                                renderNestedField(subKey, subVal, [...path, key, idx], depth + 1)
                                            )}
                                            {/* Allow adding fields to this specific object in the array */}
                                            <button 
                                                onClick={() => handleAddEntry([...path, key, idx])}
                                                className="mt-2 text-[10px] font-bold text-[#6C5CE7] flex items-center gap-1 uppercase tracking-wide"
                                            >
                                                <Plus size={10} /> Add Field to this Item
                                            </button>
                                        </div>
                                    ) : (
                                        // STANDARD INPUT for Strings inside Arrays
                                        <AutoResizeTextarea
                                            className="w-full bg-white border border-[#E5E5E5] p-2 rounded-lg text-sm text-[#2D3436]"
                                            value={item}
                                            onChange={(e: any) => handleDataChange([...path, key, idx], e.target.value)}
                                        />
                                    )}
                                </div>
                                
                                {/* Remove Item from Array Button */}
                                <button onClick={() => handleRemoveEntry([...path, key], idx)} className="h-fit mt-1 text-[#FF7675] hover:bg-[#FF7675]/10 p-1 rounded">
                                    <X size={14} />
                                </button>
                            </div>
                        );
                    })}
                    
                    <button 
                        onClick={() => {
                            // If the array contains objects, add an empty object. If strings, add empty string.
                            const firstItem = (value as any[])[0];
                            const isObjectArray = typeof firstItem === 'object' && firstItem !== null;
                            const newItem = isObjectArray ? { "new_key": "" } : "";
                            
                            const newArr = [...value, newItem];
                            handleDataChange([...path, key], newArr);
                        }}
                        className="text-xs font-bold text-[#6C5CE7] flex items-center gap-1 mt-2 hover:underline"
                    >
                        <Plus size={12}/> Add Item
                    </button>
                 </div>
            ) : (
                // Standard String/Value Handling
                <AutoResizeTextarea
                  className="w-full bg-white border-2 border-[#E5E5E5] p-3 rounded-lg focus:outline-none focus:border-[#6C5CE7] text-[#2D3436] min-h-[60px] resize-y"
                  value={String(value || "")}
                  onChange={(e: any) => handleDataChange([...path, key], e.target.value)}
                />
            )}
         </div>
      </div>
    );
  };

  if (fetchLoading) return <div className="p-10 text-center text-[#636E72]">Loading Data...</div>;

  if (!data) {
     return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <p className="text-[#636E72] font-bold">No data generated for this phase yet.</p>
            <button onClick={handleGenerate} disabled={loading}
                className="px-8 py-4 bg-[#6C5CE7] text-white rounded-2xl font-bold hover:bg-[#5A4AD1] transition-all flex items-center gap-2">
                {loading ? "Thinking..." : `Generate ${phaseConfig.name}`} <Sparkles size={18}/>
            </button>
        </div>
     );
  }

  const isRootArray = Array.isArray(data);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
       <div className="flex justify-between items-center bg-gradient-to-r from-[#FFF8F1] to-[#F5F9FF] p-5 rounded-2xl border-2 border-[#E5E5E5] sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-[#FFD166] animate-pulse' : 'bg-[#00BFA6]'}`}></div>
             <span className="font-bold text-[#6C5CE7]">{hasUnsavedChanges ? "Unsaved Changes" : "Director Notes"}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleGenerate} className="px-4 py-2 bg-[#E5E5E5] text-[#2D3436] rounded-xl font-bold hover:bg-[#dcdcdc] text-sm">Regenerate</button>
            <button onClick={handleSave} disabled={!hasUnsavedChanges || loading} className="flex items-center gap-2 px-6 py-2.5 bg-[#00BFA6] text-white rounded-xl font-bold hover:bg-[#00BFA6]/90 disabled:opacity-50">
                <Save size={16} /> Save
            </button>
          </div>
       </div>

       <div className="bg-white rounded-3xl shadow-md border-2 border-[#E5E5E5] p-6 min-h-[500px]">
           {isRootArray ? (
               <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#E5E5E5]">
                     <button onClick={() => setListPageIndex(p => Math.max(0, p-1))} disabled={listPageIndex === 0} className="p-2 text-[#6C5CE7] disabled:opacity-30"><ArrowLeft/></button>
                     <span className="font-bold text-[#2D3436]">Entry {listPageIndex + 1} / {data.length}</span>
                     <button onClick={() => setListPageIndex(p => Math.min(data.length-1, p+1))} disabled={listPageIndex === data.length-1} className="p-2 text-[#6C5CE7] disabled:opacity-30"><ArrowRight/></button>
                  </div>
                  
                  <div className="space-y-2">
                    {data[listPageIndex] && Object.entries(data[listPageIndex]).map(([k, v]) => 
                        renderNestedField(k, v, [listPageIndex])
                    )}
                  </div>
                  
                  <button onClick={() => handleAddEntry([listPageIndex])} className="w-full py-3 mt-4 border-2 border-dashed border-[#6C5CE7]/30 text-[#6C5CE7] font-bold rounded-xl hover:bg-[#6C5CE7]/5 transition-colors flex justify-center items-center gap-2">
                    <Plus size={18} /> Add New Field to this Item
                  </button>
               </div>
           ) : (
               <div className="space-y-2">
                   {Object.entries(data).map(([k, v]) => renderNestedField(k, v, []))}
                   <button onClick={() => handleAddEntry([])} className="w-full py-3 mt-4 border-2 border-dashed border-[#6C5CE7]/30 text-[#6C5CE7] font-bold rounded-xl hover:bg-[#6C5CE7]/5 transition-colors flex justify-center items-center gap-2">
                        <Plus size={18} /> Add New Root Field
                    </button>
               </div>
           )}
       </div>
    </div>
  );
}