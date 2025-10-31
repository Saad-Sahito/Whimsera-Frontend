"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowRight, Check } from "lucide-react";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate API call - replace with your actual waitlist API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsLoading(false);
    setEmail("");
  };

  const benefits = [
    "Early access to Whimsera before public launch",
    "Unlimited story creation during beta period",
    "Shape the future with your feedback",
    "Exclusive beta community access"
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-[#FFD166]/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-[#6C5CE7]/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            x: [0, -20, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#00BFA6]/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border-2 border-[#FFD166]/40 mb-6 shadow-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 text-[#FFD166]" />
            <span className="text-sm font-bold text-[#2D3436]">Limited Beta Access</span>
          </motion.div>

          <h2
            className="text-4xl md:text-6xl font-bold text-[#2D3436] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Be Among the First
            <span className="block mt-2 bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#FFD166] bg-clip-text text-transparent">
              Storytellers
            </span>
          </h2>

          <p className="text-xl text-[#2D3436]/75 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-nunito)" }}>
            Join the waitlist to get exclusive early access when we launch. 
            No credit card required. Just pure storytelling magic.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto"
        >
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#E5E5E5] shadow-sm"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#6C5CE7] flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#2D3436] font-medium leading-relaxed" style={{ fontFamily: "var(--font-poppins)" }}>
                {benefit}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          {!submitted ? (
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#00BFA6] rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#E5E5E5]">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D3436]/40" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#E5E5E5] focus:border-[#6C5CE7] focus:outline-none transition-all text-[#2D3436] placeholder:text-[#2D3436]/40"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    />
                  </div>
                  
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isLoading || !email}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
                
                <p className="text-sm text-[#2D3436]/60 mt-4 text-center" style={{ fontFamily: "var(--font-poppins)" }}>
                  We respect your privacy. No spam, ever.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-[#00BFA6] text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#6C5CE7] flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 
                className="text-3xl font-bold text-[#2D3436] mb-4"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                You're on the list! 🎉
              </h3>
              
              <p className="text-lg text-[#2D3436]/75 mb-6" style={{ fontFamily: "var(--font-nunito)" }}>
                Check your inbox for a confirmation email. We'll notify you as soon as Whimsera launches.
              </p>
              
              <p className="text-sm text-[#2D3436]/60" style={{ fontFamily: "var(--font-poppins)" }}>
                In the meantime, follow us on social media for updates and sneak peeks!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#2D3436]/60 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
            Trusted by storytellers worldwide
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              </div>
              <span className="text-sm font-medium text-[#2D3436]">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00BFA6]/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-[#00BFA6]" />
              </div>
              <span className="text-sm font-medium text-[#2D3436]">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFD166]/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-[#FFD166]" />
              </div>
              <span className="text-sm font-medium text-[#2D3436]">Easy to Use</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}