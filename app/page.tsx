'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="mb-6 inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full">
          AI Health Companion
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mb-6 leading-tight">
          Talk to <span className="text-amber-500 underline decoration-amber-200 underline-offset-8">Clara</span>. <br />
          Experience Care Reimagined.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
          The most empathetic companion for elderly wellness. Just speak naturally, and Clara takes care of everything else—from mood tracking to caregiver reports.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20">
          <Link 
            href="/conversation"
            className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-lg font-bold shadow-xl hover:bg-slate-800 hover:-translate-y-1 active:scale-95 transition-all text-center"
          >
            Start Talking Now
          </Link>
          <Link 
            href="/dashboard"
            className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-lg font-bold shadow-sm hover:border-amber-500 hover:text-amber-600 hover:-translate-y-1 active:scale-95 transition-all text-center"
          >
            View Dashboard
          </Link>
        </div>

        {/* Feature Grid - Adaptive for Laptop & Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Natural Interaction</h3>
            <p className="text-slate-500 leading-relaxed">No complex forms. Simply talk with Clara as you would with a friend.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Intelligent Analysis</h3>
            <p className="text-slate-500 leading-relaxed">Advanced AI identifies mood, health metrics, and clinical red flags automatically.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Doctor Reports</h3>
            <p className="text-slate-500 leading-relaxed">Generate professional summaries ready for medical review in one click.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">CareCompanion AI • 2026</p>
      </footer>
    </div>
  );
}
