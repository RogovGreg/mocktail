import { FC, PropsWithChildren } from 'react';

import { useSidebar } from '#src/common-functions';

import { HorizontalSidebar, Overlay, PageContainerStyled } from './styled';

export const TestComponent: FC = () => <div>TestSidebarComponent</div>;

export const PageContainer: FC<PropsWithChildren> = props => {
  const { children } = props;

  const {
    openLeftSidebar,
    openRightSidebar,
    closeBothSidebars,
    isLeftSidebarOpen,
    isRightSidebarOpen,
  } = useSidebar();

  return (
    <PageContainerStyled>
      <HorizontalSidebar side='left' active={isLeftSidebarOpen}>
        Left SideBar
      </HorizontalSidebar>
      <HorizontalSidebar side='right' active={isRightSidebarOpen}>
        Right SideBar
      </HorizontalSidebar>
      <Overlay
        visible={isLeftSidebarOpen || isRightSidebarOpen}
        onClick={closeBothSidebars}
      />
      <header style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          type='button'
          onClick={() => openLeftSidebar({ Component: TestComponent })}
        >
          Open left Sidebar
        </button>
        <button
          type='button'
          onClick={() => {
            openLeftSidebar({ Component: TestComponent });
            openRightSidebar({ Component: TestComponent });
          }}
        >
          Open both Sidebar
        </button>
        <button
          type='button'
          onClick={() => openRightSidebar({ Component: TestComponent })}
        >
          Open Right Sidebar
        </button>
      </header>
      {children}
      <footer>Footer</footer>
    </PageContainerStyled>
  );
};
