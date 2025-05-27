import { AuthContextProvider } from './global-contexts/index.ts';
import { Router } from './router/Router.tsx';
import { ThemeProvider } from './theme';

export const App = () => (
  <ThemeProvider>
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  </ThemeProvider>
);
