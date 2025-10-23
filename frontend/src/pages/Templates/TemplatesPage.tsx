import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';

import { BackendService, TTemplate } from '#api';
import { CustomInput } from '#common-components';
import {
  DeleteIcon,
  EditIcon,
  EmptyListIcon,
  PlusIcon,
  SearchIcon,
  ViewIcon,
} from '#icons';

import { TFilterTemplateFormValues } from './types';

export const TemplatesPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<TTemplate[]>([]);

  useEffect(() => {
    if (projectId) {
      BackendService.getTemplatesList({
        query: { params: { relatedProjectIds: [projectId] } },
      })
        .then(response => {
          setTemplates(response.data);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch templates', error);
        });
    }
  }, [projectId]);

  const handleDeleteTemplate = (templateId: string) => {
    BackendService.deleteTemplate({ path: { params: { id: templateId } } })
      .then(() => {
        setTemplates(templates.filter(template => template.id !== templateId));
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to delete template', error);
      });
  };

  const onSearch = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      const values: TFilterTemplateFormValues = {
        searchString: String(form.get('searchString') ?? ''),
      };

      const { searchString } = values || {};

      if (projectId) {
        BackendService.getTemplatesList({
          query: {
            params: {
              relatedProjectIds: [projectId],
              searchString,
            },
          },
        })
          .then(response => {
            setTemplates(response.data);
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.error('Failed to fetch templates', error);
          });
      }
    },
    [projectId],
  );

  return (
    <div className='container mx-auto p-6 w-full box-border'>
      <form onSubmit={onSearch} className='flex justify-center m-6'>
        <div className='join w-full max-w-2xl'>
          <CustomInput
            helperText='Search by partial name or path, exact tag or ID'
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
            inputStyle={{
              border: 'none',
            }}
          />
          <button type='submit' className='btn join-item'>
            <SearchIcon />
            Search
          </button>
          <button
            type='button'
            className='btn btn-primary join-item'
            onClick={() =>
              navigate(`/app/projects/${projectId}/templates/create`)
            }
          >
            <PlusIcon />
            Create New Template
          </button>
        </div>
      </form>

      <div className='divider divider-start'>
        {templates.length > 0
          ? `Found ${templates.length} template${templates.length > 1 ? 's' : ''}`
          : null}
      </div>

      {templates.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='table table-zebra'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Tags</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template.id} className='hover'>
                  <td>
                    <div className='font-bold'>{template.name}</div>
                    <div className='text-sm opacity-50'>{template.id}</div>
                  </td>
                  <td>
                    <div className='max-w-xs truncate'>
                      {template.description || 'No description'}
                    </div>
                  </td>
                  <td>
                    <div className='flex flex-wrap gap-1'>
                      {template.tags && template.tags.length > 0 ? (
                        template.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className='badge badge-outline badge-sm'
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className='text-sm opacity-50'>No tags</span>
                      )}
                      {template.tags && template.tags.length > 3 && (
                        <span className='badge badge-outline badge-sm'>
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className='text-sm'>
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        className='btn btn-ghost btn-sm btn-square tooltip tooltip-left'
                        data-tip='View'
                        onClick={() =>
                          navigate(
                            `/app/projects/${projectId}/templates/${template.id}`,
                          )
                        }
                      >
                        <ViewIcon />
                      </button>
                      <button
                        type='button'
                        className='btn btn-ghost btn-sm btn-square tooltip tooltip-left'
                        data-tip='Edit'
                        onClick={() =>
                          navigate(
                            `/app/projects/${projectId}/templates/${template.id}?edit=true`,
                          )
                        }
                      >
                        <EditIcon />
                      </button>
                      <button
                        type='button'
                        className='btn btn-error btn-sm btn-square tooltip tooltip-left'
                        data-tip='Delete'
                        onClick={() => handleDeleteTemplate(template.id)}
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
            No templates found
          </p>
          <p className='text-sm text-base-content/70 mt-2'>
            Create your first template to get started
          </p>
          <button
            type='button'
            className='btn btn-primary mt-4'
            onClick={() =>
              navigate(`/app/projects/${projectId}/templates/create`)
            }
          >
            Create New Template
          </button>
        </div>
      )}
      <Outlet />
    </div>
  );
};
