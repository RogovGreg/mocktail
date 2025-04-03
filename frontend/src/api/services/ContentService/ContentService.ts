import { axiosInstance } from '#api/api';

import { EContentServiceEndpoint } from './inner-types';
import { TContentService } from './types';

export const ContentService: TContentService = {
  checkAvailability: options =>
    axiosInstance.get(EContentServiceEndpoint.CheckAvailability, options),
};
