import React, { useState } from 'react';
import { Eye, Layers, Sparkles, AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function GradCAMViewer({ originalImage, heatmapImage, overlayImage, predictionLevel }) {
  const { lang, t } = useLanguage();
  const [viewMode, setViewMode] = useState('overlay'); // 'original' | 'heatmap' | 'overlay'
  const [opacity, setOpacity] = useState(55);

  const displayImage = viewMode === 'original' 
    ? originalImage 
    : (viewMode === 'heatmap' ? heatmapImage : overlayImage);

  return (
    <div className="bg-slate-900/90 border border-sky-900/40 rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Explainable AI (Grad-CAM Feature Attribution)
          </h3>
          <p className="text-[11px] text-slate-400">
            {lang === 'ta' ? 'AI மாதிரி முக்கியமாக கவனம் செலுத்திய விழித்திரை பகுதிகள்' : 'Visual attention map revealing retinal areas that influenced the AI prediction'}
          </p>
        </div>

        {/* 3-Way Toggle Controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'original' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'heatmap' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'overlay' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Alpha Overlay
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Grad-CAM Visualization"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-500 text-xs p-6">
            <Eye className="w-10 h-10 mb-2 opacity-40" />
            <span>Fundus visualizer canvas ready</span>
          </div>
        )}

        {/* Mode Label Overlay Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-[10px] font-bold text-sky-300 border border-white/10 uppercase tracking-wider">
          {viewMode} Mode
        </div>

        {/* Colormap Legend */}
        {viewMode !== 'original' && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur text-[10px] text-slate-300 border border-white/10 flex items-center gap-2">
            <span>Low Attention</span>
            <div className="w-16 h-2 rounded bg-gradient-to-r from-blue-600 via-green-500 via-yellow-400 to-red-600" />
            <span className="text-rose-400 font-bold">High Focus</span>
          </div>
        )}
      </div>

      {/* Scientific Explanation Banner */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Explainability Interpretation: </strong>
          Highlighted warm regions (red/yellow) indicate convolutional feature activations where the model observed suspected microvascular abnormalities, hemorrhages, or exudate formations. These regions serve as supporting diagnostic evidence for ophthalmologist review.
        </p>
      </div>
    </div>
  );
}