import { EAuthServiceEndpoint } from './inner-types';
import { TAuthService } from './types';
import { axiosInstance } from '../../api';

export const AuthService: TAuthService = {
  checkAvailability: config =>
    axiosInstance.get(EAuthServiceEndpoint.CheckAvailability, config?.options),
  checkStatus: config =>
    axiosInstance.get(EAuthServiceEndpoint.CheckStatus, config?.options),
  getProfile: config =>
    axiosInstance.get(EAuthServiceEndpoint.GetProfile, config?.options),
  login: config =>
    axiosInstance.post(
      EAuthServiceEndpoint.Login,
      config?.body?.data,
      config?.options,
    ),
  logout: config =>
    axiosInstance.post(EAuthServiceEndpoint.Logout, undefined, config?.options),
  refreshToken: config =>
    axiosInstance.post(
      EAuthServiceEndpoint.RefreshToken,
      config?.body?.data,
      config?.options,
    ),
  register: config =>
    axiosInstance.post(
      EAuthServiceEndpoint.Register,
      config?.body?.data,
      config?.options,
    ),
};
