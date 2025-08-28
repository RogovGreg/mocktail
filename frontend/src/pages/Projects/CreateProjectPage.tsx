import { FC } from 'react';
import { useNavigate } from 'react-router';

import { BackendService, TCreateProjectAPIMethodPayload } from '#api';

export const CreateProjectPage: FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: TCreateProjectAPIMethodPayload = {
      description: String(formData.get('description') ?? ''),
      title: String(formData.get('title') ?? ''),
    };
    BackendService.createProject({ body: { data: values } })
      .then(response => {
        navigate(`/app/projects/${response.data.id}`);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error creating project:', error);
      });
  };

  return (
    <div>
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor='title'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Title
          <input type='text' name='title' required />
        </label>

        <label
          htmlFor='description'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Description
          <textarea name='description' rows={4} />
        </label>
        <button type='submit'>Create Project</button>
      </form>
    </div>
  );
};
