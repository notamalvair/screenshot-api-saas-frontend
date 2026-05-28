import React, { useState } from 'react';
import { 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { LanguageCode, translations } from '../utils/translations';
import { PricingPlan } from '../types';

interface BillingProps {
  currentPlan: string;
  onChangePlan: (plan: string) => void;
  lang: LanguageCode;
}

export default function Billing({ currentPlan, onChangePlan, lang }: BillingProps) {
  const t = translations[lang];

  // Billing Local states
  const [currency, setCurrency] = useState<'USD' | 'RUB'>('RUB'); // Default to RUB based on localization focus, but togglable!
  const [switchedPlanAlert, setSwitchedPlanAlert] = useState(false);

  // Plans catalog
  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: t.planFreeName,
      priceUSD: 0,
      priceRUB: 0,
      screenshotLimit: 100,
      apiAccess: false,
      supportLevel: t.limitUnlimited,
      features: [
        lang === 'ru' ? '100 снимков в месяц' : '100 screenshots monthly limit',
        lang === 'ru' ? 'Захват в ручном режиме' : 'Manual capture dashboard access',
        lang === 'ru' ? 'Стандартное превью' : 'Standard viewport templates',
        lang === 'ru' ? 'Удаление через 24 часа' : 'Auto-purge in 24 hours'
      ]
    },
    {
      id: 'hobby',
      name: t.planHobbyName,
      priceUSD: 19,
      priceRUB: 1750,
      screenshotLimit: 5000,
      apiAccess: true,
      supportLevel: t.limitUnlimited,
      features: [
        lang === 'ru' ? '5,000 снимков в месяц' : '5,000 screenshots monthly limit',
        lang === 'ru' ? 'Полный доступ к REST API' : 'Full REST programmatic API access',
        lang === 'ru' ? 'Задержка рендеринга' : 'Execution delays & CSS overlays',
        lang === 'ru' ? 'Все форматы: PNG, JPEG' : 'Any format output: PNG, JPEG',
        lang === 'ru' ? 'Хранение медиа: 30 дней' : 'Extended storage: 30 days history'
      ]
    },
    {
      id: 'scale',
      name: t.planScaleName,
      priceUSD: 79,
      priceRUB: 7200,
      screenshotLimit: 50000,
      apiAccess: true,
      supportLevel: t.limitPriority,
      features: [
        lang === 'ru' ? '50,500 снимков в месяц' : '50,500 screenshots limit',
        lang === 'ru' ? 'Линейное масштабирование узлов' : 'Cluster autoscaling priority',
        lang === 'ru' ? 'Захват всей высоты страниц' : 'Ultra tall dynamic full-page renderings',
        lang === 'ru' ? 'Клиентский CDN-мост' : 'Distributed SSL CDN links',
        lang === 'ru' ? 'Выделенный Slack / Телеграм' : 'Dedicated Slack / Telegram channel',
        lang === 'ru' ? 'СLA гарантии 99.9%' : 'SLA guarantee agreement (99.9%)'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    onChangePlan(planId);
    setSwitchedPlanAlert(true);
    setTimeout(() => setSwitchedPlanAlert(false), 3000);
  };

  return (
    <div id="billing-panel-view" className="space-y-8 animate-fade-in font-sans">
      {/* Header sections */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight flex items-center gap-2">
            {t.billingTitle} <span className="text-xs font-mono font-normal bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">PCI-DSS Secure</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">{t.billingDesc}</p>
        </div>

        {/* Currency Switcher */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex items-center gap-1 shrink-0 self-start">
          <span className="text-xs font-mono text-slate-500 px-2 flex items-center gap-1 uppercase">
            <Activity className="w-3.5 h-3.5" /> {t.currencySelect}:
          </span>
          <button
            id="currency-btn-rub"
            onClick={() => setCurrency('RUB')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              currency === 'RUB' 
                ? 'bg-emerald-500 text-slate-950 font-semibold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ₽ RUB
          </button>
          <button
            id="currency-btn-usd"
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              currency === 'USD' 
                ? 'bg-emerald-500 text-slate-950 font-semibold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            $ USD
          </button>
        </div>
      </div>

      {/* Plan switch confirmation */}
      {switchedPlanAlert && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 animate-slide-in">
          <Check className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <p className="font-bold">{t.planSwitched}</p>
            <p className="text-[11px] opacity-85 mt-0.5">Quota policies restarted and active immediately.</p>
          </div>
        </div>
      )}

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((item) => {
          const isActive = currentPlan === item.id;
          const displayPrice = currency === 'RUB' ? item.priceRUB : item.priceUSD;
          const priceSymbol = currency === 'RUB' ? '₽' : '$';

          return (
            <div 
              key={item.id} 
              id={`plan-card-${item.id}`}
              className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                isActive 
                  ? 'border-emerald-500 shadow-md transform -translate-y-1 bg-slate-900/90' 
                  : 'border-slate-800 hover:border-slate-700/80'
              }`}
            >
              {/* Highlight badge for scale or selected */}
              {isActive && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-slate-950 font-bold uppercase rounded-full text-[9px] tracking-wider leading-none shadow-sm flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-slate-950" /> {t.activePlanBadge}
                </span>
              )}

              {/* Title & metrics */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-400">{item.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-white font-mono">{priceSymbol}{displayPrice.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">/ mo</span>
                  </div>
                </div>

                {/* Quota limit label */}
                <span className="inline-block w-full bg-slate-950 border border-slate-850 py-2.5 px-3 rounded-xl text-center text-xs font-mono font-bold text-slate-300">
                  {item.screenshotLimit.toLocaleString()} {t.limitScreenshots}
                </span>

                {/* List Features */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{t.featuresTitle}</h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {item.features.map((feat, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Activation Trigger */}
              <button
                id={`activate-plan-${item.id}`}
                onClick={() => handleSelectPlan(item.id)}
                className={`w-full py-3 mt-6 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-slate-400 font-extrabold cursor-default border border-slate-700/50'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <span>{isActive ? t.planActive : t.btnUpgrade}</span>
                {!isActive && <ArrowRight className="w-3.5 h-3.5 text-slate-950" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
