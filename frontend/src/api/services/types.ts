import { TApiMethod, TApiMethodResponse } from '#api/inner-types';

export type TCheckServiceAvailabilityResponseData = Readonly<{
  service: string;
  timestamp: string;
}>;
export type TCheckServiceAvailabilityResponse =
  TApiMethodResponse<TCheckServiceAvailabilityResponseData>;
export type TCheckServiceAvailability =
  TApiMethod<TCheckServiceAvailabilityResponseData>;
