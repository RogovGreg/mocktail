import { FC, useCallback, useState } from 'react';

import { AuthService, TProjectAccessToken } from '#api';
import { CustomInput } from '#common-components';

export type TCreateTokenFormProps = Readonly<{
  projectId: string | undefined;
  onTokenCreated: (token: TProjectAccessToken & { token: string }) => void;
}>;

export const CreateTokenForm: FC<TCreateTokenFormProps> = props => {
  const { projectId, onTokenCreated } = props;

  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenExpiresAt, setNewTokenExpiresAt] = useState('');

  const formatDateForInput = useCallback((isoString: string): string => {
    if (!isoString) return '';

    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value) {
      setNewTokenExpiresAt(new Date(value).toISOString());
    } else {
      setNewTokenExpiresAt('');
    }
  };

  const handleCreateToken = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectId || !newTokenName.trim()) return;

    try {
      const tokenData = {
        expiresAt: newTokenExpiresAt || null,
        name: newTokenName.trim(),
        projectId,
      };

      const response = await AuthService.createProjectAccessToken({
        body: { data: tokenData },
      });

      onTokenCreated(response.data);

      setNewTokenName('');
      setNewTokenExpiresAt('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create token', error);
    }
  };

  return (
    <div className='card bg-base-200 p-6 mb-6'>
      <form onSubmit={handleCreateToken} className='space-y-4'>
        <CustomInput
          required
          inputClassName='input-bordered w-full'
          label='Token Name'
          name='tokenName'
          onChange={event => setNewTokenName(event.target.value)}
          placeholder='Enter token name'
          value={newTokenName}
        />

        <CustomInput
          inputClassName='input-bordered w-full'
          label='Expires At (optional)'
          name='tokenExpiresAt'
          onChange={handleDateChange}
          type='datetime-local'
          value={formatDateForInput(newTokenExpiresAt)}
        />
        <div className='flex gap-2 justify-end'>
          <button
            type='button'
            className='btn btn-outline'
            onClick={() => {
              setNewTokenName('');
              setNewTokenExpiresAt('');
            }}
          >
            Clear
          </button>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={!newTokenName.trim()}
          >
            Create Token
          </button>
        </div>
      </form>
    </div>
  );
};
