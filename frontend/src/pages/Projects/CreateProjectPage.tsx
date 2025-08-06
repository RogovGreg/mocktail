import { useNavigate } from 'react-router';

import { BackendService, TCreateProjectAPIMethodPayload } from '#api';
import { ERoutes } from '#src/router';

export const CreateProjectPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: TCreateProjectAPIMethodPayload = {
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
    };
    BackendService.createProject(null, values)
      .then(response => {
        console.log('Project created successfully:', response.data);
        // TODO Navigate to the project details page
        navigate(ERoutes.Projects);
      })
      .catch(error => {
        console.error('Error creating project:', error);
        // Optionally, show an error message
      });
  };

  return (
    <div>
      <h1>Create New Project</h1>
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
