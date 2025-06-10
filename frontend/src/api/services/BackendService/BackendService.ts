import { axiosInstance } from '#api/api';

import { EBackendServiceEndpoint } from './inner-types';
import { TBackendService } from './types';

export const BackendService: TBackendService = {
  checkAvailability: options =>
    axiosInstance.get(EBackendServiceEndpoint.CheckAvailability, options),

  createTemplate: (_queryParams, payload, options) =>
    axiosInstance.post(EBackendServiceEndpoint.Template, payload, options),
  deleteTemplate: (queryParams, _payload, options) =>
    axiosInstance.delete(EBackendServiceEndpoint.Template, {
      ...options,
      params: { id: queryParams.Id },
    }),
  getTemplateByID: queryParams =>
    axiosInstance.get(EBackendServiceEndpoint.TemplateItem, {
      params: {
        id: queryParams.Id,
      },
    }),
  updateTemplate: (queryParams, payload) =>
    axiosInstance.put(EBackendServiceEndpoint.TemplateItem, payload, {
      params: {
        id: queryParams.Id,
      },
    }),

  getTemplatesList: options =>
    axiosInstance.get(EBackendServiceEndpoint.Template, options),
};
