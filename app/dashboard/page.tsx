'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getSessionHistory } from '@/lib/storage';
import { generateCaregiverReport } from '@/lib/generateReport';
import Link from 'next/link';

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSessionHistory();
        setHistory(data);
      } catch (err) {
        console.error('History fetch failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const avgMood = history.length > 0 
    ? (history.reduce((acc, s) => acc + s.moodScore, 0) / history.length).toFixed(1)
    : 0;

  const totalRedFlags = history.reduce((acc, s) => acc + s.redFlags.length, 0);

  const chartData = history.map(s => ({
    date: new Date(s.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    mood: s.moodScore
  }));

  const getMoodColor = (score: number) => {
    if (score < 4) return 'text-rose-600 bg-rose-50 border-rose-100';
    if (score < 7) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">Caregiver Dashboard</h1>
            <p className="text-slate-500 font-medium italic">Empowering families with AI-driven health insights.</p>
          </div>
          <button 
            onClick={() => generateCaregiverReport(history)}
            className="w-full md:w-auto px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Medical PDF
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Patient Mood Avg</p>
            <p className="text-5xl font-serif text-slate-900">{avgMood}<span className="text-lg text-slate-300 ml-1">/10</span></p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Sessions</p>
            <p className="text-5xl font-serif text-slate-900">{history.length}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">System Alerts</p>
            <p className={`text-5xl font-serif ${totalRedFlags > 0 ? 'text-rose-500' : 'text-slate-900'}`}>{totalRedFlags}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-amber-400 rounded-full" />
            Mood Progression
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="mood" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorMood)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-1.5 h-6 bg-slate-800 rounded-full" />
            Recent Session Logs
          </h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mb-4" />
              <p className="font-serif italic">Accessing cloud archives...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {history.slice().reverse().map((session: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-xs font-bold tracking-wider">
                      {new Date(session.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                    <div className={`px-5 py-2 rounded-2xl border font-bold text-sm ${getMoodColor(session.moodScore)}`}>
                      Score: {session.moodScore}/10
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-slate-800 leading-snug mb-6">{session.summary}</h3>
                  
                  {session.redFlags.length > 0 && (
                    <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 mb-6">
                      <p className="text-rose-600 font-black text-[10px] tracking-widest uppercase mb-3 flex items-center gap-2">
                         Warning Flags
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {session.redFlags.map((f: string, i: number) => (
                          <li key={i} className="text-rose-800 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-8 pt-8 border-t border-slate-50">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Dialogue Record</p>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide">
                      {session.transcript?.map((m: any, i: number) => (
                        <div key={i} className={`p-4 rounded-2xl ${m.role === 'assistant' ? 'bg-amber-50/50 ml-4' : 'bg-slate-50 mr-4'}`}>
                          <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">{m.role}</span>
                          <p className="text-slate-700 text-sm leading-relaxed">{m.content}</p>
                        </div>
                      ))}
                      {!session.transcript && <p className="text-slate-400 italic text-sm">Full transcript not available for this session.</p>}
                    </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
