import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  Link2, 
  Check, 
  Eye, 
  X, 
  Monitor, 
  Maximize2,
  Calendar,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { LanguageCode, translations } from '../utils/translations';
import { CapturedScreenshot } from '../types';

interface GalleryProps {
  screenshots: CapturedScreenshot[];
  onDeleteScreenshot: (id: string) => void;
  lang: LanguageCode;
}

export default function Gallery({ screenshots, onDeleteScreenshot, lang }: GalleryProps) {
  const t = translations[lang];

  // Overlay states
  const [activeImage, setActiveImage] = useState<CapturedScreenshot | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="gallery-panel-view" className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight flex items-center gap-2">
          {t.galleryTitle} <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-normal">{screenshots.length} assets</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">{t.galleryDesc}</p>
      </div>

      {/* Grid of Captured cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {screenshots.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div key={item.id} id={`gallery-card-${item.id}`} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all duration-300">
              {/* Image Preview Window */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden border-b border-slate-800/60 font-mono">
                <img
                  src={item.imageUrl}
                  alt={item.url}
                  className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />

                {/* Micro Hover Actions overlay */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    id={`view-full-${item.id}`}
                    onClick={() => setActiveImage(item)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white hover:text-emerald-400 hover:bg-slate-950 transition-all"
                    title="View Full Size"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <a
                    href={item.imageUrl}
                    download={`screensnap-${item.id}.${item.format}`}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white hover:text-emerald-400 hover:bg-slate-950 transition-all"
                    title="Download Frame"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                <span className="absolute bottom-3 left-3 bg-slate-950/90 text-[10px] text-slate-300 font-mono px-2 py-0.5 rounded-md backdrop-blur-sm uppercase">
                  {item.format} • {item.viewportWidth}x{item.viewportHeight}
                </span>
              </div>

              {/* Data Specifications section */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">destination target</h4>
                  <p className="text-sm font-bold text-slate-200 truncate font-mono" title={item.url}>{item.url}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono border-t border-b border-slate-800 py-3 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{item.deviceName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Bottom Card Controls */}
                <div className="flex items-center gap-2">
                  <button
                    id={`copy-cdn-${item.id}`}
                    onClick={() => copyUrl(item.id, item.imageUrl)}
                    className={`flex-1 py-2 px-3 border rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      isCopied
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 active:scale-95'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                    <span>{isCopied ? t.copiedMsg : t.btnCopyLink}</span>
                  </button>
                  <button
                    id={`delete-asset-${item.id}`}
                    onClick={() => onDeleteScreenshot(item.id)}
                    className="p-2 border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/5 text-slate-500 hover:text-rose-400 rounded-xl transition-all active:scale-90"
                    title={t.btnDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty status mockup */}
        {screenshots.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">{t.noScreenshots}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No graphical screenshot assets saved in database. Take samples using Quick Capture or programmatic sandbox credentials.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Overlay Zoom Portal */}
      {activeImage && (
        <div 
          id="lightbox-container"
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
            <a
              href={activeImage.imageUrl}
              download={`zoom-${activeImage.id}.${activeImage.format}`}
              className="text-white hover:text-emerald-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-4 h-4" /> Save File
            </a>
            <button 
              id="close-lightbox"
              onClick={() => setActiveImage(null)}
              className="p-3 bg-slate-900 border border-slate-800 rounded-full text-white hover:text-emerald-400 pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-4xl max-h-[80vh] bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            {/* Header specs info */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="min-w-0">
                <span className="text-slate-500 block uppercase text-[10px]">image target url</span>
                <span className="text-slate-200 font-bold truncate block max-w-lg">{activeImage.url}</span>
              </div>
              <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 text-right">
                {activeImage.viewportWidth}x{activeImage.viewportHeight} ({activeImage.format.toUpperCase()})
              </span>
            </div>

            <div className="overflow-y-auto max-h-[64vh] p-4 bg-slate-950 lg:aspect-video flex items-start justify-center">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.url}
                className="w-full h-auto object-contain rounded-lg max-h-[60vh] object-top shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
