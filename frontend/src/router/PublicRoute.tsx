import { FC, PropsWithChildren, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AuthContext } from '#src/global-contexts';

import { ERoutes } from './routes-list';

export const PublicRoute: FC<PropsWithChildren> = props => {
  const { children } = props;

  const { isAuthorized } = useContext(AuthContext);

  const { pathname: currentURL } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('> PublicRoute', {
      isAuthorized,
      currentURL,
      'currentURL !== ERoutes.Register': currentURL !== ERoutes.Register,
      'currentURL !== ERoutes.RegisterSuccess':
        currentURL !== ERoutes.RegisterSuccess,
    });
    if (
      isAuthorized &&
      currentURL !== ERoutes.Register &&
      currentURL !== ERoutes.RegisterSuccess
    ) {
      navigate(ERoutes.HomePage);
    }
  }, [isAuthorized, currentURL]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
