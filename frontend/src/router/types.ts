import { ERoutes } from "./routes-list"

export type TRouteObject = Readonly<{
  Component: React.FC,
  path: ERoutes,
}>;

export type TRouteObjectList = Readonly<Array<TRouteObject>>;