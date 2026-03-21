'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { saveUserProfile } from '@/lib/storage';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    concerns: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Sign in anonymously to get a UID
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) throw authError;

      // 2. Save profile to Supabase
      await saveUserProfile(formData);
      
      router.push('/conversation');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 md:p-16 border border-slate-100 animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-amber-100 mb-8 animate-slow-float">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-4 tracking-tight">Welcome Home</h1>
          <p className="text-slate-500 text-lg leading-relaxed">Let's introduce you to Clara. She's looking forward to meeting you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">What is your name?</label>
            <input 
              required
              className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 text-xl font-medium focus:ring-4 focus:ring-amber-100 outline-none transition-all placeholder:text-slate-200 shadow-inner"
              placeholder="e.g. Margaret Smith"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Your Age</label>
              <input 
                required
                type="number"
                className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 text-xl font-medium focus:ring-4 focus:ring-amber-100 outline-none transition-all placeholder:text-slate-200 shadow-inner"
                placeholder="e.g. 78"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Any specific concerns?</label>
            <input 
              className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 text-xl font-medium focus:ring-4 focus:ring-amber-100 outline-none transition-all placeholder:text-slate-200 shadow-inner"
              placeholder="e.g. Sleep, joint pain, or just lonely"
              value={formData.concerns}
              onChange={e => setFormData({...formData, concerns: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full h-20 bg-slate-900 text-white rounded-3xl text-xl font-black shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 mt-4"
          >
            Meet Clara
          </button>
        </form>
      </div>
    </div>
  );
}
