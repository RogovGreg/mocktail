import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';
// import { AuthContextProvider } from './global-contexts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <AuthContextProvider> */}
    <App />
    {/* </AuthContextProvider> */}
  </StrictMode>,
);
