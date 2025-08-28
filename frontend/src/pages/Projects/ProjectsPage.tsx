import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from 'antd';

import { BackendService } from '#api';
import { TProject } from '#api/services/BackendService/types';
import { ERoutes } from '#src/router';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<TProject[]>([]);

  useEffect(() => {
    BackendService.getProjectsList()
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch projects', error);
      });
  }, []);

  const handleDeleteProject = (projectId: string) => {
    BackendService.deleteProject({ path: { params: { id: projectId } } })
      .then(() => {
        setProjects(projects.filter(project => project.id !== projectId));
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to delete project', error);
      });
  };

  return (
    <div
      style={{
        boxSizing: 'border-box',
        padding: '20px',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h1>Projects Page</h1>

        <Button onClick={() => navigate(ERoutes.ProjectCreate)}>
          Create New Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              {project.title} - {project.description}
              <Button onClick={() => navigate(`/app/projects/${project.id}`)}>
                View
              </Button>
              <Button
                onClick={() => navigate(`/app/projects/${project.id}/edit`)}
              >
                Edit
              </Button>
              <Button danger onClick={() => handleDeleteProject(project.id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
};
