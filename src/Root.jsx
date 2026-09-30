import { useEffect } from 'react';
import App from './App';
import SiteChrome from './components/site/SiteChrome';
import NewsHome from './components/site/NewsHome';
import InfoPage from './components/site/InfoPage';
import { useSiteTheme } from './hooks/useSiteTheme';
import { pagePath, titleForPath } from './lib/sitePaths';

const INFO_PAGE_KEYS = {
  '/about': 'about',
  '/contact': 'contact',
  '/privacy': 'privacy',
};

const MissingPage = ({ isDark }) => (
  <div className="px-5 sm:px-8 pt-16 pb-16 text-center">
    <h1
      className={`text-3xl font-black tracking-tight ${
        isDark ? 'text-slate-100' : 'text-slate-800'
      }`}
    >
      Page not found
    </h1>
    <p
      className={`mt-3 text-[15px] ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}
    >
      That address is not part of MojiGana.
    </p>
    <a
      href="/"
      className={`mt-8 inline-flex rounded-full px-6 py-3 font-black uppercase tracking-wider ${
        isDark
          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900'
          : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white'
      }`}
    >
      Back home
    </a>
  </div>
);

const Root = () => {
  const path = pagePath(
    typeof window === 'undefined' ? '/' : window.location.pathname,
  );
  const { isDark, toggleTheme } = useSiteTheme();

  useEffect(() => {
    document.title = titleForPath(path);
  }, [path]);

  if (path === '/flashcards') return <App />;

  const infoKey = INFO_PAGE_KEYS[path];

  return (
    <SiteChrome path={path} isDark={isDark} toggleTheme={toggleTheme}>
      {path === '/' && <NewsHome isDark={isDark} />}
      {infoKey && <InfoPage pageKey={infoKey} isDark={isDark} />}
      {path !== '/' && !infoKey && <MissingPage isDark={isDark} />}
    </SiteChrome>
  );
};

export default Root;
