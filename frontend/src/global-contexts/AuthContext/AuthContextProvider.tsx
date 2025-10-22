import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StatusCodes } from 'http-status-codes';

import { AuthService, updateApiAuthorization } from '#api';
import {
  AUTHORIZED_USER_ID_FIELD_NAME,
  POLLING_AUTH_STATUS_INTERVAL,
} from '#common-constants';

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
  const [authorizedUserData, setAuthorizedUserData] = useState<
    TAuthContextValue['authorizedUserData']
  >(AUTH_CONTEXT_DEFAULT_VALUE.authorizedUserData);

  const refreshTokenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshTokenAction = useCallback(() => {
    const authorizedUserID: string | null = sessionStorage.getItem(
      AUTHORIZED_USER_ID_FIELD_NAME,
    );

    if (authorizedUserID) {
      AuthService.refreshToken({ body: { data: { UserId: authorizedUserID } } })
        .then(response => {
          if (response.status === StatusCodes.OK) {
            const { tokenType, accessToken, expiresIn } = response.data;

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

            setAccessToken({
              expiresIn,
              type: tokenType,
              value: accessToken,
            });
            setIsAuthorized(true);
            updateApiAuthorization({
              accessToken: accessToken || undefined,
              tokenType: tokenType || undefined,
            });
          }

          return response;
        })
        .catch(() => {
          setIsAuthorized(false);
          setAccessToken(AUTH_CONTEXT_DEFAULT_VALUE.accessToken);
          updateApiAuthorization({
            accessToken: undefined,
            tokenType: undefined,
          });
          setAuthorizedUserData(AUTH_CONTEXT_DEFAULT_VALUE.authorizedUserData);
        });
    } else {
      setIsAuthorized(false);
    }
  }, [refreshTokenTimeoutRef.current]);

  useEffect(() => {
    const asyncProfileRequest = async () => {
      const userProfile = await AuthService.getProfile();
      const { email, id, userName } = userProfile.data || {};

      setAuthorizedUserData({
        email,
        id,
        userName,
      });

      if (id) {
        sessionStorage.setItem(AUTHORIZED_USER_ID_FIELD_NAME, id);
      }

      setIsAuthorized(true);
    };

    if (accessToken?.value && !authorizedUserData) {
      asyncProfileRequest();
    }
  }, [accessToken, authorizedUserData]);

  useEffect(
    // init
    () => {
      refreshTokenAction();

      return () => {
        if (refreshTokenTimeoutRef.current) {
          clearTimeout(refreshTokenTimeoutRef.current);
        }
        if (pollingStatusIntervalRef.current) {
          clearInterval(pollingStatusIntervalRef.current);
        }
      };
    },
    [],
  );

  useEffect(() => {
    if (!pollingStatusIntervalRef.current) {
      pollingStatusIntervalRef.current = setInterval(() => {
        AuthService.checkStatus();
      }, POLLING_AUTH_STATUS_INTERVAL);
    }
  }, [pollingStatusIntervalRef.current]);

  useEffect(() => {
    if (accessToken?.value && !isAuthorized) {
      setIsAuthorized(true);
    } else if (!accessToken?.value && isAuthorized) {
      setIsAuthorized(false);
    }
  }, [accessToken, isAuthorized]);

  const updateAccessToken = (
    newAccessToken: TAuthContextValue['accessToken'],
  ) => {
    setAccessToken(newAccessToken);
    updateApiAuthorization({
      accessToken: newAccessToken?.value || undefined,
      tokenType: newAccessToken?.type || undefined,
    });
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
