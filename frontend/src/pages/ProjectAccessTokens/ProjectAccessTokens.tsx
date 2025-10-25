import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  AuthService,
  BackendService,
  TProject,
  TProjectAccessToken,
  TProjectAccessTokenWithValue,
  // TProjectAccessTokenWithValue,
} from '#api';
import { toast } from '#src/common-functions';

import { CreateTokenForm, ExistingTokenCard } from './elements';
import { DeleteTokenDialog } from './elements/DeleteTokenDialog';

type TTokenWithOptionalValue = TProjectAccessToken & { token?: string };

export const ProjectAccessTokens: FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const navigate = useNavigate();

  const [project, setProject] = useState<TProject | null>(null);
  const [tokens, setTokens] = useState<Array<TTokenWithOptionalValue>>([]);
  const [newlyCreatedTokens, setNewlyCreatedTokens] = useState<Set<string>>(
    new Set(),
  );

  const [deletingToken, setDeletingToken] =
    useState<TProjectAccessToken | null>(null);

  const onTokenDeleteSubmit = useCallback(async () => {
    if (deletingToken) {
      await AuthService.deleteProjectAccessToken({
        path: { params: { tokenId: deletingToken.tokenId } },
      });

      setTokens(prev =>
        prev.filter(token => token.tokenId !== deletingToken.tokenId),
      );
      setNewlyCreatedTokens(prev => {
        const newSet = new Set(prev);
        newSet.delete(deletingToken.tokenId);
        return newSet;
      });

      setDeletingToken(null);
    }
  }, [deletingToken]);

  const handleTokenAcknowledged = useCallback((tokenId: string) => {
    setNewlyCreatedTokens(prev => {
      const newSet = new Set(prev);
      newSet.delete(tokenId);
      return newSet;
    });

    setTokens(prev =>
      prev.map(token => {
        if (token.tokenId === tokenId) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { token: _, ...tokenWithoutValue } = token;
          return tokenWithoutValue;
        }

        return token;
      }),
    );
  }, []);

  const addNewToken = useCallback((newToken: TProjectAccessTokenWithValue) => {
    setTokens(prev =>
      [...prev, newToken].sort((first, second) => {
        if (!first.expiresAt && !second.expiresAt) return 0;
        if (!first.expiresAt) return 1;
        if (!second.expiresAt) return -1;
        return (
          new Date(first.expiresAt).getTime() -
          new Date(second.expiresAt).getTime()
        );
      }),
    );

    setNewlyCreatedTokens(prev => new Set([...prev, newToken.tokenId]));
  }, []);

  useEffect(() => {
    if (!projectId) {
      // eslint-disable-next-line no-console
      console.error('Project ID is required');
      return;
    }

    BackendService.getProjectByID({ path: { params: { id: projectId } } })
      .then(response => {
        setProject(response.data);
      })
      .catch(error => {
        toast.error(
          error.response?.data?.message || 'Project receiving failed.',
        );
      });

    AuthService.getProjectAccessTokens({ query: { params: { projectId } } })
      .then(response => {
        const sortedTokens = response.data.sort((a, b) => {
          if (!a.expiresAt && !b.expiresAt) return 0;
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return (
            new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
          );
        });

        setTokens(sortedTokens);
      })
      .catch(error => {
        toast.error(
          error.response?.data?.message ||
            'Project API tokens receiving failed.',
        );
      });
  }, [projectId]);

  if (!project) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='flex flex-col items-center gap-4'>
          <span className='loading loading-spinner loading-lg' />
          <p className='text-base-content/70'>Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6 w-full'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-semibold'>Create new access token</h1>
        <button
          type='button'
          className='btn btn-outline'
          onClick={() => navigate(`/app/projects/${projectId}`)}
        >
          Back to project
        </button>
      </div>
      <CreateTokenForm projectId={projectId} onTokenCreated={addNewToken} />
      <div className='mb-6'>
        <div className='mb-4'>
          <h1 className='text-2xl font-semibold'>{`Existing tokens${tokens.length > 0 ? ` (${tokens.length})` : ''}`}</h1>
        </div>

        <div className='space-y-4'>
          {tokens.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-base-content/50 italic'>
                No access tokens created yet
              </p>
            </div>
          ) : (
            tokens.map(token => (
              <ExistingTokenCard
                key={token.tokenId}
                setDeletingToken={setDeletingToken}
                token={token}
                isNewlyCreated={newlyCreatedTokens.has(token.tokenId)}
                onTokenAcknowledged={handleTokenAcknowledged}
              />
            ))
          )}
        </div>
      </div>

      {deletingToken && (
        <DeleteTokenDialog
          deletingToken={deletingToken}
          onClose={() => setDeletingToken(null)}
          onSubmit={onTokenDeleteSubmit}
        />
      )}
    </div>
  );
};
