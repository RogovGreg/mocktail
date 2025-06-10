import { TApiMethod, TApiMethodWithPayload } from '#api/inner-types';

import { TCheckServiceAvailability } from '../types';

// =========================== common ===========================

export type TTemplateReleasesChange = Readonly<{
  Name: string;
  Description: string | null;
  KeyWords: Array<string> | null;
  Schema: string;
}>;

export type TTemplatesRelease = Readonly<{
  author: string;
  createdAt: string;
  comment: string;
  version: number;
  changes: TTemplateReleasesChange;
}>;

export type TTemplate = Readonly<{
  Id: string;
  Schema: string;
  Name: string;
  KeyWords: Array<string> | null;
  Description: string | null;
  Releases: Array<TTemplatesRelease>;
  UpdatedAt: string;
  RelatedProjectId: string;
  UsedIn: Array<string>;
}>;

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
export type TGetTemplateByIDMethodResponse = TTemplate;
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
export type TUpdateTemplateAPIMethodPayload = TTemplateReleasesChange;
export type TUpdateTemplateAPIMethodResponse = TTemplate;
export type TUpdateTemplateAPIMethod = TApiMethodWithPayload<
  TUpdateTemplateMethodQueryParams,
  TCreateTemplateAPIMethodPayload,
  TCreateTemplateAPIMethodResponse
>;

// ========================== TBackendService ===========================

export type TBackendService = Readonly<{
  checkAvailability: TCheckServiceAvailability;

  createTemplate: TCreateTemplateAPIMethod;
  deleteTemplate: TDeleteTemplateAPIMethod;
  getTemplateByID: GetTemplateByIDMethod;
  getTemplatesList: GetTemplatesListMethod;
  updateTemplate: TUpdateTemplateAPIMethod;
}>;
