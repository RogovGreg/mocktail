// import { LoaderFunction } from 'react-router-dom';

// import { TProject, TTemplate } from '#api';

// export type TLoaderData = {
//   project?: TProject;
//   template?: TTemplate;
//   [key: string]: unknown;
// };

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

  // loader?: LoaderFunction;
  handle?: TRouteHandle;

  children?: Array<TRouteObject>;
}>;

export type TRouteObjectList = Readonly<Array<TRouteObject>>;
