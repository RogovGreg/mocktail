import {
  TApiMethod,
  TApiMethodResponse,
  TApiMethodWithPayload,
} from '#src/api/inner-types';

import { TCheckServiceAvailability } from '../types';

export type TLoginPassword = {
  login: string;
  password: string;
};

export type TAuthTokenData = Readonly<{
  accessToken: string;
  expiresIn: string;
  tokenType: string;
}>;

export type TUserProfile = Readonly<{
  email: string;
}>;

export type TAuthMethodLoginRequestBody = Readonly<TLoginPassword>;
export type TAuthMethodLoginResponseData = TAuthTokenData &
  Readonly<{ userEmail: string }>;
export type TAuthMethodLoginResponse = TApiMethodResponse<
  TAuthMethodLoginResponseData,
  TAuthMethodLoginRequestBody
>;
export type TAuthMethodLogin = TApiMethodWithPayload<
  TAuthMethodLoginRequestBody,
  TAuthMethodLoginResponseData
>;

export type TAuthMethodLogout = TApiMethod;

export type TAuthGetProfileResponseData = TUserProfile;
export type TAuthGetProfileResponse =
  TApiMethodResponse<TAuthGetProfileResponseData>;
export type TAuthGetProfile = TApiMethod<TAuthGetProfileResponseData>;

export type TAuthMethodRefreshTokenResponseData = TAuthTokenData;
export type TAuthMethodRefreshTokenResponse =
  TApiMethodResponse<TAuthMethodRefreshTokenResponseData>;
export type TAuthMethodRefreshToken =
  TApiMethod<TAuthMethodRefreshTokenResponseData>;

export type TAuthMethodRegisterRequestBody = Readonly<TLoginPassword>;
export type TAuthMethodRegisterResponse = TApiMethodResponse<
  void,
  TAuthMethodRegisterRequestBody
>;
export type TAuthMethodRegister = TApiMethodWithPayload<TLoginPassword>;

export type TAuthCheckStatus = TApiMethod;

export type TAuthService = Readonly<{
  checkAvailability: TCheckServiceAvailability;
  checkStatus: TAuthCheckStatus;
  getProfile: TAuthGetProfile;
  login: TAuthMethodLogin;
  logout: TAuthMethodLogout;
  refreshToken: TAuthMethodRefreshToken;
  register: TAuthMethodRegister;
}>;
