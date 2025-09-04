import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { BackendService, TCreateProjectAPIMethodPayload, TProject } from '#api';

export const EditProjectPage: FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [initialStateOfEditedProject, setInitialStateOfEditedProject] =
    useState<TProject | null>(null);

  useEffect(() => {
    if (projectId) {
      BackendService.getProjectByID({ path: { params: { id: projectId } } })
        .then(response => {
          setInitialStateOfEditedProject(response.data);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch project', error);
        });
    }
  }, [projectId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: TCreateProjectAPIMethodPayload = {
      description: String(formData.get('description') ?? ''),
      title: String(formData.get('title') ?? ''),
    };

    BackendService.updateProject({
      body: { data: values },
      path: { params: { id: String(projectId) } },
    })
      .then(() => {
        navigate(`/app/projects/${projectId}`);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error creating project:', error);
      });
  };

  return (
    <div>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor='title'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Title
          <input
            type='text'
            name='title'
            required
            defaultValue={initialStateOfEditedProject?.title}
          />
        </label>

        <label
          htmlFor='description'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Description
          <textarea
            name='description'
            rows={4}
            defaultValue={initialStateOfEditedProject?.description || undefined}
          />
        </label>
        <button type='submit'>Update Project</button>
      </form>
    </div>
  );
};
