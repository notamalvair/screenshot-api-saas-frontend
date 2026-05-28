import React from 'react';
import { 
  BarChart, 
  CheckCircle, 
  Clock, 
  Key, 
  ArrowUpRight,
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Play
} from 'lucide-react';
import { LanguageCode, translations } from '../utils/translations';
import { CapturedScreenshot, ApiKey, ApiRequestLog } from '../types';

interface OverviewProps {
  screenshots: CapturedScreenshot[];
  apiKeys: ApiKey[];
  logs: ApiRequestLog[];
  lang: LanguageCode;
  onNavigate: (tab: string) => void;
}

export default function Overview({ screenshots, apiKeys, logs, lang, onNavigate }: OverviewProps) {
  const t = translations[lang];

  // Derive core stats dynamically
  const activeKeys = apiKeys.filter(k => k.status === 'active').length;
  
  // Custom formula based on base data + dynamic state screenshots
  const totalScreenshots = 1420 + 85 + screenshots.length; 
  
  const successRate = logs.length > 0
    ? ((logs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length / logs.length) * 100).toFixed(1)
    : '98.5';

  const avgResponseTime = logs.length > 0
    ? Math.round(logs.reduce((acc, curr) => acc + curr.responseTimeMs, 0) / logs.length)
    : 1650;

  // Let's draw a nice interactive SVG chart representing load
  // Day array for the chart (last 7 days)
  const chartData = [
    { day: lang === 'ru' ? 'Пн' : 'Mon', requests: 450, latency: 1420 },
    { day: lang === 'ru' ? 'Вт' : 'Tue', requests: 580, latency: 1530 },
    { day: lang === 'ru' ? 'Ср' : 'Wed', requests: 720, latency: 1390 },
    { day: lang === 'ru' ? 'Чт' : 'Thu', requests: 610, latency: 1650 },
    { day: lang === 'ru' ? 'Пт' : 'Fri', requests: 890, latency: 1810 },
    { day: lang === 'ru' ? 'Сб' : 'Sat', requests: 310, latency: 1450 },
    { day: lang === 'ru' ? 'Вс' : 'Sun', requests: 280, latency: 1200 },
  ];

  // Find max values to scale the SVG charts neatly
  const maxRequests = Math.max(...chartData.map(d => d.requests));
  const maxLatency = Math.max(...chartData.map(d => d.latency));

  return (
    <div id="overview-dashboard-view" className="space-y-8 animate-fade-in">
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
            {t.overviewTitle} <span className="text-xs bg-[#27272a] text-zinc-400 border border-[#3f3f46] px-2.5 py-0.5 rounded-full font-mono font-normal">UTC 2026</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">{t.subtitle}</p>
        </div>
        <span className="text-xs text-zinc-400 bg-[#18181b] border border-[#27272a] px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" /> {t.overviewPeriod}
        </span>
      </div>

      {/* Grid of Key Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Captured */}
        <div id="stat-card-total" className="bg-[#18181b] border border-[#27272a] p-5 rounded-3xl flex items-center gap-4 hover:border-[#3f3f46] transition-all shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <BarChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{t.statTotalCaptured}</p>
            <p className="text-2xl font-bold text-white mt-0.5 font-mono">{totalScreenshots.toLocaleString('en-US')}</p>
          </div>
        </div>

        {/* Stat 2: Success Rate */}
        <div id="stat-card-success" className="bg-[#18181b] border border-[#27272a] p-5 rounded-3xl flex items-center gap-4 hover:border-[#3f3f46] transition-all shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{t.statSuccessRate}</p>
            <p className="text-2xl font-bold text-white mt-0.5 font-mono">{successRate}%</p>
          </div>
        </div>

        {/* Stat 3: Avg Response Latency */}
        <div id="stat-card-latency" className="bg-[#18181b] border border-[#27272a] p-5 rounded-3xl flex items-center gap-4 hover:border-[#3f3f46] transition-all shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{t.statAvgTime}</p>
            <p className="text-2xl font-bold text-white mt-0.5 font-mono">{avgResponseTime} <span className="text-xs font-sans text-zinc-500">ms</span></p>
          </div>
        </div>

        {/* Stat 4: Active API Keys */}
        <div id="stat-card-keys" className="bg-[#18181b] border border-[#27272a] p-5 rounded-3xl flex items-center gap-4 hover:border-[#3f3f46] transition-all shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{t.statActiveKeys}</p>
            <p className="text-2xl font-bold text-white mt-0.5 font-mono">{activeKeys} <span className="text-xs font-sans text-zinc-500">/{apiKeys.length}</span></p>
          </div>
        </div>
      </div>

      {/* Analytics Visualizers (Pure SVG custom-rendered grids) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Load Chart (Bar SVG) */}
        <div id="traffic-chart-panel" className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 tracking-tight">{t.chartUsageTitle}</h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">API requests/day</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="h-44 w-full flex items-end justify-between px-2 pt-4 relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-0 border-t border-[#27272a]/60 h-0 w-full" />
            <div className="absolute inset-x-0 top-1/4 border-t border-[#27272a]/60 h-0 w-full" />
            <div className="absolute inset-x-0 top-2/4 border-t border-[#27272a]/30 h-0 w-full" />
            <div className="absolute inset-x-0 top-3/4 border-t border-[#27272a]/30 h-0 w-full" />
            <div className="absolute inset-x-0 bottom-0 border-b border-[#27272a] h-0 w-full" />

            {chartData.map((data, i) => {
              const heightPercent = `${(data.requests / maxRequests) * 85}%`;
              return (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group z-10">
                  <div className="relative w-8 bg-[#27272a] hover:bg-indigo-500 rounded-t-md transition-all duration-300 flex items-end justify-center" style={{ height: heightPercent }}>
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-155 bg-[#09090b] border border-[#3f3f46] text-white rounded-lg px-2.5 py-1 text-[10px] uppercase font-mono shadow-md whitespace-nowrap z-50">
                      {data.requests} reqs
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 mt-2">{data.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latency Plot (Smooth Curve Line SVG) */}
        <div id="latency-chart-panel" className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 tracking-tight">{t.chartResponseTitle}</h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">Response lag in ms</p>
            </div>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="h-44 w-full relative pt-4 pb-6 px-1">
            {/* Custom SVG line plot */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="indigo-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="100" y2="20" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2" />
              {/* Gradient fill */}
              <path
                d="M 5,68 C 20,53 20,40 35,55 C 50,65 50,32.5 65,15 C 80,38 80,48 95,70 L 95,100 L 5,100 Z"
                fill="url(#indigo-gradient)"
              />
              {/* Curve line */}
              <path
                d="M 5,68 C 20,53 20,40 35,55 C 50,65 50,32.5 65,15 C 80,38 80,48 95,70"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Absolute positioning of dots on top of the SVG so they never stretch into ellipses */}
            <div className="absolute inset-0 pt-4 pb-6 px-1 pointer-events-none">
              {/* Mon */}
              <div className="absolute w-2 h-2 bg-indigo-500 rounded-full border border-white" style={{ left: '5%', top: '68%', transform: 'translate(-50%, -50%)' }} />
              {/* Tue */}
              <div className="absolute w-2 h-2 bg-indigo-500 rounded-full border border-white" style={{ left: '20%', top: '53%', transform: 'translate(-50%, -50%)' }} />
              {/* Wed */}
              <div className="absolute w-2 h-2 bg-indigo-500 rounded-full border border-white" style={{ left: '35%', top: '40%', transform: 'translate(-50%, -50%)' }} />
              {/* Thu */}
              <div className="absolute w-2 h-2 bg-indigo-500 rounded-full border border-white" style={{ left: '50%', top: '55%', transform: 'translate(-50%, -50%)' }} />
              
              {/* Fri (Peak highlight - beautiful neon effect!) */}
              <div className="absolute" style={{ left: '65%', top: '15%', transform: 'translate(-50%, -50%)' }}>
                <div className="absolute w-6 h-6 bg-indigo-500/25 border border-indigo-400/40 rounded-full animate-ping" style={{ transform: 'translate(-50%, -50%)' }} />
                <div className="w-3.5 h-3.5 bg-white border-2 border-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
              </div>

              {/* Sat */}
              <div className="absolute w-2 h-2 bg-indigo-500 rounded-full border border-white" style={{ left: '80%', top: '48%', transform: 'translate(-50%, -50%)' }} />
              {/* Sun */}
              <div className="absolute w-2 h-2 bg-indigo-500 rounded-full border border-white" style={{ left: '95%', top: '70%', transform: 'translate(-50%, -50%)' }} />
            </div>

            <div className="absolute inset-x-0 bottom-1 flex justify-between px-2 text-[10px] font-mono text-zinc-500 z-10">
              {chartData.map((d, idx) => (
                <span key={idx}>{d.day}</span>
              ))}
            </div>
            <span className="absolute right-4 top-2 bg-[#09090b]/80 text-indigo-400 font-mono text-[10px] px-2 py-0.5 rounded-lg border border-indigo-500/20 backdrop-blur-sm shadow-md">
              Peak: 1,810 ms
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Captures Gallery & Latest Incoming Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Captures List - Left (Span 7) */}
        <div id="recent-captures-panel" className="lg:col-span-7 bg-[#18181b] border border-[#27272a] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">{t.recentCaptures}</h3>
            <button
              onClick={() => onNavigate('gallery')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 group transition-colors"
            >
              {t.viewAll} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {screenshots.slice(0, 2).map((item) => (
              <div key={item.id} className="group bg-[#09090b] border border-[#27272a] rounded-2xl overflow-hidden shadow transitions duration-250 hover:border-[#3f3f46]">
                <div className="relative aspect-video bg-[#18181b] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.url}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-white flex items-center gap-1 font-mono uppercase bg-indigo-600 px-2.5 py-1 rounded-lg backdrop-blur-sm"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-zinc-300 truncate font-mono">{item.url}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-2 font-mono">
                    <span>{item.deviceName}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </p>
                </div>
              </div>
            ))}
            {screenshots.length === 0 && (
              <div className="col-span-2 text-center py-8 text-zinc-500 text-xs flex flex-col items-center justify-center gap-2 bg-[#09090b] border border-[#27272a] rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-zinc-650" />
                <p>{t.noScreenshots}</p>
                <button
                  onClick={() => onNavigate('capture')}
                  className="mt-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl hover:bg-indigo-500/20"
                >
                  {t.captureButton}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Server Logs Trace - Right (Span 5) */}
        <div id="recent-logs-panel" className="lg:col-span-5 bg-[#18181b] border border-[#27272a] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">{t.recentLogs}</h3>
            <button
              onClick={() => onNavigate('logs')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 group transition-colors"
            >
              {t.viewAll} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {logs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#09090b] border border-[#27272a]/55 hover:border-[#3f3f46] transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
                      {log.method}
                    </span>
                    <p className="text-xs text-zinc-300 truncate font-mono">{log.url}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 font-mono">
                    <span className="truncate max-w-[80px]">{log.apiKeyName}</span>
                    <span>•</span>
                    <span>{log.responseTimeMs}ms</span>
                  </div>
                </div>
                <div className="pl-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                    log.statusCode >= 200 && log.statusCode < 300 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {log.statusCode}
                  </span>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-8 text-zinc-600 text-xs">
                {t.emptyLogs}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
