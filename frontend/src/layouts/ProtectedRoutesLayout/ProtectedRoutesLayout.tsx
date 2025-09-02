import { FC, PropsWithChildren, useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { AuthContext } from '#src/global-contexts';

export const ProtectedLayout: FC<PropsWithChildren> = () => {
  const { isAuthorized } = useContext(AuthContext);
  const location = useLocation();

  if (isAuthorized === null) {
    return <div>Loading</div>;
  }

  if (!isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
