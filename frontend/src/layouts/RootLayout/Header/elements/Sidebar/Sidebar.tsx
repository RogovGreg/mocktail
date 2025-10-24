import { FC } from 'react';

export const Sidebar: FC = () => (
  <div className='drawer drawer-end'>
    <input id='my-drawer-5' type='checkbox' className='drawer-toggle' />
    <div className='drawer-side'>
      <label
        htmlFor='my-drawer-5'
        aria-label='close sidebar'
        className='drawer-overlay'
      />
      <div className='menu bg-base-200 min-h-full w-80 p-4 flex justify-center items-center'>
        Under Construction...
      </div>
    </div>
  </div>
);
