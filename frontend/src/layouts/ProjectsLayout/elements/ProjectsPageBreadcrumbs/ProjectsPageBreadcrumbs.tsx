import { Link, useMatches, useParams } from 'react-router-dom';

import { useProjectsItemQuery, useTemplatesItemQuery } from '#api';

export const ProjectsPageBreadcrumbs: React.FC = () => {
  const matches = useMatches();

  const { projectId, templateId } = useParams();

  const { data: project } = useProjectsItemQuery(
    projectId ? { id: projectId } : undefined,
    {
      enabled: Boolean(projectId),
    },
  );

  const { data: template } = useTemplatesItemQuery(
    templateId ? { id: templateId } : undefined,
    {
      enabled: Boolean(templateId),
    },
  );

  const breadcrumbs = matches
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .filter(match => match.handle?.crumb)
    .map((match, index, filteredMatches) => {
      const isLast = index === filteredMatches.length - 1;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { crumb } = match.handle;

      if (crumb === 'Project') {
        return {
          isLast,
          label: project?.title || 'Project Details',
          path: match.pathname,
        };
      }

      if (crumb === 'Template') {
        return {
          isLast,
          label: template?.name || 'Template Details',
          path: match.pathname,
        };
      }

      return {
        isLast,
        label: crumb,
        path: match.pathname,
      };
    });

  return (
    <div className='breadcrumbs text-sm px-6 py-1'>
      <ul>
        {breadcrumbs.map(crumb => (
          <li key={crumb.path}>
            {crumb.isLast ? (
              <span>{crumb.label}</span>
            ) : (
              <Link to={crumb.path}>{crumb.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
