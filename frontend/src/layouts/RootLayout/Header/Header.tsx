import { FC, ReactNode, useCallback, useContext, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

import { AuthContext } from '#global-contexts';
import { AccountIcon, LoginIcon, LogoutIcon, QuestionIcon } from '#icons';
import { ERoutes } from '#router';

import { Sidebar, ThemeSwitcher } from './elements';

export const Header: FC = () => {
  const { authorizedUserData, isAuthorized, userLogout } =
    useContext(AuthContext);
  const { userName } = authorizedUserData || {};

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isWebAppActive = pathname.includes(ERoutes.WebApp);

  const icon = isAuthorized ? (
    <LogoutIcon className='size-7' />
  ) : (
    <LoginIcon className='size-7' />
  );

  const onLogin = () => navigate('/login');
  const onLogout = useCallback(() => {
    if (userLogout) userLogout();
  }, [userLogout]);

  const userBadge = useMemo<ReactNode>(() => {
    let userBadgeContent: ReactNode;
    if (isAuthorized) {
      userBadgeContent = (
        <div
          className='tooltip tooltip-bottom group cursor-pointer'
          data-tip='Profile'
        >
          <Link
            to='/profile'
            className='join-item inline-flex items-center gap-2 rounded-full bg-base-200 h-10 px-3 text-sm
              transition-colors
              group-hover:bg-base-300 group-hover:text-[var(--mt-color-primary-1)]
              [&_svg]:transition-colors [&_svg]:fill-current [&_svg]:stroke-current'
          >
            <AccountIcon className='size-7' />
            <span className='max-w-[16ch] truncate'>{userName}</span>
          </Link>
        </div>
      );
    } else {
      userBadgeContent = (
        <div
          className='join-item inline-flex items-center gap-2 rounded-full bg-base-200/80 h-10 px-3 text-sm opacity-90'
          aria-disabled
        >
          <AccountIcon />
          <span>Guest</span>
        </div>
      );
    }

    return <div className='join items-center'>{userBadgeContent}</div>;
  }, [isAuthorized, navigate, userName]);

  return (
    <>
      <div className='navbar bg-base-100 shadow-sm'>
        <div className='navbar-start'>
          <button
            className='btn btn-ghost text-xl'
            onClick={() => navigate('/')}
            type='button'
          >
            <span style={{ color: 'var(--mt-color-secondary-4)' }}>Mock</span>
            <span style={{ color: 'var(--mt-color-primary-1)' }}>Tail</span>
          </button>
          <ul className='menu menu-horizontal px-1'>
            <li>
              <button
                type='button'
                className={`btn btn-ghost border-0 hover:border-0 transition-colors focus-visible:outline-none
                  ${
                    isWebAppActive
                      ? 'bg-[var(--mt-color-primary-1)] text-white hover:bg-[var(--mt-color-primary-1)]'
                      : 'hover:text-[var(--mt-color-primary-1)]'
                  }`}
                onClick={() => navigate(ERoutes.Dashboard)}
              >
                / Web App
              </button>
            </li>
          </ul>
        </div>
        <div className='navbar-end flex items-center gap-1'>
          <ThemeSwitcher />
          <label
            className='btn btn-ghost btn-circle tooltip tooltip-bottom hover:bg-base-300 hover:text-[var(--mt-color-primary-1)]
              [&_svg]:transition-colors [&_svg]:stroke-current'
            data-tip='Docs & Support'
            htmlFor='my-drawer-5'
          >
            <QuestionIcon className='size-7' />
          </label>
          {userBadge}
          <button
            type='button'
            onClick={isAuthorized ? onLogout : onLogin}
            className='btn btn-ghost btn-circle tooltip tooltip-bottom hover:bg-base-300 hover:text-[var(--mt-color-primary-1)]
              [&_svg]:transition-colors [&_svg]:fill-current'
            data-tip={isAuthorized ? 'Logout' : 'Login'}
          >
            {icon}
          </button>
        </div>
      </div>
      <Sidebar />
    </>
  );
};
