'use client';

import React, { useState, useEffect } from 'react';
import { ScanRecord } from '@/types/analysis';
import { getScanHistory, deleteScanFromHistory, clearAllHistory } from '@/lib/history-storage';
import { History, Search, Trash2, ExternalLink, Download, Sparkles, Scale, Box, Layers, Filter } from 'lucide-react';
import { downloadJSON, generatePDFReport } from '@/lib/export-utils';

interface ScanHistoryViewProps {
  onSelectScan: (record: ScanRecord) => void;
}

export function ScanHistoryView({ onSelectScan }: ScanHistoryViewProps) {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this scan record?')) {
      const updated = deleteScanFromHistory(id);
      setHistory(updated);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  const categories = Array.from(new Set(history.map(item => item.analysis.category)));

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.analysis.objectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysis.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysis.material.primaryMaterial.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.analysis.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyber-500/20 border border-cyber-500/30 flex items-center justify-center text-cyber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Scan History Repository</h1>
            <p className="text-xs text-slate-400">
              {history.length} object scan records saved locally in browser storage
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-all w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter Bar */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by object name, category, or material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyber-400 w-full sm:w-48"
            >
              <option value="all">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* History Grid */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => {
            const { analysis } = item;
            return (
              <div
                key={item.id}
                onClick={() => onSelectScan(item)}
                className="group rounded-3xl bg-dark-card border border-slate-800 p-5 space-y-4 hover:border-cyber-500/40 transition-all cursor-pointer shadow-lg relative overflow-hidden"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 p-1">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={analysis.objectName}
                        className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Box className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Top Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-cyber-400 uppercase tracking-wider block">
                      {analysis.category}
                    </span>
                    <h3 className="text-base font-bold text-white truncate group-hover:text-cyber-300 transition-colors">
                      {analysis.objectName}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Sparkles className="w-3 h-3" /> {analysis.confidence}% Conf.
                    </div>
                  </div>
                </div>

                {/* Quick Property Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">EST. WEIGHT</span>
                    <span className="font-mono font-bold text-white">
                      {analysis.estimatedWeight.value} {analysis.estimatedWeight.unit}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">MATERIAL</span>
                    <span className="font-medium text-slate-200 truncate block">
                      {analysis.material.primaryMaterial}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-xs text-cyber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Full Analysis <ExternalLink className="w-3 h-3" />
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadJSON(analysis);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      title="Download JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 border border-slate-800 rounded-3xl bg-dark-card text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyber-500/10 border border-cyber-500/30 flex items-center justify-center text-cyber-400 mx-auto">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Scan Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No scan records match your search filter criteria.'
              : 'Scan physical objects using your camera or upload images to build your analysis history repository.'}
          </p>
        </div>
      )}

    </div>
  );
}
