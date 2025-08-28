import { useContext } from 'react';
import { Outlet } from 'react-router';

import { Header } from '#src/common-components/PageContainer/elements';
import { useSidebar } from '#src/common-functions';
import { AuthContext } from '#src/global-contexts/AuthContext/AuthContext';

import { HorizontalSidebar, Overlay, PageContainerStyled } from './styled';

export const RootLayout = () => {
  const { isAuthorized } = useContext(AuthContext);

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
    <PageContainerStyled isAuthorized={Boolean(isAuthorized)}>
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
        <footer>MockTail | 2024-2025</footer>
      </main>
    </PageContainerStyled>
  );
};
