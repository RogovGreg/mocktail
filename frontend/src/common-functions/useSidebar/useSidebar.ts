import { useCallback, useContext, useEffect, useMemo } from 'react';

import { SidebarsContext, TSidebarConfig } from '#src/global-contexts';

import { TUseSidebarParameter, TUseSidebarReturnValue } from './types';
import { usePrevious } from '../usePrevious';

export const useSidebar = (
  parameter?: TUseSidebarParameter,
): TUseSidebarReturnValue => {
  const {
    onLeftSidebarOpen,
    onLeftSidebarClose,
    onRightSidebarOpen,
    onRightSidebarClose,
    onBothSidebarsClose,
  } = parameter || {};

  const {
    leftSidebarConfig: currentLeftSidebarConfig,
    rightSidebarConfig: currentRightSidebarConfig,
    setLeftSidebarConfig,
    setRightSidebarConfig,
  } = useContext(SidebarsContext);

  const prevLeftSidebarConfig: TSidebarConfig | undefined = usePrevious(
    currentLeftSidebarConfig || undefined,
  );
  const prevRightSidebarConfig: TSidebarConfig | undefined = usePrevious(
    currentRightSidebarConfig || undefined,
  );

  const leftSidebarJustOpened = Boolean(
    currentLeftSidebarConfig && !prevLeftSidebarConfig,
  );
  const leftSidebarJustClosed = Boolean(
    !currentLeftSidebarConfig && prevLeftSidebarConfig,
  );
  const rightSidebarJustOpened = Boolean(
    currentRightSidebarConfig && !prevRightSidebarConfig,
  );
  const rightSidebarJustClosed = Boolean(
    !currentRightSidebarConfig && prevRightSidebarConfig,
  );

  const bothSidebarsJustClosed: boolean =
    leftSidebarJustClosed && rightSidebarJustClosed;

  useEffect(() => {
    if (leftSidebarJustOpened && onLeftSidebarOpen) onLeftSidebarOpen();
    if (leftSidebarJustClosed && onLeftSidebarClose) onLeftSidebarClose();

    if (rightSidebarJustOpened && onRightSidebarOpen) onRightSidebarOpen();
    if (rightSidebarJustClosed && onRightSidebarClose) onRightSidebarClose();

    if (
      leftSidebarJustClosed &&
      rightSidebarJustClosed &&
      onBothSidebarsClose
    ) {
      onBothSidebarsClose();
    }
  }, [
    leftSidebarJustClosed,
    leftSidebarJustOpened,
    onLeftSidebarOpen,
    onLeftSidebarClose,
    rightSidebarJustClosed,
    rightSidebarJustOpened,
    onRightSidebarClose,
    onRightSidebarOpen,
    bothSidebarsJustClosed,
    onBothSidebarsClose,
  ]);

  const openLeftSidebar = useCallback(
    (leftSidebarConfig: TSidebarConfig): void => {
      if (setLeftSidebarConfig) {
        setLeftSidebarConfig(leftSidebarConfig);
        return;
      }

      throw new Error('The left sidebar cannot be opened');
    },
    [setLeftSidebarConfig],
  );

  const closeLeftSidebar = useCallback((): void => {
    if (setLeftSidebarConfig) {
      setLeftSidebarConfig(null);
      return;
    }

    throw new Error('The left sidebar cannot be closed');
  }, [setLeftSidebarConfig]);

  const openRightSidebar = useCallback(
    (rightSidebarConfig: TSidebarConfig): void => {
      if (setRightSidebarConfig) {
        setRightSidebarConfig(rightSidebarConfig);
        return;
      }

      throw new Error('The right sidebar cannot be opened');
    },
    [setRightSidebarConfig],
  );

  const closeRightSidebar = useCallback((): void => {
    if (setRightSidebarConfig) {
      setRightSidebarConfig(null);
      return;
    }

    throw new Error('The right sidebar cannot be closed');
  }, [setRightSidebarConfig]);

  const closeBothSidebars = useCallback((): void => {
    if (setLeftSidebarConfig && setRightSidebarConfig) {
      setLeftSidebarConfig(null);
      setRightSidebarConfig(null);
      return;
    }

    throw new Error('The sidebars cannot be closed');
  }, [setLeftSidebarConfig, setRightSidebarConfig]);

  return useMemo<TUseSidebarReturnValue>(
    () => ({
      closeLeftSidebar,
      isLeftSidebarOpen: Boolean(currentLeftSidebarConfig),
      leftSidebarConfig: currentLeftSidebarConfig,
      openLeftSidebar,

      closeRightSidebar,
      isRightSidebarOpen: Boolean(currentRightSidebarConfig),
      openRightSidebar,
      rightSidebarConfig: currentRightSidebarConfig,

      closeBothSidebars,
    }),
    [
      closeBothSidebars,
      closeLeftSidebar,
      closeRightSidebar,
      currentLeftSidebarConfig,
      currentRightSidebarConfig,
      currentRightSidebarConfig,
      openLeftSidebar,
      openRightSidebar,
    ],
  );
};
