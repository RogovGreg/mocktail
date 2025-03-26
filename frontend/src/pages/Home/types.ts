import { AxiosError, AxiosResponse } from 'axios';

import { TCheckServiceAvailabilityResponseData } from '#api';

export enum EApiServices {
  Auth = 'auth',
  Backend = 'backend',
  Content = 'content',
}

// TODO: Simplify this type
export type TCheckServiceResponseHandler = (
  response: Readonly<
    AxiosResponse<TCheckServiceAvailabilityResponseData, void>
  >,
  service: EApiServices,
) => void;

export type TCheckServiceResponseHandler2 = (
  error: Readonly<AxiosError<TCheckServiceAvailabilityResponseData, void>>,
  service: EApiServices,
) => void;

export type TAvailabilityLog = Readonly<
  Array<
    Readonly<{
      service: EApiServices;
      message: string;
    }>
  >
>;
