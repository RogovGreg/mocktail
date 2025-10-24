import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import qs from 'qs';

import { AUTHORIZED_USER_ID_FIELD_NAME } from '#common-constants';
import { ERoutes } from '#src/router';
import { PROTECTED_ROUTES } from '#src/router/routes';

import { TAuthorizationParameters } from './inner-types';

export const axiosInstance = axios.create({
  baseURL: '/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

axiosInstance.interceptors.response.use(undefined, error => {
  if (
    Object.prototype.hasOwnProperty.call(error, 'status') &&
    error.status === StatusCodes.UNAUTHORIZED &&
    PROTECTED_ROUTES.includes(window.location.pathname as ERoutes)
  ) {
    sessionStorage.removeItem(AUTHORIZED_USER_ID_FIELD_NAME);
    window.location.pathname = ERoutes.Login;
  }

  return Promise.reject(error);
});

export const updateApiAuthorization = (
  authorizationParameters?: TAuthorizationParameters | null,
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
