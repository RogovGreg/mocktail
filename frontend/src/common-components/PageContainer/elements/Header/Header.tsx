import { ReactNode, useContext, useEffect, useMemo } from 'react';

import { AuthContext } from '#src/global-contexts';

import { HeaderNavigateButtonStyled, HeaderStyled } from './styled';

export const Header = () => {
  useEffect(() => {
    console.log('Header did mount');

    return () => {
      console.log('Header will unmount');
    };
  }, []);

  const { isAuthorized } = useContext(AuthContext);

  console.log('> HEADER RENDER', isAuthorized);

  const leftElementsGroup: Array<ReactNode> = useMemo(() => {
    if (isAuthorized) {
      return [
        <HeaderNavigateButtonStyled key='dashboard-navigate-button'>
          Dashboard
        </HeaderNavigateButtonStyled>,
        <HeaderNavigateButtonStyled key='projects-navigate-button'>
          Projects
        </HeaderNavigateButtonStyled>,
      ];
    }

    return [
      <HeaderNavigateButtonStyled key='about-navigate-button'>
        About
      </HeaderNavigateButtonStyled>,
      <HeaderNavigateButtonStyled key='docs-navigate-button'>
        Docs
      </HeaderNavigateButtonStyled>,
      <HeaderNavigateButtonStyled key='support-navigate-button'>
        Support
      </HeaderNavigateButtonStyled>,
      <HeaderNavigateButtonStyled key='web-app-navigate-button'>
        Web App
      </HeaderNavigateButtonStyled>,
    ];
  }, [isAuthorized]);

  const rightElementsGroup: Array<ReactNode> = useMemo(() => {
    if (isAuthorized) {
      return [
        <HeaderNavigateButtonStyled key='logout-button'>
          Logout
        </HeaderNavigateButtonStyled>,
      ];
    }

    return [];
  }, [isAuthorized]);

  return (
    <HeaderStyled isAuthorized={Boolean(isAuthorized)}>
      <div>
        <h1 style={{ display: 'flex' }}>
          <span style={{ color: 'aqua' }}>Mock</span>
          <span style={{ color: 'orangered' }}>Tail</span>
        </h1>
        {leftElementsGroup}
      </div>
      <div>{rightElementsGroup}</div>
      {/* <button
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
      </button> */}
    </HeaderStyled>
  );
};
