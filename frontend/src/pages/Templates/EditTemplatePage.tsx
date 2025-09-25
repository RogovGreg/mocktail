import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  BackendService,
  TCreateTemplateAPIMethodPayload,
  TTemplate,
} from '#api';

export const EditTemplatePage = () => {
  const { projectId, templateId } = useParams();

  const navigate = useNavigate();

  const [initialStateOfEditedTemplate, setInitialStateOfEditedTemplate] =
    useState<TTemplate | null>(null);

  useEffect(() => {
    if (templateId) {
      BackendService.getTemplateByID({
        path: { params: { id: String(templateId) } },
      }).then(response => {
        setInitialStateOfEditedTemplate(response.data);
      });
    }
  }, [projectId, templateId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

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

    try {
      await BackendService.updateTemplate({
        body: { data: values },
        path: { params: { id: String(templateId) } },
      }).then(() => {
        navigate(`/app/projects/${projectId}/templates/${templateId}`);
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Template</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <label
          htmlFor='name'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Name
          <input
            type='text'
            name='name'
            required
            defaultValue={initialStateOfEditedTemplate?.name || undefined}
          />
        </label>

        <label
          htmlFor='tags'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Tags (comma-separated)
          <input
            type='text'
            name='tags'
            defaultValue={initialStateOfEditedTemplate?.tags || undefined}
          />
        </label>

        <label
          htmlFor='path'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Path
          <input
            type='text'
            name='path'
            defaultValue={initialStateOfEditedTemplate?.path || undefined}
          />
        </label>

        <label
          htmlFor='description'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Description
          <input
            type='text'
            name='description'
            defaultValue={
              initialStateOfEditedTemplate?.description || undefined
            }
          />
        </label>

        <label
          htmlFor='schema'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Schema (JSON string)
          <textarea
            name='schema'
            rows={4}
            defaultValue={initialStateOfEditedTemplate?.schema || undefined}
          />
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type='submit' style={{ padding: '8px 12px' }}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
