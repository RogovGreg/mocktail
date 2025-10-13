import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { AppNavigationPanel } from './elements';

export const WebAppLayout: FC = () => (
  <div className='flex h-full w-full'>
    <AppNavigationPanel />
    <div className='flex-1 overflow-auto'>
      <Outlet />
    </div>
  </div>
);
