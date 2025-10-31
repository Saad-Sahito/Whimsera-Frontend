// "use client";

// import NavbarRightDashboard from "../components/NavbarRightDashboard";
// import { motion, AnimatePresence, Variants } from "framer-motion";
// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/app/context/AuthContext";
// import { useRouter } from "next/navigation";
// import Footer from "../components/Footer";

// interface UserProfile {
//     nickname: string;
//     tier: number;
//     age: number;
// }

// const genreColors: Record<string, string> = {
//     Fantasy: "#6C5CE7",
//     Mystery: "#00BFA6",
//     Comedy: "#FFD166",
//     "Sci-Fi": "#74C0FF",
//     Romance: "#FF7675",
//     Adventure: "#00CEC9",
//     Horror: "#E17055",
//     Suspense: "#0984E3",
//     "Slice of Life": "#A29BFE",
// };

// const toneColors = ["#FFD166", "#74C0FC", "#00BFA6", "#6C5CE7", "#FF7675", "#2D3436"];

// const GRADIENT_COLORS = [
//     "rgba(108, 92, 231, 0.3)",
//     "rgba(0, 191, 166, 0.3)",
//     "rgba(255, 118, 117, 0.3)",
//     "rgba(255, 209, 102, 0.3)",
//     "rgba(116, 192, 252, 0.3)",
// ];

// const ALL_GENRES = ["Fantasy", "Mystery", "Comedy", "Sci-Fi", "Romance", "Adventure", "Horror", "Suspense", "Slice of Life"];
// const ALL_THEMES = [
//     "Friendship & Loyalty",
//     "Love & Romance",
//     "Mystery & Secrets",
//     "Adventure & Exploration",
//     "Betrayal & Revenge",
//     "Courage & Heroism",
//     "Loss & Redemption",
//     "Comedy & Humor",
// ];

// export default function StartStory() {
//     // --- Story States ---
//     const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
//     //const [selectedPOV, setSelectedPOV] = useState<string>("");
//     const [storyLength, setStoryLength] = useState<number>(40);
//     const [selectedVoice, setSelectedVoice] = useState<string>("");
//     const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
//     const [setting, setSetting] = useState<string>("");
//     const [title, setTitle] = useState<string>("");
//     const [tone, setTone] = useState<number>(40);
//     const [storyType, setStoryType] = useState<string>("interactive");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [mounted, setMounted] = useState<boolean>(false);

//     // --- User Profile States ---
//     const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

//     // --- Popup States ---
//     const [showStoryTypePopup, setShowStoryTypePopup] = useState<boolean>(false);
//     const [isLoadingTitle, setIsLoadingTitle] = useState<boolean>(false);

//     // --- Cursor State ---
//     const [ripples, setRipples] = useState<
//         { id: number; x: number; y: number; colorPair: [string, string] }[]
//     >([]);
//     const rippleCounter = useRef(0);
//     const colorIndex = useRef(0);
//     const isMoving = useRef(true);
//     const lastMoveTime = useRef(Date.now());
//     const lastColorChangeTime = useRef(Date.now());

//     // --- Auth and Router ---
//     const { isAuthenticated, userId, accessToken, isLoading: authLoading } = useAuth();
//     const router = useRouter();
//     const showLoader = authLoading;

//     useEffect(() => {
//         if (authLoading) return;
//         if (!isAuthenticated) router.push("/login");
//     }, [isAuthenticated, authLoading, router]);

//     // Loader Component
//     const TopLoader = ({ isLoading }: { isLoading: boolean }) => (
//         <AnimatePresence>
//             {isLoading && (
//                 <motion.div
//                     className="fixed top-0 left-0 right-0 h-1 z-[1000] origin-left"
//                     initial={{ scaleX: 0 }}
//                     animate={{ scaleX: 1 }}
//                     exit={{ scaleX: 0 }}
//                     transition={{
//                         duration: 0.3,
//                         ease: "easeOut"
//                     }}
//                 >
//                     <div
//                         className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#6C5CE7] animate-pulse"
//                         style={{
//                             backgroundSize: '200% 100%',
//                             animation: 'gradient-shift 1.5s ease infinite'
//                         }}
//                     />
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );

