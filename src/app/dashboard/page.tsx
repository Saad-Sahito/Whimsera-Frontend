"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Clock, Sparkles, X, Zap, Layers } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabase/client";
import { useRouter } from 'next/navigation';

interface Profile {
  nickname?: string;
  [key: string]: any;
}

interface Story {
  story_id: string;
  title?: string;
  genre?: string | string[];
  latest_phase?: string | number;
  updated_at: string;
  author_type?: 'Basic' | 'Advanced';
}

const WhimseraDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showMethodModal, setShowMethodModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) return;
      
      const user = session.user;
      const freshToken = session.access_token;
      const userId = user.id;
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${backendUrl}/users/${userId}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${freshToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.status === 'success') {
          setProfile(data.profile);
          setStories(data.stories);
        }
      } catch (error) {
        console.error("Error fetching profile and stories:", error);
      }
    }
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      await fetch(`${backendUrl}/users/${session.user.id}/session`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
      });
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  function formatRelativeTime(timestamp: string | null): string {
    if (!timestamp) return 'Never edited';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  // Helper to determine the correct route based on author type
  const getRoute = (authorType?: string) => {
    return authorType === 'Basic' ? '/basic-story-setup' : '/story-setup';
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] font-sans text-[#2D3436] p-6 md:p-12">
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#6C5CE7] opacity-5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[#FFD166] opacity-5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-[#2D3436] tracking-tight">
              Writer's Desk<span className="text-[#00BFA6]">.</span>
            </h1>
            <p className="text-[#2D3436]/60 font-medium">Welcome back, {profile?.nickname || 'Scribe'}.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-[#E5E5E5] flex items-center gap-2 shadow-sm">
              <Sparkles size={18} className="text-[#FFD166]" />
              <span className="text-sm font-bold">12 Magic Credits</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white px-4 py-2 rounded-xl border border-[#E5E5E5] text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NEW PROJECT CARD */}
          <div 
            onClick={() => setShowMethodModal(true)}
            className="lg:col-span-1 block group relative overflow-hidden bg-[#6C5CE7] rounded-[2rem] p-8 flex flex-col justify-end min-h-[320px] transition-all transform hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(108,92,231,0.25)] cursor-pointer"
          >
            <div className="absolute top-8 right-8 bg-white/20 p-4 rounded-2xl backdrop-blur-md group-hover:scale-110 transition-transform">
              <Plus color="white" size={32} />
            </div>
            <div className="relative z-10">
              <h2 className="text-white text-3xl font-black mb-2 tracking-tight">New Grimoire</h2>
              <p className="text-white/70 font-medium leading-relaxed">Choose your writing methodology and start a new spark.</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00BFA6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* RECENT PROJECTS */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2 tracking-tight">
              <Clock size={22} className="text-[#00BFA6]" />
              Recent Manuscripts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stories.map((story) => (
                <Link
                  key={story.story_id}
                  href={`${getRoute(story.author_type)}?type=continue&story_id=${story.story_id}`}
                  className="group block bg-white border-2 border-[#E5E5E5] p-6 rounded-[1.5rem] hover:border-[#6C5CE7] transition-all hover:shadow-xl hover:shadow-[#6C5CE7]/5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#F5F9FF] p-3 rounded-xl group-hover:bg-[#6C5CE7]/10 transition-colors">
                      <BookOpen size={24} className="text-[#6C5CE7]" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-[#2D3436] text-white px-2 py-0.5 rounded">
                            Phase {story.latest_phase || 0}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                            {story.author_type || 'Standard'}
                        </span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-1 truncate">{story.title || 'Untitled Story'}</h4>
                  <p className="text-sm text-gray-400 mb-6 font-medium">
                    {Array.isArray(story.genre) ? story.genre[0] : story.genre || 'Draft'}
                  </p>
                  
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider">
                    <span className="text-gray-400">{formatRelativeTime(story.updated_at)}</span>
                    <span className="text-[#6C5CE7] group-hover:translate-x-1 transition-transform">Continue →</span>
                  </div>
                </Link>
              ))}

              {stories.length === 0 && (
                <div className="border-2 border-dashed border-[#E5E5E5] rounded-3xl flex items-center justify-center p-12 text-gray-400 font-medium italic col-span-full">
                  Your inkwell is empty. Start a new story!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Words Written', val: '12,402', color: '#6C5CE7' },
            { label: 'Concepts', val: '8', color: '#00BFA6' },
            { label: 'Characters', val: '14', color: '#FF7675' },
            { label: 'Streak', val: '5 Days', color: '#FFD166' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/40 border border-white p-6 rounded-2xl backdrop-blur-sm shadow-sm">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.val}</p>
            </div>
          ))}
        </section>
      </div>

      {/* METHOD SELECTION MODAL */}
      {showMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2D3436]/40 backdrop-blur-sm" onClick={() => setShowMethodModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowMethodModal(false)}
              className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Choose your path<span className="text-[#6C5CE7]">.</span></h2>
              <p className="text-gray-500 font-medium">How would you like to build your story today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BASIC OPTION */}
              <Link 
                href="/basic-story-setup?type=new&story_id=None"
                className="group p-8 rounded-3xl border-2 border-[#E5E5E5] hover:border-[#00BFA6] hover:bg-[#00BFA6]/5 transition-all text-left"
              >
                <div className="w-14 h-14 bg-[#00BFA6]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={28} className="text-[#00BFA6]" />
                </div>
                <h3 className="text-xl font-black mb-2">Basic</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">For beginners. A streamlined, guided experience to get your idea down fast.</p>
              </Link>

              {/* ADVANCED OPTION */}
              <Link 
                href="/story-setup?type=new&story_id=None"
                className="group p-8 rounded-3xl border-2 border-[#E5E5E5] hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-all text-left"
              >
                <div className="w-14 h-14 bg-[#6C5CE7]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Layers size={28} className="text-[#6C5CE7]" />
                </div>
                <h3 className="text-xl font-black mb-2">Advanced</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">For frequent writers. Deep-dive into the Snowflake method with granular control.</p>
              </Link>
            </div>
            
            <p className="mt-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              Both paths use magic credits for generation
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhimseraDashboard;