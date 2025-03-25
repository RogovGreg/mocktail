import { FC, PropsWithChildren, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AuthContext } from '#src/global-contexts';

import { ERoutes } from './routes-list';

export const ProtectedRoute: FC<PropsWithChildren> = props => {
  const { children } = props;

  const { isAuthorized } = useContext(AuthContext);

  const { pathname: currentURL } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigate(ERoutes.Login);
    }
  }, [isAuthorized, currentURL]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
