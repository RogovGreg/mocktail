import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Tooltip } from 'react-tooltip';

import {
  EContentGenerationStatus,
  ETemplateStatus,
  TTemplate,
  useTemplateGenerationMutation,
  useTemplatesDeletionMutation,
  useTemplatesEditionMutation,
  useTemplatesItemQuery,
} from '#api';
import { CrossIcon } from '#icons';
import { toast } from '#src/common-functions';

export const TemplatePage: FC = () => {
  const { projectId, templateId } = useParams<{
    projectId: string;
    templateId: string;
  }>();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { data: template, refetch } = useTemplatesItemQuery(
    templateId ? { id: templateId } : undefined,
    { enabled: Boolean(templateId) },
  );

  const templatesEditionMutation = useTemplatesEditionMutation();
  const templatesDeletionMutation = useTemplatesDeletionMutation();
  const templateGenerationMutation = useTemplateGenerationMutation();

  const [editedTemplate, setEditedTemplate] = useState<TTemplate | null>(null);
  const [newTag, setNewTag] = useState('');

  const isEditing = Boolean(editedTemplate);
  const isGenerating = templateGenerationMutation.isPending;

  const statusConfig = useMemo(() => {
    const configs = {
      [ETemplateStatus.Draft]: {
        badgeClass: 'badge-warning',
        tooltip: 'Data has not been generated yet',
      },
      [ETemplateStatus.Published]: {
        badgeClass: 'badge-success',
        tooltip: 'Data has been generated for the current template version',
      },
      [ETemplateStatus.Stale]: {
        badgeClass: 'badge-error',
        tooltip:
          'No data or the Template has been modified since last data generation',
      },
    };
    return template ? configs[template.status] : configs[ETemplateStatus.Draft];
  }, [template]);

  const contentStatusConfig = useMemo(() => {
    if (!template?.contentStatus) return null;

    const configs = {
      [EContentGenerationStatus.Pending]: {
        badgeClass: 'badge-warning',
        tooltip: 'Generation is not completed',
      },
      [EContentGenerationStatus.Completed]: {
        badgeClass: 'badge-success',
        tooltip: `The data was successfully generated on ${
          template.lastGeneratedAt
            ? new Date(template.lastGeneratedAt).toLocaleString()
            : "'N/A'"
        } for version ${template.latestGeneratedVersion}`,
      },
      [EContentGenerationStatus.Failed]: {
        badgeClass: 'badge-error',
        tooltip: 'An unknown error occurred during generation',
      },
    };
    return configs[template.contentStatus];
  }, [template]);

  useEffect(() => {
    if (template && searchParams.get('edit') === 'true') {
      setEditedTemplate({ ...template });
    }
  }, [template, searchParams]);

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
            refetch();
          },
        },
      );
    } catch (error) {
      toast.error('Failed to update template.');
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
    if (!templateId) return;

    templateGenerationMutation.mutate(
      {
        path: { params: { id: templateId } },
      },
      {
        onError: () => {
          toast.error('Failed to generate data.');
        },
        onSuccess: () => {
          refetch();
        },
      },
    );
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

  const currentTemplate: TTemplate = editedTemplate || template;

  const {
    contentStatus: currentTemplateContentStatus,
    createdAt: currentTemplateCreatedAt,
    createdBy: currentTemplateCreatedBy,
    description: currentTemplateDescription,
    id: currentTemplateID,
    name: currentTemplateName,
    path: currentTemplatePath,
    schema: currentTemplateSchema,
    status: currentTemplateStatus,
    tags: currentTemplateTags,
    updatedAt: currentTemplateUpdatedAt,
    updatedBy: currentTemplateUpdatedBy,
    version: currentTemplateVersion,
  } = currentTemplate;

  return (
    <div className='container mx-auto p-6 w-full overflow-hidden'>
      <dialog className={`modal ${isGenerating ? 'modal-open' : ''}`}>
        <div className='modal-box'>
          <h3 className='font-bold text-lg mb-4'>Generating Data</h3>
          <div className='flex flex-col items-center gap-4 py-4'>
            <span className='loading loading-spinner loading-lg' />
            <p className='text-base-content/70'>
              Please wait while we generate data for your template...
            </p>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button type='button' aria-label='Close modal'>
            close
          </button>
        </form>
      </dialog>

      <div className='mb-8 flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0 overflow-hidden'>
          {isEditing ? (
            <input
              type='text'
              value={currentTemplateName}
              onChange={event =>
                setEditedTemplate({
                  ...editedTemplate!,
                  name: event.target.value,
                })
              }
              className='input input-bordered text-4xl font-bold mb-2 w-full'
              placeholder='Template name'
            />
          ) : (
            <div
              className='tooltip tooltip-bottom'
              data-tip={currentTemplateName}
            >
              <h1 className='text-4xl font-bold mb-2 truncate block'>
                {currentTemplateName}
              </h1>
            </div>
          )}
          <div className='text-sm text-base-content/50'>
            ID: {currentTemplateID}
          </div>
          <div className='text-sm text-base-content/50'>
            Version: {currentTemplateVersion || 'N/A'}
          </div>
          <div className='mt-2 flex items-center gap-2'>
            <span className='text-sm text-base-content/50'>Status:</span>
            <span
              className={`badge ${statusConfig.badgeClass}`}
              data-tooltip-id='status-tooltip'
              data-tooltip-content={statusConfig.tooltip}
            >
              {currentTemplateStatus}
            </span>
          </div>
          {contentStatusConfig && (
            <div className='mt-2 flex items-center gap-2'>
              <span className='text-sm text-base-content/50'>
                Content Status:
              </span>
              <span
                className={`badge ${contentStatusConfig.badgeClass}`}
                data-tooltip-id='content-status-tooltip'
                data-tooltip-content={contentStatusConfig.tooltip}
              >
                {currentTemplateContentStatus}
              </span>
            </div>
          )}
        </div>

        <div className='flex gap-2 flex-shrink-0'>
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
                disabled={templatesEditionMutation.isPending}
              >
                {templatesEditionMutation.isPending ? (
                  <>
                    <span className='loading loading-spinner loading-sm' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type='button'
                className='btn tooltip tooltip-left'
                data-tip='Warning: AI models may make mistakes when generating data. MockTail cannot guarantee the accuracy of the results.'
                style={{ backgroundColor: 'var(--mt-color-quaternary-1)' }}
                onClick={handleGenerateData}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className='loading loading-spinner loading-sm' />
                    Generating...
                  </>
                ) : (
                  'Generate Data'
                )}
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
                disabled={templatesDeletionMutation.isPending}
              >
                {templatesDeletionMutation.isPending ? (
                  <>
                    <span className='loading loading-spinner loading-sm' />
                    Deleting...
                  </>
                ) : (
                  'Delete Template'
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className='stats stats-vertical lg:stats-horizontal shadow w-full mb-6'>
        <div className='stat'>
          <div className='stat-title'>Created</div>
          <div className='stat-value text-primary text-lg'>
            {new Date(currentTemplateCreatedAt).toLocaleDateString()}
          </div>
          <div className='stat-desc'>by {currentTemplateCreatedBy}</div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Last Updated</div>
          <div className='stat-value text-secondary text-lg'>
            {new Date(currentTemplateUpdatedAt).toLocaleDateString()}
          </div>
          <div className='stat-desc'>by {currentTemplateUpdatedBy}</div>
        </div>
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-3'>Path</h3>
        {isEditing ? (
          <input
            type='text'
            value={currentTemplatePath || ''}
            onChange={event =>
              setEditedTemplate({
                ...editedTemplate!,
                path: event.target.value,
              })
            }
            className='input input-bordered w-full'
            placeholder='Template path'
          />
        ) : (
          <p className='text-base-content/80 leading-relaxed font-mono bg-base-200 p-3 rounded'>
            {currentTemplatePath || (
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
          {currentTemplateTags && currentTemplateTags.length > 0 ? (
            currentTemplateTags.map(tag => (
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
              value={currentTemplateDescription || ''}
              onChange={event =>
                setEditedTemplate({
                  ...editedTemplate!,
                  description: event.target.value,
                })
              }
              className='textarea textarea-bordered w-full h-32'
              placeholder='Template description'
            />
          ) : (
            <p className='text-base-content/80 leading-relaxed'>
              {currentTemplateDescription || (
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
              value={currentTemplateSchema || ''}
              onChange={event =>
                setEditedTemplate({
                  ...editedTemplate!,
                  schema: event.target.value,
                })
              }
              className='textarea textarea-bordered w-full h-48 font-mono text-sm'
              placeholder='Enter TypeScript schema'
            />
          ) : (
            <div className='bg-base-200 p-4 rounded-lg'>
              {currentTemplateSchema ? (
                <pre className='text-sm overflow-x-auto'>
                  {currentTemplateSchema}
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
      </div>
      <Tooltip
        id='status-tooltip'
        place='right'
        style={{
          backgroundColor: 'hsl(var(--b2))',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          color: 'hsl(var(--bc))',
          fontSize: '0.875rem',
          padding: '0.5rem 1rem',
          zIndex: 9999,
        }}
        opacity={1}
      />
      <Tooltip
        id='content-status-tooltip'
        place='right'
        style={{
          backgroundColor: 'hsl(var(--b2))',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          color: 'hsl(var(--bc))',
          fontSize: '0.875rem',
          padding: '0.5rem 1rem',
          zIndex: 9999,
        }}
        opacity={1}
      />
    </div>
  );
};
