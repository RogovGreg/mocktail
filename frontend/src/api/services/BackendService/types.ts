import { TApiMethod } from '#api/inner-types';

import { TCheckServiceAvailability } from '../types';

export type TBackendService = Readonly<{
  checkAvailability: TCheckServiceAvailability;
  getTemplatesList: TApiMethod;
}>;
