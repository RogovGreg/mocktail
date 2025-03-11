import { ERoutes } from './routes-list.ts';
import { TRouteObjectList } from './types.ts';
import {
  HomePage,
  LoginPage,
  PageNotFoundPage,
  RegisterPage,
  RegisterSuccessNotificationPage,
} from '../pages/index.ts';

export const LoginServiceRoutesList: TRouteObjectList = [
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
  {
    Component: HomePage,
    path: ERoutes.HomePage,
  },
];
