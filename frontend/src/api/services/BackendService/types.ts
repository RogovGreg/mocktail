import { TUnifiedApiMethod } from '#api/inner-types';

import { TCheckServiceAvailability } from '../types';

// =========================== common ===========================

export type TProject = Readonly<{
  id: string;
  title: string;
  description: string | null;
}>;

export type TTemplate = Readonly<{
  id: string;
  schema: string;
  name: string;
  keyWords: Array<string> | null;
  description: string | null;
  updatedAt: string;
  relatedProjectId: string;
  usedIn: Array<string>;
}>;

// =========================== createProject ===========================

export type TCreateProjectAPIMethodPayload = Pick<
  TProject,
  'title' | 'description'
>;
export type TCreateProjectAPIMethodResponse = TProject;
export type TCreateProjectAPIMethod = TUnifiedApiMethod<
  void,
  void,
  TCreateProjectAPIMethodPayload,
  TCreateProjectAPIMethodResponse
>;

// =========================== deleteProject ===========================

export type TDeleteProjectAPIMethodQueryParams = Pick<TProject, 'id'>;
export type TDeleteProjectAPIMethod =
  TUnifiedApiMethod<TDeleteProjectAPIMethodQueryParams>;

// =========================== getProjectByID ===========================

export type TGetProjectByIDMethodQueryParams = Pick<TProject, 'id'>;
export type TGetProjectByIDMethodResponse = TProject;
export type TGetProjectByIDMethod = TUnifiedApiMethod<
  TGetProjectByIDMethodQueryParams,
  void,
  void,
  TGetProjectByIDMethodResponse
>;

// ========================== getProjectsList ==========================

export type TGetProjectsListMethodQueryParams = Readonly<{
  id?: string;
  title?: string;
  member?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}>;
export type TGetProjectsListMethodResponse = Array<TProject>;
export type TGetProjectsListMethod = TUnifiedApiMethod<
  void,
  TGetProjectsListMethodQueryParams,
  void,
  TGetProjectsListMethodResponse
>;

// =========================== updateProject ===========================

export type TUpdateProjectMethodQueryParams = Pick<TProject, 'id'>;
export type TUpdateProjectAPIMethodPayload = TCreateProjectAPIMethodPayload;
export type TUpdateProjectAPIMethodResponse = TCreateProjectAPIMethodResponse;
export type TUpdateProjectAPIMethod = TUnifiedApiMethod<
  TUpdateProjectMethodQueryParams,
  void,
  TUpdateProjectAPIMethodPayload,
  TUpdateProjectAPIMethodResponse
>;

// =========================== createTemplate ===========================

export type TCreateTemplateAPIMethodPayload = Pick<
  TTemplate,
  'name' | 'description' | 'keyWords' | 'schema' | 'relatedProjectId'
>;
export type TCreateTemplateAPIMethodResponse = TTemplate;
export type TCreateTemplateAPIMethod = TUnifiedApiMethod<
  void,
  void,
  TCreateTemplateAPIMethodPayload,
  TCreateTemplateAPIMethodResponse
>;

// =========================== deleteTemplate ===========================

export type TDeleteTemplateAPIMethodQueryParams = Pick<TTemplate, 'id'>;
export type TDeleteTemplateAPIMethod =
  TUnifiedApiMethod<TDeleteTemplateAPIMethodQueryParams>;

// =========================== getTemplateByID ==========================

export type TGetTemplateByIDMethodQueryParams = Pick<TTemplate, 'id'>;

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
export type GetTemplateByIDMethod = TUnifiedApiMethod<
  TGetTemplateByIDMethodQueryParams,
  void,
  void,
  TGetTemplateByIDMethodResponse
>;

// ========================== getTemplatesList ==========================

export type TGetTemplatesListMethodQueryParams = Readonly<{
  id?: string;
  searchString?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  relatedProjectId?: string;
  usedIn?: string;
}>;
export type TGetTemplatesListMethodResponse = Array<TTemplate>;
export type GetTemplatesListMethod = TUnifiedApiMethod<
  void,
  TGetTemplatesListMethodQueryParams,
  void,
  TGetTemplatesListMethodResponse
>;

// =========================== updateTemplate ===========================

export type TUpdateTemplateMethodQueryParams = Pick<TTemplate, 'id'>;
export type TUpdateTemplateAPIMethodResponse = TTemplate;
export type TUpdateTemplateAPIMethod = TUnifiedApiMethod<
  TUpdateTemplateMethodQueryParams,
  void,
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