//     // --- Fetch User Profile ---
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             if (!userId || !accessToken) return;

//             try {
//                 const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//                 const response = await fetch(`${backendUrl}/users/${userId}/profile/data`, {
//                     headers: { Authorization: `Bearer ${accessToken}` },
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.status === "success" && data.profile) {
//                         setUserProfile(data.profile);
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching user profile:", error);
//             }
//         };

//         fetchUserProfile();
//     }, [userId, accessToken]);

//     // --- Get Initial Story Data ---
//     const getInitialStoryData = () => ({
//         //POV: selectedPOV,
//         Tone: tone,
//         Genre: selectedGenres,
//         Title: title,
//         Length: storyLength,
//         Setting: setting,
//         user_id: userId,
//         story_type: storyType,
//         story_id: null,
//         "Guide Prose": selectedVoice ? [selectedVoice] : [],
//         "Additional Themes": selectedThemes,
//         target_audience_age: userProfile?.age || null,
//     });

//     // --- Mouse Movement ---
//     useEffect(() => {
//         setMounted(true);

//         const handleMouseMove = (e: MouseEvent) => {
//             lastMoveTime.current = Date.now();
//             isMoving.current = true;

//             const now = Date.now();
//             let colorPair: [string, string];
//             if (now - lastColorChangeTime.current > 500) {
//                 colorIndex.current = (colorIndex.current + 1) % GRADIENT_COLORS.length;
//                 lastColorChangeTime.current = now;
//                 colorPair = [
//                     GRADIENT_COLORS[colorIndex.current],
//                     GRADIENT_COLORS[(colorIndex.current + 1) % GRADIENT_COLORS.length],
//                 ];
//             } else {
//                 colorPair = [
//                     GRADIENT_COLORS[colorIndex.current],
//                     GRADIENT_COLORS[(colorIndex.current + 1) % GRADIENT_COLORS.length],
//                 ];
//             }

//             const uniqueId = Date.now() + rippleCounter.current++;
//             setRipples((prev) => [...prev, { id: uniqueId, x: e.clientX, y: e.clientY, colorPair }]);
//             setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== uniqueId)), 1000);
//         };

//         const checkStationary = setInterval(() => {
//             if (Date.now() - lastMoveTime.current > 100) {
//                 isMoving.current = false;
//             }
//         }, 100);

//         window.addEventListener("mousemove", handleMouseMove);
//         return () => {
//             window.removeEventListener("mousemove", handleMouseMove);
//             clearInterval(checkStationary);
//             setMounted(false);
//         };
//     }, []);

//     // --- Toggle functions ---
//     const toggleGenre = (genre: string) => {
//         setSelectedGenres((prev) =>
//             prev.includes(genre)
//                 ? prev.filter((g) => g !== genre)
//                 : prev.length < 3
//                     ? [...prev, genre]
//                     : prev
//         );
//     };

//     const handleMultiSelect = (item: string) => {
//         setSelectedThemes((prev) =>
//             prev.includes(item)
//                 ? prev.filter((i) => i !== item)
//                 : prev.length < 3
//                     ? [...prev, item]
//                     : prev
//         );
//     };

//     const povOptions = [
//         "First-person - \"I walked into the forest…\"",
//         "Second-person - \"You enter the forest…\"",
//         "Third-person limited - \"She walked into the forest, nervous but determined.\"",
//         "Third-person omniscient - \"She walked into the forest, unaware of the danger lurking.\"",
//         "Cinematic / Script Style - dialogue-heavy, scene directions",
//     ];

//     const toneLabels = ["Playful", "Lighthearted", "Adventurous", "Dramatic", "Serious", "Intense"];
//     const lengthLabels = ["Short Long Story (7,500 - 15,000 words)", "Novelette (15,000 - 25,000 words)", "Novella (25,000 - 40,000 words)", "Novel Chapter (40,000 - 60,000 words)", "Full Novel (60,000 - 90,000 words)", "Epic / Series (90,000 - 150,000+ words)"];
//     const voiceOptions = [
//     "Casual / Conversational",     // Natural flow, modern phrasing, easy to read
//     "Fairy Tale",                  // Classic storyteller voice, simple and moral
//     "Action-driven",               // Fast, energetic pacing, focus on verbs and movement
//     //"Poetic / Lyrical",            // Emotionally vivid, rhythmic sentences
//     "Descriptive / Immersive",     // Rich sensory detail, paints vivid scenes
//     "Concise / Minimalist",        // Tight, efficient sentences with strong impact
//     "Cinematic / Visual",          // Scene-oriented, camera-like perspective
//     "Witty / Playful",             // Clever tone, light humor, charming narration
//     "Epic / Grand",                // Elevated language, sweeping storytelling
//     "Introspective / Reflective",  // Focus on inner thoughts and emotions
//     "Narrative / Classic Prose",   // Neutral, balanced storyteller voice
//     "Folkloric / Oral Tradition",  // Simple, rhythmic, sounds like spoken legend
//     ];


//     // --- Generate Title from API ---
//     const generateTitle = async () => {
//         setIsLoadingTitle(true);
//         try {
//             const initialData = getInitialStoryData();
//             const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//             const response = await fetch(`${backendUrl}/utility/title_generator`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 body: JSON.stringify({ initial_story_data: initialData }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.status === "success") {
//                     setTitle(data.data);
//                 }
//             }
//         } catch (error) {
//             console.error("Error generating title:", error);
//         } finally {
//             setIsLoadingTitle(false);
//         }
//     };

//     // --- Handle Begin Adventure ---
//     const handleBeginAdventure = async () => {
//         if (!userId) {
//             setError("Please log in to start your adventure.");
//             return;
//         }

//         setIsLoading(true);
//         setError(null);

//         try {
//             const queryParams = new URLSearchParams({
//                 user_id: userId,
//                 story_type: storyType,
//                 story_title: title || "Untitled Story",
//             });

//             const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//             const initResponse = await fetch(`${backendUrl}/stories/initialize_story?${queryParams.toString()}`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({}),
//             });

//             if (!initResponse.ok) {
//                 const text = await initResponse.text();
//                 throw new Error(`Initialize story failed: ${initResponse.status} ${text}`);
//             }

//             let initData;
//             try {
//                 initData = await initResponse.json();
//             } catch (e) {
//                 throw new Error("Invalid JSON response from initialize_story");
//             }

//             if (initData.status !== "success" || !initData.story_id) {
//                 throw new Error(initData.message || "Failed to initialize story: Invalid story_id");
//             }

//             const initialStoryData = {
//                 ...getInitialStoryData(),
//                 story_id: initData.story_id,
//             };

//             const premiseResponse = await fetch(`${backendUrl}/premise`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     initial_story_data: initialStoryData,
//                     model: "None",
//                 }),
//             });

//             if (!premiseResponse.ok) {
//                 const text = await premiseResponse.text();
//                 throw new Error(`Create premise failed: ${premiseResponse.status} ${text}`);
//             }

//             let premiseData;
//             try {
//                 premiseData = await premiseResponse.json();
//             } catch (e) {
//                 throw new Error("Invalid JSON response from create_premise");
//             }

//             if (premiseData.status !== "success") {
//                 throw new Error(premiseData.message || "Failed to create premise");
//             }

//             router.push(`/generation-app?story_id=${initData.story_id}&story_type=${storyType}`);
//         } catch (error: unknown) {
//             console.error("Error during story initialization or premise creation:", error);
//             setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // --- Variants ---
//     const containerVariants: Variants = {
//         hidden: { opacity: 0, y: 50 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//     };

//     const floatingAnimation: Variants = {
//         animate: { y: [0, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
//     };

//     if (authLoading)
//         return (
//             <div className="min-h-screen flex items-center justify-center text-[#2D3436]">
//                 <TopLoader isLoading={true} />
//                 Checking authentication...
//             </div>
//         );

//     return (
//         <main className="min-h-screen flex flex-col">
//             <TopLoader isLoading={showLoader} />
//             <NavbarRightDashboard />
//             <div className="min-h-screen text-[#2D3436] pb-20 py-18 relative px-4 sm:px-6 lg:px-8">

//                 {/* --- Ripple Effect --- */}
//                 {mounted && (
//                     <div className="fixed inset-0 pointer-events-none z-20 overflow-visible">
//                         <AnimatePresence>
//                             {ripples.map((ripple) => (
//                                 <motion.div
//                                     key={ripple.id}
//                                     initial={{ opacity: 0.5, scale: 0.6 }}
//                                     animate={{ opacity: 0, scale: 2.5 }}
//                                     exit={{ opacity: 0 }}
//                                     transition={{ duration: 0.8, ease: "easeOut" }}
//                                     className="absolute rounded-full"
//                                     style={{
//                                         width: 50,
//                                         height: 50,
//                                         left: ripple.x - 25,
//                                         top: ripple.y - 25,
//                                         background: `radial-gradient(circle, ${ripple.colorPair[0]} 0%, ${ripple.colorPair[1]} 70%, transparent 100%)`,
//                                         pointerEvents: "none",
//                                     }}
//                                 />
//                             ))}
//                         </AnimatePresence>
//                     </div>
//                 )}

//                 {/* --- Loading Orb --- */}
//                 <AnimatePresence>
//                     {isLoading && (
//                         <motion.div
//                             className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             transition={{ duration: 0.5, ease: "easeInOut" }}
//                         >
//                             <motion.div
//                                 className="w-24 h-24 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] shadow-2xl"
//                                 animate={{
//                                     scale: [1, 1.2, 1],
//                                     rotate: [0, 360],
//                                     boxShadow: [
//                                         "0 0 20px rgba(108, 92, 231, 0.8)",
//                                         "0 0 40px rgba(0, 191, 166, 0.8)",
//                                         "0 0 20px rgba(108, 92, 231, 0.8)",
//                                     ],
//                                 }}
//                                 transition={{
//                                     duration: 2,
//                                     repeat: Infinity,
//                                     ease: "easeInOut",
//                                 }}
//                             />
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* --- Error Message --- */}
//                 {error && (
//                     <motion.div
//                         className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs sm:max-w-sm"
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3, ease: "easeInOut" }}
//                     >
//                         {error}
//                         <button
//                             className="ml-4 text-white underline"
//                             onClick={() => setError(null)}
//                         >
//                             Close
//                         </button>
//                     </motion.div>
//                 )}

