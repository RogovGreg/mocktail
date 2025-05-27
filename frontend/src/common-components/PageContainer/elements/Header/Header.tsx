import { ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { AuthContext } from '#src/global-contexts';
import { useTheme } from '#src/theme';

import { useHeaderNavigationPanelConfig } from './functions';
import {
  HeaderNavigateButtonStyled,
  HeaderNavigationItemStyled,
  HeaderNavigationPanelStyled,
  HeaderStyled,
} from './styled';

export const Header = () => {
  const { isAuthorized } = useContext(AuthContext);
  const navigate = useNavigate();

  const { toggleTheme } = useTheme();

  const headerNavigationPanelConfig = useHeaderNavigationPanelConfig();

  const rightElementsGroup: Array<ReactNode> = useMemo(() => {
    if (isAuthorized) {
      return [
        <HeaderNavigateButtonStyled onClick={toggleTheme} key='theme'>
          Switch theme
        </HeaderNavigateButtonStyled>,
        <HeaderNavigateButtonStyled key='logout-button'>
          Logout
        </HeaderNavigateButtonStyled>,
      ];
    }

    return [];
  }, [isAuthorized, toggleTheme]);

  return (
    <HeaderStyled isAuthorized={Boolean(isAuthorized)}>
      <div>
        <h1 style={{ display: 'flex' }}>
          <span style={{ color: 'aqua' }}>Mock</span>
          <span style={{ color: 'orangered' }}>Tail</span>
        </h1>
        <HeaderNavigationPanelStyled>
          {headerNavigationPanelConfig.map(item => {
            const { label, href, isActive } = item;

            return (
              <HeaderNavigationItemStyled
                key={label}
                type='button'
                isActive={isActive}
                onClick={() => navigate(href)}
              >
                {label}
              </HeaderNavigationItemStyled>
            );
          })}
        </HeaderNavigationPanelStyled>
      </div>
      <div>{rightElementsGroup}</div>
    </HeaderStyled>
  );
};
