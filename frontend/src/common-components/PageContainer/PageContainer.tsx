import { FC, PropsWithChildren, useContext } from 'react';

import { useSidebar } from '#src/common-functions';
import { AuthContext } from '#src/global-contexts/AuthContext/AuthContext';

import { Header } from './elements';
import { HorizontalSidebar, Overlay, PageContainerStyled } from './styled';

export const PageContainer: FC<PropsWithChildren> = props => {
  const { children } = props;

  const { isAuthorized } = useContext(AuthContext);

  const {
    closeBothSidebars,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    rightSidebarConfig,
    leftSidebarConfig,
  } = useSidebar();

  const { Component: LeftSidebarBody } = leftSidebarConfig || {};
  const { Component: RightSidebarBody, width: rightSidebarWidth } =
    rightSidebarConfig || {};

  return (
    <PageContainerStyled isAuthorized={Boolean(isAuthorized)}>
      <HorizontalSidebar side='left' active={isLeftSidebarOpen}>
        {LeftSidebarBody ? <LeftSidebarBody /> : null}
      </HorizontalSidebar>
      <HorizontalSidebar
        side='right'
        active={isRightSidebarOpen}
        width={rightSidebarWidth}
      >
        {RightSidebarBody ? <RightSidebarBody /> : null}
      </HorizontalSidebar>
      <Overlay
        visible={isLeftSidebarOpen || isRightSidebarOpen}
        onClick={closeBothSidebars}
      />
      <Header />
      <main>
        {children}
        <footer>MockTail | 2024-2025</footer>
      </main>
    </PageContainerStyled>
  );
};
