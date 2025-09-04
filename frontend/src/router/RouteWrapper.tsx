import { FC, PropsWithChildren, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';

// import { PageContainer } from '#common-components';
import { AuthContext } from '#src/global-contexts';

import { PROTECTED_ROUTES } from './routes';
import { ERoutes } from './routes-list';

export const RouteWrapper: FC<PropsWithChildren> = props => {
  const { children } = props;

  const { isAuthorized, authorizedUserData } = useContext(AuthContext);

  const { pathname: currentURL } = useLocation();
  const navigate = useNavigate();

  const isProtectedRoute: boolean = PROTECTED_ROUTES.some(route =>
    currentURL.startsWith(route),
  );

  if (isAuthorized === false && isProtectedRoute) {
    navigate(ERoutes.Login);

    return null;
  }

  console.log('RouteWrapper', { isAuthorized, authorizedUserData });

  // if (isAuthorized === null) {
  //   // TODO: Add a beautiful loading screen
  //   return <div>Loading</div>;
  // }

  // return (
  //   // <PageContainer>
  //     {children}
  //     {/* <Outlet /> */}
  //   // </PageContainer>
  // );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
