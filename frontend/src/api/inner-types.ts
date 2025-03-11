import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type TAuthorizationParameters = Readonly<{
  tokenType: string;
  accessToken: string;
}>;

export type TApiMethodResponse<
  TRequestResponseData = void,
  TRequestBody = void,
> = Promise<Readonly<AxiosResponse<TRequestResponseData, TRequestBody>>>;
export type TApiMethod<TRequestResponseData = void> = (
  options?: AxiosRequestConfig,
) => TApiMethodResponse<TRequestResponseData>;
export type TApiMethodWithPayload<TRequestBody, TRequestResponseData = void> = (
  requestBody: TRequestBody,
  options?: AxiosRequestConfig<TRequestBody>,
) => TApiMethodResponse<TRequestResponseData, TRequestBody>;
