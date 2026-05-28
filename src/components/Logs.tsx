import React from 'react';
import { 
  Clock, 
  Terminal, 
  AlertTriangle,
  Server,
  FileCode,
  ShieldCheck,
  Search,
  Download
} from 'lucide-react';
import { LanguageCode, translations } from '../utils/translations';
import { ApiRequestLog } from '../types';

interface LogsProps {
  logs: ApiRequestLog[];
  lang: LanguageCode;
}

export default function Logs({ logs, lang }: LogsProps) {
  const t = translations[lang];

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Method', 'API Key Name', 'API Key Snippet', 'URL', 'Response Time (ms)', 'StatusCode'];
    const rows = logs.map(log => [
      log.id,
      log.timestamp,
      log.method,
      log.apiKeyName,
      log.apiKeySnippet,
      log.url,
      log.responseTimeMs,
      log.statusCode
    ]);
    
    const csvRows = [
      headers,
      ...rows
    ].map(row => 
      row.map(val => {
        const stringVal = val === null || val === undefined ? '' : String(val);
        const escaped = stringVal.replace(/"/g, '""');
        if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"') || escaped.includes(';')) {
          return `"${escaped}"`;
        }
        return escaped;
      }).join(',')
    ).join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `screensnap_api_logs_${new Date().toISOString().substring(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="request-logs-panel-view" className="space-y-8 animate-fade-in font-sans">
      {/* Upper header summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
            {t.logsTitle} <span className="text-xs bg-[#27272a] text-zinc-400 border border-[#3f3f46] px-2.5 py-0.5 rounded-full font-mono font-normal">{logs.length} entries</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">{t.logsDesc}</p>
        </div>

        {logs.length > 0 && (
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/15 group shrink-0 active:scale-95"
          >
            <Download className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>{lang === 'ru' ? 'Экспорт истории в CSV' : 'Export history log (CSV)'}</span>
          </button>
        )}
      </div>

      {/* Logs Table frame */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 bg-[#09090b]/40 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider">Gateway log trace feed</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 bg-[#09090b] border border-[#27272a] px-2.5 py-1 rounded-[10px]">
            Live Stream Enabled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#09090b]/25 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                <th className="p-4 pl-6">{t.tableLogsTime}</th>
                <th className="p-4">Method</th>
                <th className="p-4">{t.tableLogsKeyName}</th>
                <th className="p-4">{t.tableLogsUrl}</th>
                <th className="p-4">{t.tableLogsLatency}</th>
                <th className="p-4 pr-6 text-right">{t.tableLogsStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/80 text-xs font-mono text-zinc-300">
              {logs.map((log) => {
                const isSuccess = log.statusCode >= 200 && log.statusCode < 300;
                const isUnauthorized = log.statusCode === 401 || log.statusCode === 403;
                
                return (
                  <tr key={log.id} className="hover:bg-[#09090b]/40 transition-colors">
                    {/* Timestamp log */}
                    <td className="p-4 pl-6 text-zinc-500 text-[11px]">
                      {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    
                    {/* HTTP Method */}
                    <td className="p-4">
                      <span className="bg-[#09090b] px-1.5 py-0.5 rounded text-[10px] border border-[#27272a]/80 text-zinc-400 font-bold uppercase">
                        {log.method}
                      </span>
                    </td>

                    {/* Authorized API Key snippet */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                        <div>
                          <p className="font-semibold text-zinc-200 font-sans">{log.apiKeyName}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{log.apiKeySnippet}</p>
                        </div>
                      </div>
                    </td>

                    {/* Destination URL */}
                    <td className="p-4 font-bold text-white max-w-xs truncate" title={log.url}>
                      {log.url}
                    </td>

                    {/* Latency */}
                    <td className="p-4 font-mono text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-650" />
                        <span>{log.responseTimeMs} ms</span>
                      </div>
                    </td>

                    {/* Response code */}
                    <td className="p-4 pr-6 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        isSuccess 
                          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                          : isUnauthorized
                            ? 'bg-amber-500/5 text-amber-400 border-amber-500/10'
                            : 'bg-rose-500/5 text-rose-400 border-rose-500/10'
                      }`}>
                        {log.statusCode} {isSuccess ? 'OK' : isUnauthorized ? 'AUTH_FAIL' : 'LIMIT_EXCEEDED'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-zinc-600">
                    <AlertTriangle className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                    <p className="font-sans text-xs">{t.emptyLogs}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
