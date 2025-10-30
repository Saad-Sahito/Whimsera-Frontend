"use client";

import { motion } from "framer-motion";
import { Brain, MessageCircle, Globe, Zap } from "lucide-react";

const features = [
  {
    Icon: Brain,
    title: "Narrative Intelligence",
    desc: "Every tale unfolds through deep understanding of tone, pacing, and your choices.",
    color: "#6C5CE7",
    gradient: "from-[#6C5CE7]/10 to-[#6C5CE7]/5"
  },
  {
    Icon: MessageCircle,
    title: "Emotional Dialogue",
    desc: "Characters remember what you say — and how you make them feel.",
    color: "#FF7675",
    gradient: "from-[#FF7675]/10 to-[#FF7675]/5"
  },
  {
    Icon: Globe,
    title: "Persistent Worlds",
    desc: "Whimsera remembers your adventures, evolving worlds and relationships over time.",
    color: "#00BFA6",
    gradient: "from-[#00BFA6]/10 to-[#00BFA6]/5"
  },
  {
    Icon: Zap,
    title: "Instant Story Crafting",
    desc: "Begin new stories in seconds, powered by adaptive AI fine-tuned for creativity.",
    color: "#FFD166",
    gradient: "from-[#FFD166]/10 to-[#FFD166]/5"
  },
];

export default function AIMagicRedesign() {
  return (
    <section className="relative py-24 px-8 bg-gradient-to-b from-white via-[#FFF8F1] to-white overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#6C5CE7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00BFA6]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6C5CE7]/10 to-[#00BFA6]/10 border border-[#6C5CE7]/20 mb-4">
            <Zap className="w-4 h-4 text-[#6C5CE7]" />
            <span className="text-sm font-medium text-[#2D3436]">Powered by Advanced AI</span>
          </div>
          
          <h2 
            className="text-4xl md:text-5xl font-bold text-[#2D3436] mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            The Magic Behind
            <span className="block mt-2 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] bg-clip-text text-transparent">
              Every Story
            </span>
          </h2>
          
          <p className="text-lg text-[#2D3436]/70 max-w-2xl mx-auto">
            Beneath every adventure lies a powerful creative engine that listens, learns, and adapts to your imagination
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${feature.color}40, ${feature.color}20)` 
                  }}
                />
                
                {/* Card content */}
                <div className={`relative bg-gradient-to-br ${feature.gradient} backdrop-blur-sm rounded-2xl p-8 border border-[#E5E5E5] group-hover:border-[${feature.color}]/30 transition-all duration-300 h-full`}>
                  
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)` 
                    }}
                  >
                    <Icon 
                      className="w-7 h-7" 
                      style={{ color: feature.color }}
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 
                    className="text-xl font-bold text-[#2D3436] mb-3"
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-[#2D3436]/70 leading-relaxed">
                    {feature.desc}
                  </p>
                  
                  {/* Decorative corner accent */}
                  <div 
                    className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at top right, ${feature.color}, transparent)`,
                      borderTopRightRadius: '1rem'
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-[#2D3436]/70 mb-6">
            Ready to experience AI-powered storytelling?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
            Try It Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}