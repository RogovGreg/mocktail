import { createBrowserRouter, Navigate, RouteObject } from 'react-router';
import { RouterProvider } from 'react-router-dom';

import { AuthContextProvider } from '#src/global-contexts/index.ts';

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
            <Component />
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
            <Component />
          </ProtectedRoute>
        </AuthContextProvider>
      ),
    };
  }),

  {
    element: <Navigate to={ERoutes.Login} />,
    path: '/',
  },
  {
    element: <Navigate to={ERoutes.PageNotFound} />,
    path: '*',
  },
]);

export const Router = () => <RouterProvider router={router} />;
