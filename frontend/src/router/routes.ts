import { ERoutes } from './routes-list.ts';
import { TRouteObjectList } from './types.ts';
import {
  AboutPage,
  DashboardPage,
  DocsPage,
  LandingPage,
  LoginPage,
  PageNotFoundPage,
  ProfilePage,
  ProjectsPage,
  RegisterPage,
  RegisterSuccessNotificationPage,
  SupportPage,
  TemplatesDemoPage,
  WaitingPage,
} from '../pages/index.ts';

export const ROUTES_LIST: TRouteObjectList = [
  {
    Component: TemplatesDemoPage,
    isOnAuthFlow: false,
    isProtected: true,
    path: ERoutes.TemplatesDemo,
  },

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
  {
    Component: AboutPage,
    isOnAuthFlow: false,
    isProtected: false,
    path: ERoutes.About,
  },

  {
    Component: DocsPage,
    isOnAuthFlow: false,
    isProtected: false,
    path: ERoutes.Docs,
  },
  {
    Component: ProfilePage,
    isOnAuthFlow: false,
    isProtected: true,
    path: ERoutes.Profile,
  },
  {
    Component: ProjectsPage,
    isOnAuthFlow: false,
    isProtected: true,
    path: ERoutes.Projects,
  },
  {
    Component: SupportPage,
    isOnAuthFlow: false,
    isProtected: false,
    path: ERoutes.Support,
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
