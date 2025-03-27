import { TAuthContextValue } from './types';

export const AUTH_CONTEXT_DEFAULT_VALUE: TAuthContextValue = {
  accessToken: null,
  updateAccessToken: null,

  isAuthorized: false,
  updateIsAuthorized: null,

  authorizedUserData: null,
  updateAuthorizedUserData: null,
};
