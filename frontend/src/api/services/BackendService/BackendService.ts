import { EBackendServiceEndpoint } from './inner-types';
import { TBackendService } from './types';
import { axiosInstance } from '../../api';
import { interpolateUrl } from '../../helpers';

export const BackendService: TBackendService = {
  checkAvailability: config =>
    axiosInstance.get(
      EBackendServiceEndpoint.CheckAvailability,
      config?.options,
    ),

  createProject: config =>
    axiosInstance.post(
      EBackendServiceEndpoint.Project,
      config?.body?.data,
      config?.options,
    ),
  deleteProject: config =>
    axiosInstance.delete(
      interpolateUrl(EBackendServiceEndpoint.ProjectItem, {
        id: String(config?.path?.params?.id),
      }),
      config?.options,
    ),
  getProjectByID: config =>
    axiosInstance.get(
      interpolateUrl(EBackendServiceEndpoint.ProjectItem, {
        id: String(config?.path?.params?.id),
      }),
      config?.options,
    ),
  getProjectsList: config =>
    axiosInstance.get(
      EBackendServiceEndpoint.Project,

      {
        ...config?.options,
        params: config?.query?.params,
      },
    ),
  updateProject: config =>
    axiosInstance.put(
      interpolateUrl(EBackendServiceEndpoint.ProjectItem, {
        id: String(config?.path?.params?.id),
      }),
      config?.body?.data,
      config?.options,
    ),

  createTemplate: config =>
    axiosInstance.post(
      EBackendServiceEndpoint.Template,
      config?.body?.data,
      config?.options,
    ),
  deleteTemplate: config =>
    axiosInstance.delete(
      interpolateUrl(EBackendServiceEndpoint.TemplateItem, {
        id: String(config?.path?.params?.id),
      }),
      config?.options,
    ),
  getTemplateByID: config =>
    axiosInstance.get(
      interpolateUrl(EBackendServiceEndpoint.TemplateItem, {
        id: String(config?.path?.params?.id),
      }),
      config?.options,
    ),
  getTemplatesList: config =>
    axiosInstance.get(EBackendServiceEndpoint.Template, {
      ...config?.options,
      params: config?.query?.params,
    }),
  updateTemplate: config =>
    axiosInstance.put(
      interpolateUrl(EBackendServiceEndpoint.TemplateItem, {
        id: String(config?.path?.params?.id),
      }),
      config?.body?.data,
      config?.options,
    ),
};
