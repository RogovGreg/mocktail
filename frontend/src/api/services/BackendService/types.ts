import { TApiMethod, TApiMethodWithPayload } from '#api/inner-types';

import { TCheckServiceAvailability } from '../types';

// =========================== common ===========================

export type TProject = Readonly<{
  Id: string;
  Title: string;
  Description: string | null;
}>;

export type TTemplate = Readonly<{
  Id: string;
  Schema: string;
  Name: string;
  KeyWords: Array<string> | null;
  Description: string | null;
  UpdatedAt: string;
  RelatedProjectId: string;
  UsedIn: Array<string>;
}>;

// =========================== createProject ===========================

export type TCreateProjectAPIMethodPayload = Pick<
  TProject,
  'Title' | 'Description'
>;
export type TCreateProjectAPIMethodResponse = TProject;
export type TCreateProjectAPIMethod = TApiMethodWithPayload<
  null,
  TCreateProjectAPIMethodPayload,
  TCreateProjectAPIMethodResponse
>;

// =========================== deleteProject ===========================
export type TDeleteProjectAPIMethodQueryParams = Pick<TProject, 'Id'>;
export type TDeleteProjectAPIMethod = TApiMethodWithPayload<TDeleteProjectAPIMethodQueryParams>;

// =========================== getProjectByID ===========================

export type TGetProjectByIDMethodQueryParams = Pick<TProject, 'Id'>;
export type TGetProjectByIDMethodResponse = TProject;
export type TGetProjectByIDMethod = TApiMethodWithPayload<
  TGetProjectByIDMethodQueryParams,
  null,
  TGetProjectByIDMethodResponse
>;
// ========================== getProjectsList ==========================
export type TGetProjectsListMethodResponse = Array<TProject>;
export type TGetProjectsListMethod = TApiMethod<TGetProjectsListMethodResponse>;

// =========================== updateProject ===========================
export type TUpdateProjectMethodQueryParams = Pick<TProject, 'Id'>;
export type TUpdateProjectAPIMethodPayload = TCreateProjectAPIMethodPayload;
export type TUpdateProjectAPIMethodResponse = TCreateProjectAPIMethodResponse;
export type TUpdateProjectAPIMethod = TApiMethodWithPayload<
  TUpdateProjectMethodQueryParams,
  TUpdateProjectAPIMethodPayload,
  TUpdateProjectAPIMethodResponse
>;

// =========================== createTemplate ===========================

export type TCreateTemplateAPIMethodPayload = Pick<
  TTemplate,
  'Name' | 'Description' | 'KeyWords' | 'Schema' | 'RelatedProjectId'
>;
export type TCreateTemplateAPIMethodResponse = TTemplate;
export type TCreateTemplateAPIMethod = TApiMethodWithPayload<
  null,
  TCreateTemplateAPIMethodPayload,
  TCreateTemplateAPIMethodResponse
>;

// =========================== deleteTemplate ===========================

export type TDeleteTemplateAPIMethodQueryParams = Pick<TTemplate, 'Id'>;
export type TDeleteTemplateAPIMethod =
  TApiMethodWithPayload<TDeleteTemplateAPIMethodQueryParams>;

// =========================== getTemplateByID ==========================

export type TGetTemplateByIDMethodQueryParams = Pick<TTemplate, 'Id'>;

// TODO: Fix this type
export type TGetTemplateByIDMethodResponse = Readonly<{
  id: string;
  schema: string;
  name: string;
  keyWords: Array<string> | null;
  description: string | null;
  updatedAt: string;
  relatedProjectId: string;
  usedIn: Array<string>;
}>;
export type GetTemplateByIDMethod = TApiMethodWithPayload<
  TGetTemplateByIDMethodQueryParams,
  null,
  TGetTemplateByIDMethodResponse
>;

// ========================== getTemplatesList ==========================

export type TGetTemplatesListMethodResponse = Array<TTemplate>;
export type GetTemplatesListMethod =
  TApiMethod<TGetTemplatesListMethodResponse>;

// =========================== updateTemplate ===========================

export type TUpdateTemplateMethodQueryParams = Pick<TTemplate, 'Id'>;
export type TUpdateTemplateAPIMethodResponse = TTemplate;
export type TUpdateTemplateAPIMethod = TApiMethodWithPayload<
  TUpdateTemplateMethodQueryParams,
  TCreateTemplateAPIMethodPayload,
  TCreateTemplateAPIMethodResponse
>;

// ========================== TBackendService ===========================

export type TBackendService = Readonly<{
  checkAvailability: TCheckServiceAvailability;

  createProject: TCreateProjectAPIMethod;
  deleteProject: TDeleteProjectAPIMethod;
  getProjectByID: TGetProjectByIDMethod;
  getProjectsList: TGetProjectsListMethod;
  updateProject: TUpdateProjectAPIMethod;

  createTemplate: TCreateTemplateAPIMethod;
  deleteTemplate: TDeleteTemplateAPIMethod;
  getTemplateByID: GetTemplateByIDMethod;
  getTemplatesList: GetTemplatesListMethod;
  updateTemplate: TUpdateTemplateAPIMethod;
}>;
