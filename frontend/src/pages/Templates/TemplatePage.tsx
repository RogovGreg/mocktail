import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import {
  BackendService,
  TTemplate,
  useTemplatesDeletionMutation,
  useTemplatesEditionMutation,
} from '#api';
import { CrossIcon } from '#icons';

export const TemplatePage: FC = () => {
  const { projectId, templateId } = useParams<{
    projectId: string;
    templateId: string;
  }>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const templatesEditionMutation = useTemplatesEditionMutation();
  const templatesDeletionMutation = useTemplatesDeletionMutation();

  const [template, setTemplate] = useState<TTemplate | null>(null);
  const [editedTemplate, setEditedTemplate] = useState<TTemplate | null>(null);
  const [newTag, setNewTag] = useState('');

  const isEditing = Boolean(editedTemplate);

  useEffect(() => {
    if (!templateId) {
      // eslint-disable-next-line no-console
      console.error('Template ID is required');
      return;
    }

    BackendService.getTemplateByID({ path: { params: { id: templateId } } })
      .then(response => {
        setTemplate(response.data);

        if (searchParams.get('edit') === 'true') {
          setEditedTemplate(response.data);
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch template', error);
      });
  }, [templateId, searchParams]);

  const handleEditMode = () => {
    if (template) {
      setEditedTemplate({ ...template });
      setSearchParams({ edit: 'true' });
    }
  };

  const handleCancelEdit = () => {
    setEditedTemplate(null);
    setSearchParams({});
    setNewTag('');
  };

  const handleSaveChanges = async () => {
    if (!editedTemplate || !templateId) return;

    try {
      await templatesEditionMutation.mutateAsync(
        {
          body: { data: editedTemplate },
          path: { params: { id: templateId } },
        },
        {
          onSuccess: () => {
            setEditedTemplate(null);
            setSearchParams({});
          },
        },
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update template', error);
    }
  };

  const onTemplateDelete = useCallback(() => {
    if (templateId) {
      templatesDeletionMutation.mutate(
        {
          path: { params: { id: templateId } },
        },
        {
          onSuccess: () => {
            navigate(`/app/projects/${projectId}/templates`);
          },
        },
      );
    }
  }, [navigate, projectId, templateId, templatesDeletionMutation]);

  const handleAddTag = () => {
    if (!newTag.trim() || !editedTemplate) return;

    setEditedTemplate({
      ...editedTemplate,
      tags: [...(editedTemplate.tags || []), newTag.trim()],
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    if (!editedTemplate) return;

    setEditedTemplate({
      ...editedTemplate,
      tags: editedTemplate.tags?.filter(t => t !== tag) || [],
    });
  };

  const handleGenerateData = () => {
    if (templateId) {
      BackendService.generateDataByTemplateID({
        path: { params: { id: templateId } },
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to generate data', error);
      });
    }
  };

  if (!template) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='flex flex-col items-center gap-4'>
          <span className='loading loading-spinner loading-lg' />
          <p className='text-base-content/70'>Loading template...</p>
        </div>
      </div>
    );
  }

  const currentTemplate = editedTemplate || template;

  return (
    <div className='container mx-auto p-6 w-full'>
      <div className='mb-8'>
        {isEditing ? (
          <input
            type='text'
            value={currentTemplate.name}
            onChange={e =>
              setEditedTemplate({ ...editedTemplate!, name: e.target.value })
            }
            className='input input-bordered text-4xl font-bold mb-2 w-full'
            placeholder='Template name'
          />
        ) : (
          <h1 className='text-4xl font-bold mb-2'>{currentTemplate.name}</h1>
        )}
        <div className='text-sm text-base-content/50'>ID: {template.id}</div>
      </div>

      <div className='stats stats-vertical lg:stats-horizontal shadow w-full mb-6'>
        <div className='stat'>
          <div className='stat-title'>Created</div>
          <div className='stat-value text-primary text-lg'>
            {new Date(template.createdAt).toLocaleDateString()}
          </div>
          <div className='stat-desc'>by {template.createdBy}</div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Last Updated</div>
          <div className='stat-value text-secondary text-lg'>
            {new Date(template.updatedAt).toLocaleDateString()}
          </div>
          <div className='stat-desc'>by {template.updatedBy}</div>
        </div>
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-3'>Path</h3>
        {isEditing ? (
          <input
            type='text'
            value={currentTemplate.path || ''}
            onChange={e =>
              setEditedTemplate({ ...editedTemplate!, path: e.target.value })
            }
            className='input input-bordered w-full'
            placeholder='Template path'
          />
        ) : (
          <p className='text-base-content/80 leading-relaxed font-mono bg-base-200 p-3 rounded'>
            {currentTemplate.path || (
              <span className='text-base-content/50 italic'>
                No path specified
              </span>
            )}
          </p>
        )}
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-3'>Tags</h3>
        <div className='flex flex-wrap gap-2 mb-3'>
          {currentTemplate.tags && currentTemplate.tags.length > 0 ? (
            currentTemplate.tags.map(tag => (
              <span
                key={tag}
                className='badge badge-primary badge-outline gap-2'
              >
                {tag}
                {isEditing && (
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag)}
                    className='btn btn-ghost btn-xs btn-circle'
                  >
                    <CrossIcon />
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className='text-base-content/50 italic'>No tags</span>
          )}
        </div>

        {isEditing && (
          <div className='flex gap-2'>
            <input
              type='text'
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddTag()}
              className='input input-bordered input-sm flex-1'
              placeholder='Add new tag'
            />
            <button
              type='button'
              onClick={handleAddTag}
              className='btn btn-primary btn-sm'
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className='space-y-8'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-3'>Description</h2>
          {isEditing ? (
            <textarea
              value={currentTemplate.description || ''}
              onChange={e =>
                setEditedTemplate({
                  ...editedTemplate!,
                  description: e.target.value,
                })
              }
              className='textarea textarea-bordered w-full h-32'
              placeholder='Template description'
            />
          ) : (
            <p className='text-base-content/80 leading-relaxed'>
              {currentTemplate.description || (
                <span className='text-base-content/50 italic'>
                  No description provided
                </span>
              )}
            </p>
          )}
        </div>

        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-3'>Schema (TypeScript)</h2>
          {isEditing ? (
            <textarea
              value={currentTemplate.schema || ''}
              onChange={e =>
                setEditedTemplate({
                  ...editedTemplate!,
                  schema: e.target.value,
                })
              }
              className='textarea textarea-bordered w-full h-48 font-mono text-sm'
              placeholder='Enter TypeScript schema'
            />
          ) : (
            <div className='bg-base-200 p-4 rounded-lg'>
              {currentTemplate.schema ? (
                <pre className='text-sm overflow-x-auto'>
                  {currentTemplate.schema}
                </pre>
              ) : (
                <span className='text-base-content/50 italic'>
                  No schema provided
                </span>
              )}
            </div>
          )}
        </div>

        {template.usedIn && template.usedIn.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-3'>Used In</h2>
            <div className='flex flex-wrap gap-2'>
              {template.usedIn.map((location, index) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className='badge badge-secondary badge-outline'
                >
                  {location}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className='flex justify-end gap-4'>
          {isEditing ? (
            <>
              <button
                type='button'
                className='btn btn-outline'
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                type='button'
                className='btn btn-outline'
                onClick={handleGenerateData}
              >
                Generate Data
              </button>
              <button
                type='button'
                className='btn btn-outline'
                onClick={() => navigate(`/app/projects/${projectId}/templates`)}
              >
                Back to Templates
              </button>
              <button
                type='button'
                className='btn btn-outline'
                onClick={handleEditMode}
              >
                Edit Template
              </button>
              <button
                type='button'
                className='btn btn-error'
                onClick={onTemplateDelete}
              >
                Delete Template
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
