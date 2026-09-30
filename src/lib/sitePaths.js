/** Directory copies created at build time so GitHub Pages can serve each URL. */
export const STATIC_ROUTE_DIRS = ['flashcards', 'about', 'contact', 'privacy'];

export const SITE_PAGES = {
  home: { path: '/', label: 'Home', title: 'MojiGana' },
  flashcards: { path: '/flashcards', label: 'Flashcards', title: 'MojiGana' },
  about: { path: '/about', label: 'About', title: 'About MojiGana' },
  contact: { path: '/contact', label: 'Contact', title: 'Contact' },
  privacy: { path: '/privacy', label: 'Privacy', title: 'Privacy policy' },
};

const INFO_KEYS = {
  about: SITE_PAGES.about.path,
  contact: SITE_PAGES.contact.path,
  privacy: SITE_PAGES.privacy.path,
};

export function pathForInfoKey(key) {
  return INFO_KEYS[key] || SITE_PAGES.home.path;
}

/**
 * Page path without a trailing slash.
 * Strips /mojigana-web when that prefix is present so project-pages builds
 * and mojigana.com (served at the domain root) both resolve the same pages.
 */
export function pagePath(pathname = '/') {
  let path = pathname || '/';
  const bases = ['/mojigana-web'];
  const rawBase = import.meta.env?.BASE_URL || '/';
  const viteBase = String(rawBase).replace(/\/$/, '');
  if (viteBase && viteBase !== '/') bases.unshift(viteBase);

  for (const prefix of bases) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      path = path.slice(prefix.length) || '/';
      break;
    }
  }

  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  if (!path.startsWith('/')) path = `/${path}`;
  return path || '/';
}

export function titleForPath(path) {
  if (path === '/' || path === '/flashcards') return 'MojiGana';
  if (path === '/about') return 'About MojiGana';
  if (path === '/contact') return 'Contact — MojiGana';
  if (path === '/privacy') return 'Privacy policy — MojiGana';
  return 'MojiGana';
}
