// import { ERoutes } from './routes-list.ts';

import { LoaderFunction } from 'react-router-dom';

import { TProject, TTemplate } from '#api';

// type TDynamicIdSegment = ':id' | ':templateId' | ':memberId' | ':endpointId';
// type TStaticSegment = 'templates' | 'members' | 'endpoints' | 'create' | 'edit';

// type TDynamicPath =
//   | `${string}/${TDynamicIdSegment}`
//   | `${string}/${TDynamicIdSegment}/${TStaticSegment}`
//   | `${string}/${TDynamicIdSegment}/${TStaticSegment}/${TDynamicIdSegment}`
//   | `${string}/${TDynamicIdSegment}/${TStaticSegment}/${TDynamicIdSegment}/${TStaticSegment}`;

export type TLoaderData = {
  project?: TProject;
  template?: TTemplate;
  [key: string]: unknown;
};

export type TRouteHandle = {
  crumb?: (data?: TLoaderData, params?: Record<string, string>) => string;
  title?: string;
  permissions?: Array<string>;
  [key: string]: unknown;
};

export type TRoutePath = string; // ERoutes | TDynamicPath | TStaticSegment;

export type TRouteObject = Readonly<{
  Component: React.FC;
  isOnAuthFlow: boolean;
  isProtected: boolean;
  path: string; // !

  loader?: LoaderFunction;
  handle?: TRouteHandle;

  children?: Array<TRouteObject>;
}>;

export type TRouteObjectList = Readonly<Array<TRouteObject>>;
