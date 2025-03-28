import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { ERoutes } from '#src/router';
import { PROTECTED_ROUTES_PATHS_LIST } from '#src/router/routes';

import { HOST, PROTOCOL } from './constants';
import { TAuthorizationParameters } from './inner-types';

export const axiosInstance = axios.create({
  baseURL: `${PROTOCOL}://${HOST}/api/v1/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(undefined, error => {
  if (
    Object.prototype.hasOwnProperty.call(error, 'status') &&
    error.status === StatusCodes.UNAUTHORIZED &&
    PROTECTED_ROUTES_PATHS_LIST.includes(window.location.pathname as ERoutes)
  ) {
    console.log('> REDIRECT TO /login');
    // window.location.pathname = ERoutes.Login;
  }

  return Promise.reject(error);
});

export const updateApiAuthorization = (
  authorizationParameters?: TAuthorizationParameters,
): void => {
  if (authorizationParameters) {
    const { tokenType, accessToken } = authorizationParameters;

    if (tokenType && accessToken) {
      axiosInstance.defaults.headers.common.Authorization = `${tokenType} ${accessToken}`;
    }
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};
