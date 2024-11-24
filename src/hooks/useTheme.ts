import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('accentColor');
    return saved || 'blue';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-accent', accentColor);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const toggle = () => setIsDark(!isDark);

  return { isDark, toggle, accentColor, setAccentColor };
}