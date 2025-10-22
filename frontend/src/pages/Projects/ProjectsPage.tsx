import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { BackendService } from '#api';
import { TProject } from '#api/services/BackendService/types';
import { CustomInput } from '#common-components';
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
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            Search
          </button>
          <button
            type='button'
            className='btn btn-primary join-item'
            onClick={() => navigate(ERoutes.ProjectCreate)}
          >
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
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
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                      </button>
                      <button
                        type='button'
                        className='btn btn-ghost btn-sm btn-square tooltip tooltip-left'
                        data-tip='Edit'
                        onClick={() =>
                          navigate(`/app/projects/${project.id}?edit=true`)
                        }
                      >
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                      </button>
                      <button
                        type='button'
                        className='btn btn-error btn-sm btn-square tooltip tooltip-left'
                        data-tip='Delete'
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
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
            <svg
              className='w-16 h-16 mx-auto mb-4 opacity-50'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              />
            </svg>
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
