import { Outlet } from 'react-router';

import { Footer } from './Footer';
import { Header } from './Header';

export const RootLayout = () => (
  <div className='h-screen flex flex-col'>
    <Header />
    <main className='flex flex-1 items-center justify-center'>
      <Outlet />
    </main>
    <Footer />
    <div id='toast-container' className='toast toast-end toast-top z-50' />
  </div>
);
