import { TUnifiedApiMethod } from '#api/inner-types';

import { TCheckServiceAvailability } from '../types';

// =========================== common ===========================

export type TProject = Readonly<{
  createdAt: string;
  createdBy: string;
  description?: string | null;
  id: string;
  keyWords?: Array<string> | null;
  title: string;
  updatedAt: string;
  updatedBy: string;
}>;

export type TTemplate = Readonly<{
  createdAt: string;
  createdBy: string;
  description: string | null;
  id: string;
  name: string;
  path: string | null;
  relatedProjectId: string;
  schema: string;
  tags: Array<string> | null;
  updatedAt: string;
  updatedBy: string;
  usedIn: Array<string>;
}>;

// =========================== createProject ===========================

export type TCreateProjectAPIMethodPayload = Pick<
  TProject,
  'title' | 'description' | 'keyWords'
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
  searchString?: string;
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
  'name' | 'description' | 'tags' | 'schema' | 'relatedProjectId' | 'path'
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
export type TGetTemplateByIDMethodResponse = TTemplate;
export type GetTemplateByIDMethod = TUnifiedApiMethod<
  TGetTemplateByIDMethodQueryParams,
  void,
  void,
  TGetTemplateByIDMethodResponse
>;

// ========================== getTemplatesList ==========================

export type TGetTemplatesListMethodQueryParams = Readonly<{
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

// ====================== generateDataByTemplateID ======================

export type TGenerateDataByTemplateIDAPIMethodQueryParams = Pick<
  TTemplate,
  'id'
>;
export type TGenerateDataByTemplateIDAPIMethodResponse = Readonly<{
  message: string;
  id: string;
  schema: string;
}>;
export type TGenerateDataByTemplateIDAPIMethod = TUnifiedApiMethod<
  TGenerateDataByTemplateIDAPIMethodQueryParams,
  void,
  void,
  TGenerateDataByTemplateIDAPIMethodResponse
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
  generateDataByTemplateID: TGenerateDataByTemplateIDAPIMethod;
  getTemplateByID: GetTemplateByIDMethod;
  getTemplatesList: GetTemplatesListMethod;
  updateTemplate: TUpdateTemplateAPIMethod;
}>;
