import { FC, memo, useCallback, useEffect, useState } from 'react';

const LAMP_FILLING: string =
  'm24-80 h252 q45-32 69.5-79 T700-580 q0-92 -64-156 t-156-64 q-92 0 -156 64 t-64 156 q0 54 24.5 101 t69.5 79 Z';

export const ThemeSwitcher: FC = memo(() => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [hovered, setHovered] = useState(false);

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);

    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);

    document.documentElement.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);
  }, [theme]);

  const isHoveredInLightMode = !isDarkMode && hovered;

  return (
    <button
      type='button'
      className={`btn btn-ghost btn-circle cursor-pointer tooltip tooltip-bottom ${
        isDarkMode
          ? 'hover:bg-base-300 hover:text-[var(--mt-color-primary-1)] [&_svg]:transition-colors [&_svg]:fill-current [&_svg]:stroke-current'
          : ''
      } `}
      data-tip={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 -960 960 960'
        fill='currentColor'
        className='size-7'
      >
        <path d='M480-80 q-33 0 -56.5-23.5 T400-160 h160 q0 33 -23.5 56.5 T480-80 Z M320-200 v-80 h320 v80 H320 Z' />

        <path
          d={`M330-320 q-69-41 -109.5-110 T180-580 q0-125 87.5-212.5 T480-880 q125 0 212.5 87.5 T780-580 q0 81 -40.5 150 T630-320 H330 Z ${isDarkMode || isHoveredInLightMode ? LAMP_FILLING : ''}`}
          fill={isDarkMode || isHoveredInLightMode ? undefined : '#FFD700'}
        />
      </svg>
    </button>
  );
});
