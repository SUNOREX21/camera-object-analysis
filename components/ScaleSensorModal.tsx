'use client';

import React, { useState } from 'react';
import { ScaleSensorStatus } from '@/types/analysis';
import { Scale, Bluetooth, Check, X, ShieldAlert, Zap, Battery, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScaleSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scaleStatus: ScaleSensorStatus;
  onUpdateStatus: (newStatus: ScaleSensorStatus) => void;
}

export function ScaleSensorModal({
  isOpen,
  onClose,
  scaleStatus,
  onUpdateStatus,
}: ScaleSensorModalProps) {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [simulatedWeight, setSimulatedWeight] = useState<number>(scaleStatus.currentWeightGrams || 385);

  if (!isOpen) return null;

  const handleConnect = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onUpdateStatus({
        isConnected: true,
        deviceName: 'CyberScale Pro BLE #842',
        currentWeightGrams: simulatedWeight,
        batteryLevel: 94,
      });
    }, 1200);
  };

  const handleDisconnect = () => {
    onUpdateStatus({
      isConnected: false,
      deviceName: undefined,
      currentWeightGrams: undefined,
    });
  };

  const handleWeightChange = (newW: number) => {
    setSimulatedWeight(newW);
    if (scaleStatus.isConnected) {
      onUpdateStatus({
        ...scaleStatus,
        currentWeightGrams: newW,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-3xl bg-dark-card border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Smart Scale Integration Hub</h2>
              <p className="text-xs text-slate-400">
                Connect external WebBluetooth weighing sensor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scientific Context */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Optical AI Estimate vs Measured Weight</span>
          </div>
          <p>
            Standard optical camera analysis provides an <strong>AI Estimated Weight</strong> based on geometry and density models. When an external physical weighing scale is connected via WebBluetooth, ObjectLens AI automatically switches to displaying <strong>Physical Measured Weight</strong>.
          </p>
        </div>

        {/* Connection Control Box */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bluetooth className={`w-4 h-4 ${scaleStatus.isConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="text-xs font-mono font-bold text-slate-200">
                {scaleStatus.isConnected ? scaleStatus.deviceName : 'BLE Hardware Scale: Disconnected'}
              </span>
            </div>

            {scaleStatus.isConnected && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Battery className="w-3 h-3" /> {scaleStatus.batteryLevel}%
              </span>
            )}
          </div>

          {scaleStatus.isConnected ? (
            <div className="space-y-4">
              {/* Live Weight Readout simulation */}
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">LIVE SENSOR READOUT</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {scaleStatus.currentWeightGrams} <span className="text-base font-normal text-emerald-400">g</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">ACTIVE MEASURED WEIGHT</span>
              </div>

              {/* Slider to test different scale readings */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 flex justify-between font-mono">
                  <span>Simulate Weight Sensor:</span>
                  <span>{simulatedWeight} g</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="5"
                  value={simulatedWeight}
                  onChange={(e) => handleWeightChange(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs transition-all"
              >
                Disconnect Scale Sensor
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-slate-400">
                Click below to pair a WebBluetooth BLE weighing scale or test sensor integration:
              </p>

              <button
                onClick={handleConnect}
                disabled={isSearching}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Scanning BLE Weight Devices...</span>
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4" />
                    <span>Connect Smart Scale Sensor</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </motion.div>
    </div>
  );
}
