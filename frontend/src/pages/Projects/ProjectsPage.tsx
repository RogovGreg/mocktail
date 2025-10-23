import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { BackendService } from '#api';
import { TProject } from '#api/services/BackendService/types';
import { CustomInput } from '#common-components';
import {
  DeleteIcon,
  EditIcon,
  EmptyListIcon,
  PlusIcon,
  SearchIcon,
  ViewIcon,
} from '#icons';
import { ERoutes } from '#src/router';

import { TProjectFiltersFormValues } from './types';

export const ProjectsPage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Array<TProject>>([]);

  useEffect(() => {
    BackendService.getProjectsList()
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch projects', error);
      });
  }, []);

  const handleDeleteProject = (projectId: string) => {
    BackendService.deleteProject({ path: { params: { id: projectId } } })
      .then(() => {
        setProjects(projects.filter(project => project.id !== projectId));
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to delete project', error);
      });
  };

  const onSearch = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const values: TProjectFiltersFormValues = {
      searchString: String(form.get('searchString') ?? ''),
    };

    const { searchString } = values || {};

    BackendService.getProjectsList({
      query: {
        params: {
          searchString,
        },
      },
    })
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch projects', error);
      });
  }, []);

  return (
    <div className='container mx-auto p-6 w-full box-border'>
      <form onSubmit={onSearch} className='flex justify-center m-6'>
        <div className='join w-full max-w-2xl'>
          <CustomInput
            helperText='Search by partial name, exact keyword or ID'
            name='searchString'
            placeholder='Enter your search request...'
            rewriteWrapperClassName
            wrapperClassName='join-item flex-1'
            wrapperStyle={{
              background: 'transparent',
              border: 'none',
              margin: 0,
              padding: 0,
            }}
            inputClassName='input-bordered join-item w-full'
            inputStyle={{ border: 'none' }}
          />
          <button type='submit' className='btn join-item'>
            <SearchIcon />
            Search
          </button>
          <button
            type='button'
            className='btn btn-primary join-item'
            onClick={() => navigate(ERoutes.ProjectCreate)}
          >
            <PlusIcon />
            Create New Project
          </button>
        </div>
      </form>
      <div className='divider divider-start'>
        {projects.length > 0
          ? `Found ${projects.length} project${projects.length > 1 ? 's' : ''}`
          : null}
      </div>
      {projects.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='table table-zebra'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Updated At</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id} className='hover'>
                  <td>
                    <div className='font-bold'>{project.title}</div>
                    <div className='text-sm opacity-50'>{project.id}</div>
                  </td>
                  <td>
                    <div className='max-w-xs truncate'>
                      {project.description || 'No description'}
                    </div>
                  </td>
                  <td>
                    <div className='text-sm'>
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className='text-sm'>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        className='btn btn-ghost btn-sm btn-square tooltip tooltip-left'
                        data-tip='View'
                        onClick={() => navigate(`/app/projects/${project.id}`)}
                      >
                        <ViewIcon />
                      </button>
                      <button
                        type='button'
                        className='btn btn-ghost btn-sm btn-square tooltip tooltip-left'
                        data-tip='Edit'
                        onClick={() =>
                          navigate(`/app/projects/${project.id}?edit=true`)
                        }
                      >
                        <EditIcon />
                      </button>
                      <button
                        type='button'
                        className='btn btn-error btn-sm btn-square tooltip tooltip-left'
                        data-tip='Delete'
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='text-center py-12'>
          <div className='text-gray-500 mb-4'>
            <EmptyListIcon />
          </div>
          <p className='text-lg font-semibold text-base-content'>
            No projects found
          </p>
          <p className='text-sm text-base-content/70 mt-2'>
            Create your first project to get started
          </p>
          <button
            type='button'
            className='btn btn-primary mt-4'
            onClick={() => navigate(ERoutes.ProjectCreate)}
          >
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
};
