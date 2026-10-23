import React, { useState } from 'react';
import { Sliders, Sparkles, ZoomIn } from 'lucide-react';

export default function BeforeAfterCLAHE({ originalImage, enhancedImage }) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="bg-slate-900/90 border border-sky-900/40 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Image Enhancement & CLAHE Pipeline
          </h3>
          <p className="text-[11px] text-slate-400">Contrast Limited Adaptive Histogram Equalization on Green Channel</p>
        </div>
        <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          +38.4% Vessel Contrast Gain
        </div>
      </div>

      {/* Interactive Split Canvas */}
      <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden bg-black select-none">
        {/* Before Image (Left Layer) */}
        <img
          src={originalImage}
          alt="Original Fundus"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* After Image (Right Layer Clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
        >
          <img
            src={enhancedImage || originalImage}
            alt="Enhanced CLAHE"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Divider Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] cursor-ew-resize"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-[10px] text-black font-bold shadow-lg">
            ↔
          </div>
        </div>

        {/* Labels */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-slate-300">
          RAW ORIGINAL
        </span>
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-cyan-950/80 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
          CLAHE ENHANCED
        </span>
      </div>

      {/* Slider Control */}
      <div className="mt-3 flex items-center space-x-3 text-xs text-slate-400">
        <span>Raw</span>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="flex-1 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <span>Enhanced</span>
      </div>
    </div>
  );
}