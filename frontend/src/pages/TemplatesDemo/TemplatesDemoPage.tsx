import { FormEvent, useEffect, useState } from 'react';

import {
  BackendService,
  TCreateTemplateAPIMethodPayload,
  TTemplate,
} from '#api';

export const TemplatesDemoPage = () => {
  const [id, setId] = useState<string>('');
  const [template, setTemplate] = useState<Partial<TTemplate>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(Boolean(id));
  }, [id]);

  const handleRequest = async () => {
    try {
      const response = await BackendService.getTemplateByID({ Id: id }, null);
      const {
        description,
        keyWords,
        name,
        relatedProjectId,
        schema,
        updatedAt,
        usedIn,
      } = response.data;

      setTemplate({
        Id: id,
        Schema: schema,
        Name: name,
        KeyWords: keyWords || [],
        Description: description,
        UpdatedAt: updatedAt,
        RelatedProjectId: relatedProjectId,
        UsedIn: usedIn,
      });
    } catch (error) {
      console.error('Template not found', error);
      setTemplate({});
    }
  };

  // Create or update on Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values: TCreateTemplateAPIMethodPayload = {
      Description: String(form.get('description') ?? ''),
      KeyWords: String(form.get('keyWords') ?? '')
        .split(',')
        .map(s => s.trim()),
      Name: String(form.get('name') ?? ''),
      RelatedProjectId: String(form.get('relatedProjectId') ?? ''),
      Schema: String(form.get('schema') ?? ''),
    };

    try {
      if (isEditing && id) {
        // updateTemplate uses query param Id, payload is same as create
        await BackendService.updateTemplate({ Id: id }, values);
        console.log('Updated:', values);
      } else {
        const created = await BackendService.createTemplate(null, values);
        console.log('Created:', created);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!id) return;
    try {
      await BackendService.deleteTemplate({ Id: id });
      console.log('Deleted template', id);
      setTemplate({});
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Templates Demo</h2>

      {/* ID + Request */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <input
          type='text'
          placeholder='Enter Template ID'
          value={id}
          onChange={e => setId(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button
          type='button'
          onClick={handleRequest}
          style={{ marginLeft: 10, padding: '8px 12px' }}
        >
          Request
        </button>
      </div>

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
            defaultValue={template.Name ?? ''}
            required
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
            defaultValue={template.Description ?? ''}
          />
        </label>

        <label
          htmlFor='keyWords'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Key Words (comma-separated)
          <input
            type='text'
            name='keyWords'
            defaultValue={(template.KeyWords ?? []).join(', ')}
          />
        </label>

        <label
          htmlFor='schema'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Schema (JSON string)
          <textarea
            name='schema'
            defaultValue={template.Schema ?? ''}
            rows={4}
          />
        </label>

        <label
          htmlFor='relatedProjectId'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Related Project ID
          <input
            type='text'
            name='relatedProjectId'
            defaultValue={template.RelatedProjectId ?? ''}
            required
          />
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type='submit' style={{ padding: '8px 12px' }}>
            {isEditing ? 'Update' : 'Create'}
          </button>
          {isEditing && (
            <button
              type='button'
              onClick={handleDelete}
              style={{
                padding: '8px 12px',
                background: 'tomato',
                color: '#fff',
              }}
            >
              Delete
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: 40 }}>
        <h3>Templates List</h3>
        <button
          type='button'
          onClick={() => BackendService.getTemplatesList().then(console.log)}
          style={{ padding: '8px 12px' }}
        >
          Get Templates
        </button>
      </div>
    </div>
  );
};