//                 {/* --- Story Type Popup --- */}
//                 <AnimatePresence>
//                     {showStoryTypePopup && (
//                         <motion.div
//                             className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             onClick={() => setShowStoryTypePopup(false)}
//                         >
//                             <motion.div
//                                 className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
//                                 initial={{ scale: 0.9, y: 20 }}
//                                 animate={{ scale: 1, y: 0 }}
//                                 exit={{ scale: 0.9, y: 20 }}
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     Choose Your Journey
//                                 </h2>
//                                 <div className="space-y-4">
//                                     <motion.button
//                                         onClick={() => {
//                                             setStoryType("interactive");
//                                             setShowStoryTypePopup(false);
//                                         }}
//                                         className={`w-full p-4 sm:p-6 rounded-2xl border-4 text-left transition-all ${storyType === "interactive" ? "border-[#6C5CE7] bg-gradient-to-r from-[#6C5CE7]/10 to-[#00BFA6]/10" : "border-gray-200 hover:border-[#6C5CE7]"}`}
//                                         whileHover={{ scale: 1.02 }}
//                                         whileTap={{ scale: 0.98 }}
//                                     >
//                                         <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>Interactive Adventure</h3>
//                                         <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                             Shape the story with your choices and decisions
//                                         </p>
//                                     </motion.button>
//                                     <motion.button
//                                         onClick={() => {
//                                             setStoryType("classic");
//                                             setShowStoryTypePopup(false);
//                                         }}
//                                         className={`w-full p-4 sm:p-6 rounded-2xl border-4 text-left transition-all ${storyType === "classic" ? "border-[#6C5CE7] bg-gradient-to-r from-[#6C5CE7]/10 to-[#00BFA6]/10" : "border-gray-200 hover:border-[#6C5CE7]"}`}
//                                         whileHover={{ scale: 1.02 }}
//                                         whileTap={{ scale: 0.98 }}
//                                     >
//                                         <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>Classic Narrative</h3>
//                                         <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                             Experience a traditional, flowing story
//                                         </p>
//                                     </motion.button>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* --- Page Header --- */}
//                 <motion.div
//                     className="text-center mt-12 sm:mt-16 md:mt-24 px-4"
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.8, ease: "easeOut" }}
//                 >
//                     <motion.h1
//                         className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#00BFA6] bg-clip-text text-transparent mb-4"
//                         style={{ fontFamily: "Fredoka, sans-serif" }}
//                         variants={floatingAnimation}
//                         animate="animate"
//                     >
//                         Weave Your Tale
//                     </motion.h1>
//                     <motion.p
//                         className="text-base sm:text-lg md:text-xl text-[#2D3436] opacity-70 italic"
//                         style={{ fontFamily: "Annie Use Your Telescope, cursive" }}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.3, ease: "easeOut" }}
//                     >
//                         Every great story begins with a single spark of imagination...
//                     </motion.p>
//                 </motion.div>

