'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, SwitchCamera, Zap, ZapOff, Upload, RotateCcw, Sparkles, SlidersHorizontal, Check, AlertCircle, Eye, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalibrationOptions } from '@/types/analysis';

interface CameraScannerProps {
  onImageCaptured: (base64Image: string, calibration: CalibrationOptions) => void;
  onCancel?: () => void;
}

export function CameraScanner({ onImageCaptured }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Advanced calibration state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [calibration, setCalibration] = useState<CalibrationOptions>({
    referenceObject: 'none',
    knownDimensionLengthCm: undefined,
  });

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check flashlight torch support
      const track = mediaStream.getVideoTracks()[0];
      if (track) {
        const capabilities = track.getCapabilities() as any;
        setHasTorch(!!capabilities?.torch);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      let msg = 'Could not access device camera. Please check browser permissions or use file upload.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Please grant camera access in browser settings or upload an image.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera device detected on your hardware.';
      }
      setCameraError(msg);
    }
  }, [facingMode]);

  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, capturedImage]);

  // Toggle Camera Facing Mode
  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle Flash/Torch
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        const nextTorch = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
        setTorchOn(nextTorch);
      } catch (e) {
        console.error('Torch toggle failed:', e);
      }
    }
  };

  // Capture Photo
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);

      // Stop camera stream on capture
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file size must be less than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setCapturedImage(evt.target.result as string);
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & Drop Upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setCapturedImage(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Retake Photo
  const handleRetake = () => {
    setCapturedImage(null);
  };

  // Submit Image for AI Analysis
  const handleAnalyze = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage, calibration);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Scanner Container */}
      <div className="rounded-3xl bg-dark-card border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyber-500/20 border border-cyber-500/30 flex items-center justify-center text-cyber-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {capturedImage ? 'Review Object Image' : 'Camera Scanner'}
              </h2>
              <p className="text-xs text-slate-400">
                {capturedImage ? 'Verify image clarity before analysis' : 'Position object inside the HUD frame'}
              </p>
            </div>
          </div>

          {/* Advanced Calibration Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              showAdvanced || calibration.referenceObject !== 'none'
                ? 'bg-cyber-500/20 border-cyber-500/40 text-cyber-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Mode</span>
            {calibration.referenceObject !== 'none' && (
              <span className="w-2 h-2 rounded-full bg-cyber-400" />
            )}
          </button>
        </div>

        {/* Advanced Calibration Drawer */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-900/90 border-b border-slate-800 p-4 overflow-hidden"
            >
              <div className="max-w-2xl mx-auto space-y-3 text-xs">
                <div className="flex items-center gap-2 text-cyber-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dimensional Scale Calibration</span>
                </div>
                <p className="text-slate-300">
                  Including a known reference item next to your object significantly improves AI dimensional estimation accuracy.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Reference Object in Scene:
                    </label>
                    <select
                      value={calibration.referenceObject || 'none'}
                      onChange={(e) => setCalibration({ ...calibration, referenceObject: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyber-400"
                    >
                      <option value="none">No reference (Standard visual AI)</option>
                      <option value="credit-card">Standard Credit Card (8.56 × 5.4 cm)</option>
                      <option value="us-quarter">Coin / Quarter (2.42 cm diameter)</option>
                      <option value="ruler-10cm">Ruler / Scale Marker (10 cm segment)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Or Known Length (cm):
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15.0"
                      value={calibration.knownDimensionLengthCm || ''}
                      onChange={(e) => setCalibration({ ...calibration, knownDimensionLengthCm: parseFloat(e.target.value) || undefined })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewport Area (Camera Stream OR Captured Image OR Error Fallback) */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative aspect-[4/3] sm:aspect-[16/9] w-full bg-slate-950 flex items-center justify-center overflow-hidden"
        >
          {capturedImage ? (
            /* Image Preview Mode */
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                src={capturedImage}
                alt="Captured Object Preview"
                className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Image Ready for Analysis
              </div>
            </div>
          ) : cameraError ? (
            /* Camera Access Error / Fallback Upload Box */
            <div className="p-6 text-center max-w-md space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">{cameraError}</h3>
              <p className="text-xs text-slate-400">
                You can still analyze any object by uploading a clear photo from your files.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyber-500 to-indigo-600 hover:from-cyber-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Select Image File
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Stream View */
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* HUD Target Scanner Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Dark Vignette Mask */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Framing Box */}
                <div className="relative w-[75%] h-[75%] max-w-[480px] max-h-[360px] rounded-2xl border-2 border-cyber-400/80 shadow-[0_0_30px_rgba(0,240,255,0.3)] flex flex-col justify-between p-3">
                  
                  {/* Glowing Reticle Corner Markers */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyber-glow rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyber-glow rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyber-glow rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyber-glow rounded-br-lg" />

                  {/* Animated Laser Sweep Line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-glow to-transparent shadow-[0_0_15px_#00f0ff] animate-scan-line" />

                  {/* HUD Top Badge */}
                  <div className="flex justify-between items-center z-10">
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-cyber-500/40 text-[10px] font-mono text-cyber-300 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-cyber-400" /> CAMERA SCAN ACTIVE
                    </span>
                    {calibration.referenceObject !== 'none' && (
                      <span className="px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/50 text-[10px] font-mono text-indigo-200">
                        REF: {calibration.referenceObject}
                      </span>
                    )}
                  </div>

                  {/* HUD Bottom Guide Banner */}
                  <div className="self-center bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs text-white font-medium shadow-md text-center">
                    Place the entire object inside the frame.
                  </div>

                </div>
              </div>

              {/* Camera Controls Overlay (Top Right) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                {hasTorch && (
                  <button
                    onClick={toggleTorch}
                    className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                      torchOn
                        ? 'bg-amber-500/80 border-amber-400 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
                    }`}
                    title="Toggle Flash"
                  >
                    {torchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={toggleFacingMode}
                  className="p-2.5 rounded-xl bg-black/60 border border-white/20 text-white hover:bg-black/80 backdrop-blur-md transition-all"
                  title="Switch Camera (Front/Back)"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {capturedImage ? (
            /* Post-Capture Actions */
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleRetake}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Photo
              </button>

              <button
                onClick={handleAnalyze}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyber-500 via-cyber-600 to-indigo-600 hover:from-cyber-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyber-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Object Now
              </button>
            </div>
          ) : (
            /* Pre-Capture Actions */
            <div className="w-full flex items-center justify-between gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
              >
                <Upload className="w-4 h-4 text-cyber-400" />
                <span>Upload Image Instead</span>
              </button>

              {/* Shutter Capture Button */}
              <button
                onClick={handleCapture}
                disabled={!!cameraError}
                className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyber-500 to-indigo-500 p-1 shadow-lg shadow-cyber-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                title="Capture Image"
              >
                <div className="w-full h-full rounded-full border-2 border-white bg-white/20 group-hover:bg-white/40 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white shadow" />
                </div>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
