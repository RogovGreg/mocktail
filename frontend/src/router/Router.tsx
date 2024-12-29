import { createBrowserRouter, Navigate } from "react-router";
import { LoginServiceRoutesList } from "./routes.ts";
import { RouterProvider } from "react-router-dom";
import { ERoutes } from "./routes-list.ts";
import { TRouteObjectList } from "./types.ts";


const router = createBrowserRouter([
  // Public routes
  // @ts-ignore
  ...LoginServiceRoutesList.map<TRouteObjectList>(({ path, Component }) => ({
    path,

    element: (
        <Component />
    ),
  })),

  /* eslint-disable sort-keys */
  // @ts-ignore
  { path: '/', element: <Navigate to={ERoutes.Login} /> },
  // @ts-ignore
  { path: '*', element: <Navigate to={ERoutes.PageNotFound} /> },
  /* eslint-enable sort-keys */
]);

export const Router = () => <RouterProvider router={router} />;
