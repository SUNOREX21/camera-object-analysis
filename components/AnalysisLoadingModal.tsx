'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Eye, Box, Layers, Scale, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { text: 'Detecting object & background segmentation...', icon: Eye },
  { text: 'Analyzing geometric shape & surface contours...', icon: Box },
  { text: 'Identifying specular material composition...', icon: Layers },
  { text: 'Estimating 3D bounding box dimensions...', icon: Cpu },
  { text: 'Calculating volume, density & estimated weight...', icon: Scale },
  { text: 'Synthesizing final object analysis report...', icon: Sparkles },
];

interface AnalysisLoadingModalProps {
  isOpen: boolean;
  imagePreviewUrl?: string | null;
}

export function AnalysisLoadingModal({ isOpen, imagePreviewUrl }: AnalysisLoadingModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md rounded-3xl bg-dark-card border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden text-center"
      >
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Central HUD Graphic Ring */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          {/* Outer Rotating HUD Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyber-500/40 animate-hud-spin" />
          <div className="absolute inset-2 rounded-full border border-slate-800" />
          <div className="absolute inset-4 rounded-full border border-cyber-400/20 animate-pulse-glow" />

          {/* Image Thumbnail inside scanner */}
          {imagePreviewUrl ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-cyber-400 p-1 bg-black">
              <img
                src={imagePreviewUrl}
                alt="Scanning preview"
                className="w-full h-full object-cover rounded-full filter brightness-110"
              />
              <div className="absolute inset-0 bg-cyber-500/20 animate-pulse" />
              <div className="absolute left-0 right-0 h-0.5 bg-cyber-glow animate-scan-line" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-cyber-500/10 border border-cyber-500/30 flex items-center justify-center text-cyber-400">
              <StepIcon className="w-10 h-10 animate-bounce" />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-500/10 border border-cyber-500/20 text-cyber-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>AI MULTIMODAL VISION PROCESSING</span>
          </div>

          <h3 className="text-lg font-bold text-white min-h-[56px] flex items-center justify-center">
            {currentStep.text}
          </h3>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>PIPELINE PROGRESS</span>
            <span className="text-cyber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-500 via-indigo-500 to-cyber-glow"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Step List Indicator */}
        <div className="grid grid-cols-6 gap-1 pt-2">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx <= currentStepIndex
                  ? 'bg-cyber-400 shadow-sm shadow-cyber-400/50'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

      </motion.div>
    </div>
  );
}
