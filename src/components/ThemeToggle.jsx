import { useState, useEffect } from 'react';

const THEME_KEY = 'theme';
const THEMES = ['light', 'dark', 'high-contrast'];
const ICONS = { 'light': '🌙', 'dark': '☀️', 'high-contrast': '♿' };
const LABELS = { 'light': 'dark', 'dark': 'high-contrast', 'high-contrast': 'light' };

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved && THEMES.includes(saved)) return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark-theme', 'high-contrast-theme');
    if (theme !== 'light') {
      root.classList.add(`${theme}-theme`);
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const idx = THEMES.indexOf(prev);
      return THEMES[(idx + 1) % THEMES.length];
    });
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${LABELS[theme]} mode`}
    >
      {ICONS[theme]}
    </button>
  );
}