import { useEffect, useState } from 'react';
import { Icon } from './Icons.jsx';

const STORAGE_KEY = 'fyv-theme';
const THEME_COLORS = { light: '#191a18', dark: '#16181a' };

// El almacenamiento puede estar bloqueado: el selector sigue funcionando durante la visita.
function readChoice() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function saveChoice(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Sin almacenamiento, la elección dura hasta recargar.
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  // Sin una elección explícita, el tema acompaña al sistema también durante la visita.
  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)');
    const onChange = event => {
      if (readChoice()) return;
      const next = event.matches ? 'dark' : 'light';
      applyTheme(next);
      setTheme(next);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveChoice(next);
    setTheme(next);
  };

  return <button className="theme-toggle" type="button" aria-label="Modo oscuro" aria-pressed={theme === 'dark'} title="Cambiar entre tema claro y oscuro" onClick={toggle}>
    <span className="theme-thumb" aria-hidden="true" />
    <span className="theme-icon theme-sun"><Icon name="sun" size={18} /></span>
    <span className="theme-icon theme-moon"><Icon name="moon" size={18} /></span>
  </button>;
}
