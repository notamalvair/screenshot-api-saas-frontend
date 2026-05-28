import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Copy, 
  Eye, 
  Check, 
  Lock, 
  Play
} from 'lucide-react';
import { LanguageCode, translations } from '../utils/translations';
import { ApiKey, ApiRequestLog } from '../types';

interface PlaygroundProps {
  apiKeys: ApiKey[];
  onAddLog: (log: ApiRequestLog) => void;
  lang: LanguageCode;
}

export default function Playground({ apiKeys, onAddLog, lang }: PlaygroundProps) {
  const t = translations[lang];

  // Playground parameters
  const [targetUrl, setTargetUrl] = useState('https://github.com');
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(800);
  const [format, setFormat] = useState('png');
  const [fullPage, setFullPage] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState(apiKeys[0]?.id || 'no-key');
  const [language, setLanguage] = useState<'curl' | 'fetch' | 'axios' | 'python'>('curl');

  // Request/Response Simulation States
  const [isRunning, setIsRunning] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<string>('');
  const [responseBody, setResponseBody] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedKey = apiKeys.find(k => k.id === selectedKeyId);

  // Generate Snippets
  const getCodeSnippet = () => {
    const keyToken = selectedKey ? selectedKey.key : 'YOUR_API_KEY';
    const cleanUrl = targetUrl || 'https://google.com';

    switch (language) {
      case 'curl':
        return `curl -X POST "https://api.screensnap.io/v1/capture" \\
  -H "Authorization: Bearer ${keyToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "${cleanUrl}",
    "width": ${width},
    "height": ${height},
    "format": "${format}",
    "full_page": ${fullPage}
  }'`;
      case 'fetch':
        return `fetch('https://api.screensnap.io/v1/capture', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${keyToken}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: '${cleanUrl}',
    width: ${width},
    height: ${height},
    format: '${format}',
    full_page: ${fullPage}
  })
})
.then(res => res.json())
.then(data => console.log(data));`;
      case 'axios':
        return `const axios = require('axios');

axios.post('https://api.screensnap.io/v1/capture', {
  url: '${cleanUrl}',
  width: ${width},
  height: ${height},
  format: '${format}',
  full_page: ${fullPage}
}, {
  headers: {
    'Authorization': 'Bearer ${keyToken}'
  }
})
.then(response => {
  console.log(response.data);
});`;
      case 'python':
        return `import requests

url = "https://api.screensnap.io/v1/capture"
headers = {
    "Authorization": "Bearer ${keyToken}",
    "Content-Type": "application/json"
}
payload = {
    "url": "${cleanUrl}",
    "width": ${width},
    "height": ${height},
    "format": "${format}",
    "full_page": ${fullPage}
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const triggerSandboxRequest = () => {
    setIsRunning(true);
    setResponseStatus(null);
    setResponseBody('');
    setResponseHeaders('');

    // Simulate network delay
    setTimeout(() => {
      // 1. Authorization check
      if (!selectedKey || selectedKeyId === 'no-key') {
        const errStatusCode = 401;
        setResponseStatus(errStatusCode);
        setResponseHeaders(`HTTP/2 401 Unauthorized\nDate: ${new Date().toUTCString()}\nContent-Type: application/json\nServer: screensnap-gateway\nWWW-Authenticate: Bearer error="invalid_token"`);
        setResponseBody(JSON.stringify({
          success: false,
          error: {
            code: 'API_KEY_INVALID',
            message: 'The Authorization credentials provided are omitted or invalid. Generate an active API token in the dashboard settings.'
          }
        }, null, 2));

        onAddLog({
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          apiKeyName: 'Unauthorized Client',
          apiKeySnippet: 'ss_live_invalid',
          url: targetUrl || 'https://google.com',
          method: 'POST',
          statusCode: errStatusCode,
          responseTimeMs: 120,
          ip: '127.0.0.1'
        });
        setIsRunning(false);
        return;
      }

      // 2. Revoked Key check
      if (selectedKey.status === 'revoked') {
        const errStatusCode = 403;
        setResponseStatus(errStatusCode);
        setResponseHeaders(`HTTP/2 403 Forbidden\nDate: ${new Date().toUTCString()}\nContent-Type: application/json\nServer: screensnap-gateway`);
        setResponseBody(JSON.stringify({
          success: false,
          error: {
            code: 'API_KEY_REVOKED',
            message: 'The subscription API key specified has been explicitly revoked or suspended. Generate a new token.'
          }
        }, null, 2));

        onAddLog({
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          apiKeyName: selectedKey.name,
          apiKeySnippet: `${selectedKey.key.slice(0, 12)}...`,
          url: targetUrl || 'https://google.com',
          method: 'POST',
          statusCode: errStatusCode,
          responseTimeMs: 140,
          ip: '127.0.0.1'
        });
        setIsRunning(false);
        return;
      }

      // 3. Quota check
      if (selectedKey.usageCount >= selectedKey.usageLimit) {
        const errStatusCode = 429;
        setResponseStatus(errStatusCode);
        setResponseHeaders(`HTTP/2 429 Too Many Requests\nDate: ${new Date().toUTCString()}\nContent-Type: application/json\nServer: screensnap-gateway\nRetry-After: 3600`);
        setResponseBody(JSON.stringify({
          success: false,
          error: {
            code: 'QUOTA_EXCEEDED',
            message: 'Daily/monthly capture volume surpassed. Upgrade your subscription plan under the billing section to acquire larger limits.'
          }
        }, null, 2));

        onAddLog({
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          apiKeyName: selectedKey.name,
          apiKeySnippet: `${selectedKey.key.slice(0, 12)}...`,
          url: targetUrl || 'https://google.com',
          method: 'POST',
          statusCode: errStatusCode,
          responseTimeMs: 95,
          ip: '127.0.0.1'
        });
        setIsRunning(false);
        return;
      }

      // 4. Success Response
      const captureMs = 800 + Math.floor(Math.random() * 1200);
      const uuid = Math.floor(Math.random() * 1000000).toString(16);
      const outputImageUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&embed=screenshot.url&viewport.width=${width}&viewport.height=${height}&screenshot.type=${format}`;

      setResponseStatus(200);
      setResponseHeaders(`HTTP/2 200 OK\nDate: ${new Date().toUTCString()}\nContent-Type: application/json\nContent-Length: 462\nServer: screensnap-capture-edge\nx-rate-limit-remaining: ${selectedKey.usageLimit - selectedKey.usageCount - 1}\nx-response-time: ${captureMs}ms`);
      setResponseBody(JSON.stringify({
        success: true,
        data: {
          id: `sc_${uuid}`,
          url: targetUrl,
          screenshot_url: outputImageUrl,
          format: format,
          viewport: {
            width: width,
            height: height,
            full_page: fullPage
          },
          latency_ms: captureMs,
          timestamp: new Date().toISOString(),
          credits_remaining: selectedKey.usageLimit - selectedKey.usageCount - 1
        }
      }, null, 2));

      onAddLog({
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        apiKeyName: selectedKey.name,
        apiKeySnippet: `${selectedKey.key.slice(0, 12)}...`,
        url: targetUrl,
        method: 'POST',
        statusCode: 200,
        responseTimeMs: captureMs,
        ip: '127.0.0.1'
      });

      setIsRunning(false);
    }, 1500);
  };

  return (
    <div id="api-playground-panel-view" className="space-y-8 animate-fade-in">
      {/* Overview Head Info */}
      <div>
        <h2 className="text-2xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
          {t.playgroundTitle} <span className="text-xs font-mono font-normal bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2.5 py-0.5 rounded-full">v1 REST</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">{t.playgroundDesc}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side Parameters (Col Span 5) */}
        <div id="playground-parameters-form" className="xl:col-span-5 bg-[#18181b] border border-[#27272a] rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm border-b border-[#27272a] pb-3">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>{t.requestParams}</span>
          </div>

          {/* Authorization API Key selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-400" /> authorization / token
            </label>
            <select
              value={selectedKeyId}
              id="playground-apikey-selector"
              onChange={(e) => setSelectedKeyId(e.target.value)}
              className="w-full bg-[#09090b] text-zinc-300 border border-[#27272a] focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {apiKeys.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.key.slice(0, 12)}...) {k.status === 'revoked' ? '[REVOKED]' : ''}
                </option>
              ))}
              <option value="no-key">No Authorization Bearer [401 Emulation]</option>
            </select>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">payload: url</label>
            <input
              type="text"
              id="playground-url-field"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-[#09090b] text-white border border-[#27272a] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none"
            />
          </div>

          {/* Width / Height Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full bg-[#09090b] text-white border border-[#27272a] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-[#09090b] text-white border border-[#27272a] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Options Switches */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">format</span>
              <div className="flex gap-3">
                <label className="text-xs text-zinc-300 font-mono flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pg-format"
                    checked={format === 'png'}
                    onChange={() => setFormat('png')}
                    className="accent-indigo-500"
                  /> PNG
                </label>
                <label className="text-xs text-zinc-300 font-mono flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pg-format"
                    checked={format === 'jpeg'}
                    onChange={() => setFormat('jpeg')}
                    className="accent-indigo-500"
                  /> JPEG
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">full page</span>
              <label className="text-xs text-zinc-300 font-mono flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fullPage}
                  onChange={(e) => setFullPage(e.target.checked)}
                  className="accent-indigo-500 rounded border-[#27272a] h-4 w-4 bg-[#09090b]"
                /> True
              </label>
            </div>
          </div>

          {/* Execution triggers */}
          <button
            id="playground-run-request-btn"
            onClick={triggerSandboxRequest}
            disabled={isRunning}
            className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg duration-200 flex items-center justify-center gap-2 ${
              isRunning 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-600/15 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <Send className="w-3.5 h-3.5 animate-bounce text-white" />
                <span>{t.sendingRequest}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.btnSendRequest}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side Code Playground & Responses (Col Span 7) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Dynamic Code Driver selector block */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl overflow-hidden">
            {/* Tab Header bar */}
            <div className="bg-[#09090b] px-4 py-2 border-b border-[#27272a] flex items-center justify-between">
              <div className="flex gap-1.5 overflow-x-auto">
                {(['curl', 'fetch', 'axios', 'python'] as const).map((langId) => (
                  <button
                    key={langId}
                    id={`lang-driver-${langId}`}
                    onClick={() => setLanguage(langId)}
                    className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors ${
                      language === langId
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {langId === 'curl' ? 'cURL' : langId === 'fetch' ? 'Fetch (JS)' : langId === 'axios' ? 'Axios (Node)' : 'Python'}
                  </button>
                ))}
              </div>
              
              <button
                id="copy-snippet-btn"
                onClick={copyCode}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-[#18181b] border border-[#27272a]/80 px-2.5 py-1.5 rounded-lg transition-all font-mono"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? t.copiedMsg : 'Copy'}</span>
              </button>
            </div>

            {/* Structured Pre viewport */}
            <div className="p-4 bg-[#09090b]/60 overflow-x-auto max-h-56">
              <pre className="text-zinc-300 font-mono text-xs leading-relaxed select-all">
                <code>{getCodeSnippet()}</code>
              </pre>
            </div>
          </div>

          {/* Sandbox Response Console Viewer */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.responsePreview}</h3>
            
            <div className="space-y-4 font-mono text-xs">
              {/* HTTP STATUS STICKER */}
              <div className="flex items-center gap-3">
                <span className="text-slate-500">HTTP Status:</span>
                {responseStatus ? (
                  <span className={`px-2.5 py-1 rounded font-bold text-xs ${
                    responseStatus === 200 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {responseStatus} {responseStatus === 200 ? 'OK' : responseStatus === 401 ? 'Unauthorized' : responseStatus === 403 ? 'Forbidden' : 'Too Many Requests'}
                  </span>
                ) : (
                  <span className="text-zinc-400 bg-[#09090b] border border-[#27272a] px-3 py-1 rounded-[10px]">Idle (Awaiting Sandbox Execution)</span>
                )}
              </div>

              {/* HEADERS LOG */}
              {responseHeaders && (
                <div className="space-y-1">
                  <span className="text-zinc-500 uppercase text-[10px] tracking-wider block">{t.responseHeader}</span>
                  <pre className="w-full bg-[#09090b] p-3.5 border border-[#27272a]/80 rounded-xl text-[11px] text-zinc-300 leading-relaxed overflow-x-auto max-h-32 select-text whitespace-pre-wrap">
                    {responseHeaders}
                  </pre>
                </div>
              )}

              {/* JSON log */}
              {responseBody && (
                <div className="space-y-1 animate-fade-in">
                  <span className="text-zinc-550 uppercase text-[10px] tracking-wider block">{t.responseBody}</span>
                  <pre className="w-full bg-[#09090b] p-4 border border-[#27272a] rounded-xl text-[11px] text-indigo-400 leading-relaxed overflow-x-auto select-text whitespace-pre scrollbar-thin">
                    {responseBody}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
