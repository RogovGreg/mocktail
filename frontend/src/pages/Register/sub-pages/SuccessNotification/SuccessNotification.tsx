import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { MocktailLoadingIcon } from '#common-components';
import { ERoutes } from '#src/router';

export const RegisterSuccessNotificationPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(ERoutes.Login);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className='flex flex-col items-center justify-center gap-6 p-6'>
      <MocktailLoadingIcon />

      <h1 className='text-4xl font-bold'>Registration Successful!</h1>

      <p className='text-base-content/60 text-sm'>
        Redirecting to login page in {countdown}s
      </p>
    </div>
  );
};
