import { BackendService } from '#api/services/BackendService/BackendService';
import { ProjectLayout, ProtectedLayout, WebAppLayout } from '#layouts';

import { ERoutes } from './routes-list';
import { TLoaderData, TRouteObjectList, TRoutePath } from './types';
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

                handle: {
                  crumb: () => 'Projects',
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
                      crumb: () => 'Create New Project',
                    },
                  },
                  {
                    Component: ViewProjectPage,
                    isOnAuthFlow: false,
                    isProtected: true,
                    path: ':projectId',

                    loader: async ({ params }) => {
                      if (!params.projectId) {
                        return null;
                      }

                      const project = await BackendService.getProjectByID({
                        path: { params: { id: params.projectId } },
                      });

                      return { project: project.data };
                    },

                    handle: {
                      crumb: (data, params) =>
                        data?.project?.title || `Project ${params?.projectId}`,
                    },

                    children: [
                      {
                        Component: EditProjectPage,
                        isOnAuthFlow: false,
                        isProtected: true,
                        path: 'edit',

                        handle: {
                          crumb: () => 'Edit',
                        },
                      },

                      {
                        Component: TemplatesPage,
                        isOnAuthFlow: false,
                        isProtected: true,
                        path: 'templates',

                        loader: async ({ params }) => {
                          if (!params.projectId) {
                            return null;
                          }
                          const project = await BackendService.getProjectByID({
                            path: { params: { id: params.projectId } },
                          });
                          return { project: project.data };
                        },

                        handle: {
                          crumb: () => 'Templates',
                        },

                        children: [
                          {
                            Component: CreateTemplatePage,
                            isOnAuthFlow: false,
                            isProtected: true,
                            path: 'create',

                            handle: {
                              crumb: () => 'Create New Template',
                            },
                          },
                          {
                            Component: TemplatePage,
                            isOnAuthFlow: false,
                            isProtected: true,
                            path: ':templateId',

                            loader: async ({ params }) => {
                              if (!params.projectId || !params.templateId) {
                                return null;
                              }

                              const [project, template] = await Promise.all([
                                BackendService.getProjectByID({
                                  path: { params: { id: params.projectId } },
                                }),
                                BackendService.getTemplateByID({
                                  path: { params: { id: params.templateId } },
                                }),
                              ]);

                              return {
                                project: project.data,
                                template: template.data,
                              } as TLoaderData;
                            },

                            handle: {
                              crumb: (data, params) =>
                                data?.template?.name ||
                                `Template ${params?.templateId}`,
                            },

                            children: [
                              {
                                Component: EditTemplatePage,
                                isOnAuthFlow: false,
                                isProtected: true,
                                path: 'edit',

                                handle: {
                                  crumb: () => 'Edit',
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
