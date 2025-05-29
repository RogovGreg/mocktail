import { FC, PropsWithChildren, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AuthContext } from '#src/global-contexts';

import { PROTECTED_ROUTES } from './routes';
import { ERoutes } from './routes-list';

export const RouteWrapper: FC<PropsWithChildren> = props => {
  const { children } = props;

  const { isAuthorized } = useContext(AuthContext);

  const { pathname: currentURL } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized && PROTECTED_ROUTES.includes(currentURL as ERoutes)) {
      navigate(ERoutes.Login);
    }
  }, [currentURL, isAuthorized]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
