import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { AppNavigationPanel } from './elements';

export const WebAppLayout: FC = () => (
  <div style={{ display: 'flex' }}>
    <AppNavigationPanel />
    <Outlet />
  </div>
);
