export interface CapturedScreenshot {
  id: string;
  url: string;
  viewportWidth: number;
  viewportHeight: number;
  format: 'png' | 'jpeg';
  fullPage: boolean;
  timestamp: string;
  imageUrl: string;
  status: 'completed' | 'failed' | 'processing';
  deviceName: string;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  status: 'active' | 'revoked';
  usageCount: number;
  usageLimit: number;
}

export interface ApiRequestLog {
  id: string;
  timestamp: string;
  apiKeyName: string;
  apiKeySnippet: string;
  url: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  ip: string;
}

export interface PricingPlan {
  id: 'free' | 'hobby' | 'scale';
  name: string;
  priceUSD: number;
  priceRUB: number;
  features: string[];
  screenshotLimit: number;
  apiAccess: boolean;
  supportLevel: string;
}
