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

    if (formData.tags.length === 0) {
      return;
    }

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
          name='name'
          label='Template Name'
          placeholder='Enter template name'
          inputProps={{
            className: 'input w-full',
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: event.target.value }),
            required: true,
            value: formData.name,
          }}
        />
        <CustomInput
          name='path'
          label='Template Path'
          placeholder='Enter template path (optional)'
          inputProps={{
            className: 'input w-full',
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, path: event.target.value }),
            value: formData.path,
          }}
        />
        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>
            Tags <span className='text-error'>*</span>
          </legend>

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
                    x
                  </button>
                </span>
              ))
            ) : (
              <span className='text-base-content/50 italic'>
                At least one tag is required
              </span>
            )}
          </div>

          <div className='flex gap-2'>
            <CustomInput
              name='newTag'
              placeholder='Add new tag'
              wrapperProps={{
                className: 'flex-1',
                style: {
                  background: 'transparent',
                  border: 'none',
                  margin: 0,
                  padding: 0,
                },
              }}
              inputProps={{
                className: 'input input-bordered w-full',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewTag(e.target.value),
                onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddTag()),
                value: newTag,
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
            disabled={
              isSubmitting ||
              !formData.name.trim() ||
              formData.tags.length === 0
            }
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
