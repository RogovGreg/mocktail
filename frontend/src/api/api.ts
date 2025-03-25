import axios from 'axios';

import { HOST, PROTOCOL } from './constants';
import { TAuthorizationParameters } from './inner-types';

export const axiosInstance = axios.create({
  baseURL: `${PROTOCOL}://${HOST}/api/v1/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateApiAuthorization = (
  authorizationParameters?: TAuthorizationParameters,
): void => {
  if (authorizationParameters) {
    const { tokenType, accessToken } = authorizationParameters;

    console.log('> updateApiAuthorization: ', `${tokenType} ${accessToken}`);

    axiosInstance.defaults.headers.common.Authorization = `${tokenType} ${accessToken}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};
