import { FC, useEffect } from 'react';
import { useMatches } from 'react-router-dom';
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

export const App: FC = () => {
  const matches = useMatches();

  useEffect(() => {
    const currentMatch = matches[matches.length - 1];
    const title = currentMatch?.handle?.title;

    if (title) {
      document.title = `MockTail | ${title}`;
    } else {
      document.title = 'MockTail';
    }
  }, [matches]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SidebarsContextProvider>
          <RootLayout />
        </SidebarsContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};
