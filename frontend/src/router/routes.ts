import { HomePage, LoginPage, PageNotFoundPage } from "../pages";
import { ERoutes } from "./routes-list";
import { TRouteObjectList } from "./types";

export const LoginServiceRoutesList: TRouteObjectList = [
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
    path: ERoutes.HomePage
  }
]