import { FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  AuthContextProvider,
  SidebarsContextProvider,
} from './global-contexts';
import { RootLayout } from './layouts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000, // 1 minutes: 1000 * 60
    },
  },
});

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <SidebarsContextProvider>
        <RootLayout />
      </SidebarsContextProvider>
    </AuthContextProvider>
  </QueryClientProvider>
);
