export type TAuthAccessToken = Readonly<{
  value: string | null;
  expiresIn: string | null;
  type: string | null;
}>

export type TAuthContextValue = Readonly<{
  accessToken: TAuthAccessToken | null;
  updateAccessToken: null | ((parameter: TAuthAccessToken) => void);

  isAuthorized: boolean;
  updateIsAuthorized: null | ((parameter: boolean) => void);

  authorizedUserData: null;
}>;