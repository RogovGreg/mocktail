import { TUnifiedApiMethod } from '../../inner-types';
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
export type TAuthMethodLoginResponse = Readonly<{
  accessToken: TAuthTokenData;
  authorizedUser: TUserProfile;
}>;
export type TAuthMethodLogin = TUnifiedApiMethod<
  void,
  void,
  TAuthMethodLoginRequestBody,
  TAuthMethodLoginResponse
>;

// ================= LOGOUT =======================

export type TAuthMethodLogout = TUnifiedApiMethod;

// ================= GET PROFILE =======================

export type TAuthGetProfileResponse = TUserProfile;
export type TAuthGetProfile = TUnifiedApiMethod<
  void,
  void,
  void,
  TAuthGetProfileResponse
>;

// ================= REFRESH TOKEN =======================

export type TAuthMethodRefreshTokenRequestBody = Readonly<{ UserId: string }>;
export type TAuthMethodRefreshTokenResponse = TAuthTokenData;
export type TAuthMethodRefreshToken = TUnifiedApiMethod<
  void,
  void,
  TAuthMethodRefreshTokenRequestBody,
  TAuthMethodRefreshTokenResponse
>;

// ================= REGISTER =======================

export type TAuthMethodRegisterRequest = TLoginPassword;

export type TAuthMethodRegister = TUnifiedApiMethod<
  void,
  void,
  TAuthMethodRegisterRequest
>;

// ================= CHECK STATUS =======================

export type TAuthCheckStatus = TUnifiedApiMethod;

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
