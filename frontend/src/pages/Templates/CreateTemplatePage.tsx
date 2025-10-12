import { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';

import { BackendService, TCreateTemplateAPIMethodPayload } from '#api';

export const CreateTemplatePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const values: TCreateTemplateAPIMethodPayload = {
      description: String(form.get('description') ?? ''),
      name: String(form.get('name') ?? ''),
      path: String(form.get('path') ?? ''),
      relatedProjectId: String(projectId),
      schema: String(form.get('schema') ?? ''),
      tags: String(form.get('tags') ?? '')
        .split(',')
        .map(tag => tag.trim()),
    };

    await BackendService.createTemplate({
      body: { data: values },
    })
      .then(response => {
        navigate(`/app/projects/${projectId}/templates/${response.data.id}`);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Template</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <label
          htmlFor='name'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Name
          <input type='text' name='name' required />
        </label>

        <label
          htmlFor='tags'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Tags (comma-separated)
          <input type='text' name='tags' />
        </label>

        <label
          htmlFor='path'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Path
          <input type='text' name='path' />
        </label>

        <label
          htmlFor='description'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Description
          <input type='text' name='description' />
        </label>

        <label
          htmlFor='schema'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Schema (JSON string)
          <textarea name='schema' rows={4} />
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type='submit' style={{ padding: '8px 12px' }}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
