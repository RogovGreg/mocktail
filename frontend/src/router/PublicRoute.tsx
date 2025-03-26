import { FC, PropsWithChildren } from 'react';

export const PublicRoute: FC<PropsWithChildren> = props => {
  const { children } = props;

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
