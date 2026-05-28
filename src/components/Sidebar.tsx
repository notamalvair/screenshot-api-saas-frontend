import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  Key, 
  Terminal, 
  Image as ImageIcon, 
  History, 
  CreditCard, 
  Globe,
  Monitor,
  LogOut
} from 'lucide-react';
import { LanguageCode, translations } from '../utils/translations';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  currentPlan: string;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  lang, 
  setLang, 
  currentPlan, 
  user, 
  onLogout 
}: SidebarProps) {
  const t = translations[lang];

  const menuItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'capture', label: t.navCapture, icon: Camera },
    { id: 'apikeys', label: t.navApiKeys, icon: Key },
    { id: 'playground', label: t.navPlayground, icon: Terminal },
    { id: 'gallery', label: t.navGallery, icon: ImageIcon },
    { id: 'logs', label: t.navLogs, icon: History },
    { id: 'billing', label: t.navBilling, icon: CreditCard },
  ];

  const getUserInitials = () => {
    if (!user || !user.name) return 'US';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <aside id="app-sidebar" className="w-64 bg-[#18181b] border-r border-[#27272a] flex flex-col justify-between h-screen sticky top-0 shrink-0 text-zinc-300 font-sans">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 animate-pulse">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-sans font-bold tracking-tight text-white text-lg flex items-center gap-1">
              ScreenSnap <span className="text-indigo-400 text-xs font-mono font-normal">SaaS</span>
            </h1>
            <p className="text-xs text-zinc-500 font-sans tracking-wide">Screenshot Engines</p>
          </div>
        </div>

        {/* Language Selector in Sidebar */}
        <div className="mt-6 flex items-center justify-between p-2 bg-[#09090b] rounded-xl border border-[#27272a]">
          <span className="text-xs text-zinc-500 flex items-center gap-1 font-mono">
            <Globe className="w-3.5 h-3.5 text-zinc-450" /> LANG
          </span>
          <div className="flex gap-1">
            <button
              id="lang-btn-ru"
              onClick={() => setLang('ru')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                lang === 'ru' 
                  ? 'bg-indigo-600 text-white font-semibold shadow' 
                  : 'hover:text-white text-zinc-400 hover:bg-[#18181b]'
              }`}
            >
              RU
            </button>
            <button
              id="lang-btn-en"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                lang === 'en' 
                  ? 'bg-indigo-600 text-white font-semibold shadow' 
                  : 'hover:text-white text-zinc-400 hover:bg-[#18181b]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group text-left cursor-pointer ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 font-semibold border-l-2 border-indigo-500 pl-3.5'
                  : 'hover:bg-[#27272a]/60 hover:text-white border-l-2 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-115 ${
                isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'
              }`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Account Info Status Bar */}
      <div className="p-4 border-t border-[#27272a] bg-[#09090b]/40">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-mono text-indigo-300 font-bold text-xs uppercase shrink-0">
              {getUserInitials()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-zinc-200 truncate" title={user?.name || 'User Profile'}>
                {user?.name || 'Demo Account'}
              </p>
              <p className="text-[10px] text-zinc-400 truncate font-mono uppercase bg-[#18181b] border border-[#27272a] px-1.5 py-0.5 rounded-lg w-max mt-0.5" title={`${currentPlan} active subscription`}>
                {currentPlan} {t.activePlanBadge.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Logout Trigger button */}
          <button
            onClick={onLogout}
            id="sidebar-logout-btn"
            className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group cursor-pointer shrink-0"
            title={lang === 'ru' ? 'Выход из рабочего пространства' : 'Logout of Workspace'}
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
