// Updated Sidebar.tsx (now supports draggable phases)
import React from "react";
import { Lock, Check } from "lucide-react";
import { PHASES } from "../../config/storyConstants";

interface SidebarProps {
  activeStepIndex: number;
  maxReachedPhaseIndex: number;
  completedSteps: string[];
  onNavigate: (index: number) => void;
  openPhases: number[]; // To highlight open phases
  onDragStart: (index: number) => void; // Callback for drag start
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeStepIndex,
  maxReachedPhaseIndex,
  completedSteps,
  onNavigate,
  openPhases,
  onDragStart,
}) => {
  return (
    <aside className="w-80 bg-white m-4 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border-2 border-[#E5E5E5] hidden md:flex">
      <div className="p-8 bg-gradient-to-br from-[#6C5CE7] to-[#8E7CF0] text-white">
        <h1 className="text-3xl font-black tracking-tight">
          Whimsera<span className="text-[#FFD166]">.</span>
        </h1>
        <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
          <p className="text-xl font-black">Snowflake</p>
          <p className="text-xs opacity-80 mt-1 uppercase tracking-wider">Methodology</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {PHASES.map((phase, index) => {
          const Icon = phase.icon;
          const isUnlocked = index <= maxReachedPhaseIndex;
          const isCompleted = completedSteps.includes(phase.id);
          const isCurrent = activeStepIndex === index;
          const isOpen = openPhases.includes(index);

          return (
            <div
              key={phase.id}
              draggable={isUnlocked}
              onDragStart={(e) => {
                if (isUnlocked) {
                  e.dataTransfer.setData("phaseIndex", index.toString());
                  onDragStart(index);
                }
              }}
              onClick={() => isUnlocked && onNavigate(index)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all transform duration-200 cursor-pointer ${
                isCurrent
                  ? "bg-[#6C5CE7] text-white scale-[1.02] shadow-lg shadow-[#6C5CE7]/30"
                  : isCompleted
                  ? "bg-[#00BFA6]/10 text-[#00BFA6] hover:bg-[#00BFA6]/20"
                  : isUnlocked
                  ? "bg-[#E5E5E5]/50 text-[#636E72] hover:bg-[#E5E5E5]"
                  : "opacity-40 grayscale"
              } ${isOpen && openPhases.length > 1 ? "ring-4 ring-[#6C5CE7]/30" : ""}`}
            >
              <div className={`p-2 rounded-lg ${isCurrent ? "bg-white/20" : "bg-transparent"}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 text-left">
                <span className="font-bold text-sm block">{phase.name}</span>
                {isCurrent && <span className="text-[10px] opacity-80 font-medium">In Progress</span>}
                {isOpen && openPhases.length > 1 && <span className="text-[10px] font-bold text-[#FFD166]">Open</span>}
              </div>
              
              {isCompleted && !isCurrent && <Check size={18} />}
              {!isUnlocked && <Lock size={16} />}
            </div>
          );
        })}
      </div>

      <div className="p-4 text-center text-xs text-[#636E72]">
        Drag phases to workspace for side-by-side view
      </div>
    </aside>
  );
};