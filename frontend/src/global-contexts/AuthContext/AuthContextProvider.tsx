import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { StatusCodes } from 'http-status-codes';

import { AuthService, updateApiAuthorization } from '#api';
import {
  AUTHORIZED_USER_ID_FIELD_NAME,
  POLLING_AUTH_STATUS_INTERVAL,
} from '#common-constants';
import { ERoutes } from '#src/router';
import { PUBLIC_ROUTES_PATHS_LIST } from '#src/router/routes';

import { AuthContext } from './AuthContext';
import { AUTH_CONTEXT_DEFAULT_VALUE } from './constants';
import { TAuthContextValue } from './types';

export const AuthContextProvider: FC<PropsWithChildren> = props => {
  const { children } = props;

  const navigate = useNavigate();
  const { pathname: currentURL } = useLocation();

  const [accessToken, setAccessToken] = useState<
    TAuthContextValue['accessToken']
  >(AUTH_CONTEXT_DEFAULT_VALUE.accessToken);
  const [isAuthorized, setIsAuthorized] = useState<
    TAuthContextValue['isAuthorized']
  >(AUTH_CONTEXT_DEFAULT_VALUE.isAuthorized);
  const [authorizedUserData, setAuthorizedUserData] = useState<
    TAuthContextValue['authorizedUserData']
  >(AUTH_CONTEXT_DEFAULT_VALUE.authorizedUserData);

  const refreshTokenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  console.log('> AuthContextProvider - RENDER. isAuthorized', isAuthorized);

  const refreshTokenAction = useCallback(() => {
    const authorizedUserID: string | null = sessionStorage.getItem(
      AUTHORIZED_USER_ID_FIELD_NAME,
    );

    if (authorizedUserID) {
      AuthService.refreshToken({
        UserId: authorizedUserID,
      })
        .then(response => {
          if (response.status === StatusCodes.OK) {
            const { tokenType, accessToken, expiresIn } = response.data;

            setAccessToken({
              expiresIn,
              type: tokenType,
              value: accessToken,
            });
            setIsAuthorized(true);

            const expiresInMs: number = expiresIn
              ? Number.parseInt(expiresIn, 10)
              : NaN;

            if (expiresInMs) {
              refreshTokenTimeoutRef.current = setTimeout(
                () => {
                  refreshTokenAction();
                },
                expiresInMs - Date.now() - 5000,
              );
            }
          }
        })
        .catch(() => {
          setIsAuthorized(false);
          setAccessToken(AUTH_CONTEXT_DEFAULT_VALUE.accessToken);
          setAuthorizedUserData(AUTH_CONTEXT_DEFAULT_VALUE.authorizedUserData);

          if (PUBLIC_ROUTES_PATHS_LIST.includes(currentURL as ERoutes)) {
            navigate(ERoutes.Login);
          }
        });
    }
  }, [refreshTokenTimeoutRef.current, currentURL]);

  useEffect(() => {
    refreshTokenAction();

    return () => {
      if (refreshTokenTimeoutRef.current) {
        clearTimeout(refreshTokenTimeoutRef.current);
      }
      if (pollingStatusIntervalRef.current) {
        clearInterval(pollingStatusIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthorized && !pollingStatusIntervalRef.current) {
      pollingStatusIntervalRef.current = setInterval(() => {
        AuthService.checkStatus();
      }, POLLING_AUTH_STATUS_INTERVAL);
    }
  }, [currentURL, isAuthorized, pollingStatusIntervalRef.current]);

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
