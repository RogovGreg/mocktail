import { ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '#api';
import { AUTHORIZED_USER_ID_FIELD_NAME } from '#common-constants';
import { AuthContext } from '#src/global-contexts';
import { ERoutes } from '#src/router';
import { useTheme } from '#src/theme';

import { ThemeSwitcher } from './elements';
import { useHeaderNavigationPanelConfig } from './functions';
import {
  HeaderNavigationItemStyled,
  HeaderNavigationPanelStyled,
  HeaderStyled,
} from './styled';

export const Header = () => {
  const {
    isAuthorized,
    updateIsAuthorized,
    updateAccessToken,
    updateAuthorizedUserData,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const { toggleTheme } = useTheme();

  const headerNavigationPanelConfig = useHeaderNavigationPanelConfig();

  const rightElementsGroup: Array<ReactNode> = useMemo(() => {
    if (isAuthorized) {
      return [
        <div key='theme-switcher'>
          <ThemeSwitcher />
        </div>,
        <HeaderNavigationItemStyled
          key='logout-button'
          onClick={async () => {
            if (
              updateIsAuthorized &&
              updateAccessToken &&
              updateAuthorizedUserData
            ) {
              await AuthService.logout().then(response => {
                if (response.status === StatusCodes.OK) {
                  updateIsAuthorized(false);
                  updateAccessToken({
                    expiresIn: null,
                    type: null,
                    value: null,
                  });
                  updateAuthorizedUserData(null);

                  sessionStorage.removeItem(AUTHORIZED_USER_ID_FIELD_NAME);

                  navigate(ERoutes.Login);
                }
              });
            }
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24px'
            viewBox='0 -960 960 960'
            width='24px'
            fill='#e3e3e3'
          >
            <path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z' />
          </svg>
        </HeaderNavigationItemStyled>,
      ];
    }

    return [];
  }, [isAuthorized, toggleTheme]);

  return (
    <HeaderStyled isAuthorized={Boolean(isAuthorized)}>
      <div>
        <h1
          style={{ display: 'flex', alignSelf: 'center', marginLeft: '10px' }}
        >
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {rightElementsGroup}
      </div>
    </HeaderStyled>
  );
};
