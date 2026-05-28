import React, { useState } from 'react';
import { 
  Monitor, 
  Server, 
  Globe, 
  Lock, 
  User, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Check, 
  Zap, 
  ChevronRight,
  Mail,
  Camera,
  ArrowRight,
  Sparkles,
  Quote,
  Star
} from 'lucide-react';
import { LanguageCode } from '../utils/translations';

interface LandingPageProps {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  onRegister: (name: string, email: string) => void;
}

export default function LandingPage({ lang, setLang, onRegister }: LandingPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'enterprise' | 'indie'>('all');

  // Translations dictionary for the landing page
  const text = {
    ru: {
      brand: 'ScreenSnap API',
      subtitle: 'Screenshot engines',
      badge: 'Новое поколение API скриншотов',
      heroTitle: 'Автоматизируйте снимки экранов сайтов по API',
      heroDesc: 'Высокопроизводительный SaaS-сервис для разработчиков. Делайте скриншоты любой сложности, управляйте API-ключами, анализируйте задержки в реальном времени.',
      formTitle: 'Создайте бесплатный аккаунт',
      formDesc: 'Начните использовать ScreenSnap API бесплатно за 10 секунд',
      labelName: 'Ваше имя',
      labelEmail: 'Электронная почта',
      labelPassword: 'Пароль',
      btnSubmit: 'Зарегистрироваться и войти',
      btnDemo: 'Войти как Demo-пользователь',
      errEmpty: 'Пожалуйста, заполните все поля.',
      errPassShort: 'Пароль должен быть не менее 6 символов.',
      f1Title: '⚡ Сверхбыстрый рендеринг',
      f1Desc: 'Наши распределенные GPU ноды генерируют скриншоты в среднем всего за 1.6 секунды.',
      f2Title: '⚙️ Интерактивная песочница',
      f2Desc: 'Пробуйте запросы прямо в браузере и копируйте готовый код для cURL, Fetch, Axios и Python.',
      f3Title: '🛡️ Высокий уровень безопасности',
      f3Desc: 'Шифруйте запросы, управляйте лимитами и мгновенно отзывайте скомпрометированные API ключи.',
      f4Title: '📊 Детальная аналитика',
      f4Desc: 'Интуитивно понятные графики времени ответов, задержки шлюза и подробный аудит-лог запросов.',
      stat1: '14K+ запросов в секунду',
      stat2: '99.98% аптайм серверов',
      stat3: '960+ компаний доверяют нам'
    },
    en: {
      brand: 'ScreenSnap API',
      subtitle: 'Screenshot engines',
      badge: 'Next Generation Screenshot API',
      heroTitle: 'Automate Website Screen Captures via API',
      heroDesc: 'High-performance cloud utility built for developers. Render flawless viewport snapshots of any complexity, analyze latency traces, and scale with ease.',
      formTitle: 'Create a free account',
      formDesc: 'Enter developer workspace immediately in just 10 seconds',
      labelName: 'Your Name',
      labelEmail: 'Email Address',
      labelPassword: 'Password',
      btnSubmit: 'Register & Enter Workspace',
      btnDemo: 'Enter as Demo User',
      errEmpty: 'Please fill in all input fields.',
      errPassShort: 'Password must be at least 6 characters.',
      f1Title: '⚡ High-Speed Rendering',
      f1Desc: 'Distributed GPU nodes render static page captures in an average of 1.6 seconds.',
      f2Title: '⚙️ Interactive Sandbox',
      f2Desc: 'Conduct real-time mock trials on target URLs and grab instantly ready code templates.',
      f3Title: '🛡️ Robust Enterprise Shield',
      f3Desc: 'Cryptographically safe token generation with custom billing quotas and rapid revoke.',
      f4Title: '📊 Performance Logs',
      f4Desc: 'Full transparency on gateway traffic with diagnostic curves and historical payload logs.',
      stat1: '14K+ snapshot queries / sec',
      stat2: '99.98% verified uptime',
      stat3: '960+ developers joined'
    }
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg(text.errEmpty);
      return;
    }
    if (password.length < 6) {
      setErrorMsg(text.errPassShort);
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      onRegister(name, email);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleDemoAccess = () => {
    onRegister('Demo Account', 'demo@screensnap.io');
  };

  return (
    <div id="landing-page-root" className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans selection:bg-indigo-500/35 selection:text-indigo-200 overflow-x-hidden relative">
      
      {/* Visual Ambient Blur backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Global Header */}
      <header className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/35">
              <Monitor className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight block">ScreenSnap</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">{text.subtitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language toggle bar */}
            <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-xl border border-[#27272a]">
              <button
                onClick={() => setLang('ru')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  lang === 'ru' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  lang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Hero / Register Split */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: SaaS Marketing Pitch */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {text.badge}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-sans text-white tracking-tight leading-tight">
            {text.heroTitle}
          </h1>

          <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            {text.heroDesc}
          </p>

          {/* SaaS High-Tech Stats Indicator Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#27272a]/60">
            <div>
              <p className="text-lg md:text-xl font-bold font-mono text-indigo-400">{text.stat1.split(' ')[0]}</p>
              <p className="text-xs text-zinc-500 font-sans leading-tight mt-0.5">{text.stat1.substring(text.stat1.indexOf(' ') + 1)}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold font-mono text-emerald-400">{text.stat2.split(' ')[0]}</p>
              <p className="text-xs text-zinc-500 font-sans leading-tight mt-0.5">{text.stat2.substring(text.stat2.indexOf(' ') + 1)}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold font-mono text-indigo-400">{text.stat3.split(' ')[0]}</p>
              <p className="text-xs text-zinc-500 font-sans leading-tight mt-0.5">{text.stat3.substring(text.stat3.indexOf(' ') + 1)}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Registration / Auth Deck */}
        <div className="lg:col-span-5">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-indigo-600/5">
            <div className="space-y-2 mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">{text.formTitle}</h2>
              <p className="text-xs text-zinc-400">{text.formDesc}</p>
            </div>

            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/25 text-rose-450 p-3 rounded-xl text-xs font-medium text-rose-400 mb-4 animate-shake">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 font-mono flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-zinc-500" /> {text.labelName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-zinc-650"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 font-mono flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" /> {text.labelEmail}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-zinc-650"
                  placeholder="name@company.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 font-mono flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" /> {text.labelPassword}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-zinc-650"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-805 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 group mt-4 active:scale-97 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{text.btnSubmit}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#27272a]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-[#18181b] px-3.5 text-zinc-500">{lang === 'ru' ? 'Или быстрый доступ' : 'Or quick access'}</span>
              </div>
            </div>

            {/* Demo Instant Button */}
            <button
              onClick={handleDemoAccess}
              className="w-full bg-zinc-900 border border-[#27272a] hover:bg-[#27272a] text-zinc-200 hover:text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 group active:scale-97 cursor-pointer font-mono"
            >
              <span>{text.btnDemo}</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </main>

      {/* Bento Showcase Grid below */}
      <section className="bg-[#09090b] border-t border-[#27272a] py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center md:text-left mb-12 space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{lang === 'ru' ? 'Спроектировано для стабильности' : 'Engineered for Performance'}</h2>
            <p className="text-sm text-zinc-500">{lang === 'ru' ? 'Умная облачная инфраструктура, готовая к любым нагрузкам' : 'Our automated cloud pipeline is ready to scale side-by-side with your stack'}</p>
          </div>

          {/* 4 Cards Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-3xl space-y-3 group hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{text.f1Title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{text.f1Desc}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-3xl space-y-3 group hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{text.f2Title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{text.f2Desc}</p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-3xl space-y-3 group hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{text.f3Title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{text.f3Desc}</p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-3xl space-y-3 group hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{text.f4Title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{text.f4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Testimonials Section */}
      <section className="bg-[#09090b] border-t border-[#27272a] py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/15 px-3 py-1 rounded-full text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Quote className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Отзывы сообщества' : 'Community Voices'}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {lang === 'ru' ? 'Что говорят разработчики о ScreenSnap API' : 'What Builders Are Saying About Us'}
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed font-sans">
              {lang === 'ru' 
                ? 'Узнайте мнение инженеров из технологических компаний и независимых разработчиков со всего мира' 
                : 'Hear firsthand feedback from software engineers, tech companies, and indie hackers globally'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 border-indigo-505 text-white shadow-lg shadow-indigo-600/15'
                  : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white'
              }`}
            >
              {lang === 'ru' ? 'Все отзывы' : 'All Reviews'}
            </button>
            <button
              onClick={() => setActiveCategory('enterprise')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                activeCategory === 'enterprise'
                  ? 'bg-indigo-600 border-indigo-505 text-white shadow-lg shadow-indigo-600/15'
                  : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white'
              }`}
            >
              {lang === 'ru' ? 'SaaS и Компании' : 'SaaS & Enterprise'}
            </button>
            <button
              onClick={() => setActiveCategory('indie')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                activeCategory === 'indie'
                  ? 'bg-indigo-600 border-indigo-505 text-white shadow-lg shadow-indigo-600/15'
                  : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white'
              }`}
            >
              {lang === 'ru' ? 'Инди-хакеры' : 'Indie Makers'}
            </button>
          </div>

          {/* Testimonial Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: lang === 'ru' ? 'Алексей Карпенко' : 'Alexei Karpenko',
                role: lang === 'ru' ? 'Руководитель Frontend разработки' : 'Lead Frontend Engineer',
                company: 'Vercel partner',
                category: 'enterprise',
                avatar: 'AK',
                quote: lang === 'ru' 
                  ? 'ScreenSnap сэкономил нам десятки часов ручной проверки скриншотов. Рендеринг через GPU-ноды происходит мгновенно!'
                  : 'ScreenSnap saved us dozens of hours in manual screenshot verification. GPU node rendering is unbelievably fast!',
                rating: 5
              },
              {
                id: 2,
                name: lang === 'ru' ? 'Михаил Воронов' : 'Mikhail Voronov',
                role: lang === 'ru' ? 'Старший инженер инфраструктуры' : 'Senior Infrastructure Engineer',
                company: 'Yandex Cloud partner',
                category: 'enterprise',
                avatar: 'MV',
                quote: lang === 'ru' 
                  ? 'Очень крутая песочница и простая генерация API ключей. Интеграция с Python заняла всего пять строк кода.'
                  : 'Outstanding sandbox and straightforward API keys generation. Python integration took literally five lines of code.',
                rating: 5
              },
              {
                id: 3,
                name: lang === 'ru' ? 'Елизавета Смирнова' : 'Elizabeth Smirnova',
                role: lang === 'ru' ? 'Основатель стартапа' : 'Indie Startup Founder',
                company: 'TailWindy.io',
                category: 'indie',
                avatar: 'ES',
                quote: lang === 'ru' 
                  ? 'Шаблоны в песочнице заработали с первой попытки в cURL. Идеальный сервис для авто-генерации PDF-отчетов по расписанию.'
                  : 'Sandbox templates worked perfectly on the very first try with cURL. Flawless utility for scheduled PDF report screenshotting.',
                rating: 5
              },
              {
                id: 4,
                name: lang === 'ru' ? 'Дайсукэ Сато' : 'Daisuke Sato',
                role: lang === 'ru' ? 'DevOps Архитектор' : 'DevOps Architect',
                company: 'SmartNews Tokyo',
                category: 'enterprise',
                avatar: 'DS',
                quote: lang === 'ru' 
                  ? 'Задержка в 1.6 секунды на генерацию скриншота со сложными JS анимациями — это настоящая магия. Лучший API на рынке.'
                  : 'A 1.6-second render latency for captures with complex JavaScript animations is absolute magic. The best screen API, hands down.',
                rating: 5
              },
              {
                id: 5,
                name: lang === 'ru' ? 'Илья Резник' : 'Ilya Reznik',
                role: lang === 'ru' ? 'Full-stack Разработчик' : 'Full-stack Developer',
                company: 'Figma plugins auth',
                category: 'indie',
                avatar: 'IR',
                quote: lang === 'ru' 
                  ? 'Автоматические графики времени ответов помогли нам оптимизировать кэширование. График задержек выглядит потрясающе!'
                  : 'Automated latency analytics helped us optimize caching instantly. The response-time monitoring graph looks stunning!',
                rating: 5
              }
            ].filter(item => activeCategory === 'all' || item.category === activeCategory).map(item => (
              <div 
                key={item.id}
                className="bg-[#18181b] border border-[#27272a] hover:border-indigo-500/50 p-6 rounded-3xl space-y-4 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-600/5 group"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote content */}
                  <p className="text-zinc-300 text-xs leading-relaxed italic relative z-10">
                    "{item.quote}"
                  </p>
                </div>

                {/* Developer Profile Header */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#27272a]/60">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-mono font-bold text-white text-xs shrink-0 select-none">
                    {item.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{item.role}</p>
                    <p className="text-[9px] font-mono font-semibold text-indigo-400 tracking-wider uppercase mt-0.5 bg-[#09090b] px-1.5 py-0.5 rounded-md border border-[#27272a] w-max">
                      {item.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aesthetic minimalistic footer */}
      <footer className="border-t border-[#27272a] bg-[#09090b] py-8 text-center text-zinc-500 text-xs">
        <p>© 2026 ScreenSnap SaaS API Inc. {lang === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}</p>
      </footer>
    </div>
  );
}
