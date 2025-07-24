import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type TAuthorizationParameters = Readonly<{
  tokenType?: string;
  accessToken?: string;
}>;

export type TApiMethodResponse<
  TResponseData = void,
  TRequestBody = void,
> = Promise<Readonly<AxiosResponse<TResponseData, TRequestBody>>>;

export type TApiMethod<TResponseData = void> = (
  options?: AxiosRequestConfig,
) => TApiMethodResponse<TResponseData>;

export type TApiMethodWithPayload<
  TQueryParams,
  TRequestBody = void,
  TResponseData = void,
> = (
  queryParams: TQueryParams,
  requestBody: TRequestBody,
  options?: AxiosRequestConfig<TRequestBody>,
) => TApiMethodResponse<TResponseData, TRequestBody>;
