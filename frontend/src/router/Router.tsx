import { createBrowserRouter, Navigate, RouteObject } from 'react-router';
import { RouterProvider } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute.tsx';
import { PublicRoute } from './PublicRoute.tsx';
import { ProtectedRoutesList, PublicRoutesList } from './routes.ts';
import { ERoutes } from './routes-list.ts';

const router = createBrowserRouter([
  ...PublicRoutesList.map<RouteObject>(routeObject => {
    const { path, Component } = routeObject;

    return {
      path,

      element: (
        <PublicRoute>
          <Component />
        </PublicRoute>
      ),
    };
  }),

  ...ProtectedRoutesList.map<RouteObject>(routeObject => {
    const { path, Component } = routeObject;

    return {
      path,

      element: (
        <ProtectedRoute>
          <Component />
        </ProtectedRoute>
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
