// import { useContext } from 'react';
import { Outlet } from 'react-router';

import { Footer } from './Footer';
// import { useSidebar } from '#src/common-functions';
// import { AuthContext } from '#src/global-contexts/AuthContext/AuthContext';
import { Header } from './Header';
// import { HorizontalSidebar, Overlay, PageContainerStyled } from './styled';
// import packageInfo from '../../../package.json';

export const RootLayout = () => (
  // const { isAuthorized } = useContext(AuthContext);

  // const {
  //   closeBothSidebars,
  //   isLeftSidebarOpen,
  //   isRightSidebarOpen,
  //   // rightSidebarConfig,
  //   // leftSidebarConfig,
  // } = useSidebar();

  // const { Component: RightSidebarBody } = rightSidebarConfig || {};
  // const { Component: LeftSidebarBody } = leftSidebarConfig || {};

  <div className='h-screen flex flex-col'>
    {/* <div
        // visible={isLeftSidebarOpen || isRightSidebarOpen}
        onClick={closeBothSidebars}
      /> */}
    <Header />
    <main className='flex flex-1 items-center justify-center'>
      <Outlet />
    </main>
    <Footer />
  </div>
);
