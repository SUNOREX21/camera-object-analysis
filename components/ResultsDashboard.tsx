'use client';

import React, { useState } from 'react';
import { 
  AnalysisResult, 
  ScaleSensorStatus 
} from '@/types/analysis';
import { 
  Sparkles, 
  Scale, 
  Box, 
  Layers, 
  Palette, 
  ShieldAlert, 
  CheckCircle2, 
  Download, 
  Share2, 
  Copy, 
  FileText, 
  RotateCcw, 
  HelpCircle, 
  Info, 
  Sliders, 
  Maximize2,
  Check
} from 'lucide-react';
import { downloadJSON, copyAnalysisToClipboard, generatePDFReport } from '@/lib/export-utils';
import { DimensionBox3D } from './DimensionBox3D';

interface ResultsDashboardProps {
  analysis: AnalysisResult;
  scaleStatus: ScaleSensorStatus;
  onRescan: () => void;
  onSaveHistory: () => void;
  isSavedInHistory: boolean;
}

export function ResultsDashboard({
  analysis,
  scaleStatus,
  onRescan,
  onSaveHistory,
  isSavedInHistory,
}: ResultsDashboardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Check if sensor weight is actively connected
  const activeWeightValue = scaleStatus.isConnected && scaleStatus.currentWeightGrams
    ? scaleStatus.currentWeightGrams
    : analysis.estimatedWeight.value;

  const activeWeightUnit = analysis.estimatedWeight.unit;
  const isSensorMeasured = scaleStatus.isConnected;

  const handleCopy = async () => {
    await copyAnalysisToClipboard(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-slate-800 p-4 rounded-3xl backdrop-blur-xl">
        <button
          onClick={onRescan}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all w-fit"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Scan Another Object</span>
        </button>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSaveHistory}
            disabled={isSavedInHistory}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isSavedInHistory
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                : 'bg-cyber-500/20 hover:bg-cyber-500/30 border border-cyber-500/40 text-cyber-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSavedInHistory ? 'Saved to History' : 'Save Scan'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={() => downloadJSON(analysis)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyber-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => generatePDFReport(analysis)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyber-500 to-indigo-600 hover:from-cyber-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-cyber-500/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Header */}
      <div className="rounded-3xl bg-dark-card border border-slate-800 p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Object Image Preview Thumbnail */}
          <div className="lg:col-span-4 relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2 group shadow-xl">
            {analysis.imageUrl ? (
              <img
                src={analysis.imageUrl}
                alt={analysis.objectName}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <Box className="w-16 h-16" />
              </div>
            )}
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyber-400">
              AI SCANNER VERIFIED
            </div>
          </div>

          {/* Key Identification Metrics */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-cyber-500/10 border border-cyber-500/30 text-cyber-400 text-xs font-mono font-bold">
                CATEGORY: {analysis.category.toUpperCase()}
              </span>

              {/* Confidence Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyber-400" />
                <span className="text-slate-400">AI Confidence:</span>
                <span className="text-emerald-400 font-bold">{analysis.confidence}%</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {analysis.objectName}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              {analysis.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div>
                <span className="text-slate-500">Condition:</span>{' '}
                <span className="text-slate-200 font-medium">{analysis.condition}</span>
              </div>
              {analysis.manufactureInfo?.brand && (
                <div>
                  <span className="text-slate-500">Brand / Series:</span>{' '}
                  <span className="text-slate-200 font-medium">{analysis.manufactureInfo.brand}</span>
                </div>
              )}
              {analysis.manufactureInfo?.model && (
                <div>
                  <span className="text-slate-500">Model:</span>{' '}
                  <span className="text-slate-200 font-medium">{analysis.manufactureInfo.model}</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Main Physical Properties Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyber-400" />
          <span>Physical Property Metrics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Estimated / Measured Weight */}
          <div className="rounded-2xl bg-dark-card border border-slate-800 p-6 space-y-3 relative overflow-hidden group hover:border-cyber-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">
                {isSensorMeasured ? 'Measured Weight' : 'Estimated Weight'}
              </span>
              <Scale className={`w-4 h-4 ${isSensorMeasured ? 'text-emerald-400' : 'text-cyber-400'}`} />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {activeWeightValue}
              </span>
              <span className="text-lg font-semibold text-slate-400 font-mono">
                {activeWeightUnit}
              </span>
            </div>

            {/* Disclaimer pill */}
            <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
              isSensorMeasured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-cyber-500/10 border-cyber-500/20 text-cyber-300'
            }`}>
              <span className="font-medium">
                {isSensorMeasured
                  ? 'Sensor Measured • Hardware Bluetooth Scale'
                  : 'AI Estimate • Visual AI Model'}
              </span>
              <span className="font-bold font-mono">
                {isSensorMeasured ? '100% Exact' : `${analysis.estimatedWeight.confidence}% conf.`}
              </span>
            </div>

            {!isSensorMeasured && (
              <p className="text-[11px] text-slate-400 leading-tight">
                Calculated from optical volume geometry and baseline material density matrix ({analysis.estimatedDensity.value} {analysis.estimatedDensity.unit}).
              </p>
            )}
          </div>

          {/* Card 2: Dimensions */}
          <div className="rounded-2xl bg-dark-card border border-slate-800 p-6 space-y-3 relative overflow-hidden group hover:border-cyber-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Dimensions (L × W × H)</span>
              <Box className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="text-2xl font-extrabold text-white font-mono">
              {analysis.dimensions.length} × {analysis.dimensions.width} × {analysis.dimensions.height}{' '}
              <span className="text-sm font-semibold text-slate-400">{analysis.dimensions.unit}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Source Method:</span>
              <span className="font-medium text-cyber-300">{analysis.dimensions.source}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              Bounding box estimated with {analysis.dimensions.confidence}% confidence.
            </p>
          </div>

          {/* Card 3: Volume & Density */}
          <div className="rounded-2xl bg-dark-card border border-slate-800 p-6 space-y-3 relative overflow-hidden group hover:border-cyber-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Volume & Density</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block">EST. VOLUME</span>
                <span className="text-lg font-bold text-white font-mono">
                  {analysis.estimatedVolume.value} {analysis.estimatedVolume.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">EST. DENSITY</span>
                <span className="text-lg font-bold text-white font-mono">
                  {analysis.estimatedDensity.value} {analysis.estimatedDensity.unit}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              Density matrix matched to primary material baseline.
            </div>
          </div>

          {/* Card 4: Material Analysis */}
          <div className="rounded-2xl bg-dark-card border border-slate-800 p-6 space-y-3 relative overflow-hidden group hover:border-cyber-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Material & Finish</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <span className="text-xl font-bold text-white block">
                {analysis.material.primaryMaterial}
              </span>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                {analysis.material.confidence}% Material Confidence
              </span>
            </div>

            <div className="space-y-1.5 pt-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Texture:</span>
                <span>{analysis.material.texture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reflectivity:</span>
                <span>{analysis.material.reflectivity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transparency:</span>
                <span>{analysis.material.transparency}</span>
              </div>
            </div>
          </div>

          {/* Card 5: Color Breakdown */}
          <div className="rounded-2xl bg-dark-card border border-slate-800 p-6 space-y-3 relative overflow-hidden group hover:border-cyber-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Color Analysis</span>
              <Palette className="w-4 h-4 text-amber-400" />
            </div>

            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl border border-white/20 shadow-md shrink-0"
                style={{ backgroundColor: analysis.color.hex }}
              />
              <div>
                <span className="text-base font-bold text-white block leading-tight">
                  {analysis.color.primary}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {analysis.color.hex} • {analysis.color.rgb}
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-300 border-t border-slate-800">
              <span className="text-slate-400">Secondary Accent:</span> {analysis.color.secondary}
            </div>
          </div>

          {/* Card 6: Geometry & Shape */}
          <div className="rounded-2xl bg-dark-card border border-slate-800 p-6 space-y-3 relative overflow-hidden group hover:border-cyber-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Geometric Shape</span>
              <Box className="w-4 h-4 text-cyber-400" />
            </div>

            <div className="text-base font-bold text-white">
              {analysis.shape}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Geometric classification helps parameterize volume integration and mass distribution formulas.
            </p>
          </div>

        </div>
      </div>

      {/* 3D Visual Dimension Representation */}
      <div className="rounded-3xl bg-dark-card border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-400" />
            <span>Interactive 3D Dimension Visualization</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Scale: {analysis.dimensions.length} × {analysis.dimensions.width} × {analysis.dimensions.height} {analysis.dimensions.unit}
          </span>
        </div>

        <DimensionBox3D dimensions={analysis.dimensions} objectName={analysis.objectName} />
      </div>

      {/* Accuracy & Scientific Trust Section */}
      <div className="rounded-3xl bg-dark-card border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Accuracy, Confidence & Physical Assumptions</h2>
            <p className="text-xs text-slate-400">
              Detailed transparency log explaining how each physical property was estimated.
            </p>
          </div>
        </div>

        {/* Assumptions List */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            AI PHYSICAL ASSUMPTIONS USED IN CALCULATION:
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            {analysis.assumptions.map((item, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-cyber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Property Trust Log Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="p-3.5">PROPERTY</th>
                <th className="p-3.5">ESTIMATED VALUE</th>
                <th className="p-3.5">CONFIDENCE</th>
                <th className="p-3.5">METHOD & ALGORITHM</th>
                <th className="p-3.5">PRIMARY ASSUMPTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 bg-slate-950/40">
              {analysis.propertyTrust.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white">{row.property}</td>
                  <td className="p-3.5 font-mono text-cyber-300">{row.value}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                      row.confidence >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {row.confidence}%
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{row.method}</td>
                  <td className="p-3.5 text-slate-400">{row.assumption}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
