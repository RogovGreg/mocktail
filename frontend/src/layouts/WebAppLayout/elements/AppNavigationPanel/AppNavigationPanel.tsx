import { ReactNode, useContext, useMemo } from 'react';
import {
  Link,
  Params,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

import { TTemplate, useProjectsListQuery, useTemplatesListQuery } from '#api';
import { AuthContext } from '#global-contexts';
import {
  ApiTokensIcon,
  // DashboardIcon,
  LinkIcon,
  PlusIcon,
  ProjectsIcon,
  ProjectsItemIcon,
  TemplatesIcon,
  TemplatesItemIcon,
} from '#icons';

export const AppNavigationPanel: React.FC = () => {
  const params: Readonly<Params<string>> = useParams();
  const { projectId, templateId } = params || {};

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { authorizedUserData } = useContext(AuthContext);
  const { id: userID } = authorizedUserData || {};

  const { isProjectsActive } = useMemo(
    () => ({
      // isDashboardActive: pathname.includes('/app/dashboard'),
      isProjectsActive:
        pathname.includes('/app/projects') && !projectId && !templateId,
    }),
    [projectId, templateId, pathname],
  );

  const { data: userProjectsList } = useProjectsListQuery(
    userID ? { createdBy: userID } : undefined,
    { enabled: Boolean(userID) },
  );

  const relatedProjectIds = useMemo<Array<string>>(
    () => userProjectsList?.map(project => project.id) || [],
    [userProjectsList],
  );

  const { data: allUserProjectsTemplates } = useTemplatesListQuery(
    {
      relatedProjectIds,
    },
    { enabled: relatedProjectIds.length > 0 },
  );

  const userProjectTemplatesList = useMemo<
    Record<string, Array<TTemplate>>
  >(() => {
    if (!allUserProjectsTemplates) {
      return {};
    }

    return allUserProjectsTemplates.reduce<Record<string, Array<TTemplate>>>(
      (accumulator, templateItem) => {
        const { relatedProjectId: projectId } = templateItem;

        if (accumulator[projectId]) {
          accumulator[projectId].push(templateItem);
        } else {
          accumulator[projectId] = [templateItem];
        }

        return accumulator;
      },
      {},
    );
  }, [allUserProjectsTemplates]);

  const navBarProjectsTree = useMemo<ReactNode | Array<ReactNode>>(() => {
    if (!userProjectsList?.length) {
      return null;
    }

    return userProjectsList.map<ReactNode>(usersProject => {
      const { id: usersProjectID, title: usersProjectTitle } = usersProject;

      const isTemplateOfThisProjectOpened = Boolean(
        projectId === usersProjectID &&
          templateId &&
          userProjectTemplatesList[usersProjectID]?.find(
            template => template.id === templateId,
          ),
      );
      const isTemplatesActive: boolean =
        pathname.includes('/templates') &&
        !templateId &&
        projectId === usersProjectID;

      const isApiTokensActive: boolean =
        pathname.includes('/api-tokens') && projectId === usersProjectID;

      const projectTemplatesList: Array<TTemplate> =
        userProjectTemplatesList[usersProjectID] || [];

      const isProjectsItemActive: boolean =
        projectId === usersProjectID &&
        !isApiTokensActive &&
        !isTemplatesActive &&
        !templateId;

      return (
        <li key={usersProjectID}>
          <details open={usersProjectID === projectId}>
            <summary className={isProjectsItemActive ? 'active' : undefined}>
              <ProjectsItemIcon />
              <span>{usersProjectTitle}</span>
              <div className='tooltip tooltip-left' data-tip='Project overview'>
                <Link
                  to={`/app/projects/${usersProjectID}`}
                  className='btn btn-ghost btn-xs btn-square'
                >
                  <LinkIcon />
                </Link>
              </div>
            </summary>
            <ul>
              <li>
                <Link
                  to={`/app/projects/${usersProjectID}/api-tokens`}
                  className={isApiTokensActive ? 'active' : undefined}
                >
                  <ApiTokensIcon />
                  <span>API Tokens</span>
                </Link>
              </li>
              <li>
                <details open={isTemplateOfThisProjectOpened}>
                  <summary className={isTemplatesActive ? 'active' : undefined}>
                    <TemplatesIcon />
                    <span>Templates</span>
                    <div>
                      <div
                        className='tooltip tooltip-left'
                        data-tip="Project's templates overview"
                      >
                        <Link
                          to={`/app/projects/${usersProjectID}/templates`}
                          className='btn btn-ghost btn-xs btn-square'
                        >
                          <LinkIcon />
                        </Link>
                      </div>
                      <div
                        className='tooltip tooltip-left'
                        data-tip='Create new template'
                      >
                        <button
                          type='button'
                          onClick={event => {
                            event.preventDefault();
                            navigate(
                              `/app/projects/${usersProjectID}/templates/create`,
                            );
                          }}
                          className='btn btn-ghost btn-xs btn-square'
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </div>
                  </summary>
                  {projectTemplatesList.length > 0 && (
                    <ul>
                      {projectTemplatesList.map(projectTemplate => {
                        const {
                          id: projectTemplateID,
                          name: projectTemplateName,
                        } = projectTemplate;

                        const isTemplatesItemActive: boolean =
                          projectId === usersProjectID &&
                          templateId === projectTemplateID;

                        return (
                          <li key={projectTemplateID}>
                            <Link
                              to={`/app/projects/${usersProjectID}/templates/${projectTemplateID}`}
                              className={
                                isTemplatesItemActive ? 'active' : undefined
                              }
                            >
                              <TemplatesItemIcon />
                              <span>{projectTemplateName}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </details>
              </li>
            </ul>
          </details>
        </li>
      );
    });
  }, [
    projectId,
    templateId,
    userProjectsList,
    userProjectTemplatesList,
    pathname,
    navigate,
  ]);

  return (
    <ul className='menu menu-xs bg-base-200 h-full min-w-xs w-64 flex-shrink-0'>
      {/* <li>
        <Link
          to='/app/dashboard'
          className={isDashboardActive ? 'active' : undefined}
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </Link>
      </li> */}
      <li>
        <Link
          to='/app/projects'
          className={isProjectsActive ? 'active' : undefined}
        >
          <ProjectsIcon />
          <span>Projects</span>
          <div className='tooltip tooltip-left' data-tip='Create new project'>
            <button
              type='button'
              onClick={event => {
                event.preventDefault();
                navigate('/app/projects/create');
              }}
              className='btn btn-ghost btn-xs btn-square'
            >
              <PlusIcon />
            </button>
          </div>
        </Link>
        {navBarProjectsTree ? <ul>{navBarProjectsTree}</ul> : null}
      </li>
    </ul>
  );
};
