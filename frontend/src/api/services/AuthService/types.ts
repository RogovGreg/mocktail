import {
  TApiMethod,
  TApiMethodResponse,
  TApiMethodWithPayload,
} from '#src/api/inner-types';

export type TLoginPassword = {
  login: string;
  password: string;
};

export type TAuthTokenData = Readonly<{
  accessToken: string;
  expiresIn: string;
  tokenType: string;
}>;

export type TAuthMethodCheckAvailabilityResponseData = Readonly<{
  service: string;
  timestamp: string;
}>;
export type TAuthMethodCheckAvailabilityResponse =
  TApiMethodResponse<TAuthMethodCheckAvailabilityResponseData>;
export type TAuthMethodCheckAvailability =
  TApiMethod<TAuthMethodCheckAvailabilityResponseData>;

export type TAuthMethodLoginRequestBody = Readonly<TLoginPassword>;
export type TAuthMethodLoginResponseData = TAuthTokenData;
export type TAuthMethodLoginResponse = TApiMethodResponse<
  TAuthMethodLoginResponseData,
  TAuthMethodLoginRequestBody
>;
export type TAuthMethodLogin = TApiMethodWithPayload<
  TAuthMethodLoginRequestBody,
  TAuthMethodLoginResponseData
>;

export type TAuthMethodLogout = TApiMethod;

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

export type TAuthService = Readonly<{
  checkAvailability: TAuthMethodCheckAvailability;
  login: TAuthMethodLogin;
  logout: TAuthMethodLogout;
  refreshToken: TAuthMethodRefreshToken;
  register: TAuthMethodRegister;
}>;
