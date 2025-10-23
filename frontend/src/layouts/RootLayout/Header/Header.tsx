import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AuthService } from '#api';
// import { UserOutlined } from '@ant-design/icons';
// import { StatusCodes } from 'http-status-codes';
// import { AuthService } from '#api';
import { ThemeSwitcher } from '#common-components';
import { QuestionIcon } from '#icons';
import { AuthContext } from '#src/global-contexts';
// import { AUTHORIZED_USER_ID_FIELD_NAME } from '#common-constants';
// import { AuthContext } from '#src/global-contexts';
import { ERoutes } from '#src/router';

// import {
//   HeaderNavigationItemStyled,
//   HeaderNavigationPanelStyled,
//   HeaderStyled,
// } from './styled';
// import { THeaderNavigationPanel } from './types';

export const Header = () => {
  const {
    authorizedUserData,
    // isAuthorized,
    // updateIsAuthorized,
    // updateAccessToken,
    // updateAuthorizedUserData,
  } = useContext(AuthContext);
  const { userName } = authorizedUserData || {};

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isWebAppActive = pathname.includes(ERoutes.WebApp);

  // const leftElementsGroup = useMemo<THeaderNavigationPanel>(
  //   () => [
  //     {
  //       href: ERoutes.Dashboard,
  //       isActive: pathname.includes(ERoutes.WebApp),
  //       label: '/ Web App',
  //     },
  //   ],
  //   [pathname],
  // );

  // const userProfilePanel = useMemo<ReactNode>(
  //   () => (
  //     <div key='profile'>
  //       {isAuthorized ? <span>{userName}</span> : <span>Guest</span>}
  //       {/* <Tooltip title={isAuthorized ? 'Logout' : 'Login'}> */}
  //       {isAuthorized ? (
  //         <button
  //           type='button'
  //           onClick={() =>
  //             AuthService.logout().then(() => navigate(ERoutes.Landing))
  //           }
  //         >
  //           <svg
  //             xmlns='http://www.w3.org/2000/svg'
  //             height='24px'
  //             viewBox='0 -960 960 960'
  //             width='24px'
  //             fill='#e3e3e3'
  //           >
  //             <path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z' />
  //           </svg>
  //         </button>
  //       ) : (
  //         <button type='button' onClick={() => navigate(ERoutes.Login)}>
  //           <svg
  //             xmlns='http://www.w3.org/2000/svg'
  //             height='24px'
  //             viewBox='0 -960 960 960'
  //             width='24px'
  //             fill='#e3e3e3'
  //           >
  //             <path d='M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z' />
  //           </svg>
  //         </button>
  //       )}
  //     </div>
  //   ),
  //   [isAuthorized, userName],
  // );

  return (
    <div className='navbar bg-base-100 shadow-sm'>
      <div className='navbar-start'>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <h1 className='btn btn-ghost text-xl' onClick={() => navigate('/')}>
          <span style={{ color: 'var(--mt-color-secondary-1)' }}>Mock</span>
          <span style={{ color: 'var(--mt-color-primary-1)' }}>Tail</span>
        </h1>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <button
              type='button'
              className='btn btn-ghost'
              style={{
                backgroundColor: isWebAppActive
                  ? 'var(--mt-color-primary-1)'
                  : 'transparent',
                color: isWebAppActive ? 'white' : 'inherit',
              }}
              onClick={() => navigate(ERoutes.Dashboard)}
            >
              / Web App
            </button>
          </li>
        </ul>
      </div>
      <div className='navbar-end'>
        <div>
          <span>{userName || 'Guest'}</span>
          <ThemeSwitcher />
          {/* <button type='button' className='btn btn-ghost btn-circle'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z'
              />
            </svg>
          </button> */}
        </div>
        <button className='btn btn-ghost btn-circle' type='button'>
          <QuestionIcon />
        </button>
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn m-1'>
            Click ⬇️
          </div>
          <ul
            tabIndex={-1}
            className='dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm'
          >
            <li>
              <ThemeSwitcher />
            </li>
            <li>
              <button
                onClick={() => AuthService.logout().then(() => navigate('/'))}
                type='button'
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
