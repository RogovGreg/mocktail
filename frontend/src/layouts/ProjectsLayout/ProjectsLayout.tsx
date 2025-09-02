import { Outlet } from 'react-router-dom';

import { ProjectsPageBreadcrumbs } from './elements';

export const ProjectLayout: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <ProjectsPageBreadcrumbs />
    <Outlet />
  </div>
);
