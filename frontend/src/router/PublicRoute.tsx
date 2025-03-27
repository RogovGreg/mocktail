import { FC, PropsWithChildren, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AuthContext } from '#src/global-contexts';

import { ERoutes } from './routes-list';

export const PublicRoute: FC<PropsWithChildren> = props => {
  const { children } = props;

  const { isAuthorized } = useContext(AuthContext);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      isAuthorized &&
      pathname !== ERoutes.Register &&
      pathname !== ERoutes.RegisterSuccess
    ) {
      navigate(ERoutes.HomePage);
    }
  }, [isAuthorized, pathname]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
