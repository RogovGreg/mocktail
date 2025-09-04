import { AxiosError, AxiosResponse } from 'axios';

import { TCheckServiceAvailabilityResponse } from '#api';

export enum EApiServices {
  Auth = 'auth',
  Backend = 'backend',
  Content = 'content',
}

// TODO: Simplify this type
export type TCheckServiceResponseHandler = (
  response: Readonly<AxiosResponse<TCheckServiceAvailabilityResponse, void>>,
  service: EApiServices,
) => void;

export type TCheckServiceResponseHandler2 = (
  error: Readonly<AxiosError<TCheckServiceAvailabilityResponse, void>>,
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
