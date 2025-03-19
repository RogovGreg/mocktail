import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { updateApiAuthorization } from '#api';

import { AuthContext } from './AuthContext';
import { AUTH_CONTEXT_DEFAULT_VALUE } from './constants';
import { TAuthContextValue } from './types';

export const AuthContextProvider: FC<PropsWithChildren> = props => {
  const { children } = props;

  const [accessToken, setAccessToken] = useState<
    TAuthContextValue['accessToken']
  >(AUTH_CONTEXT_DEFAULT_VALUE.accessToken);
  const [isAuthorized, setIsAuthorized] = useState<
    TAuthContextValue['isAuthorized']
  >(AUTH_CONTEXT_DEFAULT_VALUE.isAuthorized);

  useEffect(() => {
    if (accessToken?.value && !isAuthorized) {
      setIsAuthorized(true);
    } else if (!accessToken?.value && isAuthorized) {
      setIsAuthorized(false);
    }
  }, [accessToken, isAuthorized]);

  useEffect(() => {
    updateApiAuthorization({
      accessToken: accessToken?.value || undefined,
      tokenType: accessToken?.type || undefined,
    });
  }, [accessToken]);

  const updateAccessToken = (
    newAccessToken: TAuthContextValue['accessToken'],
  ) => {
    setAccessToken(newAccessToken);
  };

  const updateIsAuthorized = (
    newIsAuthorized: TAuthContextValue['isAuthorized'],
  ) => {
    if (newIsAuthorized !== isAuthorized) {
      setIsAuthorized(newIsAuthorized);
    }
  };

  const contextValue = useMemo<TAuthContextValue>(
    () => ({
      accessToken,
      isAuthorized,
      updateAccessToken,
      updateIsAuthorized,

      authorizedUserData: null,
    }),
    [accessToken, isAuthorized, updateAccessToken, updateIsAuthorized],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
