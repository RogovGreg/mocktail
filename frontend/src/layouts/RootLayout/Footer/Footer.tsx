import packageInfo from '../../../../package.json';

export const Footer: React.FC = () => (
  <footer className='footer sm:footer-horizontal bg-neutral text-neutral-content justify-center items-center p-1 text-xs'>
    MockTail v{packageInfo.version} | 2024-2025
  </footer>
);
