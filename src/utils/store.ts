import { CapturedScreenshot, ApiKey, ApiRequestLog } from '../types';

// Pre-populate some aesthetic initial data if nothing exists in localStorage
const INITIAL_SCREENSHOTS: CapturedScreenshot[] = [
  {
    id: 'sc-1',
    url: 'https://github.com',
    viewportWidth: 1280,
    viewportHeight: 800,
    format: 'png',
    fullPage: false,
    timestamp: '2026-05-28T10:15:30Z',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
    status: 'completed',
    deviceName: 'Macbook Pro 13"',
  },
  {
    id: 'sc-2',
    url: 'https://apple.com',
    viewportWidth: 390,
    viewportHeight: 844,
    format: 'png',
    fullPage: false,
    timestamp: '2026-05-28T09:42:15Z',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    status: 'completed',
    deviceName: 'iPhone 14 Pro',
  },
  {
    id: 'sc-3',
    url: 'https://google.com',
    viewportWidth: 1024,
    viewportHeight: 768,
    format: 'png',
    fullPage: false,
    timestamp: '2026-05-27T16:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    status: 'completed',
    deviceName: 'iPad Air',
  }
];

const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    key: 'ss_live_a1f9c3e80b2d4f5e6a7d8c9b0e1f2a3b',
    name: 'Production Server',
    createdAt: '2026-05-20T08:00:00Z',
    status: 'active',
    usageCount: 1420,
    usageLimit: 5000,
  },
  {
    id: 'key-2',
    key: 'ss_live_6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    name: 'Staging Environment',
    createdAt: '2026-05-24T14:30:00Z',
    status: 'active',
    usageCount: 85,
    usageLimit: 1000,
  }
];

const INITIAL_LOGS: ApiRequestLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-05-28T12:15:00Z',
    apiKeyName: 'Production Server',
    apiKeySnippet: 'ss_live_a1f9...2a3b',
    url: 'https://github.com',
    method: 'POST',
    statusCode: 200,
    responseTimeMs: 1420,
    ip: '192.168.1.1',
  },
  {
    id: 'log-2',
    timestamp: '2026-05-28T11:58:34Z',
    apiKeyName: 'Production Server',
    apiKeySnippet: 'ss_live_a1f9...2a3b',
    url: 'https://vercel.com',
    method: 'POST',
    statusCode: 200,
    responseTimeMs: 2150,
    ip: '192.168.1.1',
  },
  {
    id: 'log-3',
    timestamp: '2026-05-28T11:32:10Z',
    apiKeyName: 'Staging Environment',
    apiKeySnippet: 'ss_live_6c7d...0e1f',
    url: 'https://news.ycombinator.com',
    method: 'POST',
    statusCode: 200,
    responseTimeMs: 820,
    ip: '185.45.192.8',
  },
  {
    id: 'log-4',
    timestamp: '2026-05-28T11:15:22Z',
    apiKeyName: 'Production Server',
    apiKeySnippet: 'ss_live_a1f9...2a3b',
    url: 'https://not-exists-url-12345.xyz',
    method: 'POST',
    statusCode: 422,
    responseTimeMs: 3100,
    ip: '192.168.1.1',
  }
];

export function getScreenshots(): CapturedScreenshot[] {
  const data = localStorage.getItem('saas_screenshots');
  if (!data) {
    localStorage.setItem('saas_screenshots', JSON.stringify(INITIAL_SCREENSHOTS));
    return INITIAL_SCREENSHOTS;
  }
  return JSON.parse(data);
}

export function saveScreenshots(screenshots: CapturedScreenshot[]) {
  localStorage.setItem('saas_screenshots', JSON.stringify(screenshots));
}

export function getApiKeys(): ApiKey[] {
  const data = localStorage.getItem('saas_api_keys');
  if (!data) {
    localStorage.setItem('saas_api_keys', JSON.stringify(INITIAL_API_KEYS));
    return INITIAL_API_KEYS;
  }
  return JSON.parse(data);
}

export function saveApiKeys(keys: ApiKey[]) {
  localStorage.setItem('saas_api_keys', JSON.stringify(keys));
}

export function getRequestLogs(): ApiRequestLog[] {
  const data = localStorage.getItem('saas_request_logs');
  if (!data) {
    localStorage.setItem('saas_request_logs', JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  }
  return JSON.parse(data);
}

export function saveRequestLogs(logs: ApiRequestLog[]) {
  localStorage.setItem('saas_request_logs', JSON.stringify(logs));
}

export function getCurrentPlan(): string {
  const plan = localStorage.getItem('saas_current_plan');
  return plan || 'hobby';
}

export function saveCurrentPlan(plan: string) {
  localStorage.setItem('saas_current_plan', plan);
}

export function generateRandomApiKey(): string {
  const chars = '0123456789abcdef';
  let key = 'ss_live_';
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * 16)];
  }
  return key;
}

export function getLanguageToggle(): 'en' | 'ru' {
  const lang = localStorage.getItem('saas_lang');
  return (lang as 'en' | 'ru') || 'ru'; // Default to Russian to cater directly to user's query language, but let them toggle!
}

export function saveLanguageToggle(lang: 'en' | 'ru') {
  localStorage.setItem('saas_lang', lang);
}
