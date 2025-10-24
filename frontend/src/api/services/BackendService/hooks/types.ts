import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import {
  TGetProjectByIDMethodPathParams,
  TGetProjectByIDMethodResponse,
  TGetProjectsListMethodQueryParams,
  TGetProjectsListMethodResponse,
  TGetTemplateByIDMethodQueryParams,
  TGetTemplateByIDMethodResponse,
  TGetTemplatesListMethodQueryParams,
  TGetTemplatesListMethodResponse,
} from '../types';

export type TUseProjectsListQuery = (
  params?: TGetProjectsListMethodQueryParams,
  options?: Partial<UseQueryOptions<TGetProjectsListMethodResponse>>,
) => UseQueryResult<TGetProjectsListMethodResponse | null, Error>;

export type TUseProjectsItemQuery = (
  params?: TGetProjectByIDMethodPathParams,
  options?: Partial<UseQueryOptions<TGetProjectByIDMethodResponse>>,
) => UseQueryResult<TGetProjectByIDMethodResponse | null, Error>;

export type TUseTemplatesListQuery = (
  params?: TGetTemplatesListMethodQueryParams,
  options?: Partial<UseQueryOptions<TGetTemplatesListMethodResponse>>,
) => UseQueryResult<TGetTemplatesListMethodResponse | null, Error>;

export type TUseTemplatesItemQuery = (
  params?: TGetTemplateByIDMethodQueryParams,
  options?: Partial<UseQueryOptions<TGetTemplateByIDMethodResponse>>,
) => UseQueryResult<TGetTemplateByIDMethodResponse | null, Error>;
