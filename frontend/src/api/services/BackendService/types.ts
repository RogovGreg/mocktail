import { TCheckServiceAvailability } from '../types';

export type TBackendService = Readonly<{
  checkAvailability: TCheckServiceAvailability;
}>;
