import React from "react";
import { TAuthContextValue } from "./types";
import { AUTH_CONTEXT_DEFAULT_VALUE } from "./constants";

export const AuthContext = React.createContext<TAuthContextValue>(AUTH_CONTEXT_DEFAULT_VALUE);