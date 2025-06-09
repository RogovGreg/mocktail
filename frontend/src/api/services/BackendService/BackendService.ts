import { axiosInstance } from '#api/api';

import { EBackendServiceEndpoint } from './inner-types';
import { TBackendService } from './types';

export const BackendService: TBackendService = {
  checkAvailability: options =>
    axiosInstance.get(EBackendServiceEndpoint.CheckAvailability, options),
  getTemplates: (options: any) =>
    axiosInstance.get(EBackendServiceEndpoint.GetTemplates, options),
  creteTemplate: (data, options) =>
    axiosInstance.post(EBackendServiceEndpoint.CreateTemplate, data, options),
  updateTemplate: (templateId, data, options) =>
    axiosInstance.put(
      EBackendServiceEndpoint.UpdateTemplate.replace(':templateId', templateId),
      data,
      options,
    ),
  deleteTemplate: (templateId, options) =>
    axiosInstance.delete(
      EBackendServiceEndpoint.DeleteTemplate.replace(':templateId', templateId),
      options,
    ),
};
