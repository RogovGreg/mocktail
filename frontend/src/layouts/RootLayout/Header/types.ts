import { ERoutes } from '#src/router';

export type THeaderNavigationButtonConfig = Readonly<{
  label: string;
  isActive: boolean;
  href: ERoutes;
}>;

export type THeaderNavigationPanel = Readonly<
  Array<THeaderNavigationButtonConfig>
>;
