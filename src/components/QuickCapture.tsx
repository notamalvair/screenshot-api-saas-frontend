import React, { useState } from 'react';
import { 
  Camera, 
  Smartphone, 
  Tablet as TabletIcon, 
  Monitor, 
  Cpu, 
  Layers, 
  Download, 
  CheckCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { LanguageCode, translations } from '../utils/translations';
import { CapturedScreenshot } from '../types';

interface QuickCaptureProps {
  onAddScreenshot: (s: CapturedScreenshot) => void;
  lang: LanguageCode;
}

export default function QuickCapture({ onAddScreenshot, lang }: QuickCaptureProps) {
  const t = translations[lang];

  // Forms states
  const [url, setUrl] = useState('https://github.com');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(800);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [fullPage, setFullPage] = useState(false);
  const [delay, setDelay] = useState(1); // wait delay in seconds
  
  // Applet UI States
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturePhase, setCapturePhase] = useState('');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [apiError, setApiError] = useState(false);
  const [successNotif, setSuccessNotif] = useState(false);

  // Quick preset handling
  const applyPreset = (type: 'desktop' | 'tablet' | 'mobile') => {
    setDevice(type);
    if (type === 'desktop') {
      setWidth(1280);
      setHeight(800);
    } else if (type === 'tablet') {
      setWidth(768);
      setHeight(1024);
    } else {
      setWidth(375);
      setHeight(812);
    }
  };

  // Perform Live Capture
  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Normalize URL
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    setIsCapturing(true);
    setApiError(false);
    setSuccessNotif(false);

    // Progress stage simulation
    const phases = [
      lang === 'ru' ? 'Инициализация мотора Chromium...' : 'Initializing headless chromium node...',
      lang === 'ru' ? 'Разрешение DNS и подключение по SSL...' : 'Resolving target DNS & handshaking SSL...',
      lang === 'ru' ? 'Загрузка стилей и скриптов (DOM)...' : 'Loading external stylesheets & assets (DOM)...',
      lang === 'ru' ? 'Ожидание стабилизации лейаута...' : 'Waiting for viewport stabilization...',
      lang === 'ru' ? 'Снимок экрана и сжатие буфера...' : 'Capturing pixels & compressing buffer...'
    ];

    let pIdx = 0;
    setCapturePhase(phases[0]);
    const interval = setInterval(() => {
      pIdx++;
      if (pIdx < phases.length) {
        setCapturePhase(phases[pIdx]);
      }
    }, 900);

    try {
      // Form Microlink API URL
      const mUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&embed=screenshot.url&viewport.width=${width}&viewport.height=${height}&viewport.isMobile=${device === 'mobile'}&screenshot.type=${format}`;
      
      const response = await fetch(mUrl);
      if (!response.ok) throw new Error('API capture failed');
      
      const blob = await response.blob();
      // Ensure we received an image
      if (!blob.type.startsWith('image/')) {
        throw new Error('Response is not an image');
      }

      const localImgUrl = URL.createObjectURL(blob);
      setCapturedImage(localImgUrl);

      // Successfully captured! Call callback to append to lists
      const deviceNames = {
        desktop: 'Macbook Pro 13"',
        tablet: 'iPad Slate',
        mobile: 'iPhone 14 Pro'
      };

      const newScreenshot: CapturedScreenshot = {
        id: 'sc_' + Date.now(),
        url: targetUrl,
        viewportWidth: width,
        viewportHeight: height,
        format: format,
        fullPage: fullPage,
        timestamp: new Date().toISOString(),
        imageUrl: mUrl, // store micorlink API trigger url so it resolves reliably on reload
        status: 'completed',
        deviceName: deviceNames[device],
      };

      onAddScreenshot(newScreenshot);
      setSuccessNotif(true);
    } catch (err) {
      console.error(err);
      setApiError(true);
    } finally {
      clearInterval(interval);
      setIsCapturing(false);
      setCapturePhase('');
    }
  };

  return (
    <div id="quick-capture-panel-view" className="space-y-8 animate-fade-in">
      {/* Tab Header Description */}
      <div>
        <h2 className="text-2xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
          {t.captureTitle} <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
        </h2>
        <p className="text-sm text-zinc-400 mt-1">{t.captureDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Controls Panel (Col Span 5) */}
        <form id="capture-settings-form" onSubmit={handleCapture} className="lg:col-span-5 bg-[#18181b] border border-[#27272a] rounded-3xl p-6 space-y-6">
          {/* Target URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.inputUrlLabel}</label>
            <div className="relative">
              <input
                id="capture-url-input"
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.inputUrlPlaceholder}
                className="w-full bg-[#09090b] text-white placeholder-zinc-650 border border-[#27272a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Device Preset Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Device Preset</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="preset-desktop-btn"
                onClick={() => applyPreset('desktop')}
                className={`py-2 px-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                  device === 'desktop'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    : 'bg-[#09090b] border-[#27272a]/80 text-zinc-400 hover:border-[#3f3f46] hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono">{t.deviceDesktop}</span>
              </button>
              <button
                type="button"
                id="preset-tablet-btn"
                onClick={() => applyPreset('tablet')}
                className={`py-2 px-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                  device === 'tablet'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    : 'bg-[#09090b] border-[#27272a]/80 text-zinc-400 hover:border-[#3f3f46] hover:text-white'
                }`}
              >
                <TabletIcon className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono">{t.deviceTablet}</span>
              </button>
              <button
                type="button"
                id="preset-mobile-btn"
                onClick={() => applyPreset('mobile')}
                className={`py-2 px-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                  device === 'mobile'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    : 'bg-[#09090b] border-[#27272a]/80 text-zinc-400 hover:border-[#3f3f46] hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono">{t.deviceMobile}</span>
              </button>
            </div>
          </div>

          {/* Direct Width/Height Specifications */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.viewportWidth}</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full bg-[#09090b] text-white border border-[#27272a] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.viewportHeight}</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-[#09090b] text-white border border-[#27272a] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* File Format Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.imageFormat}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-zinc-300 font-mono cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  checked={format === 'png'}
                  onChange={() => setFormat('png')}
                  className="accent-indigo-500 animate-scale-up"
                />
                PNG
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-300 font-mono cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  checked={format === 'jpeg'}
                  onChange={() => setFormat('jpeg')}
                  className="accent-indigo-500 animate-scale-up"
                />
                JPEG / JPG
              </label>
            </div>
          </div>

          {/* Delay parameter slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-zinc-400 uppercase tracking-wider">Delay execution</span>
              <span className="text-indigo-400 font-mono">{delay} sec</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-[#09090b] rounded-lg cursor-pointer appearance-none"
            />
          </div>

          {/* Action Trigger Button */}
          <button
            id="trigger-capture-submit"
            type="submit"
            disabled={isCapturing}
            className={`w-full py-4 px-4 rounded-xl font-sans font-bold text-sm tracking-wide transition-all uppercase flex items-center justify-center gap-2 ${
              isCapturing
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-lg shadow-indigo-600/10 transform hover:-translate-y-0.5'
            }`}
          >
            {isCapturing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{t.capturing}</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 text-white" />
                <span>{t.captureButton}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Hand: Device Showcase Panel (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.previewDevice}</h3>
            {capturedImage && (
              <a
                href={capturedImage}
                download={`screenshot-${Date.now()}.${format}`}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] px-3.5 py-1.5 rounded-xl active:scale-95 transition-all font-sans font-medium"
              >
                <Download className="w-3.5 h-3.5" /> {t.btnDownload}
              </a>
            )}
          </div>

          {/* Beautiful device wrappers */}
          <div id="device-wrapper-container" className="bg-[#09090b] border border-[#27272a] rounded-3xl p-6 min-h-[420px] flex items-center justify-center relative overflow-hidden">
            {/* Active loading state */}
            {isCapturing && (
              <div className="absolute inset-0 bg-[#09090b]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-50">
                <div className="relative mb-6">
                  {/* Glowing rings */}
                  <div className="w-16 h-16 rounded-full border-t border-r border-indigo-500/40 animate-spin absolute inset-0 scale-125" />
                  <div className="w-16 h-16 rounded-full border-b border-l border-indigo-500/40 animate-spin absolute inset-0" />
                  <div className="w-16 h-16 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center">
                    <Camera className="w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  {t.capturing}
                </h4>
                <p className="text-xs text-zinc-450 font-mono mt-3 max-w-sm border-t border-[#27272a] pt-3">
                  {capturePhase}
                </p>
              </div>
            )}

            {/* If has Captured Image, show the device frame mock */}
            {capturedImage ? (
              <div className="w-full flex justify-center animate-fade-in">
                {/* 1. Desktop Browser Frame */}
                {device === 'desktop' && (
                  <div className="w-full max-w-xl bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-2xl">
                    {/* Browser Head Bar */}
                    <div className="bg-[#09090b] px-4 py-3 border-b border-[#27272a] flex items-center gap-3">
                      <div className="flex gap-1.5 shrink-0">
                        <div className="w-3 h-3 rounded-full bg-rose-500/85" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/85" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/85" />
                      </div>
                      <div className="flex-1 bg-[#18181b] border border-[#27272a] px-3 py-1 rounded-lg text-[11px] font-mono text-zinc-400 truncate flex items-center justify-between">
                        <span className="truncate">{url}</span>
                        <Eye className="w-3 h-3 text-zinc-500" />
                      </div>
                    </div>
                    {/* Screenshot frame */}
                    <div className="aspect-[16/10] bg-[#09090b] overflow-y-auto">
                      <img
                        src={capturedImage}
                        alt="Captured Output"
                        className="w-full h-auto object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Tablet Device Frame */}
                {device === 'tablet' && (
                  <div className="w-[320px] bg-[#18181b] border-8 border-[#09090b] rounded-[32px] overflow-hidden shadow-2xl relative">
                    {/* Tablet Top Camera Speaker */}
                    <div className="absolute top-1 inset-x-0 mx-auto w-12 h-1.5 bg-zinc-800 rounded" />
                    <div className="aspect-[3/4] bg-[#09090b] overflow-hidden">
                      <img
                        src={capturedImage}
                        alt="Captured Output"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Mobile Device Frame */}
                {device === 'mobile' && (
                  <div className="w-[200px] bg-[#18181b] border-8 border-[#09090b] rounded-[36px] overflow-hidden shadow-2xl relative">
                    {/* Phone Notch */}
                    <div className="absolute top-0 inset-x-0 mx-auto w-20 h-4 bg-[#09090b] rounded-b-xl z-20 flex items-center justify-center">
                      <p className="text-[6px] text-zinc-650 font-mono tracking-widest pl-1">○○</p>
                    </div>
                    <div className="aspect-[9/19] bg-[#09090b] overflow-hidden relative">
                      <img
                        src={capturedImage}
                        alt="Captured Output"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Inside blank state */
              <div className="text-center p-6 text-zinc-500 space-y-3">
                <Cpu className="w-10 h-10 text-zinc-700 mx-auto animate-pulse" />
                <p className="text-xs uppercase font-semibold font-mono tracking-wider text-zinc-400">
                  Ready to capture
                </p>
                <p className="text-[11px] text-zinc-500 max-w-xs font-sans">
                  The generated capture output mockups will instantly populate in this frame.
                </p>
              </div>
            )}
          </div>

          {/* Feedback messages */}
          {successNotif && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 animate-slide-in">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-emerald-400">{t.captureSuccess}</p>
                <p className="text-[11px] opacity-80 mt-0.5">Media asset catalogued in server storage.</p>
              </div>
            </div>
          )}

          {apiError && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center gap-3 animate-slide-in">
              <CheckCircle className="w-5 h-5 shrink-0 rotate-45 text-amber-500" />
              <div className="text-xs">
                <p className="font-bold text-amber-400">{t.captureFailed}</p>
                <p className="text-[11px] opacity-80 mt-0.5">Please check URL connectivity & server availability constraints.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
