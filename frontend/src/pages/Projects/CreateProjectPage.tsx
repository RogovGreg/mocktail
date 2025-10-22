/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react';
import { useNavigate } from 'react-router';

import { BackendService, TCreateProjectAPIMethodPayload } from '#api';
import { CustomInput } from '#common-components';

export const CreateProjectPage: FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
    keyWords: [] as string[],
    title: '',
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload: TCreateProjectAPIMethodPayload = {
      description: formData.description || undefined,
      keyWords: formData.keyWords.length > 0 ? formData.keyWords : undefined,
      title: formData.title,
    };

    try {
      const response = await BackendService.createProject({
        body: { data: payload },
      });
      navigate(`/app/projects/${response.data.id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || formData.keyWords.includes(newKeyword.trim())) {
      return;
    }

    setFormData({
      ...formData,
      keyWords: [...formData.keyWords, newKeyword.trim()],
    });
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keyWords: formData.keyWords.filter(kw => kw !== keyword),
    });
  };

  const handleCancel = () => {
    navigate('/app/projects');
  };

  return (
    <div className='container mx-auto p-6 w-full'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>Create New Project</h1>
        <p className='text-base-content/70'>
          Fill in the details to create a new project
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-2'>
        <div className='form-control'>
          <CustomInput
            inputClassName='input-bordered w-full'
            label='Project Title'
            name='title'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, title: event.target.value })
            }
            placeholder='Enter project title'
            required
          />
        </div>

        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>Keywords</legend>

          <div className='flex flex-wrap gap-2 mb-3'>
            {formData.keyWords.length > 0 ? (
              formData.keyWords.map(keyword => (
                <span
                  key={keyword}
                  className='badge badge-primary badge-outline gap-2'
                >
                  {keyword}
                  <button
                    type='button'
                    onClick={() => handleRemoveKeyword(keyword)}
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
              <span className='text-base-content/50 italic'>
                No keywords added yet
              </span>
            )}
          </div>

          <div className='flex gap-2'>
            <CustomInput
              inputClassName='input-bordered w-full'
              name='newKeyword'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setNewKeyword(event.target.value)
              }
              placeholder='Add new keyword'
              specificInputProps={{
                onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddKeyword()),
              }}
              value={newKeyword}
              rewriteWrapperClassName
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
              onClick={handleAddKeyword}
              className='btn btn-primary'
              disabled={!newKeyword.trim()}
            >
              Add
            </button>
          </div>
        </fieldset>

        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>Description</legend>
          <textarea
            id='project-description'
            name='description'
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            className='input h-32 w-full'
            placeholder='Enter project description (optional)'
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
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? (
              <>
                <span className='loading loading-spinner loading-sm mr-2' />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
