import { ERoutes } from './routes-list.ts';
import { TRouteObjectList } from './types.ts';
import {
  DashboardPage,
  LandingPage,
  LoginPage,
  PageNotFoundPage,
  RegisterPage,
  RegisterSuccessNotificationPage,
  WaitingPage,
} from '../pages/index.ts';

export const ROUTES_LIST: TRouteObjectList = [
  {
    Component: RegisterPage,
    isOnAuthFlow: true,
    isProtected: false,
    path: ERoutes.Register,
  },
  {
    Component: RegisterSuccessNotificationPage,
    isOnAuthFlow: true,
    isProtected: false,
    path: ERoutes.RegisterSuccess,
  },
  {
    Component: LoginPage,
    isOnAuthFlow: true,
    isProtected: false,
    path: ERoutes.Login,
  },
  {
    Component: PageNotFoundPage,
    isOnAuthFlow: true,
    isProtected: false,
    path: ERoutes.PageNotFound,
  },
  {
    Component: WaitingPage,
    isOnAuthFlow: true,
    isProtected: false,
    path: ERoutes.WaitingPage,
  },
  {
    Component: DashboardPage,
    isOnAuthFlow: false,
    isProtected: true,
    path: ERoutes.Dashboard,
  },
  {
    Component: LandingPage,
    isOnAuthFlow: false,
    isProtected: false,
    path: ERoutes.Landing,
  },
];

export const PROTECTED_ROUTES: Array<ERoutes> = ROUTES_LIST.reduce<
  Array<ERoutes>
>((accumulator, { isProtected, path }) => {
  if (isProtected) {
    accumulator.push(path);
  }

  return accumulator;
}, []);

export const AUTH_FLOW_ROUTES: Array<ERoutes> = ROUTES_LIST.reduce<
  Array<ERoutes>
>((accumulator, { isOnAuthFlow, path }) => {
  if (isOnAuthFlow) {
    accumulator.push(path);
  }

  return accumulator;
}, []);
