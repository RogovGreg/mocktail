import { useTheme } from '#src/theme';

import { ThemeSwitcherStyled } from './styled';

const LAMP_FILLING: string =
  'm24-80 h252 q45-32 69.5-79 T700-580 q0-92 -64-156 t-156-64 q-92 0 -156 64 t-64 156 q0 54 24.5 101 t69.5 79 Z';

export const ThemeSwitcher = () => {
  const { toggleTheme, darkMode } = useTheme();

  return (
    <ThemeSwitcherStyled onClick={toggleTheme}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24px'
        height='24px'
        viewBox='0 -960 960 960'
      >
        <path
          d='M480-80 q-33 0 -56.5-23.5 T400-160 h160 q0 33 -23.5 56.5 T480-80 Z M320-200 v-80 h320 v80 H320 Z'
          fill='#666'
        />

        <path
          d={`M330-320 q-69-41 -109.5-110 T180-580 q0-125 87.5-212.5 T480-880 q125 0 212.5 87.5 T780-580 q0 81 -40.5 150 T630-320 H330 Z ${darkMode ? LAMP_FILLING : ''}`}
          fill={darkMode ? '#666' : '#FFD700'}
        />
      </svg>
    </ThemeSwitcherStyled>
  );
};
