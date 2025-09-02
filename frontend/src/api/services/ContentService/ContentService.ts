import { EContentServiceEndpoint } from './inner-types';
import { TContentService } from './types';
import { axiosInstance } from '../../api';

export const ContentService: TContentService = {
  checkAvailability: config =>
    axiosInstance.get(
      EContentServiceEndpoint.CheckAvailability,
      config?.options,
    ),
};
