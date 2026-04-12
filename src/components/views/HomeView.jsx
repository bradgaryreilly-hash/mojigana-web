import { Play, Sun, Moon, Settings } from 'lucide-react';
import { SITE_INFO_ORDER, SITE_INFO_PAGES } from '../../data/siteInfoContent';

/** Cumulative nudge upward for hero (below header); ~2× primary CTA height */
const HOME_BELOW_HEADER_SHIFT = '8rem';

const HomeView = ({
  isDark,
  toggleTheme,
  setIsSettingsOpen,
  setCurrentView,
  setInfoModal,
}) => (
  <div className="relative flex flex-col h-full min-h-0 text-center isolate bg-transparent">
    <header className="relative z-20 shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 bg-transparent">
      <nav
        className="flex flex-1 flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1.5 min-w-0"
        aria-label="Site information"
      >
        {SITE_INFO_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setInfoModal(key)}
            className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide whitespace-nowrap px-1 py-0.5 rounded-md transition-colors active:scale-95 ${
              isDark
                ? 'text-slate-400 hover:text-[#2DD4BF] hover:bg-white/[0.06]'
                : 'text-slate-600 hover:text-[#06948E] hover:bg-white/40'
            }`}
          >
            {SITE_INFO_PAGES[key].title}
          </button>
        ))}
      </nav>
      <div className="flex shrink-0 gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 sm:p-3 rounded-full active:scale-95 transition-all ${
            isDark ? 'text-amber-500' : 'text-black'
          }`}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className={`p-2 sm:p-3 rounded-full active:scale-95 transition-all ${
            isDark ? 'text-slate-400' : 'text-black'
          }`}
        >
          <Settings size={24} />
        </button>
      </div>
    </header>

    <div
      className="relative z-10 -mt-[var(--home-below-header-shift)] flex flex-1 flex-col min-h-0"
      style={{ '--home-below-header-shift': HOME_BELOW_HEADER_SHIFT }}
    >
      {/* Aura + hero move together; inset is the area below the header */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(135vw,36rem)] aspect-square rounded-full blur-[4.5rem] opacity-[0.52] scale-100 bg-gradient-to-br ${
            isDark
              ? 'from-[#06B6D4] from-20% to-[#10B981] to-80%'
              : 'from-[#0891B2] from-20% to-[#059669] to-80%'
          }`}
          style={{ top: 'clamp(4rem, 36%, 46%)' }}
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-visible px-4 pt-2 pb-8 sm:px-8">
        {/*
          One centered stack (same overall position as before). Equal gap-y so the copy
          sits the same distance from あ below and from the button above.
        */}
        <div className="flex w-full max-w-[90vw] flex-col items-center gap-y-12">
          <div className="relative flex w-96 max-w-full items-center justify-center min-h-[min(90vw,24rem)]">
            <span
              style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
              className={`relative z-10 inline-block bg-clip-text font-black text-[clamp(7rem,36vw,12rem)] text-transparent bg-gradient-to-br filter drop-shadow-[0_22px_55px_rgba(14,165,233,0.45)] ${
                isDark
                  ? 'from-[#06B6D4] from-20% to-[#10B981] to-80%'
                  : 'from-[#0891B2] from-20% to-[#059669] to-80%'
              }`}
            >
              あ
            </span>
          </div>

          <div
            className="relative z-20 text-center"
            style={{ transform: 'translateY(-1rem)' }}
          >
            <h1
              className={`text-6xl font-black tracking-tight ${
                isDark ? 'text-slate-100' : 'text-slate-800'
              }`}
            >
              MojiGana
            </h1>
            <h2
              className={`mb-3 text-3xl font-bold tracking-tight ${
                isDark ? 'text-slate-100' : 'text-slate-800'
              }`}
            >
              Flashcards
            </h2>
            <p
              className={`px-6 text-xl font-medium leading-relaxed ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}
            >
              Practice your Hiragana, Katakana & Numbers
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('selection')}
            className={`flex w-full max-w-xs items-center justify-center gap-3 rounded-full py-5 font-black text-xl uppercase tracking-wider shadow-xl transition-all active:scale-95 ${
              isDark
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-cyan-600/30'
            }`}
          >
            <Play size={24} fill="currentColor" /> Start Learning
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default HomeView;
