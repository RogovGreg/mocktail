import { axiosInstance } from '#api/api';

import { EBackendServiceEndpoint } from './inner-types';
import { TBackendService } from './types';

export const BackendService: TBackendService = {
  checkAvailability: options =>
    axiosInstance.get(EBackendServiceEndpoint.CheckAvailability, options),

  createProject: (_queryParams, payload, options) =>
    axiosInstance.post(EBackendServiceEndpoint.Project, payload, options),

  deleteProject: queryParams =>
    axiosInstance.delete(
      EBackendServiceEndpoint.ProjectItem.replace(':id', queryParams.id as string),
    ),
  getProjectByID: queryParams =>
    axiosInstance.get(
      EBackendServiceEndpoint.ProjectItem.replace(':id', queryParams.id as string),
    ),
  updateProject: (queryParams, payload) =>
    axiosInstance.put(
      EBackendServiceEndpoint.ProjectItem.replace(':id', queryParams.id as string),
      payload,
    ),
  getProjectsList: options =>
    axiosInstance.get(EBackendServiceEndpoint.Project, options),

  createTemplate: (_queryParams, payload, options) =>
    axiosInstance.post(EBackendServiceEndpoint.Template, payload, options),
  deleteTemplate: queryParams =>
    axiosInstance.delete(
      EBackendServiceEndpoint.TemplateItem.replace(':id', queryParams.Id as string),
    ),
  getTemplateByID: queryParams =>
    axiosInstance.get(
      EBackendServiceEndpoint.TemplateItem.replace(':id', queryParams.Id as string),
    ),
  updateTemplate: (queryParams, payload) =>
    axiosInstance.put(
      EBackendServiceEndpoint.TemplateItem.replace(':id', queryParams.Id as string),
      payload,
    ),

  getTemplatesList: options =>
    axiosInstance.get(EBackendServiceEndpoint.Template, options),
};
