'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CameraScanner } from '@/components/CameraScanner';
import { AnalysisLoadingModal } from '@/components/AnalysisLoadingModal';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { ThreeDReconstructionView } from '@/components/3DReconstructionView';
import { ScanHistoryView } from '@/components/ScanHistoryView';
import { ScaleSensorModal } from '@/components/ScaleSensorModal';
import { AnalysisResult, CalibrationOptions, ScaleSensorStatus, ScanRecord } from '@/types/analysis';
import { getScanHistory, saveScanToHistory } from '@/lib/history-storage';
import { MOCK_ANALYSIS_DATABASE } from '@/lib/mock-data';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'home' | 'scanner' | 'history' | '3d' | 'results'>('home');
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  
  // History & Sensor State
  const [historyRecords, setHistoryRecords] = useState<ScanRecord[]>([]);
  const [isSavedInHistory, setIsSavedInHistory] = useState<boolean>(false);
  const [scaleModalOpen, setScaleModalOpen] = useState<boolean>(false);
  const [scaleStatus, setScaleStatus] = useState<ScaleSensorStatus>({
    isConnected: false,
  });

  // Dark/Light Theme
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    setHistoryRecords(getScanHistory());
  }, []);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Image Captured from Camera Scanner or File Upload
  const handleImageCaptured = async (base64Image: string, calibration: CalibrationOptions) => {
    setCapturedBase64(base64Image);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, calibration }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setCurrentAnalysis(result);
      setIsSavedInHistory(false);

      // Transition to Results Dashboard after animation completes
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentTab('results');
      }, 4200);
    } catch (err) {
      console.error('Analysis request error, using fallback analyzer:', err);
      const fallbackResult = {
        ...MOCK_ANALYSIS_DATABASE.default,
        id: 'scan-' + Date.now(),
        timestamp: new Date().toISOString(),
        imageUrl: base64Image,
      };
      setCurrentAnalysis(fallbackResult);
      setIsSavedInHistory(false);

      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentTab('results');
      }, 4200);
    }
  };

  // Instant Demo Preset Selection
  const handleDemoSelect = (sampleKey: string) => {
    const sample = MOCK_ANALYSIS_DATABASE[sampleKey] || MOCK_ANALYSIS_DATABASE.default;
    setCurrentAnalysis(sample);
    setIsSavedInHistory(false);
    setCurrentTab('results');
  };

  // Save current scan to localStorage history
  const handleSaveToHistory = () => {
    if (currentAnalysis) {
      saveScanToHistory(currentAnalysis);
      setIsSavedInHistory(true);
      setHistoryRecords(getScanHistory());
    }
  };

  // Select scan record from history
  const handleSelectScanRecord = (record: ScanRecord) => {
    setCurrentAnalysis(record.analysis);
    setIsSavedInHistory(true);
    setCurrentTab('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 selection:bg-cyber-500 selection:text-white">
      
      {/* Header */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        scaleStatus={scaleStatus}
        onOpenScaleModal={() => setScaleModalOpen(true)}
        historyCount={historyRecords.length}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HeroSection
            onStartScan={() => setCurrentTab('scanner')}
            onUploadClick={() => setCurrentTab('scanner')}
            onDemoSelect={handleDemoSelect}
          />
        )}

        {currentTab === 'scanner' && (
          <div className="py-8">
            <CameraScanner
              onImageCaptured={handleImageCaptured}
              onCancel={() => setCurrentTab('home')}
            />
          </div>
        )}

        {currentTab === 'results' && currentAnalysis && (
          <ResultsDashboard
            analysis={currentAnalysis}
            scaleStatus={scaleStatus}
            onRescan={() => setCurrentTab('scanner')}
            onSaveHistory={handleSaveToHistory}
            isSavedInHistory={isSavedInHistory}
          />
        )}

        {currentTab === 'history' && (
          <ScanHistoryView onSelectScan={handleSelectScanRecord} />
        )}

        {currentTab === '3d' && (
          <ThreeDReconstructionView />
        )}
      </main>

      {/* AI Processing Step-by-Step HUD Modal */}
      <AnalysisLoadingModal
        isOpen={isAnalyzing}
        imagePreviewUrl={capturedBase64}
      />

      {/* Smart Scale Hardware Connection Simulator Modal */}
      <ScaleSensorModal
        isOpen={scaleModalOpen}
        onClose={() => setScaleModalOpen(false)}
        scaleStatus={scaleStatus}
        onUpdateStatus={(newStatus) => setScaleStatus(newStatus)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-dark-card/60 backdrop-blur-md py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white">ObjectLens AI</span>
            <span className="text-[10px] font-mono text-cyber-400 bg-cyber-500/10 px-2 py-0.5 rounded border border-cyber-500/20">
              v2.5 Multimodal Engine
            </span>
          </div>
          <p>© 2026 ObjectLens AI Inc. Physical object properties are computer vision estimates.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => setCurrentTab('scanner')} className="hover:text-white transition-colors">Scanner</button>
            <button onClick={() => setCurrentTab('history')} className="hover:text-white transition-colors">History</button>
            <button onClick={() => setCurrentTab('3d')} className="hover:text-white transition-colors">3D Reconstruction</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
