import { ProjectLayout, ProtectedLayout, WebAppLayout } from '#layouts';

import { ERoutes } from './routes-list';
import { TRouteObjectList, TRoutePath } from './types';
import { App } from '../App';
import {
  AboutPage,
  CreateProjectPage,
  CreateTemplatePage,
  DashboardPage,
  DocsPage,
  EditProjectPage,
  EditTemplatePage,
  LandingPage,
  LoginPage,
  MembersPage,
  PageNotFoundPage,
  ProfilePage,
  ProjectsPage,
  RegisterPage,
  RegisterSuccessNotificationPage,
  SupportPage,
  TemplatePage,
  TemplatesPage,
  ViewProjectPage,
  WaitingPage,
} from '../pages';

export const ROUTES_LIST: TRouteObjectList = [
  {
    Component: App,
    isOnAuthFlow: false,
    isProtected: false,
    path: '/',

    children: [
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
        Component: SupportPage,
        isOnAuthFlow: false,
        isProtected: false,
        path: ERoutes.Support,
      },

      {
        Component: ProtectedLayout,
        isOnAuthFlow: false,
        isProtected: true,
        path: 'app',

        children: [
          {
            Component: WebAppLayout,
            isOnAuthFlow: false,
            isProtected: true,
            path: '',

            children: [
              {
                Component: DashboardPage,
                isOnAuthFlow: false,
                isProtected: true,
                path: 'dashboard',
              },
              {
                Component: ProjectLayout,
                isOnAuthFlow: false,
                isProtected: true,
                path: 'projects',

                children: [
                  {
                    Component: ProjectsPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: '',
                  },
                  {
                    Component: TemplatesPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/templates',
                  },
                  {
                    Component: CreateTemplatePage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/templates/create',
                  },
                  {
                    Component: TemplatePage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/templates/:templateId',
                  },
                  {
                    Component: EditTemplatePage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/templates/:templateId/edit',
                  },
                  {
                    Component: MembersPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/members',
                  },
                  {
                    Component: MembersPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/members/create',
                  },
                  {
                    Component: MembersPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/members/:memberId',
                  },
                  {
                    Component: MembersPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/members/:memberId/edit',
                  },
                  {
                    Component: ViewProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/endpoints',
                  },
                  {
                    Component: ViewProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/endpoints/create',
                  },
                  {
                    Component: ViewProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/endpoints/:endpointId',
                  },
                  {
                    Component: ViewProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/endpoints/:endpointId/edit',
                  },
                  {
                    Component: ViewProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId',
                  },
                  {
                    Component: EditProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId/edit',
                  },
                  {
                    Component: CreateProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: 'create',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const PROTECTED_ROUTES: Array<TRoutePath> = ROUTES_LIST.reduce<
  Array<TRoutePath>
>((accumulator, { isProtected, path }) => {
  if (isProtected) {
    accumulator.push(path);
  }

  return accumulator;
}, []);

export const AUTH_FLOW_ROUTES: Array<TRoutePath> = ROUTES_LIST.reduce<
  Array<TRoutePath>
>((accumulator, { isOnAuthFlow, path }) => {
  if (isOnAuthFlow) {
    accumulator.push(path);
  }

  return accumulator;
}, []);
