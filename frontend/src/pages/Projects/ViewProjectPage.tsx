import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { BackendService, TProject } from '#api';

export const ViewProjectPage: FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

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

  return (
    <div>
      <h1>View Project</h1>
      {project ? (
        <div>
          <h2>{project.title}</h2>
          <p>{project.description || 'No description'}</p>
        </div>
      ) : (
        <p>Loading project...</p>
      )}
    </div>
  );
};
