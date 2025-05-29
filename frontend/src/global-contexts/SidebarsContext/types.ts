import { FunctionComponent } from 'react';

export type TSidebarConfig = Readonly<{
  width?: string;

  Component: FunctionComponent;
}>;

export type TSidebarsContextValue = Readonly<{
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;

  leftSidebarConfig: TSidebarConfig | null;
  rightSidebarConfig: TSidebarConfig | null;

  setLeftSidebarConfig: null | ((parameter: TSidebarConfig | null) => void);
  setRightSidebarConfig: null | ((parameter: TSidebarConfig | null) => void);
}>;

/**
 * const { openSidebar, closeRightSidebar, isRightSidebarOpen, isLeftSidebarOpen } = useRightSidebar({ onOpen, onClose });
 * const { openLeftSidebar, closeLeftSidebar } = useLeftSidebar({ onOpen, onClose });
 *
 * openSidebar({
 *  width: '200px',
 *  Component,
 *  side: 'right',
 * });
 *
 *
 */
