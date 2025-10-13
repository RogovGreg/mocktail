import { Link, useMatches } from 'react-router-dom';

export const ProjectsPageBreadcrumbs: React.FC = () => {
  const matches = useMatches();

  const breadcrumbs = matches
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .filter(match => match.handle?.crumb)
    .map((match, index, filteredMatches) => {
      const isLast = index === filteredMatches.length - 1;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const label = match.handle.crumb(match.data, match.params);

      return {
        isLast,
        label,
        path: match.pathname,
      };
    });

  return (
    <div className='breadcrumbs text-sm p-4'>
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
