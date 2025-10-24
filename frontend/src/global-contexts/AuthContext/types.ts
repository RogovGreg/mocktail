import { TUserProfile } from '#api';

export type TAuthAccessToken = Readonly<{
  value: string | null;
  expiresIn: string | null;
  type: string | null;
}>;

export type TAuthContextValue = Readonly<{
  accessToken: TAuthAccessToken | null;
  updateAccessToken: null | ((parameter: TAuthAccessToken) => void);

  isAuthorized: boolean | null;
  updateIsAuthorized: null | ((parameter: boolean) => void);

  authorizedUserData: TUserProfile | null;
  updateAuthorizedUserData: null | ((parameter: TUserProfile | null) => void);

  userLogout: null | (() => Promise<void>);
}>;
