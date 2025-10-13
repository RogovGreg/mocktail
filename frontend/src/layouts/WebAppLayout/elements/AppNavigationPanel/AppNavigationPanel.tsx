import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';

import { BackendService } from '#api';
import { TProject, TTemplate } from '#api/services/BackendService/types';
import { AuthContext } from '#src/global-contexts/AuthContext/AuthContext';

export const AppNavigationPanel: React.FC = () => {
  const { projectId, templateId } = useParams();

  const { authorizedUserData } = useContext(AuthContext);
  const { id: userID } = authorizedUserData || {};

  const [userProjectsList, setUserProjectsList] = useState<Array<TProject>>([]);
  const [userProjectTemplatesList, setUserProjectTemplatesList] = useState<
    Record<string, Array<TTemplate>>
  >({});

  useEffect(() => {
    const fetchDataUsersProjectsData = async () => {
      const usersProjects = await BackendService.getProjectsList({
        query: { params: { createdBy: userID! } },
      }).then(response => response.data);

      const templatePromises = usersProjects.map(async project => {
        const { id } = project;

        const templates = await BackendService.getTemplatesList({
          query: { params: { relatedProjectId: id } },
        }).then(response => response.data);

        return { projectId: id, templates };
      });

      const templateResults = await Promise.all(templatePromises);

      const usersProjectsTemplates = templateResults.reduce<
        Record<string, Array<TTemplate>>
      >((accumulator, { projectId, templates }) => {
        accumulator[projectId] = templates;
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

      if (!projectTemplatesList.length) {
        return (
          <li key={usersProjectID}>
            <Link to={`/app/projects/${usersProjectID}`}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-4 w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'
                />
              </svg>
              <span>{usersProjectTitle}</span>
            </Link>
          </li>
        );
      }

      return (
        <li key={usersProjectID}>
          <details open={usersProjectID === projectId}>
            <summary>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-4 w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'
                />
              </svg>
              <span>{usersProjectTitle}</span>
              <div className='tooltip tooltip-left' data-tip='Project overview'>
                <Link
                  to={`/app/projects/${usersProjectID}`}
                  className='btn btn-ghost btn-xs btn-square'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                    />
                  </svg>
                </Link>
              </div>
            </summary>
            <ul>
              <li>
                <details open={isTemplateOfThisProjectOpened}>
                  <summary>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                      fill='currentColor'
                      className='size-4'
                    >
                      <path d='M3 4.75a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6.25 3a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7ZM6.25 7.25a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7ZM6.25 11.5a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7ZM4 12.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM3 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z' />
                    </svg>
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
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-6'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                            />
                          </svg>
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
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1}
                              stroke='currentColor'
                              className='size-3'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M12 4.5v15m7.5-7.5h-15'
                              />
                            </svg>
                          </Link>
                        </button>
                      </div>
                    </div>
                  </summary>
                </details>
                <ul>
                  {projectTemplatesList.map(projectTemplate => {
                    const { id: projectTemplateID, name: projectTemplateName } =
                      projectTemplate;

                    return (
                      <li key={projectTemplateID}>
                        <Link
                          to={`/app/projects/${usersProjectID}/templates/${projectTemplateID}`}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 16 16'
                            fill='currentColor'
                            className='size-4'
                          >
                            <path
                              fillRule='evenodd'
                              d='M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm1 5.75A.75.75 0 0 1 5.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 7.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z'
                              clipRule='evenodd'
                            />
                          </svg>
                          <span>{projectTemplateName}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </details>
        </li>
      );
    });
  }, [projectId, userProjectsList, userProjectTemplatesList]);

  return (
    <ul className='menu menu-xs bg-base-200 h-full min-w-xs w-64 flex-shrink-0'>
      <li>
        <Link to='/app/dashboard'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='size-4'
          >
            <path
              fillRule='evenodd'
              d='M2 12V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Zm1.5-5.5V12a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V6.5A.5.5 0 0 0 12 6H4a.5.5 0 0 0-.5.5Zm.75-1.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM7 4a.75.75 0 1 1-1.5 0A.75.75 0 0 1 7 4Zm1.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
              clipRule='evenodd'
            />
          </svg>
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to='/app/projects'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='size-4'
          >
            <path
              fillRule='evenodd'
              d='M11 4V3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1ZM9 2.5H7a.5.5 0 0 0-.5.5v1h3V3a.5.5 0 0 0-.5-.5ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'
              clipRule='evenodd'
            />
            <path d='M3 11.83V12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-.17c-.313.11-.65.17-1 .17H4c-.35 0-.687-.06-1-.17Z' />
          </svg>
          <span>Projects</span>
          <div className='tooltip tooltip-left' data-tip='Create new project'>
            <button type='button'>
              <Link
                to='/app/projects/create'
                className='btn btn-ghost btn-xs btn-square'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1}
                  stroke='currentColor'
                  className='size-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 4.5v15m7.5-7.5h-15'
                  />
                </svg>
              </Link>
            </button>
          </div>
        </Link>
        {navBarProjectsTree ? <ul>{navBarProjectsTree}</ul> : null}
      </li>
    </ul>
  );
};
