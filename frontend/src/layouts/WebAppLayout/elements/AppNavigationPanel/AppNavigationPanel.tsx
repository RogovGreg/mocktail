import { ReactNode, useMemo } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { AppNavigationPanelStyled } from './styled';

export const AppNavigationPanel: React.FC = () => {
  const { projectId } = useParams();

  const dynamicPartOfNavigationPanel = useMemo<ReactNode>(() => {
    if (projectId) {
      return (
        <>
          <hr />
          <ul>
            <li>
              <Link to={`/app/projects/${projectId}`}>Project Main Page</Link>
            </li>
            <li>
              <ul>
                <li>
                  <Link to={`/app/projects/${projectId}/templates`}>
                    Templates
                  </Link>
                </li>
                <li>
                  <Link to={`/app/projects/${projectId}/members`}>Members</Link>
                </li>
              </ul>
            </li>
          </ul>
        </>
      );
    }

    return null;
  }, [projectId]);

  return (
    <AppNavigationPanelStyled>
      <ul>
        <li>
          <Link to='/app/dashboard'>Dashboard</Link>
        </li>
        <li>
          <Link to='/app/projects'>Projects</Link>
        </li>
      </ul>
      {dynamicPartOfNavigationPanel}
    </AppNavigationPanelStyled>
  );
};