//                 {/* Story Type Selection */}
//                 <motion.div
//                     className="flex justify-center mt-6 sm:mt-8"
//                     variants={containerVariants}
//                     initial="hidden"
//                     animate="visible"
//                 >
//                     <div className="relative group">
//                         <motion.div
//                             className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] rounded-full blur-md opacity-50"
//                             animate={{
//                                 scale: [1, 1.05, 1],
//                             }}
//                             transition={{
//                                 duration: 2,
//                                 repeat: Infinity,
//                                 ease: "easeInOut",
//                             }}
//                         />
//                         <motion.button
//                             onClick={() => setShowStoryTypePopup(true)}
//                             className="relative border-4 border-[#6C5CE7] rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-[#2D3436] bg-white backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-[#00BFA6] shadow-2xl transition-all hover:shadow-[0_0_30px_rgba(108,92,231,0.5)] cursor-pointer"
//                             style={{ fontFamily: "Fredoka, sans-serif" }}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             {storyType === "interactive" ? "Interactive Adventure" : "Classic Narrative"}
//                         </motion.button>
//                     </div>
//                 </motion.div>

//                 {/* SECTION 1 - The Foundation */}
//                 <motion.section
//                     className="max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 px-4"
//                     variants={containerVariants}
//                     initial="hidden"
//                     animate="visible"
//                 >
//                     <div className="relative">
//                         <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] rounded-3xl blur-xl opacity-20 animate-pulse" />
//                         <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-4 border-[#E5E5E5]">
//                             <motion.div
//                                 className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2"
//                                 whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
//                                 transition={{ duration: 0.3, ease: "easeInOut" }}
//                             >
//                                 <div className="bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white">
//                                     <span className="text-xs sm:text-sm font-bold block" style={{ fontFamily: "Poppins, sans-serif" }}>CHAPTER 1</span>
//                                     <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>The Foundation</span>
//                                 </div>
//                             </motion.div>

