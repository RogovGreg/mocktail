export type TRouteHandle = {
  crumb?: string;
  title?: string;
  [key: string]: unknown;
};

export type TRoutePath = string;

export type TRouteObject = Readonly<{
  Component: React.FC;
  isOnAuthFlow: boolean;
  isProtected: boolean;
  path: string;
  index?: boolean;
  element?: React.ReactNode;

  handle?: TRouteHandle;

  children?: Array<TRouteObject>;
}>;

export type TRouteObjectList = Readonly<Array<TRouteObject>>;
