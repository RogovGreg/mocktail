import { createBrowserRouter, Navigate } from "react-router";
import { LoginServiceRoutesList } from "./routes";
import { RouterProvider } from "react-router-dom";
import { ERoutes } from "./routes-list";

const router = createBrowserRouter([
  // Public routes
  ...LoginServiceRoutesList.map(({ path, Component }) => ({
    path,

    element: (
        <Component />
    ),
  })),

  /* eslint-disable sort-keys */
  { path: '/', element: <Navigate to={ERoutes.Login} /> },
  { path: '*', element: <Navigate to={ERoutes.PageNotFound} /> },
  /* eslint-enable sort-keys */
]);

export const Router = () => <RouterProvider router={router} />;