//                             <div className="mt-12 sm:mt-16 mb-8 sm:mb-12">
//                                 <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     What kind of tale calls to you?
//                                 </h3>
//                                 <p className="text-center text-[#2D3436] opacity-60 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                     Choose up to three genres to blend
//                                 </p>
//                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
//                                     {ALL_GENRES.map((genre) => (
//                                         <motion.button
//                                             key={genre}
//                                             onClick={() => toggleGenre(genre)}
//                                             className={`rounded-2xl py-2 sm:py-3 px-3 sm:px-4 text-white font-bold text-sm sm:text-lg shadow-lg transition-all ${selectedGenres.includes(genre) ? "ring-4 ring-yellow-400" : ""}`}
//                                             style={{ backgroundColor: genreColors[genre], fontFamily: "Fredoka, sans-serif" }}
//                                             whileHover={{ scale: 1.05, y: -5 }}
//                                             whileTap={{ scale: 0.95 }}
//                                             animate={selectedGenres.includes(genre) ? { rotate: [0, -3, 3, 0] } : {}}
//                                             transition={{ duration: 0.3, ease: "easeInOut" }}
//                                         >
//                                             {genre}
//                                         </motion.button>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="mb-8 sm:mb-12 max-w-3xl mx-auto">
//                                 <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     Where will your story unfold?
//                                 </h3>
//                                 <p className="text-center text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                     Paint your world with words
//                                 </p>
//                                 <motion.textarea
//                                     className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg"
//                                     style={{ fontFamily: "Poppins, sans-serif" }}
//                                     placeholder="A mystical forest where ancient trees whisper secrets..."
//                                     rows={4}
//                                     value={setting}
//                                     onChange={(e) => setSetting(e.target.value)}
//                                     whileFocus={{ scale: 1.02 }}
//                                     transition={{ duration: 0.2, ease: "easeInOut" }}
//                                 />
//                             </div>

