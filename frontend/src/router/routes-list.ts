export enum ERoutes {
  About = '/about',
  Docs = '/docs',
  Landing = '',
  Login = '/login',
  PageNotFound = '/page-not-found',
  Profile = '/profile',

  WebApp = '/app',
  Dashboard = '/app/dashboard',

  Projects = '/app/projects',
  ProjectCreate = '/app/projects/create',
  ProjectView = '/app/projects/:projectId',
  ProjectEdit = '/app/projects/:projectId/edit',

  ProjectTemplates = '/app/projects/:projectId/templates',
  ProjectTemplateCreate = '/app/projects/:projectId/templates/create',
  ProjectTemplateView = '/app/projects/:projectId/templates/:templateId',
  ProjectTemplateEdit = '/app/projects/:projectId/templates/:templateId/edit',

  ProjectMembers = '/app/projects/:projectId/members',
  ProjectMemberCreate = '/app/projects/:projectId/members/create',
  ProjectMemberView = '/app/projects/:projectId/members/:memberId',
  ProjectMemberEdit = '/app/projects/:projectId/members/:memberId/edit',

  ProjectEndpoints = '/app/projects/:projectId/endpoints',
  ProjectEndpointCreate = '/app/projects/:projectId/endpoints/create',
  ProjectEndpointView = '/app/projects/:projectId/endpoints/:endpointId',
  ProjectEndpointEdit = '/app/projects/:projectId/endpoints/:endpointId/edit',

  Register = '/register',
  RegisterSuccess = '/register/success',
  Support = '/support',
  WaitingPage = '/waiting',
}
