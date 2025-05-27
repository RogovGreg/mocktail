import { createBrowserRouter, Navigate, RouteObject } from 'react-router';
import { RouterProvider } from 'react-router-dom';

import { PageContainer } from '#common-components';

import { ROUTES_LIST } from './routes.ts';
import { ERoutes } from './routes-list.ts';
import { RouteWrapper } from './RouteWrapper.tsx';
import { SidebarsContextProvider } from '../global-contexts/SidebarsContext/index.ts';

const router = createBrowserRouter([
  ...ROUTES_LIST.map<RouteObject>(routeObject => {
    const { path, Component } = routeObject;

    return {
      path,

      element: (
        <RouteWrapper>
          <SidebarsContextProvider>
            <PageContainer>
              <Component />
            </PageContainer>
          </SidebarsContextProvider>
        </RouteWrapper>
      ),
    };
  }),

  {
    element: <Navigate to={ERoutes.WaitingPage} />,
    path: '/',
  },
  {
    element: <Navigate to={ERoutes.PageNotFound} />,
    path: '*',
  },
]);

export const Router = () => <RouterProvider router={router} />;
