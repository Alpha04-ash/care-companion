'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Talk to Clara', path: '/conversation' },
  { name: 'Care Dashboard', path: '/dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-amber-100 group-hover:rotate-12 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <span className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            Care<span className="text-amber-500">Companion</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname === link.path
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex gap-4 text-2xl">
          <Link href="/conversation" className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </Link>
          <Link href="/dashboard" className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
