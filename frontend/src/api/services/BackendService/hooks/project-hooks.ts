import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { TUseProjectsItemQuery, TUseProjectsListQuery } from './types';
import { BackendService } from '../BackendService';

export const useProjectsListQuery: TUseProjectsListQuery = (params, options) =>
  useQuery({
    queryFn: () =>
      BackendService.getProjectsList(
        params
          ? {
              query: {
                params,
              },
            }
          : undefined,
      ).then(response => response.data),
    queryKey: ['getProjectsList', params],
    ...options,
  });

export const useProjectsItemQuery: TUseProjectsItemQuery = (params, options) =>
  useQuery({
    queryFn: () =>
      BackendService.getProjectByID(
        params
          ? {
              path: {
                params,
              },
            }
          : undefined,
      ).then(response => response.data),
    queryKey: ['getProjectsItem', params],
    ...options,
  });

export const useProjectsCreationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BackendService.createProject,
    mutationKey: ['createProject'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] === 'getProjectsList',
      });
    },
  });
};

export const useProjectsDeletionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BackendService.deleteProject,
    mutationKey: ['deleteProject'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] === 'getProjectsList',
      });
    },
  });
};

export const useProjectsEditionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BackendService.updateProject,
    mutationKey: ['editProject'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] === 'getProjectsList',
      });
    },
  });
};
