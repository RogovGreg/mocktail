// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Router } from './router/Router.tsx';
// import './index.css';
import './app.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Router />,
  // </StrictMode>,
);
