import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { StatusCodes } from 'http-status-codes';

import { AuthService, updateApiAuthorization } from '#api';
import { AUTHORIZED_USER_ID_FIELD_NAME } from '#common-constants';

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
  const [authorizedUserData, setAuthorizedUserData] =
    useState<TAuthContextValue['authorizedUserData']>(null);

  console.log('> AuthContextProvider - RENDER. isAuthorized', isAuthorized);

  useEffect(() => {
    const authorizedUserID: string | null = sessionStorage.getItem(
      AUTHORIZED_USER_ID_FIELD_NAME,
    );

    if (authorizedUserID) {
      AuthService.refreshToken({
        UserId: authorizedUserID,
      }).then(response => {
        if (response.status === StatusCodes.OK) {
          const { tokenType, accessToken, expiresIn } = response.data;

          setAccessToken({
            expiresIn,
            type: tokenType,
            value: accessToken,
          });
          setIsAuthorized(true);
        }
      });
    }
  }, []);

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
      authorizedUserData,
      isAuthorized,
      updateAccessToken,
      updateAuthorizedUserData: setAuthorizedUserData,
      updateIsAuthorized,
    }),
    [
      accessToken,
      authorizedUserData,
      isAuthorized,
      setAuthorizedUserData,
      updateAccessToken,
      updateIsAuthorized,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
