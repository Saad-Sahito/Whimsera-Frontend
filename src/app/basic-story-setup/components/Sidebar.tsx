"use client";
import React from "react";
import { Lock, ChevronRight, GripVertical } from "lucide-react";
import { PHASES } from "./../constants";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  activePhaseIndex: number; // For highlighting logic if needed
  openPhases: number[];
  onOpenPhase: (idx: number) => void;
}

export const Sidebar = ({ collapsed, setCollapsed, openPhases, onOpenPhase }: SidebarProps) => {
  
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("phaseIndex", index.toString());
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className={`relative transition-all duration-300 m-4 flex-shrink-0 ${collapsed ? 'w-20' : 'w-72'}`}>
      <aside className="h-full bg-white rounded-[2rem] shadow-xl flex flex-col overflow-hidden border-2 border-[#E5E5E5]">
        {/* Header */}
        <div className={`flex flex-col justify-center transition-all ${collapsed ? 'h-24 bg-[#6C5CE7] items-center' : 'p-6 bg-gradient-to-br from-[#6C5CE7] to-[#8E7CF0]'}`}>
          {!collapsed ? (
            <div><h1 className="text-2xl font-black text-white">Whimsera.</h1><p className="text-white/70 text-xs font-bold mt-1">Snowflake Studio</p></div>
          ) : ( <span className="text-white font-black text-xl">W</span> )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {PHASES.map((phase, idx) => {
            const isOpen = openPhases.includes(idx);
            
            return (
              <div
                key={phase.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onClick={() => onOpenPhase(idx)}
                className={`w-full flex items-center rounded-xl transition-all cursor-grab active:cursor-grabbing hover:bg-gray-50
                  ${collapsed ? 'justify-center py-4' : 'px-4 py-3 gap-3'} 
                  ${isOpen ? 'bg-[#6C5CE7]/10 text-[#6C5CE7] border border-[#6C5CE7]/20' : 'text-[#636E72]'}
                `}
              >
                {!collapsed && <GripVertical size={14} className="text-gray-300" />}
                {React.createElement(phase.icon, { size: 18 })}
                {!collapsed && <span className="font-bold text-sm text-left flex-1">{phase.name}</span>}
                {!collapsed && isOpen && <div className="w-2 h-2 rounded-full bg-[#6C5CE7]" />}
              </div>
            );
          })}
        </div>
      </aside>
      
      <button 
        onClick={() => setCollapsed(!collapsed)} 
        className="absolute -right-3 top-20 bg-white border border-gray-200 p-1 rounded-full shadow-md z-10 text-[#6C5CE7] hover:scale-110 transition-transform"
      >
        <ChevronRight size={14} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </div>
  );
};