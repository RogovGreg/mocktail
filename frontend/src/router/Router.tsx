import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';

import { ROUTES_LIST } from './routes';
import { ERoutes } from './routes-list.ts';
import { RouteWrapper } from './RouteWrapper.tsx';
import { TRouteObject } from './types.ts';

const mapRouteObject = (routeObject: TRouteObject): RouteObject => {
  const { children, Component, element, handle, index, path } = routeObject;

  if (index === true) {
    if (!element) throw new Error('Index route needs element');

    return {
      element,
      handle,
      index: true,
    };
  }

  return {
    children: children?.map(mapRouteObject),
    handle,
    path,

    element: (
      <RouteWrapper>
        <Component />
      </RouteWrapper>
    ),
  };
};

const router = createBrowserRouter([
  ...ROUTES_LIST.map(mapRouteObject),
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
