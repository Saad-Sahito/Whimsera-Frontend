import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Globe, BookOpen, Users, Zap, Network, Layers, Shield, CheckCircle2, FileText } from "lucide-react";

const PHASES = [
  {
    id: 1,
    title: "Planting the first spark of magic...",
    description: "Creating story seed",
    duration: 10,
    icon: Sparkles,
    gradient: "from-[#6C5CE7] to-[#8B7FE8]"
  },
  {
    id: 2,
    title: "Weaving the fabric of reality...",
    description: "Building independent world foundation",
    duration: 30,
    icon: Globe,
    gradient: "from-[#8B7FE8] to-[#00BFA6]"
  },
  {
    id: 3,
    title: "Charting the path of adventure...",
    description: "Generating minimal plot outline",
    duration: 30,
    icon: BookOpen,
    gradient: "from-[#00BFA6] to-[#74C0FC]"
  },
  {
    id: 4,
    title: "Breathing life into characters...",
    description: "Generating narrative agents",
    duration: 10,
    icon: Users,
    gradient: "from-[#74C0FC] to-[#FF7675]"
  },
  {
    id: 5,
    title: "Discovering tensions and drama...",
    description: "Analyzing conflicts",
    duration: 30,
    icon: Zap,
    gradient: "from-[#FF7675] to-[#FFD166]"
  },
  {
    id: 6,
    title: "Threading story strands together...",
    description: "Connecting elements to plot",
    duration: 20,
    icon: Network,
    gradient: "from-[#FFD166] to-[#6C5CE7]"
  },
  {
    id: 7,
    title: "Enriching the narrative tapestry...",
    description: "Expanding plot outline",
    duration: 120,
    icon: Layers,
    gradient: "from-[#6C5CE7] to-[#00BFA6]"
  },
  {
    id: 8,
    title: "Ensuring a perfect reading experience...",
    description: "Age-appropriateness filter",
    duration: 20,
    icon: Shield,
    gradient: "from-[#00BFA6] to-[#74C0FC]"
  },
  {
    id: 9,
    title: "Polishing every detail to perfection...",
    description: "Quality validation",
    duration: 20,
    icon: CheckCircle2,
    gradient: "from-[#74C0FC] to-[#FF7675]"
  },
  {
    id: 10,
    title: "Adding the final touches of brilliance...",
    description: "Refining plot",
    duration: 120,
    icon: Wand2,
    gradient: "from-[#FF7675] to-[#FFD166]"
  },
  {
    id: 11,
    title: "Preparing your journey compass...",
    description: "Creating story tracker",
    duration: 30,
    icon: FileText,
    gradient: "from-[#FFD166] to-[#6C5CE7]"
  }
];




interface Props {
  isVisible: boolean;
}

export default function StoryCreationPhases({ isVisible }: Props) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentPhase(0);
      setProgress(0);
      setElapsedTime(0);
      return;
    }

    if (currentPhase >= PHASES.length) return;

    const phase = PHASES[currentPhase];
    const startTime = Date.now();
    const duration = phase.duration * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const phaseProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(phaseProgress);
      setElapsedTime(Math.floor(elapsed / 1000));

      if (phaseProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentPhase((p) => p + 1);
          setProgress(0);
          setElapsedTime(0);
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentPhase, isVisible]);

  if (!isVisible) return null;

  const totalDuration = PHASES.reduce((acc, p) => acc + p.duration, 0);
  const overallProgress = PHASES.slice(0, currentPhase).reduce((acc, p) => acc + p.duration, 0) + (currentPhase < PHASES.length ? (PHASES[currentPhase].duration * progress / 100) : 0);
  const overallPercentage = (overallProgress / totalDuration) * 100;

  if (currentPhase >= PHASES.length) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-[#6C5CE7]/90 via-[#00BFA6]/90 to-[#FFD166]/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-6 rounded-full bg-white shadow-2xl flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <CheckCircle2 className="w-16 h-16 text-[#00BFA6]" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Fredoka, sans-serif" }}>
            Putting in Final Touches
          </h2>
          <p className="text-xl text-white/90 italic" style={{ fontFamily: "Annie Use Your Telescope, cursive" }}>
            Your Story Awaits!
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const phase = PHASES[currentPhase];
  const Icon = phase.icon;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 sm:p-12 max-w-2xl w-full shadow-2xl border-4 border-white relative overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${phase.gradient} opacity-5`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10">
          {/* Phase indicator */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-[#6C5CE7]" style={{ fontFamily: "Poppins, sans-serif" }}>
              Phase {phase.id} of {PHASES.length}
            </span>
            <span className="text-sm text-[#2D3436]/60" style={{ fontFamily: "Poppins, sans-serif" }}>
              {Math.floor(overallProgress / 60)}:{String(Math.floor(overallProgress % 60)).padStart(2, '0')} / {Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Icon with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.id}
              className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${phase.gradient} shadow-2xl flex items-center justify-center`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Phase title and description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3436] mb-3" style={{ fontFamily: "Fredoka, sans-serif" }}>
                {phase.title}
              </h2>
              <p className="text-lg sm:text-xl text-[#2D3436]/70 italic" style={{ fontFamily: "Annie Use Your Telescope, cursive" }}>
                {phase.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Phase progress bar */}
          <div className="mb-6">
            <div className="w-full bg-[#E5E5E5] h-3 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${phase.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[#2D3436]/60" style={{ fontFamily: "Poppins, sans-serif" }}>
                {elapsedTime}s / {phase.duration}s
              </span>
              <span className="text-xs font-bold text-[#6C5CE7]" style={{ fontFamily: "Poppins, sans-serif" }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Overall progress */}
          <div className="pt-6 border-t border-[#E5E5E5]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-[#2D3436]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Overall Progress
              </span>
              <span className="text-sm font-bold text-[#6C5CE7]" style={{ fontFamily: "Poppins, sans-serif" }}>
                {Math.round(overallPercentage)}%
              </span>
            </div>
            <div className="w-full bg-[#E5E5E5] h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166] rounded-full"
                animate={{ width: `${overallPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Completed phases indicator */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {PHASES.map((p, idx) => (
              <motion.div
                key={p.id}
                className={`w-3 h-3 rounded-full ${
                  idx < currentPhase
                    ? "bg-[#00BFA6]"
                    : idx === currentPhase
                    ? "bg-[#6C5CE7]"
                    : "bg-[#E5E5E5]"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              />
            ))}
          </div>

          {/* Sparkle effects */}
          <motion.div
            className="absolute top-8 right-8 text-[#FFD166] opacity-60"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-8 text-[#6C5CE7] opacity-60"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [360, 180, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}