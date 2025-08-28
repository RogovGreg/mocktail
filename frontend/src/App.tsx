import {
  AuthContextProvider,
  SidebarsContextProvider,
} from './global-contexts';
import { RootLayout } from './layouts';
import { ThemeProvider } from './theme';

export const App = () => (
  <ThemeProvider>
    <AuthContextProvider>
      <SidebarsContextProvider>
        <RootLayout />
      </SidebarsContextProvider>
    </AuthContextProvider>
  </ThemeProvider>
);
