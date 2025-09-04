import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type TAuthorizationParameters = Readonly<{
  tokenType?: string;
  accessToken?: string;
}>;

// ========================================================================

export type TApiMethodConfig<
  TPathParams = void,
  TQueryParams = void,
  TRequestBody = void,
> = {
  path?: { params: TPathParams };
  query?: { params: TQueryParams };
  body?: { data: TRequestBody };
  options?: AxiosRequestConfig;
};

export type TUnifiedApiMethod<
  TPathParams = void,
  TQueryParams = void,
  TRequestBody = void,
  TResponseData = void,
> = (
  config?: TApiMethodConfig<TPathParams, TQueryParams, TRequestBody>,
) => Promise<AxiosResponse<TResponseData>>;
