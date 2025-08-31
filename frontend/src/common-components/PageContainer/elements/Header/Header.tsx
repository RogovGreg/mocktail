import { ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router';
// import { UserOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

// import DropdownButton from 'antd/es/dropdown/dropdown-button';
// import { StatusCodes } from 'http-status-codes';
import { AuthService } from '#api';
// import { AUTHORIZED_USER_ID_FIELD_NAME } from '#common-constants';
import { AuthContext } from '#src/global-contexts';
import { ERoutes } from '#src/router';
import { useTheme } from '#src/theme';

import { ThemeSwitcher } from './elements';
import {
  HeaderNavigationItemStyled,
  HeaderNavigationPanelStyled,
  HeaderStyled,
} from './styled';
import { THeaderNavigationPanel } from './types';

export const Header = () => {
  const {
    authorizedUserData,
    isAuthorized,
    // updateIsAuthorized,
    // updateAccessToken,
    // updateAuthorizedUserData,
  } = useContext(AuthContext);
  const { userName } = authorizedUserData || {};

  const navigate = useNavigate();

  const { toggleTheme } = useTheme();

  const leftElementsGroup = useMemo<THeaderNavigationPanel>(
    () => [
      {
        href: ERoutes.About,
        isActive: false,
        label: 'About',
      },
      {
        href: ERoutes.Docs,
        isActive: false,
        label: 'Docs',
      },
      {
        href: ERoutes.Support,
        isActive: false,
        label: 'Support',
      },
      {
        href: ERoutes.Dashboard,
        isActive: false,
        label: 'Web App',
      },
    ],
    [],
  );

  const userProfilePanel = useMemo<ReactNode>(
    () => (
      <div key='profile'>
        {isAuthorized ? <span>{userName}</span> : <span>Guest</span>}
        <Tooltip title={isAuthorized ? 'Logout' : 'Login'}>
          {isAuthorized ? (
            <Button
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='24px'
                  viewBox='0 -960 960 960'
                  width='24px'
                  fill='#e3e3e3'
                >
                  <path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z' />
                </svg>
              }
              onClick={() =>
                AuthService.logout().then(() => navigate(ERoutes.Landing))
              }
            />
          ) : (
            <Button
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='24px'
                  viewBox='0 -960 960 960'
                  width='24px'
                  fill='#e3e3e3'
                >
                  <path d='M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z' />
                </svg>
              }
              onClick={() => navigate(ERoutes.Login)}
            />
          )}
        </Tooltip>
      </div>
    ),
    [isAuthorized, userName],
  );

  const rightElementsGroup = useMemo<Array<ReactNode>>(
    () => [
      <div key='theme-switcher'>
        <ThemeSwitcher />
      </div>,
      userProfilePanel,
    ],
    [isAuthorized, toggleTheme, userName],
  );

  return (
    <HeaderStyled isAuthorized={Boolean(isAuthorized)}>
      <div>
        <h1
          style={{ alignSelf: 'center', display: 'flex', marginLeft: '10px' }}
        >
          <span style={{ color: 'aqua' }}>Mock</span>
          <span style={{ color: 'orangered' }}>Tail</span>
        </h1>
        <HeaderNavigationPanelStyled>
          {leftElementsGroup.map(item => {
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
      <div style={{ alignItems: 'center', display: 'flex' }}>
        {rightElementsGroup}
      </div>
    </HeaderStyled>
  );
};
