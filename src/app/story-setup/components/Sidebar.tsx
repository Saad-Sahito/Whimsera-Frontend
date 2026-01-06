import React from "react";
import { Lock, Check } from "lucide-react";
import { FlowType, FLOWS } from "../../config/storyConstants";

interface SidebarProps {
  flowType: FlowType;
  activeStepIndex: number;
  maxReachedPhaseIndex: number;
  completedSteps: string[];
  onNavigate: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  flowType,
  activeStepIndex,
  maxReachedPhaseIndex,
  completedSteps,
  onNavigate,
}) => {
  const activeFlowPhases = FLOWS[flowType];

  return (
    <aside className="w-80 bg-white m-4 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border-2 border-[#E5E5E5]">
      <div className="p-8 bg-gradient-to-br from-[#6C5CE7] to-[#8E7CF0] text-white">
        <h1 className="text-4xl font-black">
          Whimsera<span className="text-[#FFD166]">.</span>
        </h1>
        <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
          <p className="text-2xl font-black">{flowType}</p>
          <p className="text-xs opacity-80 mt-1">Story Flow</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {activeFlowPhases.map((phase, index) => {
          const Icon = phase.icon;
          const isUnlocked = index <= maxReachedPhaseIndex;
          const isCompleted = completedSteps.includes(phase.id);
          const isCurrent = activeStepIndex === index;

          return (
            <button
              key={phase.id}
              onClick={() => isUnlocked && onNavigate(index)}
              disabled={!isUnlocked}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all transform ${
                isCurrent
                  ? "bg-[#6C5CE7] text-white scale-[1.02] shadow-lg shadow-[#6C5CE7]/30"
                  : isCompleted
                  ? "bg-[#00BFA6]/10 text-[#00BFA6] hover:bg-[#00BFA6]/20"
                  : isUnlocked
                  ? "bg-[#E5E5E5]/50 text-[#636E72] hover:bg-[#E5E5E5]"
                  : "opacity-30"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left font-bold text-sm">
                {phase.name}
              </span>
              {isCompleted && !isCurrent && <Check size={18} />}
              {!isUnlocked && <Lock size={16} />}
            </button>
          );
        })}
      </div>
    </aside>
  );
};