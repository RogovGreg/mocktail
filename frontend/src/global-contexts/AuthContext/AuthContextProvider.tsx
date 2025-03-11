import { FC, PropsWithChildren, useMemo, useState } from 'react';

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
    [],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
