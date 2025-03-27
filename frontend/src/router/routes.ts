import { ERoutes } from './routes-list.ts';
import { TRouteObjectList } from './types.ts';
import {
  HomePage,
  LoginPage,
  PageNotFoundPage,
  RegisterPage,
  RegisterSuccessNotificationPage,
} from '../pages/index.ts';

export const PUBLIC_ROUTES_LIST: TRouteObjectList = [
  {
    Component: RegisterPage,
    path: ERoutes.Register,
  },
  {
    Component: RegisterSuccessNotificationPage,
    path: ERoutes.RegisterSuccess,
  },
  {
    Component: LoginPage,
    path: ERoutes.Login,
  },
  {
    Component: PageNotFoundPage,
    path: ERoutes.PageNotFound,
  },
];

export const PUBLIC_ROUTES_PATHS_LIST: Array<ERoutes> = PUBLIC_ROUTES_LIST.map(
  routeObject => routeObject.path,
);

export const ProtectedRoutesList: TRouteObjectList = [
  {
    Component: HomePage,
    path: ERoutes.HomePage,
  },
];

export const PROTECTED_ROUTES_PATHS_LIST: Array<ERoutes> =
  ProtectedRoutesList.map(routeObject => routeObject.path);
