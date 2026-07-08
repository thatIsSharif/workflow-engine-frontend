import { useState, useEffect } from 'react';

const STORAGE_KEY = 'workflow-engine-theme';

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => getInitialTheme() === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <div className="theme-toggle-wrapper">
      <label>Dark Mode</label>
      <button
        className="theme-toggle"
        role="switch"
        aria-checked={dark}
        aria-pressed={dark}
        onClick={() => setDark((d) => !d)}
      />
    </div>
  );
}
