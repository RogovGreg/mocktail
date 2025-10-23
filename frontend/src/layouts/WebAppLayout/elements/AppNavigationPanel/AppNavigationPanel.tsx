import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { BackendService } from '#api';
import { TProject, TTemplate } from '#api/services/BackendService/types';
import {
  ApiTokensIcon,
  DashboardIcon,
  LinkIcon,
  PlusIcon,
  ProjectsIcon,
  ProjectsItemIcon,
  TemplatesIcon,
  TemplatesItemIcon,
} from '#icons';
import { AuthContext } from '#src/global-contexts/AuthContext/AuthContext';

export const AppNavigationPanel: React.FC = () => {
  const params = useParams();
  const { projectId, templateId } = params || {};

  const { pathname } = useLocation();

  const { authorizedUserData } = useContext(AuthContext);
  const { id: userID } = authorizedUserData || {};

  const [userProjectsList, setUserProjectsList] = useState<Array<TProject>>([]);
  const [userProjectTemplatesList, setUserProjectTemplatesList] = useState<
    Record<string, Array<TTemplate>>
  >({});

  const {
    isApiTokensActive,
    isDashboardActive,
    isProjectsActive,
    isTemplatesActive,
  } = useMemo(
    () => ({
      isApiTokensActive: pathname.includes('/api-tokens') && Boolean(projectId),
      isDashboardActive: pathname.includes('/app/dashboard'),
      isProjectsActive:
        pathname.includes('/app/projects') && !projectId && !templateId,
      isTemplatesActive:
        pathname.includes('/templates') && Boolean(projectId) && !templateId,
    }),
    [projectId, templateId, pathname],
  );

  useEffect(() => {
    const fetchDataUsersProjectsData = async () => {
      const usersProjects = await BackendService.getProjectsList({
        query: { params: { createdBy: userID! } },
      }).then(response => response.data);

      const relatedProjectIds = usersProjects.map(project => project.id);

      const allTemplates = await BackendService.getTemplatesList({
        query: { params: { relatedProjectIds } },
      }).then(response => response.data);

      const usersProjectsTemplates = allTemplates.reduce<
        Record<string, Array<TTemplate>>
      >((accumulator, templateItem) => {
        const { relatedProjectId: projectId } = templateItem;

        if (accumulator[projectId]) {
          accumulator[projectId].push(templateItem);
        } else {
          accumulator[projectId] = [templateItem];
        }

        return accumulator;
      }, {});

      setUserProjectsList(usersProjects);
      setUserProjectTemplatesList(usersProjectsTemplates);
    };

    if (userID) {
      fetchDataUsersProjectsData();
    }
  }, [userID]);

  const navBarProjectsTree = useMemo<ReactNode | Array<ReactNode>>(() => {
    if (!userProjectsList.length) {
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
                        <button type='button'>
                          <Link
                            to={`/app/projects/${usersProjectID}/templates/create`}
                            className='btn btn-ghost btn-xs btn-square'
                          >
                            <PlusIcon />
                          </Link>
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
    isTemplatesActive,
    isApiTokensActive,
  ]);

  return (
    <ul className='menu menu-xs bg-base-200 h-full min-w-xs w-64 flex-shrink-0'>
      <li>
        <Link
          to='/app/dashboard'
          className={isDashboardActive ? 'active' : undefined}
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link
          to='/app/projects'
          className={isProjectsActive ? 'active' : undefined}
        >
          <ProjectsIcon />
          <span>Projects</span>
          <div className='tooltip tooltip-left' data-tip='Create new project'>
            <button type='button'>
              <Link
                to='/app/projects/create'
                className='btn btn-ghost btn-xs btn-square'
              >
                <PlusIcon />
              </Link>
            </button>
          </div>
        </Link>
        {navBarProjectsTree ? <ul>{navBarProjectsTree}</ul> : null}
      </li>
    </ul>
  );
};
