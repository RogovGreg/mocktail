import { FC, PropsWithChildren, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AuthContext } from '#src/global-contexts';

import { PROTECTED_ROUTES } from './routes';
import { ERoutes } from './routes-list';

export const RouteWrapper: FC<PropsWithChildren> = props => {
  const { children } = props;

  const { isAuthorized, authorizedUserData } = useContext(AuthContext);

  const { pathname: currentURL } = useLocation();
  const navigate = useNavigate();

  if (
    isAuthorized === false &&
    PROTECTED_ROUTES.includes(currentURL as ERoutes)
  ) {
    navigate(ERoutes.Login);

    return null;
  }

  if (
    (isAuthorized === null &&
      PROTECTED_ROUTES.includes(currentURL as ERoutes)) ||
    (isAuthorized && !authorizedUserData)
  ) {
    // TODO: Add a beautiful loading screen
    return <div>Loading</div>;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
