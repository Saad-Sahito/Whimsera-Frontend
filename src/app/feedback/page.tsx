
// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import NavbarRightDashboard from "../components/NavbarRightDashboard";
// import Footer from "../components/Footer";
// import { useAuth } from "../context/AuthContext";

// // Model options with display names and backend keys
// // const MODEL_OPTIONS = [
// //   { key: "gpt-5-nano-2025-08-07", name: "Flicker" },
// //   //{ key: "gemini-2.5-flash-lite", name: "Kite" },
// //   { key: "openai/gpt-oss-120b", name: "Lyric" },
// //   { key: "llama-3.3-70b-versatile", name: "Lyra" },
// //   { key: "gpt-5-mini-2025-08-07", name: "Ember" },
// //   { key: "gpt-4o-mini-2024-07-18", name: "Echo" },
// //   { key: "gemini-2.5-flash", name: "Nova" },
// //   { key: "claude-haiku-4-5-20251001", name: "Haiku" },
// // ];

// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// export default function FeedbackPage() {
//   const [formData, setFormData] = useState<Record<string, string | number>>({});
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { isAuthenticated, userId, isLoading: authLoading, accessToken } = useAuth();
//   const router = useRouter();
//   // Show loader during any processing
//   const showLoader = loading || authLoading;

//   useEffect(() => {
//     if (authLoading) return;
//     if (!isAuthenticated) router.push("/login");
//   }, [isAuthenticated, authLoading, router]);
//   // Loader Component
//   const TopLoader = ({ isLoading }: { isLoading: boolean }) => (
//     <AnimatePresence>
//       {isLoading && (
//         <motion.div
//           className="fixed top-0 left-0 right-0 h-1 z-[1000] origin-left"
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           exit={{ scaleX: 0 }}
//           transition={{
//             duration: 0.3,
//             ease: "easeOut"
//           }}
//         >
//           <div
//             className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#6C5CE7] animate-pulse"
//             style={{
//               backgroundSize: '200% 100%',
//               animation: 'gradient-shift 1.5s ease infinite'
//             }}
//           />
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNumberSelect = (name: string, value: number) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch(`${backendUrl}/feedback`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) setSubmitted(true);
//       else console.error("Feedback submission failed:", await res.text());
//     } catch (err) {
//       console.error("Error submitting feedback:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   if (authLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-[#2D3436]">
//         <TopLoader isLoading={true} />
//         Checking authentication...
//       </div>
//     );


//   if (submitted) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <TopLoader isLoading={showLoader} />
//         <NavbarRightDashboard />
//         <main className="flex-1 flex items-center justify-center text-center p-6">
//           <div className="max-w-md bg-[#FFF8F1] border border-[#E5E5E5] rounded-2xl p-8 shadow-md">
//             <h1 className="text-2xl font-semibold text-[#2D3436] mb-3">
//               Thank you for your feedback! 🌟
//             </h1>
//             <p className="text-[#2D3436]">Your insights help us improve Whimsera!</p>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <NavbarRightDashboard />
//       <main className="flex-1 flex flex-col items-center px-4 py-10 text-[#2D3436] mt-24">
//         <div className="w-full max-w-2xl bg-[#FFF8F1] border border-[#E5E5E5] rounded-2xl shadow-md p-8">
//           <h1 className="text-3xl font-semibold text-[#6C5CE7] mb-6 text-center">
//             Whimsera Beta Feedback ✨
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* USER CONTEXT */}
//             <div>
//               <label className="font-semibold">1. How did you use the app?</label>
//               <select
//                 name="usage_mode"
//                 onChange={handleChange}
//                 className="w-full mt-2 border rounded-md p-2"
//               >
//                 <option value="">Select</option>
//                 <option value="interactive">Interactive story mode</option>
//                 <option value="classic">Classic story mode</option>
//                 <option value="both">Both</option>
//               </select>
//             </div>

//             {/* <div>
//               <label className="font-semibold">2. Which AI model did you try?</label>
//               <select
//                 name="model_used"
//                 onChange={handleChange}
//                 className="w-full mt-2 border rounded-md p-2"
//               >
//                 <option value="">Select a model</option>
//                 {MODEL_OPTIONS.map((model) => (
//                   <option key={model.key} value={model.key}>
//                     {model.name}
//                   </option>
//                 ))}
//               </select>
//             </div> */}

