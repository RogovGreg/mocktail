import { FC, PropsWithChildren } from 'react';

import { useSidebar } from '#src/common-functions';

import { Header } from './elements';
import { HorizontalSidebar, Overlay, PageContainerStyled } from './styled';

export const PageContainer: FC<PropsWithChildren> = props => {
  const { children } = props;

  const {
    closeBothSidebars,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    rightSidebarConfig,
    leftSidebarConfig,
  } = useSidebar();

  const { Component: LeftSidebarBody, width: leftSidebarWidth } =
    leftSidebarConfig || {};
  const { Component: RightSidebarBody, width: rightSidebarWidth } =
    rightSidebarConfig || {};

  return (
    <PageContainerStyled>
      <HorizontalSidebar
        side='left'
        active={isLeftSidebarOpen}
        width={leftSidebarWidth}
      >
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
