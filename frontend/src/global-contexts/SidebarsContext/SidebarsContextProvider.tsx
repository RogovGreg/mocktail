import { FC, PropsWithChildren, useMemo, useState } from 'react';

import { SidebarsContext } from './SidebarsContext';
import { TSidebarConfig, TSidebarsContextValue } from './types';

export const SidebarsContextProvider: FC<PropsWithChildren> = props => {
  const { children } = props;

  const [leftSidebarConfig, setLeftSidebarConfig] =
    useState<TSidebarConfig | null>(null);
  const [rightSidebarConfig, setRightSidebarConfig] =
    useState<TSidebarConfig | null>(null);

  const contextValue = useMemo<TSidebarsContextValue>(
    () => ({
      isLeftSidebarOpen: Boolean(leftSidebarConfig),
      isRightSidebarOpen: Boolean(rightSidebarConfig),

      leftSidebarConfig,
      rightSidebarConfig,

      setLeftSidebarConfig,
      setRightSidebarConfig,
    }),
    [
      leftSidebarConfig,
      setLeftSidebarConfig,
      rightSidebarConfig,
      setRightSidebarConfig,
    ],
  );

  return (
    <SidebarsContext.Provider value={contextValue}>
      {children}
    </SidebarsContext.Provider>
  );
};
