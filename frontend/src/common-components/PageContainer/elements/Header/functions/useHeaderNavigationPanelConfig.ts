import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { ERoutes } from '#src/router';
import { PROTECTED_ROUTES } from '#src/router/routes';

import { THeaderNavigationPanel } from '../types';

export const useHeaderNavigationPanelConfig = (): THeaderNavigationPanel => {
  const { pathname: currentURL } = useLocation();

  const isNowOnWebApp = useMemo<boolean>(
    () => PROTECTED_ROUTES.includes(currentURL as ERoutes),
    [currentURL],
  );

  return useMemo<THeaderNavigationPanel>(() => {
    if (isNowOnWebApp) {
      return [
        {
          href: ERoutes.Dashboard,
          isActive: currentURL === ERoutes.Dashboard,
          label: 'Dashboard',
        },
        {
          href: ERoutes.Projects,
          isActive: currentURL === ERoutes.Projects,
          label: 'Projects',
        },
        {
          href: ERoutes.TemplatesDemo,
          isActive: currentURL === ERoutes.TemplatesDemo,
          label: 'Templates Demo',
        },
      ];
    }

    return [
      {
        href: ERoutes.About,
        isActive: currentURL === ERoutes.About,
        label: 'About',
      },
      {
        href: ERoutes.Docs,
        isActive: currentURL === ERoutes.Docs,
        label: 'Docs',
      },
      {
        href: ERoutes.Support,
        isActive: currentURL === ERoutes.Support,
        label: 'Support',
      },
      {
        href: ERoutes.Dashboard,
        isActive: isNowOnWebApp,
        label: 'Web App',
      },
    ];
  }, [isNowOnWebApp, currentURL]);
};
