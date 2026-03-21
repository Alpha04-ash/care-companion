'use client';

import React, { useState, useEffect, useRef } from 'react';
import VoiceInput from '@/components/VoiceInput';
import { sendMessage, ChatMessage } from '@/lib/gemini';
import { saveSessionAnalysis, getUserProfile } from '@/lib/storage';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ConversationPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkUser = async () => {
      const profile = await getUserProfile();
      if (!profile) {
        router.push('/onboarding');
      } else {
        setUserProfile(profile);
        if (messages.length === 0) {
          const welcome = `Hello ${profile.name}! I'm Clara, your health companion. I'd love to hear how your day is going. Is there anything on your mind?`;
          setMessages([{ role: 'assistant', content: welcome }]);
          speak(welcome);
        }
      }
    };
    checkUser();
  }, []);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
    window.speechSynthesis.cancel();

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = voices.filter(v => v.lang.startsWith('en'));
      const bestVoice = preferredVoices.find(v => v.name.includes('Google') && v.name.includes('Female')) ||
                        preferredVoices.find(v => v.name.includes('Natural')) ||
                        preferredVoices.find(v => v.name.includes('Premium')) ||
                        preferredVoices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria')) ||
                        preferredVoices[0];

      if (bestVoice) utterance.voice = bestVoice;
      utterance.pitch = 1.1; 
      utterance.rate = 0.85;  
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = doSpeak;
    } else {
      doSpeak();
    }
  };

  const handleSubmission = async (content: string) => {
    if (!content.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content };
    const historyPlusUser = [...messages, userMsg];
    setMessages(historyPlusUser);
    setIsTyping(true);
    setTextInput('');

    try {
      const response = await axios.post('/api/chat', { 
        message: content, 
        history: messages,
        userProfile: userProfile 
      });
      const result = response.data.reply;
      const claraMsg: ChatMessage = { role: 'assistant', content: result };
      setMessages([...historyPlusUser, claraMsg]);
      speak(result);
    } catch (e: any) {
      const errText = e.response?.data?.message || "I'm sorry, I'm having a little trouble connecting. Could you say that again?";
      const err = { role: 'assistant', content: errText };
      setMessages([...historyPlusUser, err as ChatMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndSession = async () => {
    if (messages.length < 2) {
      router.push('/dashboard');
      return;
    }
    
    setIsAnalyzing(true);
    const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    
    try {
      const response = await axios.post('/api/analyze', { transcript });
      const analysis = response.data;
      
      await saveSessionAnalysis({
        ...analysis,
        transcript: messages
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Analysis failed', error);
      // Fallback save anyway so transcript isn't lost
      await saveSessionAnalysis({
        moodScore: 5,
        sleepQuality: null,
        painLevel: null,
        appetite: null,
        social: null,
        redFlags: ["System: Analysis failed"],
        summary: "Conversation completed but AI analysis failed.",
        transcript: messages
      });
      router.push('/dashboard');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exchangeCount = messages.filter(m => m.role === 'user').length;

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-80px)] flex flex-col items-center relative selection:bg-amber-100">
      {/* Premium Navigation Header */}
      <div className="w-full max-w-5xl flex justify-between items-center p-6 md:p-10 animate-fade-in z-20">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white animate-slow-float">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
               <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
             </svg>
           </div>
           <div>
             <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight">Clara</h2>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Now</span>
             </div>
           </div>
        </div>
        
        <button 
          onClick={() => {
            setIsMuted(!isMuted);
            if (!isMuted) window.speechSynthesis.cancel();
          }}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center gap-3 border-2 ${
            isMuted ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-white border-slate-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          )}
          {isMuted ? 'Muted' : 'Sound On'}
        </button>
      </div>

      {/* Message Stream */}
      <div className="w-full max-w-4xl flex-1 flex flex-col p-6 pb-96 overflow-y-auto space-y-12">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col animate-entrance ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-3 px-6">
              {msg.role === 'user' ? 'Patient' : 'Clara AI'}
            </span>
            <div className={`p-8 md:p-12 rounded-[2.5rem] text-2xl md:text-4xl leading-[1.15] shadow-sm max-w-[95%] md:max-w-[85%] transition-all ${
              msg.role === 'user' 
                ? 'bg-[#0f172a] text-white rounded-br-none shadow-xl' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 font-medium'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex items-center gap-5 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-pulse-soft">
             <div className="flex space-x-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" />
             </div>
             <span className="text-slate-400 font-black italic text-lg uppercase tracking-widest">Processing...</span>
           </div>
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 z-[200] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
            <div className="w-24 h-24 border-8 border-slate-100 border-t-amber-500 rounded-full animate-spin mb-8" />
            <h2 className="text-3xl font-serif font-black text-slate-900 mb-2">Analyzing Session</h2>
            <p className="text-slate-500 italic">Clara is synchronizing insights to the cloud...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Control Center - The $10k Piece */}
      <div className="fixed bottom-8 left-0 right-0 px-4 md:px-0 z-50">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-3xl p-8 md:p-12 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border border-white/20 flex flex-col gap-10">
          
          <VoiceInput onTranscriptComplete={handleSubmission} />
          
          <div className="flex flex-col md:flex-row gap-6 border-t border-slate-50 pt-10">
            <div className="flex-1 relative group">
              <input 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmission(textInput)}
                placeholder="Talk to Clara here..."
                className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 text-xl font-medium focus:ring-4 focus:ring-amber-100 outline-none transition-all placeholder:text-slate-300 shadow-inner group-hover:bg-slate-100"
              />
            </div>
            {exchangeCount >= 5 && (
              <button 
                onClick={handleEndSession} 
                className="h-16 px-12 bg-emerald-500 text-white font-black rounded-2xl text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all active:scale-95 whitespace-nowrap"
              >
                End & Save Session
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
