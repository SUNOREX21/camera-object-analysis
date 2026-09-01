'use client';

import React from 'react';
import { Camera, History, Box, Scale, Sparkles, Sun, Moon } from 'lucide-react';
import { ScaleSensorStatus } from '@/types/analysis';

interface HeaderProps {
  currentTab: 'home' | 'scanner' | 'history' | '3d' | 'results';
  onNavigate: (tab: 'home' | 'scanner' | 'history' | '3d' | 'results') => void;
  scaleStatus: ScaleSensorStatus;
  onOpenScaleModal: () => void;
  historyCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({
  currentTab,
  onNavigate,
  scaleStatus,
  onOpenScaleModal,
  historyCount,
  darkMode,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-dark-bg/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-500 via-indigo-500 to-cyber-glow p-0.5 shadow-lg shadow-cyber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-cyber-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyber-400 bg-clip-text text-transparent">
                ObjectLens
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyber-500/20 text-cyber-400 border border-cyber-500/30 rounded-md">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Vision & Physical Property Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-card/60 p-1.5 rounded-full border border-slate-800/80">
          <button
            onClick={() => onNavigate('scanner')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'scanner' || currentTab === 'results'
                ? 'bg-gradient-to-r from-cyber-600 to-cyber-500 text-white shadow-md shadow-cyber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Scanner
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'history'
                ? 'bg-gradient-to-r from-cyber-600 to-cyber-500 text-white shadow-md shadow-cyber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-cyber-500/20 text-cyber-400 font-mono">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('3d')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === '3d'
                ? 'bg-gradient-to-r from-cyber-600 to-cyber-500 text-white shadow-md shadow-cyber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            3D Mesh Mode
            <span className="px-1 text-[9px] uppercase font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
              Future
            </span>
          </button>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2.5">
          {/* Smart Scale Simulator Status */}
          <button
            onClick={onOpenScaleModal}
            title="Smart Weighing Scale Connection"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              scaleStatus.isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Scale className={`w-3.5 h-3.5 ${scaleStatus.isConnected ? 'animate-pulse text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">
              {scaleStatus.isConnected ? 'Scale Connected' : 'Scale Offline'}
            </span>
            <span className={`w-2 h-2 rounded-full ${scaleStatus.isConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark/light mode"
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Scan CTA Header Button */}
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyber-500 to-indigo-600 hover:from-cyber-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-cyber-500/20 hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan Now</span>
          </button>
        </div>
      </div>
    </header>
  );
}
