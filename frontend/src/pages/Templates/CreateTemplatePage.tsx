import { FormEvent } from 'react';
import { useParams } from 'react-router';

import { BackendService, TCreateTemplateAPIMethodPayload } from '#api';

export const CreateTemplatePage = () => {
  const { projectId } = useParams();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const values: TCreateTemplateAPIMethodPayload = {
      description: String(form.get('description') ?? ''),
      keyWords: String(form.get('keyWords') ?? '')
        .split(',')
        .map(s => s.trim()),
      name: String(form.get('name') ?? ''),
      relatedProjectId: String(projectId),
      schema: String(form.get('schema') ?? ''),
    };

    try {
      const created = await BackendService.createTemplate({
        body: { data: values },
      });
      console.log('Created:', created);
    } catch (err) {
      console.error(err);
    }
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
          htmlFor='description'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Description
          <input type='text' name='description' />
        </label>

        <label
          htmlFor='keyWords'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Key Words (comma-separated)
          <input type='text' name='keyWords' />
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
