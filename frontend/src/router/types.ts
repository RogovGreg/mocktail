// import { ERoutes } from './routes-list.ts';

// type TDynamicIdSegment = ':id' | ':templateId' | ':memberId' | ':endpointId';
// type TStaticSegment = 'templates' | 'members' | 'endpoints' | 'create' | 'edit';

// type TDynamicPath =
//   | `${string}/${TDynamicIdSegment}`
//   | `${string}/${TDynamicIdSegment}/${TStaticSegment}`
//   | `${string}/${TDynamicIdSegment}/${TStaticSegment}/${TDynamicIdSegment}`
//   | `${string}/${TDynamicIdSegment}/${TStaticSegment}/${TDynamicIdSegment}/${TStaticSegment}`;

export type TRoutePath = string; // ERoutes | TDynamicPath | TStaticSegment;

export type TRouteObject = Readonly<{
  Component: React.FC;
  isOnAuthFlow: boolean;
  isProtected: boolean;
  path: string; // !

  children?: Array<TRouteObject>;
}>;

export type TRouteObjectList = Readonly<Array<TRouteObject>>;
