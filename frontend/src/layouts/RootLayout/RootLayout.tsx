import { useContext } from 'react';
import { Outlet } from 'react-router';

import { useSidebar } from '#src/common-functions';
import { AuthContext } from '#src/global-contexts/AuthContext/AuthContext';
import { useTheme } from '#src/theme';

import { Header } from './Header';
import { HorizontalSidebar, Overlay, PageContainerStyled } from './styled';
import packageInfo from '../../../package.json';

export const RootLayout = () => {
  const { isAuthorized } = useContext(AuthContext);
  const { darkMode } = useTheme();

  const {
    closeBothSidebars,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    rightSidebarConfig,
    leftSidebarConfig,
  } = useSidebar();

  const { Component: RightSidebarBody } = rightSidebarConfig || {};
  const { Component: LeftSidebarBody } = leftSidebarConfig || {};

  return (
    <PageContainerStyled
      isAuthorized={Boolean(isAuthorized)}
      darkMode={darkMode}
    >
      <HorizontalSidebar side='left' active={isLeftSidebarOpen}>
        {LeftSidebarBody ? <LeftSidebarBody /> : null}
      </HorizontalSidebar>
      <HorizontalSidebar side='right' active={isRightSidebarOpen}>
        {RightSidebarBody ? <RightSidebarBody /> : null}
      </HorizontalSidebar>
      <Overlay
        visible={isLeftSidebarOpen || isRightSidebarOpen}
        onClick={closeBothSidebars}
      />
      <Header />
      <main>
        <Outlet />
        <footer>v{packageInfo.version} | 2024-2025</footer>
      </main>
    </PageContainerStyled>
  );
};
