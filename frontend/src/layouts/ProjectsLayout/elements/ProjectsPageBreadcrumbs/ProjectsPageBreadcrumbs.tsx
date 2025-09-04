import { Link, useLocation } from 'react-router';

import { ProjectsPageBreadcrumbsStyled } from './styled';

export const ProjectsPageBreadcrumbs = () => {
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const pathSnippets: Array<string> = location.pathname
      .split('/')
      .filter(i => i);

    return pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const title = pathSnippets[index];

      return {
        title:
          index === pathSnippets.length - 1 ? (
            title.charAt(0).toUpperCase() + title.slice(1)
          ) : (
            <Link to={url}>
              {title.charAt(0).toUpperCase() + title.slice(1)}
            </Link>
          ),
      };
    });
  };

  return <ProjectsPageBreadcrumbsStyled items={getBreadcrumbItems()} />;
};
