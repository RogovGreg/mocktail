import { FC } from 'react';

import {
  AuthContextProvider,
  SidebarsContextProvider,
} from './global-contexts';
import { RootLayout } from './layouts';

export const App: FC = () => (
  <AuthContextProvider>
    <SidebarsContextProvider>
      <RootLayout />
    </SidebarsContextProvider>
  </AuthContextProvider>
);
