import { FC, useState } from 'react';

import { TProjectAccessToken } from '#api';
import { CustomInput } from '#common-components';

export type TDeleteTokenDialogProps = {
  deletingToken: TProjectAccessToken;
  onClose: () => void;
  onSubmit: () => void;
};

export const DeleteTokenDialog: FC<TDeleteTokenDialogProps> = props => {
  const {
    deletingToken: { name: deletingTokenName },
    onClose,
    onSubmit,
  } = props;

  const [deleteConfirmName, setDeleteConfirmName] = useState<string>('');

  return (
    <div className='modal modal-open'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Delete Access Token</h3>
        <p className='py-4 text-center'>
          Are you sure you want to delete the token &quot;{deletingTokenName}
          &quot;? This action cannot be undone.
        </p>
        <CustomInput
          name='deleteConfirmName'
          label={`Type the token name "${deletingTokenName}" to confirm deletion`}
          placeholder={deletingTokenName}
          inputProps={{
            className: 'input w-full',
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              setDeleteConfirmName(event.target.value),
            value: deleteConfirmName,
          }}
        />
        <div className='modal-action'>
          <button type='button' className='btn btn-outline' onClick={onClose}>
            Cancel
          </button>
          <button
            type='button'
            className='btn btn-error'
            onClick={onSubmit}
            disabled={deleteConfirmName !== deletingTokenName}
          >
            Delete Token
          </button>
        </div>
      </div>
    </div>
  );
};
