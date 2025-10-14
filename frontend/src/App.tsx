import {
  AuthContextProvider,
  SidebarsContextProvider,
} from './global-contexts';
import { RootLayout } from './layouts';

export const App = () => (
  <AuthContextProvider>
    <SidebarsContextProvider>
      <RootLayout />
    </SidebarsContextProvider>
  </AuthContextProvider>
);
