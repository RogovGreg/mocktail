import { axiosInstance } from '#api/api';

import { EBackendServiceEndpoint } from './inner-types';
import { TBackendService } from './types';

export const BackendService: TBackendService = {
  checkAvailability: options =>
    axiosInstance.get(EBackendServiceEndpoint.CheckAvailability, options),

  createTemplate: (_queryParams, payload, options) =>
    axiosInstance.post(EBackendServiceEndpoint.Template, payload, options),
  deleteTemplate: queryParams =>
    axiosInstance.delete(
      EBackendServiceEndpoint.TemplateItem.replace(':id', queryParams.Id),
    ),
  getTemplateByID: queryParams =>
    axiosInstance.get(
      EBackendServiceEndpoint.TemplateItem.replace(':id', queryParams.Id),
    ),
  updateTemplate: (queryParams, payload) =>
    axiosInstance.put(
      EBackendServiceEndpoint.TemplateItem.replace(':id', queryParams.Id),
      payload,
    ),

  getTemplatesList: options =>
    axiosInstance.get(EBackendServiceEndpoint.Template, options),
};
