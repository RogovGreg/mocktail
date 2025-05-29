import { TSidebarConfig } from '#src/global-contexts';

export type TUseSidebarReturnValue = Readonly<{
  isLeftSidebarOpen: boolean;
  leftSidebarConfig: TSidebarConfig | null;
  openLeftSidebar: (leftSidebarConfig: TSidebarConfig) => void;
  closeLeftSidebar: () => void;

  isRightSidebarOpen: boolean;
  rightSidebarConfig: TSidebarConfig | null;
  openRightSidebar: (rightSidebarConfig: TSidebarConfig) => void;
  closeRightSidebar: () => void;

  closeBothSidebars: () => void;
}>;

export type TUseSidebarParameter = Readonly<{
  onLeftSidebarOpen?: () => void;
  onLeftSidebarClose?: () => void;
  onRightSidebarOpen?: () => void;
  onRightSidebarClose?: () => void;
  onBothSidebarsClose?: () => void;
}>;
