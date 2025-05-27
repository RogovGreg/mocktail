// theme/ThemeProvider.tsx
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ThemeConfig } from 'antd';
import { ConfigProvider, theme as antdTheme } from 'antd';

export type ThemeContextValue = {
  darkMode: boolean;
  toggleTheme(): void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const prefersDark = window.matchMedia?.(
    '(prefers-color-scheme: dark)',
  ).matches;
  const [darkMode, setDarkMode] = useState<boolean>(
    JSON.parse(localStorage.getItem('dark') ?? 'false') || prefersDark,
  );

  const toggleTheme = useCallback(() => setDarkMode(mode => !mode), []);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light',
    );
    localStorage.setItem('dark', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme: ThemeConfig = useMemo(
    () => ({
      algorithm: darkMode
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
      token: {
        colorBgBase: darkMode ? 'white' : 'black',
        colorPrimary: darkMode ? 'red' : 'blue',
        colorTextBase: darkMode ? 'black' : 'white',
      },
    }),
    [darkMode],
  );

  const ctx = useMemo(
    () => ({ darkMode, toggleTheme }),
    [darkMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={ctx}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};
