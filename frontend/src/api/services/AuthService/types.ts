import { TUnifiedApiMethod } from '../../inner-types';
import { TCheckServiceAvailability } from '../types';

// ================= Common Types =======================

export type TLoginPassword = Readonly<{
  email: string | null;
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

export type TProjectAccessToken = Readonly<{
  createdAt: string;
  expiresAt: string | null;
  name: string;
  projectId: string;
  tokenId: string;
}>;

export type TProjectAccessTokenWithValue = TProjectAccessToken &
  Readonly<{ token: string }>;

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

// ====================== createProjectAccessToken ======================

export type TCreateProjectAccessTokenApiMethodPayload = Readonly<{
  projectId: string;
  name: string;
  expiresAt?: string | null;
}>;
export type TCreateProjectAccessTokenApiMethodResponse =
  TProjectAccessTokenWithValue;
export type TCreateProjectAccessTokenApiMethod = TUnifiedApiMethod<
  void,
  void,
  TCreateProjectAccessTokenApiMethodPayload,
  TCreateProjectAccessTokenApiMethodResponse
>;

// ====================== getProjectAccessToken ======================

export type TGetProjectAccessTokenApiMethodQueryParams = Readonly<{
  projectId: string;
}>;
export type TGetProjectAccessTokenApiMethodResponse =
  Array<TProjectAccessToken>;
export type TGetProjectAccessTokenApiMethod = TUnifiedApiMethod<
  void,
  TGetProjectAccessTokenApiMethodQueryParams,
  void,
  TGetProjectAccessTokenApiMethodResponse
>;

// ====================== deleteProjectAccessToken ======================

export type TDeleteProjectAccessTokenApiMethodQueryParams = Readonly<{
  tokenId: string;
}>;
export type TDeleteProjectAccessTokenApiMethod =
  TUnifiedApiMethod<TDeleteProjectAccessTokenApiMethodQueryParams>;

// ======================================================

export type TAuthService = Readonly<{
  checkAvailability: TCheckServiceAvailability;

  checkStatus: TAuthCheckStatus;

  getProfile: TAuthGetProfile;

  login: TAuthMethodLogin;
  logout: TAuthMethodLogout;
  refreshToken: TAuthMethodRefreshToken;

  register: TAuthMethodRegister;

  createProjectAccessToken: TCreateProjectAccessTokenApiMethod;
  deleteProjectAccessToken: TDeleteProjectAccessTokenApiMethod;
  getProjectAccessTokens: TGetProjectAccessTokenApiMethod;
}>;
