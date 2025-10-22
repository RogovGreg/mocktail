import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { BackendService, TCreateTemplateAPIMethodPayload } from '#api';
import { CustomInput } from '#common-components';

export const CreateTemplatePage: FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
    name: '',
    path: '',
    schema: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    const payload: TCreateTemplateAPIMethodPayload = {
      description: formData.description || null,
      name: formData.name,
      path: formData.path || null,
      relatedProjectId: projectId!,
      schema: formData.schema,
      tags: formData.tags,
    };

    try {
      const response = await BackendService.createTemplate({
        body: { data: payload },
      });
      navigate(`/app/projects/${projectId}/templates/${response.data.id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || formData.tags.includes(newTag.trim())) {
      return;
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, newTag.trim()],
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleCancel = () => {
    navigate(`/app/projects/${projectId}/templates`);
  };

  return (
    <div className='container mx-auto p-6 w-full'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>Create New Template</h1>
        <p className='text-base-content/70'>
          Fill in the details to create a new template
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-2'>
        <CustomInput
          required
          name='name'
          label='Template Name'
          placeholder='Enter template name'
          inputClassName='w-full'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: event.target.value })
          }
          value={formData.name}
        />
        <CustomInput
          name='path'
          label='Template Path'
          placeholder='Enter template path (optional)'
          inputClassName='w-full'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, path: event.target.value })
          }
          value={formData.path}
        />
        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>Tags</legend>

          <div className='flex flex-wrap gap-2 mb-3'>
            {formData.tags.length > 0 ? (
              formData.tags.map(tag => (
                <span
                  key={tag}
                  className='badge badge-primary badge-outline gap-2'
                >
                  {tag}
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag)}
                    className='btn btn-ghost btn-xs btn-circle'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                      fill='currentColor'
                      className='size-4'
                    >
                      <path d='M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z' />
                    </svg>
                  </button>
                </span>
              ))
            ) : (
              <span className='text-base-content/50 italic'>No tags added</span>
            )}
          </div>

          <div className='flex gap-2'>
            <CustomInput
              inputClassName='input-bordered w-full'
              name='newTag'
              placeholder='Add new tag'
              rewriteWrapperClassName
              value={newTag}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setNewTag(event.target.value)
              }
              specificInputProps={{
                onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) =>
                  event.key === 'Enter' &&
                  (event.preventDefault(), handleAddTag()),
              }}
              wrapperClassName='flex-1'
              wrapperStyle={{
                background: 'transparent',
                border: 'none',
                margin: 0,
                padding: 0,
              }}
            />
            <button
              type='button'
              onClick={handleAddTag}
              className='btn btn-primary'
              disabled={!newTag.trim()}
            >
              Add
            </button>
          </div>
        </fieldset>
        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>Description</legend>
          <textarea
            name='description'
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            className='input h-24 w-full'
            placeholder='Enter template description (optional)'
            style={{ resize: 'vertical' }}
          />
        </fieldset>

        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>Schema (TypeScript)</legend>
          <textarea
            name='schema'
            value={formData.schema}
            onChange={e => setFormData({ ...formData, schema: e.target.value })}
            className='input h-24 font-mono text-sm w-full'
            placeholder='Enter TypeScript schema (optional)'
            style={{ resize: 'vertical' }}
          />
        </fieldset>
        <div className='flex justify-end gap-4 pt-6'>
          <button
            type='button'
            className='btn btn-outline'
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type='submit'
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting ? (
              <>
                <span className='loading loading-spinner loading-sm mr-2' />
                Creating...
              </>
            ) : (
              'Create Template'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
