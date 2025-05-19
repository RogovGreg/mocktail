import React from 'react';

import { TSidebarsContextValue } from './types';

export const SidebarsContext = React.createContext<TSidebarsContextValue>({
  isLeftSidebarOpen: false,
  isRightSidebarOpen: false,

  leftSidebarConfig: null,
  rightSidebarConfig: null,

  setLeftSidebarConfig: null,
  setRightSidebarConfig: null,
});
