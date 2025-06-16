import {
  TApiMethod,
  TApiMethodResponse,
  TApiMethodWithPayload,
} from '#src/api/inner-types';

import { TCheckServiceAvailability } from '../types';

// ================= Common Types =======================

export type TLoginPassword = Readonly<{
  login: string | null;
  password: string | null;
}>;

export type TAuthTokenData = Readonly<{
  accessToken: string | null;
  expiresIn: string | null;
  tokenType: string | null;
}>;

export type TUserProfile = Readonly<{
  email: string | null;
  id: string | null;
  userName: string | null;
}>;

// ================= LOGIN =======================

export type TAuthMethodLoginRequestBody = TLoginPassword;
export type TAuthMethodLoginResponseData = Readonly<{
  accessToken: TAuthTokenData;
  authorizedUser: TUserProfile;
}>;
export type TAuthMethodLoginResponse = TApiMethodResponse<
  TAuthMethodLoginResponseData,
  TAuthMethodLoginRequestBody
>;
export type TAuthMethodLogin = TApiMethodWithPayload<
  null,
  TAuthMethodLoginRequestBody,
  TAuthMethodLoginResponseData
>;

// ================= LOGOUT =======================

export type TAuthMethodLogout = TApiMethod;

export type TAuthGetProfileResponseData = TUserProfile;
export type TAuthGetProfileResponse =
  TApiMethodResponse<TAuthGetProfileResponseData>;
export type TAuthGetProfile = TApiMethod<TAuthGetProfileResponseData>;

// ================= REFRESH TOKEN =======================

export type TAuthMethodRefreshTokenResponseData = TAuthTokenData;
export type TAuthMethodRefreshTokenResponse =
  TApiMethodResponse<TAuthMethodRefreshTokenResponseData>;
export type TAuthMethodRefreshToken = TApiMethodWithPayload<
  null,
  { UserId: string },
  TAuthMethodRefreshTokenResponseData
>;

// ================= REGISTER =======================

export type TAuthMethodRegisterRequestBody = TLoginPassword;
export type TAuthMethodRegisterResponse = TApiMethodResponse<
  void,
  TAuthMethodRegisterRequestBody
>;
export type TAuthMethodRegister = TApiMethodWithPayload<null, TLoginPassword>;

// ================= CHECK STATUS =======================

export type TAuthCheckStatus = TApiMethod;

// ======================================================

export type TAuthService = Readonly<{
  checkAvailability: TCheckServiceAvailability;
  checkStatus: TAuthCheckStatus;
  getProfile: TAuthGetProfile;
  login: TAuthMethodLogin;
  logout: TAuthMethodLogout;
  refreshToken: TAuthMethodRefreshToken;
  register: TAuthMethodRegister;
}>;
