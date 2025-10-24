import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import {
  AuthService,
  BackendService,
  TProject,
  useProjectsDeletionMutation,
  useProjectsEditionMutation,
} from '#api';
import { CrossIcon } from '#icons';

export const ViewProjectPage: FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const projectsEditionMutation = useProjectsEditionMutation();
  const projectsDeletionMutation = useProjectsDeletionMutation();

  const [project, setProject] = useState<TProject | null>(null);
  const [editedProject, setEditedProject] = useState<TProject | null>(null);
  const [newKeyword, setNewKeyword] = useState('');

  const isEditing = Boolean(editedProject);

  useEffect(() => {
    if (!projectId) {
      // eslint-disable-next-line no-console
      console.error('Project ID is required');
      return;
    }

    BackendService.getProjectByID({ path: { params: { id: projectId } } })
      .then(response => {
        setProject(response.data);

        if (searchParams.get('edit') === 'true') {
          setEditedProject(response.data);
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch project', error);
      });

    AuthService.getProjectAccessTokens({ query: { params: { projectId } } });
  }, [projectId, searchParams]);

  const handleEditMode = () => {
    if (project) {
      setEditedProject({ ...project });
      setSearchParams({ edit: 'true' });
    }
  };

  const handleCancelEdit = () => {
    setEditedProject(null);
    setSearchParams({});
    setNewKeyword('');
  };

  const handleSaveChanges = async () => {
    if (!editedProject || !projectId) return;

    try {
      await projectsEditionMutation.mutateAsync(
        {
          body: { data: editedProject },
          path: { params: { id: projectId } },
        },
        {
          onSuccess: response => {
            setProject(response.data);
            setEditedProject(null);
            setSearchParams({});
          },
        },
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update project', error);
    }
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || !editedProject) return;

    setEditedProject({
      ...editedProject,
      keyWords: [...(editedProject.keyWords || []), newKeyword.trim()],
    });
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    if (!editedProject) return;

    setEditedProject({
      ...editedProject,
      keyWords: editedProject.keyWords?.filter(kw => kw !== keyword) || [],
    });
  };

  const onProjectDelete = useCallback(() => {
    if (projectId) {
      projectsDeletionMutation.mutate(
        {
          path: { params: { id: projectId } },
        },
        {
          onSuccess: () => navigate('/app/projects'),
        },
      );
    }
  }, [projectId, navigate, projectsDeletionMutation]);

  if (!project) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='flex flex-col items-center gap-4'>
          <span className='loading loading-spinner loading-lg' />
          <p className='text-base-content/70'>Loading project...</p>
        </div>
      </div>
    );
  }

  const currentProject: TProject = editedProject || project;

  return (
    <div className='container mx-auto p-6 w-full'>
      <div className='mb-8'>
        {isEditing ? (
          <input
            type='text'
            value={currentProject.title}
            onChange={event =>
              setEditedProject({ ...editedProject!, title: event.target.value })
            }
            className='input input-bordered text-2xl font-bold mb-2 w-full'
            placeholder='Project title'
          />
        ) : (
          <h1 className='text-2xl font-semibold mb-2'>
            {currentProject.title}
          </h1>
        )}
        <div className='text-sm text-base-content/50'>ID: {project.id}</div>
      </div>

      <div className='stats stats-vertical lg:stats-horizontal shadow w-full mb-2'>
        <div className='stat'>
          <div className='stat-title'>Created</div>
          <div className='stat-value text-primary text-lg'>
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div className='stat-desc'>by {project.createdBy}</div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Last Updated</div>
          <div className='stat-value text-secondary text-lg'>
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>
          <div className='stat-desc'>by {project.updatedBy}</div>
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-3'>Keywords</h2>
        <div className='flex flex-wrap gap-2 mb-3'>
          {currentProject.keyWords && currentProject.keyWords.length > 0 ? (
            currentProject.keyWords.map(keyword => (
              <span
                key={keyword}
                className='badge badge-primary badge-outline gap-2'
              >
                {keyword}
                {isEditing && (
                  <button
                    type='button'
                    onClick={() => handleRemoveKeyword(keyword)}
                    className='btn btn-ghost btn-xs btn-circle'
                  >
                    <CrossIcon />
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className='text-base-content/50 italic'>No keywords</span>
          )}
        </div>

        {isEditing && (
          <div className='flex gap-2'>
            <input
              type='text'
              value={newKeyword}
              onChange={event => setNewKeyword(event.target.value)}
              onKeyPress={event => event.key === 'Enter' && handleAddKeyword()}
              className='input input-bordered input-sm flex-1'
              placeholder='Add new keyword'
            />
            <button
              type='button'
              onClick={handleAddKeyword}
              className='btn btn-primary btn-sm'
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className='space-y-8'>
        <div className='mb-6'>
          <h2 className='text-lg font-semibold mb-3'>Description</h2>
          {isEditing ? (
            <textarea
              value={currentProject.description || ''}
              onChange={e =>
                setEditedProject({
                  ...editedProject!,
                  description: e.target.value,
                })
              }
              className='textarea textarea-bordered w-full h-32'
              placeholder='Project description'
            />
          ) : (
            <p className='text-base-content/80 leading-relaxed'>
              {currentProject.description || (
                <span className='text-base-content/50 italic'>
                  No description provided
                </span>
              )}
            </p>
          )}
        </div>

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
                onClick={() =>
                  navigate(`/app/projects/${projectId}/api-tokens`)
                }
              >
                Go to project&apos;s API tokens
              </button>
              <button
                type='button'
                className='btn btn-outline'
                onClick={() => navigate(`/app/projects/${projectId}/templates`)}
              >
                Go to project&apos;s templates
              </button>
              <button
                type='button'
                className='btn btn-outline'
                onClick={handleEditMode}
              >
                Edit Project
              </button>
              <button
                type='button'
                className='btn btn-error'
                onClick={onProjectDelete}
              >
                Delete Project
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