//                             <div className="max-w-3xl mx-auto">
//                                 <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     What mood shall enchant your tale?
//                                 </h3>
//                                 <p className="text-center text-[#2D3436] opacity-60 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                     From playful to intense
//                                 </p>
//                                 <div className="relative">
//                                     <input
//                                         type="range"
//                                         min="0"
//                                         max="100"
//                                         step="20"
//                                         value={tone}
//                                         onChange={(e) => setTone(parseInt(e.target.value))}
//                                         className="w-full h-3 rounded-full appearance-none cursor-pointer"
//                                         style={{
//                                             background: `linear-gradient(to right, #FFD166, #74C0FC, #00BFA6, #6C5CE7, #FF7675, #2D3436)`,
//                                         }}
//                                     />
//                                     <div className="flex justify-between mt-4 sm:mt-6">
//                                         {toneLabels.map((label, i) => (
//                                             <motion.span
//                                                 key={i}
//                                                 className={`text-center font-bold text-xs sm:text-sm ${tone === i * 20 ? "scale-125" : ""}`}
//                                                 style={{ color: toneColors[i], fontFamily: "Fredoka, sans-serif" }}
//                                                 animate={tone === i * 20 ? { y: [0, -5, 0] } : {}}
//                                                 transition={{ duration: 0.5, ease: "easeInOut" }}
//                                             >
//                                                 {label}
//                                             </motion.span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.section>

//                 {/* SECTION 2 - The Voice (RESTORED) */}
//                 <motion.section
//                     className="max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 px-4"
//                     variants={containerVariants}
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true }}
//                 >
//                     <div className="relative">
//                         <div className="absolute inset-0 bg-gradient-to-r from-[#FF7675] to-[#FFD166] rounded-3xl blur-xl opacity-20 animate-pulse" />
//                         <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-4 border-[#E5E5E5]">
//                             <motion.div
//                                 className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2"
//                                 whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
//                                 transition={{ duration: 0.3, ease: "easeInOut" }}
//                             >
//                                 <div className="bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white">
//                                     <span className="text-xs sm:text-sm font-bold block" style={{ fontFamily: "Poppins, sans-serif" }}>CHAPTER 2</span>
//                                     <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>The Voice</span>
//                                 </div>
//                             </motion.div>

