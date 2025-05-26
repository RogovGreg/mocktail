import { ERoutes } from './routes-list.ts';

export type TRouteObject = Readonly<{
  Component: React.FC;
  path: ERoutes;
  isProtected: boolean;
  isOnAuthFlow: boolean;
}>;

export type TRouteObjectList = Readonly<Array<TRouteObject>>;
