import { TGetTemplatesListMethodQueryParams } from '#api';

export type TFilterTemplateFormValues = Pick<
  TGetTemplatesListMethodQueryParams,
  'searchString'
>;
