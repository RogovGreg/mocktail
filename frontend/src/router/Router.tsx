import { createBrowserRouter, Navigate, RouteObject } from 'react-router';
import { RouterProvider } from 'react-router-dom';

import { PageContainer } from '#common-components';
import {
  AuthContextProvider,
  SidebarsContextProvider,
} from '#src/global-contexts/index.ts';

import { ProtectedRoute } from './ProtectedRoute.tsx';
import { PublicRoute } from './PublicRoute.tsx';
import { ProtectedRoutesList, PUBLIC_ROUTES_LIST } from './routes.ts';
import { ERoutes } from './routes-list.ts';

const router = createBrowserRouter([
  ...PUBLIC_ROUTES_LIST.map<RouteObject>(routeObject => {
    const { path, Component } = routeObject;

    return {
      path,

      element: (
        <AuthContextProvider>
          <PublicRoute>
            <SidebarsContextProvider>
              <PageContainer>
                <Component />
              </PageContainer>
            </SidebarsContextProvider>
          </PublicRoute>
        </AuthContextProvider>
      ),
    };
  }),

  ...ProtectedRoutesList.map<RouteObject>(routeObject => {
    const { path, Component } = routeObject;

    return {
      path,

      element: (
        <AuthContextProvider>
          <ProtectedRoute>
            <SidebarsContextProvider>
              <PageContainer>
                <Component />
              </PageContainer>
            </SidebarsContextProvider>
          </ProtectedRoute>
        </AuthContextProvider>
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