//                             {/* <div className="mt-12 sm:mt-16 mb-8 sm:mb-12">
//                                 <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     Through whose eyes shall we see?
//                                 </h3>
//                                 <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                     Choose your narrative perspective
//                                 </p>
//                                 <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
//                                     {povOptions.map((option, idx) => (
//                                         <motion.button
//                                             key={idx}
//                                             onClick={() => setSelectedPOV(option)}
//                                             className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 transition-all text-xs sm:text-sm font-semibold ${selectedPOV === option
//                                                 ? "bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-white border-white shadow-lg"
//                                                 : "border-[#FF7675] text-[#2D3436] bg-white/80 hover:border-[#FF7675] hover:bg-[#FF7675]/10"
//                                                 }`}
//                                             style={{ fontFamily: "Poppins, sans-serif" }}
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                         >
//                                             {option}
//                                         </motion.button>
//                                     ))}
//                                 </div>
//                             </div> */}

//                             <div className="mt-12 sm:mt-16 mb-8 sm:mb-12 max-w-3xl mx-auto">
//                                 <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     How epic shall your journey be?
//                                 </h3>
//                                 <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                     From a quick tale to an endless saga
//                                 </p>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="100"
//                                     step="20"
//                                     value={storyLength}
//                                     onChange={(e) => setStoryLength(parseInt(e.target.value))}
//                                     className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-[#FF7675] to-[#FFD166] cursor-pointer"
//                                 />
//                                 <div className="flex justify-between mt-4 sm:mt-6">
//                                     {lengthLabels.map((label, i) => (
//                                         <motion.span
//                                             key={i}
//                                             className={`text-center font-bold text-xs ${storyLength === i * 20 ? "scale-125 text-[#FF7675]" : "text-[#2D3436] opacity-50"
//                                                 }`}
//                                             style={{ fontFamily: "Fredoka, sans-serif" }}
//                                             animate={storyLength === i * 20 ? { y: [0, -5, 0] } : {}}
//                                             transition={{ duration: 0.5, ease: "easeInOut" }}
//                                         >
//                                             {label}
//                                         </motion.span>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div>
//                                 <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     What voice will guide the prose?
//                                 </h3>
//                                 <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
//                                     {voiceOptions.map((voice, idx) => (
//                                         <motion.button
//                                             key={idx}
//                                             onClick={() => setSelectedVoice(voice)}
//                                             className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 transition-all font-semibold text-xs sm:text-sm ${selectedVoice === voice
//                                                 ? "bg-gradient-to-r from-[#FFD166] to-[#74C0FC] text-[#2D3436] border-white shadow-lg"
//                                                 : "border-[#FFD166] text-[#2D3436] bg-white/80 hover:border-[#FFD166] hover:bg-[#FFD166]/10"
//                                                 }`}
//                                             style={{ fontFamily: "Poppins, sans-serif" }}
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                         >
//                                             {voice}
//                                         </motion.button>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.section>

//                 {/* SECTION 3 - The Magic (Updated Title Orb) */}
//                 <motion.section
//                     className="max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 px-4 mb-10"
//                     variants={containerVariants}
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true }}
//                 >
//                     <div className="relative">
//                         <div className="absolute inset-0 bg-gradient-to-r from-[#FFD166] to-[#74C0FC] rounded-3xl blur-xl opacity-20 animate-pulse" />
//                         <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-4 border-[#E5E5E5]">
//                             <motion.div
//                                 className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2"
//                                 whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
//                                 transition={{ duration: 0.3, ease: "easeInOut" }}
//                             >
//                                 <div className="bg-gradient-to-r from-[#FFD166] to-[#74C0FC] text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white">
//                                     <span className="text-xs sm:text-sm font-bold block" style={{ fontFamily: "Poppins, sans-serif" }}>CHAPTER 3</span>
//                                     <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>The Magic</span>
//                                 </div>
//                             </motion.div>

