import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { StatusCodes } from 'http-status-codes';

import { AuthService, BackendService, ContentService } from '#api';
import { MocktailLoadingIcon } from '#common-components';
import { AUTHORIZED_USER_ID_FIELD_NAME } from '#common-constants';
import { useSidebar } from '#src/common-functions';
import { AuthContext } from '#src/global-contexts';
import { ERoutes } from '#src/router';

import {
  EApiServices,
  TAvailabilityLog,
  TCheckServiceResponseHandler,
  TCheckServiceResponseHandler2,
} from './types';

const SidebarBodyTempComponent = () => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <MocktailLoadingIcon />
  </div>
);

export const DashboardPage = () => {
  const { updateIsAuthorized, updateAccessToken, updateAuthorizedUserData } =
    useContext(AuthContext);

  const [responses, setResponses] = useState<TAvailabilityLog>([]);

  const navigate = useNavigate();

  const { openLeftSidebar, openRightSidebar } = useSidebar();

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
      <h1>Sidebars</h1>
      <div>
        <button
          type='button'
          onClick={() =>
            openLeftSidebar({ Component: SidebarBodyTempComponent })
          }
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          Open Left Sidebar
        </button>
        <button
          type='button'
          onClick={() =>
            openRightSidebar({ Component: SidebarBodyTempComponent })
          }
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          Open Right Sidebar
        </button>
      </div>
      <h1>Pages:</h1>
      <div style={{ marginBottom: '20px' }}>
        <button
          type='button'
          onClick={() => navigate(ERoutes.Projects)}
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          To Projects page
        </button>
      </div>
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
          onClick={() => navigate(ERoutes.WaitingDemoPage)}
          style={{
            cursor: 'pointer',
            margin: '5px',
            padding: '10px 15px',
          }}
        >
          To Demo Waiting Page
        </button>
        <button
          type='button'
          onClick={async () => {
            if (
              updateIsAuthorized &&
              updateAccessToken &&
              updateAuthorizedUserData
            ) {
              await AuthService.logout().then(response => {
                if (response.status === StatusCodes.OK) {
                  updateIsAuthorized(false);
                  updateAccessToken({
                    expiresIn: null,
                    type: null,
                    value: null,
                  });
                  updateAuthorizedUserData(null);

                  sessionStorage.removeItem(AUTHORIZED_USER_ID_FIELD_NAME);

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
