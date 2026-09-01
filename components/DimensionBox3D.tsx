'use client';

import React, { useRef, useEffect } from 'react';
import { DimensionsInfo } from '@/types/analysis';

interface DimensionBox3DProps {
  dimensions: DimensionsInfo;
  objectName: string;
}

export function DimensionBox3D({ dimensions, objectName }: DimensionBox3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0.4;
    let angleY = 0.6;

    const scaleL = Math.max(dimensions.length, 1);
    const scaleW = Math.max(dimensions.width, 1);
    const scaleH = Math.max(dimensions.height, 1);

    const maxDim = Math.max(scaleL, scaleW, scaleH);
    const normL = (scaleL / maxDim) * 120;
    const normW = (scaleW / maxDim) * 120;
    const normH = (scaleH / maxDim) * 120;

    // 3D vertices of box
    const halfL = normL / 2;
    const halfW = normW / 2;
    const halfH = normH / 2;

    const vertices = [
      [-halfL, -halfH, -halfW],
      [halfL, -halfH, -halfW],
      [halfL, halfH, -halfW],
      [-halfL, halfH, -halfW],
      [-halfL, -halfH, halfW],
      [halfL, -halfH, halfW],
      [halfL, halfH, halfW],
      [-halfL, halfH, halfW],
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
    ];

    const render = () => {
      angleY += 0.008;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Floor
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = 1;
      for (let i = -150; i <= 150; i += 30) {
        ctx.beginPath();
        ctx.moveTo(centerX + i, centerY + 80);
        ctx.lineTo(centerX + i * 0.5, centerY + 140);
        ctx.stroke();
      }

      // Rotate and Project Vertices
      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
        let z1 = x * Math.sin(angleY) + z * Math.cos(angleY);

        // Rotate X
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Perspective scale
        const fov = 300;
        const scale = fov / (fov + z2 + 200);
        return {
          px: centerX + x1 * scale,
          py: centerY + y2 * scale,
        };
      });

      // Draw Glowing Cyber Edges
      edges.forEach(([i1, i2]) => {
        const p1 = projected[i1];
        const p2 = projected[i2];

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Vertex Corner Points
      projected.forEach(({ px, py }) => {
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.fill();
      });

      // Draw Dimension Text Labels near bounding box
      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px JetBrains Mono, monospace';

      // Length Label
      const pL1 = projected[4];
      const pL2 = projected[5];
      ctx.fillText(`L: ${dimensions.length} ${dimensions.unit}`, (pL1.px + pL2.px) / 2 - 25, (pL1.py + pL2.py) / 2 + 18);

      // Height Label
      const pH1 = projected[1];
      const pH2 = projected[2];
      ctx.fillText(`H: ${dimensions.height} ${dimensions.unit}`, pH2.px + 10, (pH1.py + pH2.py) / 2);

      // Width Label
      const pW1 = projected[5];
      const pW2 = projected[6];
      ctx.fillText(`W: ${dimensions.width} ${dimensions.unit}`, pW2.px + 10, (pW1.py + pW2.py) / 2);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <div className="relative w-full h-64 sm:h-80 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-30" />

      {/* Canvas Viewport */}
      <canvas ref={canvasRef} className="w-full h-full relative z-10" />

      {/* Overlay Badges */}
      <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyber-400">
        3D WIREFRAME BOUNDING BOX
      </div>

      <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-400">
        AUTOROTATE 360°
      </div>
    </div>
  );
}
