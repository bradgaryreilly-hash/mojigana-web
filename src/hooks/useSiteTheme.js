import { useState } from 'react';
import { loadPersistedState, persistTheme } from '../lib/persistedState';

export function useSiteTheme() {
  const [theme, setTheme] = useState(
    () => loadPersistedState()?.theme ?? 'dark',
  );

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      persistTheme(next);
      return next;
    });
  };

  return { isDark: theme === 'dark', toggleTheme };
}
