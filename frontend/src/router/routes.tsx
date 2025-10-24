import { Navigate } from 'react-router';

import {
  ProjectDetailLayout,
  ProjectLayout,
  ProtectedLayout,
  TemplatesLayout,
  WebAppLayout,
} from '#layouts';

import { ERoutes } from './routes-list';
import { TRouteObjectList, TRoutePath } from './types';
import { App } from '../App';
import {
  AboutPage,
  CreateProjectPage,
  CreateTemplatePage,
  DashboardPage,
  DocsPage,
  LandingPage,
  LoginPage,
  PageNotFoundPage,
  ProfilePage,
  ProjectAccessTokens,
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
                Component: () => null,
                element: <Navigate to='dashboard' replace />,
                index: true,
                isOnAuthFlow: false,
                isProtected: true,
                path: '',
              },
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

                handle: {
                  crumb: 'Projects',
                },

                children: [
                  {
                    Component: ProjectsPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: '',
                  },
                  {
                    Component: CreateProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: 'create',

                    handle: {
                      crumb: 'Create New Project',
                    },
                  },
                  {
                    Component: ProjectDetailLayout,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId',

                    handle: {
                      crumb: 'Project',
                    },

                    children: [
                      {
                        Component: ViewProjectPage,
                        isOnAuthFlow: false,
                        isProtected: true,
                        path: '',
                      },
                      {
                        Component: ProjectAccessTokens,
                        isOnAuthFlow: false,
                        isProtected: true,
                        path: 'api-tokens',

                        handle: {
                          crumb: 'API Tokens',
                        },
                      },
                      {
                        Component: TemplatesLayout,
                        isOnAuthFlow: false,
                        isProtected: true,
                        path: 'templates',

                        handle: {
                          crumb: 'Templates',
                        },

                        children: [
                          {
                            Component: TemplatesPage,
                            isOnAuthFlow: false,
                            isProtected: true,
                            path: '',
                          },
                          {
                            Component: CreateTemplatePage,
                            isOnAuthFlow: false,
                            isProtected: true,
                            path: 'create',

                            handle: {
                              crumb: 'Create new template',
                            },
                          },
                          {
                            Component: TemplatePage,
                            isOnAuthFlow: false,
                            isProtected: true,
                            path: ':templateId',

                            handle: {
                              crumb: 'Template',
                            },
                          },
                        ],
                      },
                    ],
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
