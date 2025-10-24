import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { TUseTemplatesItemQuery, TUseTemplatesListQuery } from './types';
import { BackendService } from '../BackendService';

export const useTemplatesListQuery: TUseTemplatesListQuery = (
  params,
  options,
) =>
  useQuery({
    queryFn: () =>
      BackendService.getTemplatesList(
        params
          ? {
              query: {
                params,
              },
            }
          : undefined,
      ).then(response => response.data),
    queryKey: ['getTemplatesList', params],
    ...options,
  });

export const useTemplatesItemQuery: TUseTemplatesItemQuery = (
  params,
  options,
) =>
  useQuery({
    queryFn: () =>
      BackendService.getTemplateByID(
        params
          ? {
              path: {
                params,
              },
            }
          : undefined,
      ).then(response => response.data),
    queryKey: ['getTemplatesItem', params],
    ...options,
  });

export const useTemplatesCreationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BackendService.createTemplate,
    mutationKey: ['createTemplate'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] === 'getTemplatesList',
      });
    },
  });
};

export const useTemplatesDeletionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BackendService.deleteTemplate,
    mutationKey: ['deleteTemplate'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] === 'getTemplatesList',
      });
    },
  });
};

export const useTemplatesEditionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BackendService.updateTemplate,
    mutationKey: ['editTemplate'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] === 'getTemplatesList',
      });
    },
  });
};
