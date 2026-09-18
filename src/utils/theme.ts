export type Theme = 'dark' | 'light';

const THEME_KEY = 'portfolio-theme';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(THEME_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark'; // Default to signature dark mode
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light-mode');
    root.classList.remove('dark-mode');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  } else {
    root.classList.remove('light-mode');
    root.classList.add('dark-mode');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  }
  localStorage.setItem(THEME_KEY, theme);
}
