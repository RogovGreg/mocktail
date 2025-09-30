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
  const getSystemTheme = () => {
    if (typeof window === 'undefined') return false;

    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('mocktail-theme');
    if (stored) {
      return JSON.parse(stored);
    }
    return getSystemTheme();
  });

  const toggleTheme = useCallback(() => setDarkMode(mode => !mode), []);

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');

    if (darkMode) {
      root.style.setProperty('--ant-color-bg-base', '#141414');
      root.style.setProperty('--ant-color-text-base', '#ffffff');
      root.style.setProperty('--ant-color-bg-container', '#1f1f1f');
    } else {
      root.style.setProperty('--ant-color-bg-base', '#ffffff');
      root.style.setProperty('--ant-color-text-base', '#000000');
      root.style.setProperty('--ant-color-bg-container', '#ffffff');
    }

    localStorage.setItem('mocktail-theme', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme: ThemeConfig = useMemo(
    () => ({
      algorithm: darkMode
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
      token: {
        colorError: 'var(--mt-color-primary-2)',
      },

      components: {
        Layout: {
          bodyBg: darkMode ? '#141414' : '#ffffff',
          headerBg: darkMode ? '#1f1f1f' : '#ffffff',
        },
        Menu: {
          itemBg: darkMode ? '#1f1f1f' : '#ffffff',
          subMenuItemBg: darkMode ? '#1f1f1f' : '#ffffff',
        },

        Input: {
          colorBorder: darkMode
            ? 'var(--mt-color-tertiary-4)'
            : 'var(--mt-color-tertiary-3)',

          activeBorderColor: darkMode
            ? 'var(--mt-color-tertiary-2)'
            : 'var(--mt-color-tertiary-5)',

          hoverBorderColor: darkMode
            ? 'var(--mt-color-tertiary-2)'
            : 'var(--mt-color-tertiary-5)',

          activeShadow: darkMode
            ? '0 0 0 1px var(--mt-color-tertiary-2)'
            : '0 0 0 1px var(--mt-color-tertiary-5)',

          colorBgContainer: darkMode
            ? 'var(--mt-color-tertiary-5)'
            : 'var(--mt-color-tertiary-2)',

          errorActiveShadow: '0 0 0 2px var(--mt-color-primary-2)',
        },

        Form: {
          labelColor: 'var(--mt-main-text-color)',
          labelRequiredMarkColor: 'var(--mt-color-primary-2)',
          verticalLabelPadding: '0 0 3px',
        },
      },
    }),
    [darkMode],
  );

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ darkMode, toggleTheme }),
    [darkMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};
