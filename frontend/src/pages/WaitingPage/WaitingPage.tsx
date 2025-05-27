import { useEffect, useState } from 'react';

import { MocktailLoadingIcon } from '#common-components';

import './styled.css';

export const WaitingPage = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>
        <span style={{ color: '#00FFFF' }}>Mock</span>
        <span style={{ color: '#FF5900' }}>Tail</span>
      </h1>
      <MocktailLoadingIcon />
      <span>Loading{'.'.repeat(dotCount)}</span>
    </div>
  );
};
