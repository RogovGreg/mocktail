import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { StatusCodes } from 'http-status-codes';

import { AuthService, BackendService, ContentService } from '#api';
import { AuthContext } from '#src/global-contexts';
import { ERoutes } from '#src/router';

import {
  EApiServices,
  TAvailabilityLog,
  TCheckServiceResponseHandler,
  TCheckServiceResponseHandler2,
} from './types';

export const HomePage = () => {
  const { updateIsAuthorized } = useContext(AuthContext);

  const [responses, setResponses] = useState<TAvailabilityLog>([]);

  const navigate = useNavigate();

  const checkServiceResponseSuccessHandler: TCheckServiceResponseHandler = (
    response,
    service,
  ) => {
    setResponses([
      ...responses,
      {
        message: `service is available at ${response.data.timestamp}`,
        service,
      },
    ]);
  };

  const checkServiceResponseFailureHandler: TCheckServiceResponseHandler2 = (
    error,
    service,
  ) => {
    setResponses([
      ...responses,
      {
        message: `service is not available with status - ${error.status}`,
        service,
      },
    ]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Check Service Availability</h1>
      <div style={{ marginBottom: '20px' }}>
        <button
          type='button'
          onClick={() =>
            AuthService.checkAvailability().then(
              response =>
                checkServiceResponseSuccessHandler(response, EApiServices.Auth),
              error =>
                checkServiceResponseFailureHandler(error, EApiServices.Auth),
            )
          }
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          Check Auth Service
        </button>
        <button
          type='button'
          onClick={() =>
            BackendService.checkAvailability().then(
              response =>
                checkServiceResponseSuccessHandler(
                  response,
                  EApiServices.Backend,
                ),
              error =>
                checkServiceResponseFailureHandler(error, EApiServices.Backend),
            )
          }
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          Check Backend Service
        </button>
        <button
          type='button'
          onClick={() =>
            ContentService.checkAvailability().then(
              response =>
                checkServiceResponseSuccessHandler(
                  response,
                  EApiServices.Content,
                ),
              error =>
                checkServiceResponseFailureHandler(error, EApiServices.Content),
            )
          }
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          Check Content Service
        </button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button
          type='button'
          onClick={() => AuthService.checkStatus()}
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          Check Status
        </button>
        <button
          type='button'
          onClick={() => AuthService.getProfile()}
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          Get Profile
        </button>
        <button
          type='button'
          onClick={async () => {
            if (updateIsAuthorized) {
              await AuthService.logout().then(response => {
                if (response.status === StatusCodes.OK) {
                  updateIsAuthorized(false);

                  navigate(ERoutes.Login);
                }
              });
            }
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
          {responses.map(response => {
            const { service, message } = response;
            return (
              <li key={`${service}: ${message}`} style={{ textAlign: 'left' }}>
                <strong>{service}: </strong>
                <span>{message}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
