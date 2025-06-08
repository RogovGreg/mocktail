import { axiosInstance } from '#api/api';

import { EBackendServiceEndpoint } from './inner-types';
import { TBackendService } from './types';

export const BackendService: TBackendService = {
  checkAvailability: options =>
    axiosInstance.get(EBackendServiceEndpoint.CheckAvailability, options),
  getTemplatesList: options =>
    axiosInstance.get(EBackendServiceEndpoint.Template, options),
};
