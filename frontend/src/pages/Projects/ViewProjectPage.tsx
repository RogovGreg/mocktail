import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { BackendService, TProject } from '#api';

export const ViewProjectPage: FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const navigate = useNavigate();

  const [project, setProject] = useState<TProject | null>(null);

  useEffect(() => {
    if (!projectId) {
      // eslint-disable-next-line no-console
      console.error('Project ID is required');
      return;
    }

    BackendService.getProjectByID({ path: { params: { id: projectId } } })
      .then(response => {
        setProject(response.data);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch project', error);
      });
  }, [projectId]);

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

  return (
    <div className='container mx-auto p-6 w-full'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>{project.title}</h1>
        <div className='text-sm text-base-content/50'>ID: {project.id}</div>
      </div>

      <div className='stats stats-vertical lg:stats-horizontal shadow w-full'>
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
        <h3 className='text-lg font-semibold mb-3'>Keywords</h3>
        <div className='flex flex-wrap gap-2'>
          {project.keyWords && project.keyWords.length > 0 ? (
            project.keyWords.map(keyword => (
              <span key={keyword} className='badge badge-primary badge-outline'>
                {keyword}
              </span>
            ))
          ) : (
            <span className='text-base-content/50 italic'>No keywords</span>
          )}
        </div>
      </div>

      <div className='space-y-8'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-3'>Description</h2>
          <p className='text-base-content/80 leading-relaxed'>
            {project.description || (
              <span className='text-base-content/50 italic'>
                No description provided
              </span>
            )}
          </p>
        </div>

        <div className='flex justify-end gap-4'>
          <button
            type='button'
            className='btn btn-outline'
            onClick={() => navigate(`/app/projects/${projectId}/edit`)}
          >
            Edit Project
          </button>
          <button type='button' className='btn btn-outline' disabled>
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};
