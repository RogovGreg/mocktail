import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import { AuthService } from '#api';
import { AuthContext } from '#src/global-contexts';
import { ERoutes } from '#src/router';

const SERVICES = ['auth', 'backend', 'content'];
const PROTOCOL = 'http';
const HOST = 'localhost';

export const HomePage = () => {
  const [responses, setResponses] = useState<Record<string, string>>({});

  const test = useContext(AuthContext);
  console.log('>> ', test);

  const navigate = useNavigate();

  const checkService = async (service: string) => {
    try {
      console.log('> checkService', service);
      const response = await fetch(
        `${PROTOCOL}://${HOST}/api/v1/${service}/check-availability`,
        {
          method: 'GET',
          credentials: service === 'backend' ? 'omit' : 'include',
          headers: {
            Authorization: `${sessionStorage.getItem('tokenType')} ${sessionStorage.getItem('accessToken')}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error from ${service}: ${response.statusText}`);
      }

      const data = await response.json();

      setResponses(prev => ({
        ...prev,
        [service]: `Service: ${data.service}, Time: ${data.timestamp}`,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setResponses(prev => ({
        ...prev,
        [service]: `Error: ${error.message}`,
      }));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Check Service Availability</h1>
      <div style={{ marginBottom: '20px' }}>
        {SERVICES.map(service => (
          <button
            type='button'
            key={service}
            onClick={() => checkService(service)}
            style={{
              margin: '5px',
              padding: '10px 15px',
              cursor: 'pointer',
            }}
          >
            Check {service}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button
          type='button'
          onClick={async () => {
            await AuthService.logout().then(response => {
              if (response.status === 200) {
                navigate(ERoutes.Login);
              }
            });
          }}
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          Logout
        </button>
      </div>
      <div>
        <h2>Responses</h2>
        <ul>
          {Object.entries(responses).map(([service, response]) => (
            <li key={service}>
              <strong>{service}:</strong> {response}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
