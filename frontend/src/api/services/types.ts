import { TUnifiedApiMethod } from '#api/inner-types';

export type TCheckServiceAvailabilityResponse = Readonly<{
  service: string;
  timestamp: string;
}>;

export type TCheckServiceAvailability = TUnifiedApiMethod<
  void,
  void,
  void,
  TCheckServiceAvailabilityResponse
>;