//                             <div className="mt-12 sm:mt-16 mb-8 sm:mb-12">
//                                 <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     What threads will weave through?
//                                 </h3>
//                                 <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                     Select up to three themes
//                                 </p>
//                                 <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
//                                     {ALL_THEMES.map((item, idx) => (
//                                         <motion.button
//                                             key={idx}
//                                             onClick={() => handleMultiSelect(item)}
//                                             className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 font-semibold text-xs sm:text-sm ${selectedThemes.includes(item)
//                                                 ? "bg-gradient-to-r from-[#FFD166] to-[#74C0FC] text-[#2D3436] border-white shadow-lg"
//                                                 : "border-[#FFD166] text-[#2D3436] bg-white/80 hover:border-[#FFD166] hover:bg-[#FFD166]/10"
//                                                 }`}
//                                             style={{ fontFamily: "Poppins, sans-serif" }}
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                         >
//                                             {item}
//                                         </motion.button>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="max-w-2xl mx-auto">
//                                 <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8" style={{ fontFamily: "Fredoka, sans-serif" }}>
//                                     What name shall crown your tale?
//                                 </h3>
//                                 <p className="text-center text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
//                                     Enter a title or let Whimsera suggest one
//                                 </p>
//                                 <div className="flex items-center gap-3 sm:gap-4">
//                                     <div className="relative flex-1">
//                                         <input
//                                             type="text"
//                                             placeholder="The Chronicles of..."
//                                             value={title}
//                                             onChange={(e) => setTitle(e.target.value)}
//                                             className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full border-3 border-[#FFD166] focus:outline-none focus:ring-4 focus:ring-[#74C0FC] text-base sm:text-lg font-semibold bg-white/80 backdrop-blur-sm shadow-lg pr-14"
//                                             style={{ fontFamily: "Fredoka, sans-serif" }}
//                                             disabled={isLoadingTitle}
//                                         />
//                                         {isLoadingTitle && (
//                                             <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                                                 <motion.div
//                                                     className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD166] to-[#74C0FC] shadow-lg"
//                                                     animate={{
//                                                         scale: [1, 1.3, 1],
//                                                         rotate: [0, 360],
//                                                         boxShadow: [
//                                                             "0 0 15px rgba(255, 209, 102, 0.7)",
//                                                             "0 0 30px rgba(116, 192, 252, 0.7)",
//                                                             "0 0 15px rgba(255, 209, 102, 0.7)",
//                                                         ],
//                                                     }}
//                                                     transition={{
//                                                         duration: 1.8,
//                                                         repeat: Infinity,
//                                                         ease: "easeInOut",
//                                                     }}
//                                                 />
//                                             </div>
//                                         )}
//                                     </div>
//                                     <motion.button
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                         onClick={generateTitle}
//                                         disabled={isLoadingTitle}
//                                         className="relative p-4 rounded-full bg-gradient-to-r from-[#FFD166] to-[#74C0FC] text-white shadow-xl border-4 border-white disabled:opacity-60 overflow-hidden"
//                                         transition={{ duration: 0.3 }}
//                                     >
//                                         <motion.div
//                                             className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm"
//                                             animate={{
//                                                 scale: [1, 1.4, 1],
//                                                 rotate: [0, 360],
//                                             }}
//                                             transition={{
//                                                 duration: 1.5,
//                                                 repeat: Infinity,
//                                                 ease: "easeInOut",
//                                             }}
//                                         />
//                                     </motion.button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.section>

//                 <motion.div
//                     className="text-center mt-12 sm:mt-16 px-4 mb-16 sm:mb-20"
//                     variants={containerVariants}
//                     initial="hidden"
//                     whileInView="visible"
//                     viewport={{ once: true }}
//                 >
//                     <motion.button
//                         className="px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#00BFA6] text-white text-lg sm:text-2xl font-bold rounded-full shadow-2xl border-4 border-white"
//                         style={{ fontFamily: "Fredoka, sans-serif" }}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={handleBeginAdventure}
//                     >
//                         Begin Your Adventure
//                     </motion.button>
//                 </motion.div>

//             </div>
//             <Footer />
//         </main>
//     );
// }