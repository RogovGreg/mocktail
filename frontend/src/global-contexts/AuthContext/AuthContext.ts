import React from 'react';

import { AUTH_CONTEXT_DEFAULT_VALUE } from './constants';
import { TAuthContextValue } from './types';

export const AuthContext = React.createContext<TAuthContextValue>(
  AUTH_CONTEXT_DEFAULT_VALUE,
);
