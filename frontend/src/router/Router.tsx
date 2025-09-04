import { createBrowserRouter, Navigate, RouteObject } from 'react-router';
import { RouterProvider } from 'react-router-dom';

import { ROUTES_LIST } from './routes.ts';
import { ERoutes } from './routes-list.ts';
import { RouteWrapper } from './RouteWrapper.tsx';
import { TRouteObject } from './types.ts';
import { SidebarsContextProvider } from '../global-contexts/SidebarsContext/index.ts';

const mapRouteObject = (routeObject: TRouteObject): RouteObject => {
  const { path, Component, children } = routeObject;

  return {
    children: children?.map(mapRouteObject),
    path,

    element: (
      <RouteWrapper>
        <SidebarsContextProvider>
          <Component />
        </SidebarsContextProvider>
      </RouteWrapper>
    ),
  };
};

const router = createBrowserRouter([
  ...ROUTES_LIST.map(mapRouteObject),

  {
    element: <Navigate to={ERoutes.Dashboard} />,
    path: ERoutes.WebApp,
  },
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
