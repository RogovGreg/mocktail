import { Dispatch, FC, memo, SetStateAction, useMemo } from 'react';

import { TProjectAccessToken } from '#api';

export type TExistingTokenCardProps = Readonly<{
  setDeletingToken: Dispatch<SetStateAction<TProjectAccessToken | null>>;
  token: TProjectAccessToken & { token?: string };
  isNewlyCreated?: boolean;
  onTokenAcknowledged?: (tokenId: string) => void;
}>;

export const ExistingTokenCard: FC<TExistingTokenCardProps> = memo(props => {
  const {
    setDeletingToken,
    token,
    isNewlyCreated = false,
    onTokenAcknowledged,
  } = props;

  const isTokenExpired = Boolean(
    token.expiresAt && new Date(token.expiresAt) < new Date(),
  );

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'never';
    return new Date(dateString).toLocaleDateString();
  };

  const handleAcknowledge = () => {
    if (onTokenAcknowledged) {
      onTokenAcknowledged(token.tokenId);
    }
  };

  const cardBorderClass = useMemo(() => {
    if (isTokenExpired) return 'border-error';
    if (isNewlyCreated) return 'border-success';
    return 'border-base-300';
  }, [isTokenExpired, isNewlyCreated]);

  const hasTokenValue = Boolean(
    'token' in token && token.token && token.token.trim().length > 0,
  );

  return (
    <div className={`card bg-base-100 shadow-sm border ${cardBorderClass}`}>
      <div className='card-body'>
        {isNewlyCreated && hasTokenValue && (
          <div className='alert alert-warning mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <div className='flex-1'>
              <h3 className='font-bold'>Token created successfully!</h3>
              <div className='text-xs'>
                This is the only time you&apos;ll see this token. Make sure to
                copy it now - you won&apos;t be able to see it again!
              </div>
            </div>
            <button
              type='button'
              className='btn btn-sm btn-outline'
              onClick={handleAcknowledge}
            >
              I&apos;ve saved it
            </button>
          </div>
        )}

        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <h3 className='card-title'>
              {token.name}
              {isTokenExpired && (
                <span className='badge badge-error'>Expired</span>
              )}
              {isNewlyCreated && (
                <span className='badge badge-success'>New</span>
              )}
            </h3>
            <div className='text-sm text-base-content/70 space-y-1'>
              <p>Expires: {formatDate(token.expiresAt)}</p>
              <p>Created: {formatDate(token.createdAt)}</p>

              {hasTokenValue ? (
                <div className='space-y-1'>
                  <span className='font-medium text-warning'>Token value</span>
                  <div className='flex items-center gap-2 bg-base-200 p-3 rounded border border-warning'>
                    <code className='text-xs break-all flex-1 font-mono'>
                      {token.token}
                    </code>
                    <button
                      type='button'
                      className='btn btn-warning btn-xs'
                      onClick={() =>
                        navigator.clipboard.writeText(token.token!)
                      }
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <button
            type='button'
            className='btn btn-error btn-sm'
            onClick={() => setDeletingToken(token)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});
