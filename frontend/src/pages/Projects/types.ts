import { TGetProjectsListMethodQueryParams } from '#api';

export type TProjectFiltersFormValues = Pick<
  TGetProjectsListMethodQueryParams,
  'searchString'
>;
