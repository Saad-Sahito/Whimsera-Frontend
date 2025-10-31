// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/AuthContext";
// import NavbarRightDashboard from "../components/NavbarRightDashboard";
// import Footer from "../components/Footer";

// interface UserProfile {
//   user_id: string;
//   nickname: string;
//   age: number | null;
//   tier: string;
// }

// export default function ProfileSettings() {
//   const [nickname, setNickname] = useState("");
//   const [age, setAge] = useState("");
//   const [tier, setTier] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { isAuthenticated, userId, isLoading: authLoading, accessToken } = useAuth();
//   const router = useRouter();
//   const showLoader = loading || authLoading;

//   useEffect(() => {
//     if (authLoading) return;
//     if (!isAuthenticated) router.push("/login");
//   }, [isAuthenticated, authLoading, router]);

//   const availableTiers = ["1", "2"];

//   useEffect(() => {
//     const fetchUserProfileData = async () => {
//       if (!userId || !accessToken) {
//         setError("Authentication required");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://whimsera.com";
//         const response = await fetch(`${backendUrl}/users/${userId}/profile/data`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Failed to fetch profile data: ${errorData.detail || response.statusText}`);
//         }

//         const { status, profile }: { status: string; profile: UserProfile } = await response.json();

//         if (status === "success" && profile) {
//           setNickname(profile.nickname || "");
//           setAge(profile.age ? profile.age.toString() : "");
//           setTier(profile.tier || "");
//         } else {
//           throw new Error("Invalid response format");
//         }
//       } catch (err) {
//         console.error("Failed to fetch profile data:", err);
//         setError("Error loading profile data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfileData();
//   }, [userId, accessToken]);

//   const handleSaveSettings = async () => {
//     try {
//       if (!availableTiers.includes(tier)) {
//         setError("Please select a valid tier");
//         return;
//       }

//       const userData = {
//         nickname,
//         age: parseInt(age) || 0,
//         tier,
//       };

//       const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://whimsera.com";
//       const response = await fetch(`${backendUrl}/users/${userId}/profile/setting`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Failed to update settings: ${errorData.detail || response.statusText}`);
//       }

//       alert("Settings saved successfully!");
//     } catch (err) {
//       console.error("Failed to save settings:", err);
//       setError("Error saving settings. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <motion.div
//           className="relative"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <motion.div
//             className="w-20 h-20 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] shadow-2xl"
//             animate={{
//               scale: [1, 1.2, 1],
//               rotate: [0, 360],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//           <p className="mt-4 text-[#2D3436] font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
//             Loading your profile...
//           </p>
//         </motion.div>
//       </div>
//     );
//   }

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

//   if (authLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-[#2D3436]">
//         <TopLoader isLoading={true} />
//         Checking authentication...
//       </div>
//     );

//   return (
//     <main className="min-h-screen flex flex-col">
//       <div className="min-h-screen">
//         <TopLoader isLoading={showLoader} />
//         <NavbarRightDashboard />

//         {error && (
//           <motion.div
//             className="fixed top-24 right-4 bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-white p-6 rounded-2xl shadow-2xl z-50 max-w-full sm:max-w-md border-4 border-white"
//             initial={{ opacity: 0, x: 100 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 100 }}
//           >
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="font-bold text-lg mb-1" style={{ fontFamily: "Fredoka, sans-serif" }}>Oops!</p>
//                 <p className="text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>
//               </div>
//               <button
//                 className="ml-4 text-white hover:text-[#2D3436] transition-colors"
//                 onClick={() => setError(null)}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </motion.div>
//         )}

//         <div className="max-w-4xl mx-auto mt-32 px-4 sm:px-6 pb-20">
//           {/* Header */}
//           <motion.div
//             className="text-center mb-12"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h1
//               className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#74C0FC] bg-clip-text text-transparent mb-3"
//               style={{ fontFamily: "Fredoka, sans-serif" }}
//             >
//               Profile Settings
//             </h1>
//             <p className="text-[#2D3436] opacity-70 text-base sm:text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
//               Customize your storytelling experience
//             </p>
//           </motion.div>

//           {/* Main Form */}
//           <motion.div
//             className="relative"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             {/* Glow Effect */}
//             <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7]/20 to-[#00BFA6]/20 rounded-3xl blur-xl" />

//             <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#E5E5E5]">
//               <div className="space-y-8">
//                 {/* Basic Info Section */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-[#2D3436] font-semibold mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
//                       Nickname
//                     </label>
//                     <input
//                       type="text"
//                       value={nickname}
//                       onChange={(e) => setNickname(e.target.value)}
//                       className="w-full px-4 sm:px-5 py-2 sm:py-3 rounded-xl border-2 border-[#E5E5E5] text-[#2D3436] bg-white/80 focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all shadow-sm"
//                       style={{ fontFamily: "Poppins, sans-serif" }}
//                       placeholder="Enter your nickname"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-[#2D3436] font-semibold mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
//                       Age
//                     </label>
//                     <input
//                       type="number"
//                       value={age}
//                       onChange={(e) => setAge(e.target.value)}
//                       className="w-full px-4 sm:px-5 py-2 sm:py-3 rounded-xl border-2 border-[#E5E5E5] text-[#2D3436] bg-white/80 focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all shadow-sm"
//                       style={{ fontFamily: "Poppins, sans-serif" }}
//                       placeholder="Enter your age"
//                     />
//                   </div>
//                 </div>

//                 {/* Tier Selection */}
//                 <div>
//                   <label className="block text-[#2D3436] font-semibold mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
//                     Subscription Tier
//                   </label>
//                   <select
//                     value={tier}
//                     onChange={(e) => setTier(e.target.value)}
//                     className="w-full px-4 sm:px-5 py-2 sm:py-3 rounded-xl border-2 border-[#E5E5E5] text-[#2D3436] bg-white/80 focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all shadow-sm cursor-pointer"
//                     style={{ fontFamily: "Poppins, sans-serif" }}
//                   >
//                     <option value="" disabled>Select your tier</option>
//                     {availableTiers.map((tierOption) => (
//                       <option key={tierOption} value={tierOption}>
//                         Tier {tierOption}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Save Button */}
//                 <motion.button
//                   onClick={handleSaveSettings}
//                   className="w-full py-3 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#74C0FC] text-white shadow-2xl border-4 border-white relative overflow-hidden"
//                   style={{ fontFamily: "Fredoka, sans-serif" }}
//                   whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(108, 92, 231, 0.3)" }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
//                     animate={{
//                       x: ["-100%", "100%"],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}
//                   />
//                   <span className="relative">Save Settings</span>
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         </div>


//       </div>
//       <Footer />
//     </main>
//   );
// }