import { HomePage, LoginPage, PageNotFoundPage, RegisterPage } from "../pages/index.ts";
import { ERoutes } from "./routes-list.ts";
import { TRouteObjectList } from "./types.ts";

export const LoginServiceRoutesList: TRouteObjectList = [
  {
    Component: RegisterPage,
    path: ERoutes.Register,
  },
  {
    Component: LoginPage,
    path: ERoutes.Login,
  },
  {
    Component: PageNotFoundPage,
    path: ERoutes.PageNotFound,
  },
  {
    Component: HomePage,
    path: ERoutes.HomePage,
  },
]