import { FC, PropsWithChildren } from 'react';

import { useSidebar } from '#src/common-functions';

import { Header } from './elements';
import { HorizontalSidebar, Overlay, PageContainerStyled } from './styled';

export const PageContainer: FC<PropsWithChildren> = props => {
  const { children } = props;

  const {
    // openLeftSidebar,
    // openRightSidebar,
    closeBothSidebars,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    rightSidebarConfig,
    leftSidebarConfig,
  } = useSidebar();

  const { Component: RightSidebarBody } = rightSidebarConfig || {};
  const { Component: LeftSidebarBody } = leftSidebarConfig || {};

  return (
    <PageContainerStyled>
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
        {children}
        <footer>Footer</footer>
      </main>
    </PageContainerStyled>
  );
};
