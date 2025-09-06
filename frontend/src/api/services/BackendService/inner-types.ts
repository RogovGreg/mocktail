export enum EBackendServiceEndpoint {
  CheckAvailability = 'backend/check-availability',

  Project = 'backend/projects',
  ProjectItem = 'backend/projects/:id',

  GenerateDataByTemplateID = 'backend/templates/:id/generate',
  Template = 'backend/templates',
  TemplateItem = 'backend/templates/:id',
}
