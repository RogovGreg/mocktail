import { axiosInstance } from '#api/api';

import { EAuthServiceEndpoint } from './inner-types';
import { TAuthService } from './types';

export const AuthService: TAuthService = {
  checkAvailability: options =>
    axiosInstance.get(EAuthServiceEndpoint.CheckAvailability, options),
  checkStatus: options =>
    axiosInstance.get(EAuthServiceEndpoint.CheckStatus, options),
  getProfile: options =>
    axiosInstance.get(EAuthServiceEndpoint.GetProfile, options),
  login: (_queryParams, requestBody, options) =>
    axiosInstance.post(EAuthServiceEndpoint.Login, requestBody, options),
  logout: options =>
    axiosInstance.post(EAuthServiceEndpoint.Logout, undefined, options),

  refreshToken: (_queryParams, requestBody, options) =>
    axiosInstance.post(EAuthServiceEndpoint.RefreshToken, requestBody, options),
  register: (_queryParams, requestBody, options) =>
    axiosInstance.post(EAuthServiceEndpoint.Register, requestBody, options),
};
