/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import QuickCapture from './components/QuickCapture';
import ApiKeys from './components/ApiKeys';
import Playground from './components/Playground';
import Gallery from './components/Gallery';
import Logs from './components/Logs';
import Billing from './components/Billing';
import LandingPage from './components/LandingPage';

import { CapturedScreenshot, ApiKey, ApiRequestLog } from './types';
import { 
  getScreenshots, 
  saveScreenshots, 
  getApiKeys, 
  saveApiKeys, 
  getRequestLogs, 
  saveRequestLogs, 
  getCurrentPlan, 
  saveCurrentPlan,
  generateRandomApiKey,
  getLanguageToggle,
  saveLanguageToggle
} from './utils/store';
import { LanguageCode, translations } from './utils/translations';

export default function App() {
  // Navigation & Authentication
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<LanguageCode>('ru'); // Default to Russian to cater to the user's language preference
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Central Application State
  const [screenshots, setScreenshots] = useState<CapturedScreenshot[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [logs, setLogs] = useState<ApiRequestLog[]>([]);
  const [currentPlan, setCurrentPlanState] = useState<string>('hobby');

  // Load state on mount
  useEffect(() => {
    setScreenshots(getScreenshots());
    setApiKeys(getApiKeys());
    setLogs(getRequestLogs());
    setCurrentPlanState(getCurrentPlan());
    setLang(getLanguageToggle());

    // Load authenticated user profile if logged in
    const storedUser = localStorage.getItem('saas_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Could not load user from localStorage:', e);
      }
    }
  }, []);

  // Update language state
  const handleSetLang = (l: LanguageCode) => {
    setLang(l);
    saveLanguageToggle(l);
  };

  // Auth Operations
  const handleRegister = (name: string, email: string) => {
    const newUserObj = { name, email };
    setUser(newUserObj);
    localStorage.setItem('saas_user', JSON.stringify(newUserObj));
    // Reset back to main tab on login
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('saas_user');
  };

  // State Updates & Storage Synchronization
  const handleAddScreenshot = (newSc: CapturedScreenshot) => {
    const updated = [newSc, ...screenshots];
    setScreenshots(updated);
    saveScreenshots(updated);
  };

  const handleDeleteScreenshot = (id: string) => {
    const updated = screenshots.filter(s => s.id !== id);
    setScreenshots(updated);
    saveScreenshots(updated);
  };

  const handleCreateApiKey = (name: string) => {
    const newKey: ApiKey = {
      id: 'key_' + Date.now(),
      key: generateRandomApiKey(),
      name: name,
      createdAt: new Date().toISOString(),
      status: 'active',
      usageCount: 0,
      usageLimit: currentPlan === 'free' ? 100 : currentPlan === 'hobby' ? 5000 : 50000
    };
    const updated = [newKey, ...apiKeys];
    setApiKeys(updated);
    saveApiKeys(updated);
  };

  const handleRevokeApiKey = (id: string) => {
    const updated = apiKeys.map(k => {
      if (k.id === id) {
        return { ...k, status: 'revoked' as const };
      }
      return k;
    });
    setApiKeys(updated);
    saveApiKeys(updated);
  };

  const handleAddLog = (newLog: ApiRequestLog) => {
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    saveRequestLogs(updatedLogs);

    // If request was successful (200), increment usage of that specific key!
    if (newLog.statusCode === 200) {
      const updatedKeys = apiKeys.map(k => {
        // Use a simple starts-with match to map anonymous logs back to their keys
        if (newLog.apiKeySnippet.startsWith(k.key.slice(0, 8))) {
          return { ...k, usageCount: k.usageCount + 1 };
        }
        return k;
      });
      setApiKeys(updatedKeys);
      saveApiKeys(updatedKeys);
    }
  };

  const handleChangePlan = (planId: string) => {
    setCurrentPlanState(planId);
    saveCurrentPlan(planId);

    // Adjust quotas dynamically on active keys when plan is updated!
    const updatedKeys = apiKeys.map(k => ({
      ...k,
      usageLimit: planId === 'free' ? 100 : planId === 'hobby' ? 5000 : 50000
    }));
    setApiKeys(updatedKeys);
    saveApiKeys(updatedKeys);
  };

  // If there is no user logged in, intercept with the beautiful landing & auth experience first!
  if (!user) {
    return (
      <LandingPage 
        lang={lang} 
        setLang={handleSetLang} 
        onRegister={handleRegister} 
      />
    );
  }

  return (
    <div id="saas-app-canvas" className="min-h-screen bg-[#09090b] flex text-[#fafafa] selection:bg-indigo-500/30 selection:text-indigo-300">
      {/* 2-Column Responsive Layout */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        lang={lang} 
        setLang={handleSetLang} 
        currentPlan={currentPlan}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <main id="app-main-view" className="flex-1 min-w-0 h-screen overflow-y-auto px-8 py-8 relative">
        {currentTab === 'dashboard' && (
          <Overview 
            screenshots={screenshots} 
            apiKeys={apiKeys} 
            logs={logs} 
            lang={lang} 
            onNavigate={setCurrentTab}
          />
        )}
        {currentTab === 'capture' && (
          <QuickCapture 
            onAddScreenshot={handleAddScreenshot} 
            lang={lang}
          />
        )}
        {currentTab === 'apikeys' && (
          <ApiKeys 
            apiKeys={apiKeys} 
            onCreateKey={handleCreateApiKey} 
            onRevokeKey={handleRevokeApiKey} 
            lang={lang}
          />
        )}
        {currentTab === 'playground' && (
          <Playground 
            apiKeys={apiKeys} 
            onAddLog={handleAddLog} 
            lang={lang}
          />
        )}
        {currentTab === 'gallery' && (
          <Gallery 
            screenshots={screenshots} 
            onDeleteScreenshot={handleDeleteScreenshot} 
            lang={lang}
          />
        )}
        {currentTab === 'logs' && (
          <Logs 
            logs={logs} 
            lang={lang}
          />
        )}
        {currentTab === 'billing' && (
          <Billing 
            currentPlan={currentPlan} 
            onChangePlan={handleChangePlan} 
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}