//             {/* STORY QUALITY */}
//             <div>
//               <label className="font-semibold">
//                 2. How would you rate the overall story quality? (1-5)
//               </label>
//               <div className="flex space-x-2 mt-2">
//                 {[1, 2, 3, 4, 5].map((value) => (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() => handleNumberSelect("story_quality", value)}
//                     className={`px-4 py-2 border rounded-md ${formData.story_quality === value
//                       ? "bg-[#6C5CE7] text-white"
//                       : "bg-white text-[#2D3436] hover:bg-[#E5E5E5]"
//                       }`}
//                   >
//                     {value}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="font-semibold">3. What did you like most about the story?</label>
//               <textarea
//                 name="story_like"
//                 onChange={handleChange}
//                 className="w-full mt-2 border rounded-md p-2"
//               />
//             </div>

//             <div>
//               <label className="font-semibold">4. What would you improve about the story?</label>
//               <textarea
//                 name="story_improve"
//                 onChange={handleChange}
//                 className="w-full mt-2 border rounded-md p-2"
//               />
//             </div>

//             {/* INTERACTIVITY */}
//             <div>
//               <label className="font-semibold">
//                 5. If you tried interactive mode, how natural did the choices feel? (1–5)
//               </label>
//               <div className="flex space-x-2 mt-2">
//                 {[1, 2, 3, 4, 5].map((value) => (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() => handleNumberSelect("interactivity_naturalness", value)}
//                     className={`px-4 py-2 border rounded-md ${formData.interactivity_naturalness === value
//                       ? "bg-[#6C5CE7] text-white"
//                       : "bg-white text-[#2D3436] hover:bg-[#E5E5E5]"
//                       }`}
//                   >
//                     {value}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="font-semibold">6. Was the pacing or flow of the story comfortable?</label>
//               <select
//                 name="story_pacing"
//                 onChange={handleChange}
//                 className="w-full mt-2 border rounded-md p-2"
//               >
//                 <option value="">Select</option>
//                 <option value="much_too_fast">Much too fast</option>
//                 <option value="slightly_too_fast">Slightly too fast</option>
//                 <option value="perfectly_balanced">Perfectly balanced</option>
//                 <option value="slightly_too_slow">Slightly too slow</option>
//                 <option value="much_too_slow">Much too slow</option>
//               </select>
//             </div>

//             {/* APP EXPERIENCE */}
//             <div>
//               <label className="font-semibold">7. How easy was it to use the interface? (1–5)</label>
//               <div className="flex space-x-2 mt-2">
//                 {[1, 2, 3, 4, 5].map((value) => (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() => handleNumberSelect("ease_of_use", value)}
//                     className={`px-4 py-2 border rounded-md ${formData.ease_of_use === value
//                       ? "bg-[#6C5CE7] text-white"
//                       : "bg-white text-[#2D3436] hover:bg-[#E5E5E5]"
//                       }`}
//                   >
//                     {value}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="font-semibold">
//                 8. Did anything feel buggy, slow, or confusing?
//               </label>
//               <textarea
//                 name="buggy_or_confusing"
//                 onChange={handleChange}
//                 className="w-full mt-2 border rounded-md p-2"
//               />
//             </div>

//             {/* OPEN FEEDBACK */}
//             <div>
//               <label className="font-semibold">
//                 9. Any other suggestions or features you&apos;d love to see?
//               </label>
//               <textarea
//                 name="additional_feedback"
//                 onChange={handleChange}
//                 className="w-full mt-2 border rounded-md p-2"
//               />
//             </div>

//             {/* OPTIONAL METRICS */}
//             <div>
//               <label className="font-semibold">
//                 10. Would you recommend the app to a friend? (0-5)
//               </label>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {[0, 1, 2, 3, 4, 5].map((value) => (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() => handleNumberSelect("nps_score", value)}
//                     className={`px-4 py-2 border rounded-md ${formData.nps_score === value
//                       ? "bg-[#6C5CE7] text-white"
//                       : "bg-white text-[#2D3436] hover:bg-[#E5E5E5]"
//                       }`}
//                   >
//                     {value}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="font-semibold">
//                 11. How likely are you to use it again? (1–5)
//               </label>
//               <div className="flex space-x-2 mt-2">
//                 {[1, 2, 3, 4, 5].map((value) => (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() => handleNumberSelect("reuse_likelihood", value)}
//                     className={`px-4 py-2 border rounded-md ${formData.reuse_likelihood === value
//                       ? "bg-[#6C5CE7] text-white"
//                       : "bg-white text-[#2D3436] hover:bg-[#E5E5E5]"
//                       }`}
//                   >
//                     {value}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-md font-semibold text-white bg-[#00BFA6] hover:bg-[#6C5CE7] transition-colors"
//             >
//               {loading ? "Submitting..." : "Submit Feedback"}
//             </button>
//           </form>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }
