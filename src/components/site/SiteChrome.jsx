import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { SITE_PAGES } from '../../lib/sitePaths';

const FOOTER_NAV = [
  SITE_PAGES.home,
  SITE_PAGES.about,
  SITE_PAGES.contact,
  SITE_PAGES.privacy,
];

const SiteChrome = ({ path, isDark, toggleTheme, children }) => {
  useEffect(() => {
    const id = 'mojigana-sawarabi';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Sawarabi+Gothic&display=swap';
    document.head.appendChild(link);
  }, []);

  const shellBg = isDark
    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40'
    : 'bg-gradient-to-br from-cyan-50 via-white to-emerald-50';

  const headerBg = isDark ? 'bg-slate-900/85' : 'bg-white/80';

  return (
    <div className="min-h-screen w-full bg-slate-900 flex justify-center selection:bg-emerald-100">
      <div
        className={`w-full max-w-xl min-h-[100dvh] relative shadow-2xl flex flex-col transition-colors duration-300 box-border pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] ${shellBg}`}
      >
        <header
          className={`sticky top-0 z-20 flex items-center justify-between gap-2 px-3 sm:px-4 py-3 backdrop-blur-md ${headerBg}`}
        >
          <a
            href={SITE_PAGES.home.path}
            aria-label="Home"
            aria-current={path === SITE_PAGES.home.path ? 'page' : undefined}
            className="z-10 shrink-0 rounded-xl active:scale-95 transition-transform"
          >
            <img
              src="/mojigana-icon.jpg"
              alt=""
              width="40"
              height="40"
              className="h-10 w-10 rounded-xl object-cover"
            />
          </a>
          <p
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 text-2xl font-black tracking-tight ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            MojiGana
          </p>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 sm:p-3 rounded-full shrink-0 active:scale-95 transition-all ${
              isDark ? 'text-amber-500' : 'text-black'
            }`}
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>
        <main className="flex-1">{children}</main>
        <footer className={`px-3 sm:px-4 py-4 ${headerBg}`}>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5"
            aria-label="Home, about, contact, and privacy"
          >
            {FOOTER_NAV.map((item) => {
              const active = path === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide whitespace-nowrap px-1 py-0.5 rounded-md transition-colors ${
                    active
                      ? isDark
                        ? 'text-[#2DD4BF]'
                        : 'text-[#06948E]'
                      : isDark
                        ? 'text-slate-400 hover:text-[#2DD4BF] hover:bg-white/[0.06]'
                        : 'text-slate-600 hover:text-[#06948E] hover:bg-white/40'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default SiteChrome;
