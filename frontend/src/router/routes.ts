import { HomePage, LoginPage, PageNotFoundPage, SignUpPage } from "../pages/index.ts";
import { ERoutes } from "./routes-list.ts";
import { TRouteObjectList } from "./types.ts";

export const LoginServiceRoutesList: TRouteObjectList = [
  {
    Component: SignUpPage,
    path: ERoutes.SignUp,
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