import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ERoutes } from '#src/router';

export const RegisterSuccessNotificationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(ERoutes.Login);
    }, 2000);
  }, []);

  return <div>Register Success</div>;
};
