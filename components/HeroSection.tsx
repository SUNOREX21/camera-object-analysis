'use client';

import React from 'react';
import { Camera, Upload, Sparkles, ShieldAlert, Cpu, Eye, Scale, Box, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onStartScan: () => void;
  onUploadClick: () => void;
  onDemoSelect: (sampleKey: string) => void;
}

export function HeroSection({ onStartScan, onUploadClick, onDemoSelect }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden pt-8 pb-20 md:py-24">
      {/* Background Cyber Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* AI Vision Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-500/10 border border-cyber-500/30 text-cyber-400 text-xs font-semibold backdrop-blur-md shadow-sm shadow-cyber-500/10">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen Multimodal Computer Vision v2.5</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Scan Anything.{' '}
              <span className="bg-gradient-to-r from-cyber-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Understand Everything.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              Use AI to identify objects and estimate their physical properties — including volume, material composition, density, dimensions, and visual weight.
            </p>

            {/* Scientific Notice Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200/90 max-w-xl">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Scientific Honesty Notice:</span> Optical cameras estimate weight based on visual recognition, estimated volume, and material density matrix. True mass requires physical hardware scale connection.
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartScan}
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyber-500 via-cyber-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-cyber-500/30 hover:shadow-cyber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Scan Object</span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onUploadClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Upload className="w-5 h-5 text-cyber-400" />
                <span>Upload Image</span>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 max-w-xl">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Cpu className="w-4 h-4 text-cyber-400" />
                <span>Multimodal Vision</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Weight & Volume</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Box className="w-4 h-4 text-indigo-400" />
                <span>3D Dimensions</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Interactive HUD Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Card Frame */}
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-cyber-500/30 via-slate-800/40 to-indigo-500/20 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[22px] bg-dark-card/90 border border-slate-800 p-6 space-y-6">
                
                {/* Scanner HUD Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
                      LIVE HUD SCANNER
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyber-400 bg-cyber-500/10 px-2 py-0.5 rounded border border-cyber-500/20">
                    TARGET LOCK: 98%
                  </span>
                </div>

                {/* Simulated Scan Frame Graphic */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-cyber-grid bg-[size:16px_16px] opacity-40" />

                  {/* Animated Laser Line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-glow to-transparent shadow-[0_0_15px_#00f0ff] animate-scan-line" />

                  {/* Corner Target Markers */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyber-400" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyber-400" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyber-400" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyber-400" />

                  {/* Sample Preview Graphic */}
                  <div className="relative z-10 text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-cyber-500/10 border border-cyber-500/30 flex items-center justify-center text-cyber-400 group-hover:scale-110 transition-transform">
                      <Eye className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-mono text-slate-300">
                      Place Object In Frame
                    </span>
                  </div>
                </div>

                {/* Live Output Simulation Pills */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400">Target Object</span>
                    <span className="font-semibold text-slate-100">Stainless Steel Bottle</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400">Estimated Weight</span>
                    <span className="font-mono font-bold text-cyber-400">385 g (82% conf.)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400">Dimensions</span>
                    <span className="font-mono text-slate-200">7.4 × 7.4 × 26.5 cm</span>
                  </div>
                </div>

                {/* Instant Quick Demo Buttons */}
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-medium text-slate-400 mb-2">Try sample scan instantly:</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDemoSelect('default')}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800/60 hover:bg-cyber-500/20 hover:border-cyber-500/40 border border-slate-700 text-slate-300 hover:text-cyber-300 text-xs font-medium transition-all"
                    >
                      🍼 Thermal Bottle
                    </button>
                    <button
                      onClick={() => onDemoSelect('mug')}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800/60 hover:bg-cyber-500/20 hover:border-cyber-500/40 border border-slate-700 text-slate-300 hover:text-cyber-300 text-xs font-medium transition-all"
                    >
                      ☕ Ceramic Mug
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
